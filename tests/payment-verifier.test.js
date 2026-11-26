import { approvedReview } from "./fixtures/publication.js";
import { products } from "../catalog.js";
import { productRoute } from "../catalogPaths.js";
const testReviews = Object.fromEntries(
  products.map((p) => [productRoute(p), approvedReview(p)]),
);
const verifyPayment = (body, options = {}) =>
  verifyActualPayment(body, { ...options, publicationReviews: testReviews });
import test from "node:test";
import assert from "node:assert/strict";
import {
  chains,
  InputError,
  ProviderError,
  tronHex,
  validatePaymentRequest,
  verifyPayment as verifyActualPayment,
} from "../server/payment-verifier.js";
import handler from "../api/verify-payment.js";
const tx = "1".repeat(64),
  blockHash = "0x" + "2".repeat(64),
  seller = "02440ca32c73a80189d1f3f47cf6ed7fd9cad4cb",
  sender = "3".repeat(40),
  event = "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const request = (network = "erc20") => ({
  network,
  txid: network === "trc20" ? tx : "0x" + tx,
  items: [{ id: "product/aws-free-trial", quantity: 1 }],
});
function log(
  network = "erc20",
  amount = 15n,
  recipient = seller,
  from = sender,
) {
  const chain = chains[network];
  return {
    address: network === "trc20" ? tronHex(chain.contract) : chain.contract,
    topics: [event, "0".repeat(24) + from, "0".repeat(24) + recipient],
    data: (amount * 10n ** BigInt(chain.decimals))
      .toString(16)
      .padStart(64, "0"),
  };
}
function evmFetch({
  network = "erc20",
  status = "0x1",
  logs = [log(network)],
  finalized = "0x100",
  canonicalHash = blockHash,
  receipt = true,
  chainId = chains[network].chainId,
} = {}) {
  return async (url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(new URL(url).protocol, "https:");
    return {
      ok: true,
      json: async () =>
        body.map(({ id, method, params }) => {
          let result;
          if (method === "eth_chainId") result = "0x" + chainId.toString(16);
          else if (method === "eth_getTransactionReceipt")
            result = receipt
              ? {
                  transactionHash: "0x" + tx,
                  blockHash,
                  blockNumber: "0x100",
                  status,
                  logs,
                }
              : null;
          else if (method === "eth_getBlockByNumber")
            result =
              params[0] === "finalized"
                ? { number: finalized, hash: blockHash }
                : { number: "0x100", hash: canonicalHash };
          else throw Error(method);
          return { jsonrpc: "2.0", id, result };
        }),
    };
  };
}
function tronFetch(receipt) {
  return async (url, options) => {
    assert(url.endsWith("/walletsolidity/gettransactioninfobyid"));
    assert.equal(JSON.parse(options.body).value, tx);
    return { ok: true, json: async () => receipt };
  };
}
const tronReceipt = (logs) => ({
  id: tx,
  blockNumber: 100,
  receipt: { result: "SUCCESS" },
  log: logs,
});
test("validates network, hash and server-derived catalog amount", () => {
  const r = validatePaymentRequest({
    ...request(),
    expectedAmount: "0.01",
    recipient: sender,
  });
  assert.equal(r.expected, 15000000n);
  assert.equal(r.expectedAmount, "15");
  assert.equal(r.method.address, "0x" + seller);
  for (const invalid of [
    { ...request(), network: "polygon" },
    { ...request(), txid: "bad" },
    { ...request(), items: [] },
    { ...request(), items: [{ id: "unknown", quantity: 1 }] },
    { ...request(), items: [{ id: "product/aws-free-trial", quantity: 0 }] },
    { ...request(), items: [{ id: "product/aws-free-trial", quantity: 100 }] },
    { ...request(), items: [{ id: "product/aws-free-trial", quantity: 1.5 }] },
    { ...request(), items: [...request().items, ...request().items] },
  ])
    assert.throws(() => validatePaymentRequest(invalid), InputError);
});
test("validates TRON address checksums", () => {
  assert.equal(
    tronHex("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"),
    "a614f803b6fd780986a42c78ec9c7f77e6ded13c",
  );
  assert.throws(
    () => tronHex("TNVAsjnoeREQkG599aVW9TguPsCVnVo6Bb"),
    ProviderError,
  );
});
for (const network of ["erc20", "bep20"]) {
  test(`${network}: confirms canonical, finalized USDT payment with correct decimals`, async () => {
    const result = await verifyPayment(request(network), {
      fetch: evmFetch({ network }),
    });
    assert.equal(result.status, "confirmed");
    assert.equal(result.receivedAmount, "15");
    assert.equal(result.finalized, true);
  });
  test(`${network}: rejects fake token, wrong recipient, self-transfer and outgoing net flow`, async () => {
    for (const logs of [
      [{ ...log(network), address: "0x" + "f".repeat(40) }],
      [log(network, 15n, sender)],
      [log(network, 15n, seller, seller)],
      [log(network), log(network, 15n, sender, seller)],
      [{ ...log(network), removed: true }],
      [
        {
          ...log(network),
          topics: [event, "0".repeat(64), "f".repeat(24) + seller],
        },
      ],
    ])
      assert.equal(
        (
          await verifyPayment(request(network), {
            fetch: evmFetch({ network, logs }),
          })
        ).status,
        "unmatched",
      );
  });
  test(`${network}: rejects underpayment and overpayment with integer precision`, async () => {
    for (const amount of [14n, 16n]) {
      const result = await verifyPayment(request(network), {
        fetch: evmFetch({ network, logs: [log(network, amount)] }),
      });
      assert.equal(result.status, "amount_mismatch");
      assert.equal(result.receivedAmount, String(amount));
    }
  });
  test(`${network}: sums multiple genuine incoming transfers`, async () =>
    assert.equal(
      (
        await verifyPayment(request(network), {
          fetch: evmFetch({
            network,
            logs: [log(network, 10n), log(network, 5n)],
          }),
        })
      ).status,
      "confirmed",
    ));
  test(`${network}: pending, absent and reverted receipts never confirm`, async () => {
    assert.equal(
      (
        await verifyPayment(request(network), {
          fetch: evmFetch({ network, receipt: false }),
        })
      ).status,
      "not_found",
    );
    assert.equal(
      (
        await verifyPayment(request(network), {
          fetch: evmFetch({ network, status: "0x0" }),
        })
      ).status,
      "failed",
    );
    assert.equal(
      (
        await verifyPayment(request(network), {
          fetch: evmFetch({ network, finalized: "0xff" }),
        })
      ).status,
      "pending",
    );
    assert.equal(
      (
        await verifyPayment(request(network), {
          fetch: evmFetch({ network, canonicalHash: "0x" + "4".repeat(64) }),
        })
      ).status,
      "pending",
    );
  });
  test(`${network}: wrong RPC chain cannot confirm`, async () =>
    assert.rejects(
      () =>
        verifyPayment(request(network), {
          fetch: evmFetch({ network, chainId: 999 }),
        }),
      ProviderError,
    ));
}
test("TRC20 confirms only successful solidified USDT receipts to configured wallet", async () => {
  const receiver = tronHex("TNVAsjnoeREQkG599aVW9TguPsCVnVo6Ba");
  const r = await verifyPayment(request("trc20"), {
    fetch: tronFetch(tronReceipt([log("trc20", 15n, receiver)])),
  });
  assert.equal(r.status, "confirmed");
  assert.equal(r.receivedAmount, "15");
  assert.equal(r.finalized, true);
});
test("TRC20 missing, failed, wrong-asset and incorrect amount receipts do not confirm", async () => {
  const receiver = tronHex("TNVAsjnoeREQkG599aVW9TguPsCVnVo6Ba");
  const cases = [
    [{}, "not_found"],
    [
      { ...tronReceipt([log("trc20", 15n, receiver)]), result: "FAILED" },
      "failed",
    ],
    [
      {
        ...tronReceipt([log("trc20", 15n, receiver)]),
        receipt: { result: "REVERT" },
      },
      "failed",
    ],
    [tronReceipt([log("trc20", 14n, receiver)]), "amount_mismatch"],
    [tronReceipt([log("trc20", 15n, sender)]), "unmatched"],
    [
      tronReceipt([
        { ...log("trc20", 15n, receiver), address: "f".repeat(40) },
      ]),
      "unmatched",
    ],
  ];
  for (const [receipt, status] of cases)
    assert.equal(
      (await verifyPayment(request("trc20"), { fetch: tronFetch(receipt) }))
        .status,
      status,
    );
});
test("RPC outages, malformed data and unknown execution status fail closed", async () => {
  for (const fetch of [
    async () => {
      throw Error("offline");
    },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({ error: "rate limited" }) }),
    evmFetch({ status: undefined, chainId: 999 }),
    evmFetch({ status: "0x2" }),
  ])
    await assert.rejects(
      () => verifyPayment(request(), { fetch }),
      ProviderError,
    );
});
async function callApi(body, { method = "POST", origin, contentLength } = {}) {
  const headers = {
    host: "example.com",
    ...(origin ? { origin } : {}),
    ...(contentLength ? { "content-length": contentLength } : {}),
  };
  const response = {
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(n) {
      this.code = n;
      return this;
    },
    json(v) {
      this.body = v;
      return this;
    },
  };
  await handler({ method, headers, body }, response);
  return response;
}
test("API rejects unsupported methods, cross-origin, invalid input and oversized bodies", async () => {
  assert.equal((await callApi({}, { method: "GET" })).code, 405);
  assert.equal(
    (await callApi(request(), { origin: "https://other.example" })).code,
    403,
  );
  assert.equal((await callApi({})).code, 400);
  assert.equal((await callApi("not-json")).code, 400);
  assert.equal((await callApi(request(), { contentLength: 20000 })).code, 413);
  assert.equal(
    (await callApi({ ...request(), extra: "x".repeat(20000) })).code,
    413,
  );
});
