import { productPublication } from "../offer-publication.js";
import { productRoute } from "../catalogPaths.js";
import { createHash } from "node:crypto";
import { products } from "../catalog.js";
import { paymentMethods } from "../payments.js";
const TRANSFER =
  "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const prices = new Map(
  products.map((p) => ["product/" + slug(p.provider + " " + p.name), p.price]),
);
export const chains = {
  erc20: {
    chainId: 1,
    contract: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    rpc: "https://ethereum-rpc.publicnode.com",
    env: "ETHEREUM_RPC_URL",
  },
  bep20: {
    chainId: 56,
    contract: "0x55d398326f99059ff775485246999027b3197955",
    decimals: 18,
    rpc: "https://bsc-dataseed.bnbchain.org",
    env: "BSC_RPC_URL",
  },
  trc20: {
    contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    decimals: 6,
    rpc: "https://api.trongrid.io",
    env: "TRON_RPC_URL",
  },
};
export class InputError extends Error {}
export class ProviderError extends Error {}
const hex = (s) =>
  typeof s === "string" ? s.replace(/^0x/i, "").toLowerCase() : "";
const hash = (s) => /^[0-9a-f]{64}$/.test(hex(s));
function evmNumber(value) {
  if (typeof value !== "string" || !/^0x[0-9a-f]+$/i.test(value))
    throw new ProviderError("Invalid block data");
  const n = Number(BigInt(value));
  if (!Number.isSafeInteger(n) || n < 0)
    throw new ProviderError("Invalid block data");
  return n;
}
export function tronHex(address) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let n = 0n;
  for (const char of address) {
    const i = alphabet.indexOf(char);
    if (i < 0) throw new ProviderError("Invalid configured TRON address");
    n = n * 58n + BigInt(i);
  }
  let h = n.toString(16);
  if (h.length % 2) h = "0" + h;
  const data = Buffer.from(h, "hex");
  const payload = data.subarray(0, 21);
  const digest = createHash("sha256")
    .update(createHash("sha256").update(payload).digest())
    .digest();
  if (
    data.length !== 25 ||
    payload[0] !== 0x41 ||
    !digest.subarray(0, 4).equals(data.subarray(21))
  )
    throw new ProviderError("Invalid configured TRON address");
  return payload.subarray(1).toString("hex");
}
export function validatePaymentRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new InputError("Provide a payment request.");
  const { network, items } = body;
  const chain = chains[network],
    method = paymentMethods.find((m) => m.id === network);
  if (!chain || !method) throw new InputError("Select TRC20, BEP20, or ERC20.");
  if (
    typeof body.txid !== "string" ||
    body.txid.length > 66 ||
    !hash(body.txid.trim())
  )
    throw new InputError("Enter a valid 64-character transaction hash (TXID).");
  if (
    !Array.isArray(items) ||
    items.length < 1 ||
    items.length > products.length
  )
    throw new InputError("Select at least one valid account package.");
  const seen = new Set();
  let total = 0;
  for (const item of items) {
    if (
      !item ||
      !prices.has(item.id) ||
      seen.has(item.id) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    )
      throw new InputError("The cart contains an invalid package or quantity.");
    seen.add(item.id);
    total += prices.get(item.id) * item.quantity;
  }
  if (!Number.isSafeInteger(total) || total <= 0)
    throw new InputError("Invalid cart total.");
  return {
    network,
    chain,
    method,
    expected: BigInt(total) * 10n ** BigInt(chain.decimals),
    expectedAmount: String(total),
    txid: (network === "trc20" ? "" : "0x") + hex(body.txid.trim()),
  };
}
function amountText(amount, decimals) {
  const scale = 10n ** BigInt(decimals),
    fraction = (amount % scale)
      .toString()
      .padStart(decimals, "0")
      .replace(/0+$/, "");
  return (amount / scale).toString() + (fraction ? "." + fraction : "");
}
// Only approved token Transfer logs count. Subtract outgoing transfers and reject self-transfers.
export function receivedUnits(logs, contract, recipient) {
  let total = 0n;
  for (const log of Array.isArray(logs) ? logs : []) {
    if (
      log.removed ||
      hex(log.address) !== hex(contract) ||
      !Array.isArray(log.topics) ||
      log.topics.length !== 3 ||
      hex(log.topics[0]) !== TRANSFER
    )
      continue;
    const from = hex(log.topics[1]),
      to = hex(log.topics[2]),
      data = hex(log.data);
    if (
      !/^[0-9a-f]{64}$/.test(from) ||
      !/^[0-9a-f]{64}$/.test(to) ||
      !/^[0-9a-f]{64}$/.test(data) ||
      !from.startsWith("0".repeat(24)) ||
      !to.startsWith("0".repeat(24))
    )
      continue;
    const value = BigInt("0x" + data);
    if (to.slice(-40) === recipient) total += value;
    if (from.slice(-40) === recipient) total -= value;
  }
  return total;
}
function outcome(request, logs) {
  const contract =
      request.network === "trc20"
        ? tronHex(request.chain.contract)
        : hex(request.chain.contract),
    recipient =
      request.network === "trc20"
        ? tronHex(request.method.address)
        : hex(request.method.address);
  const amount = receivedUnits(logs, contract, recipient);
  if (amount <= 0n)
    return {
      status: "unmatched",
      message:
        "No matching USDT transfer to the selected receiving wallet was found.",
    };
  const receivedAmount = amountText(amount, request.chain.decimals);
  if (amount !== request.expected)
    return {
      status: "amount_mismatch",
      receivedAmount,
      message:
        "The received USDT amount does not match this cart. Contact the seller if your agreed quote differs.",
    };
  return { status: "matched", receivedAmount };
}
async function jsonPost(url, body, context, headers = {}) {
  let response;
  try {
    response = await context.fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: context.signal,
    });
  } catch {
    throw new ProviderError("Network provider unavailable");
  }
  if (!response.ok) throw new ProviderError("Network provider unavailable");
  let value;
  try {
    value = await response.json();
  } catch {
    throw new ProviderError("Invalid provider response");
  }
  if (!value || typeof value !== "object" || value.Error || value.error)
    throw new ProviderError("Network provider unavailable");
  return value;
}
async function rpcBatch(url, calls, context) {
  const responses = await jsonPost(
    url,
    calls.map(([method, params], i) => ({
      jsonrpc: "2.0",
      id: i + 1,
      method,
      params,
    })),
    context,
  );
  if (!Array.isArray(responses) || responses.length !== calls.length)
    throw new ProviderError("Invalid RPC response");
  return calls.map((_, i) => {
    const r = responses.filter((r) => r.id === i + 1);
    if (r.length !== 1 || r[0].error || !Object.hasOwn(r[0], "result"))
      throw new ProviderError("RPC check unavailable");
    return r[0].result;
  });
}
async function verifyEvm(request, context, url) {
  const [chainId, receipt] = await rpcBatch(
    url,
    [
      ["eth_chainId", []],
      ["eth_getTransactionReceipt", [request.txid]],
    ],
    context,
  );
  if (evmNumber(chainId) !== request.chain.chainId)
    throw new ProviderError("Wrong RPC network");
  if (!receipt)
    return {
      status: "not_found",
      message:
        "This TXID is not yet available on the selected network. Check the network and try again shortly.",
    };
  if (
    hex(receipt.transactionHash) !== hex(request.txid) ||
    !hash(receipt.blockHash)
  )
    throw new ProviderError("Invalid transaction receipt");
  const blockNumber = evmNumber(receipt.blockNumber);
  if (receipt.status === "0x0")
    return {
      status: "failed",
      message:
        "The transaction failed on-chain. No successful payment was confirmed.",
    };
  if (receipt.status !== "0x1")
    throw new ProviderError("Unknown execution status");
  const match = outcome(request, receipt.logs);
  if (match.status !== "matched") return match;
  const [finalized, block] = await rpcBatch(
    url,
    [
      ["eth_getBlockByNumber", ["finalized", false]],
      ["eth_getBlockByNumber", [receipt.blockNumber, false]],
    ],
    context,
  );
  if (
    !block ||
    hex(block.hash) !== hex(receipt.blockHash) ||
    evmNumber(block.number) !== blockNumber
  )
    return {
      status: "pending",
      message:
        "The transaction is not yet stable in the canonical chain. Check again shortly.",
    };
  if (!finalized || evmNumber(finalized.number) < blockNumber)
    return {
      ...match,
      status: "pending",
      blockNumber,
      message:
        "USDT was found, but the network has not finalized this transaction yet. Check again shortly.",
    };
  return {
    ...match,
    status: "confirmed",
    blockNumber,
    finalized: true,
    message:
      "Payment confirmed on-chain. The USDT transfer matches the selected wallet and cart amount.",
  };
}
async function verifyTron(request, context, url) {
  const headers = process.env.TRONGRID_API_KEY
    ? { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY }
    : {};
  const receipt = await jsonPost(
    url + "/walletsolidity/gettransactioninfobyid",
    { value: request.txid },
    context,
    headers,
  );
  if (!receipt.id)
    return {
      status: "not_found",
      message:
        "A finalized TRON receipt is not available yet. Check the TXID and network, then try again shortly.",
    };
  if (
    hex(receipt.id) !== request.txid ||
    !Number.isSafeInteger(receipt.blockNumber) ||
    receipt.blockNumber < 0
  )
    throw new ProviderError("Invalid TRON receipt");
  if (
    receipt.result === "FAILED" ||
    (receipt.receipt?.result && receipt.receipt.result !== "SUCCESS")
  )
    return {
      status: "failed",
      message:
        "The transaction failed on-chain. No successful payment was confirmed.",
    };
  if (receipt.receipt?.result !== "SUCCESS")
    throw new ProviderError("Unknown TRON execution status");
  const match = outcome(request, receipt.log);
  if (match.status !== "matched") return match;
  return {
    ...match,
    status: "confirmed",
    blockNumber: receipt.blockNumber,
    finalized: true,
    message:
      "Payment confirmed on-chain. The USDT transfer matches the selected wallet and cart amount.",
  };
}
export async function verifyPayment(body, options = {}) {
  const request = validatePaymentRequest(body);
  for (const item of body.items) {
    const product = products.find((p) => productRoute(p) === item.id);
    const review = options.publicationReviews?.[item.id];
    const publication = productPublication(product, review);
    if (!publication.purchasable)
      throw new InputError(
        publication.published
          ? "The selected product is currently unavailable to purchase."
          : "The selected product is not eligible for purchase.",
      );
  }
  const endpoint =
    options.endpoint || process.env[request.chain.env] || request.chain.rpc;
  const parsed = new URL(endpoint);
  if (parsed.protocol !== "https:")
    throw new ProviderError("HTTPS RPC required");
  const context = {
    fetch: options.fetch || fetch,
    signal: options.signal || AbortSignal.timeout(20000),
  };
  const result = await (request.network === "trc20"
    ? verifyTron(request, context, endpoint.replace(/\/$/, ""))
    : verifyEvm(request, context, endpoint));
  return {
    ...result,
    network: request.network,
    txid: request.txid,
    expectedAmount: request.expectedAmount,
    recipient: request.method.address,
    checkedAt: new Date().toISOString(),
  };
}
