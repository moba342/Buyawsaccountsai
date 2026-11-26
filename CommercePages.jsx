import { canPurchaseProduct } from "./offer-publication";
import { trackEvent, publicAnalyticsItem } from "./analytics";
import PaymentIcon, { PaymentOptions } from "./PaymentIcon";
import SellerProfileCard from "./SellerProfileCard";
import PaymentVerification, {
  usePaymentVerification,
} from "./PaymentVerification";
import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Send,
  Copy,
  Check,
  Info,
} from "lucide-react";
import ProviderLogo from "./ProviderLogo";
import { formatPrice } from "./catalog";
import { paymentMethods } from "./payments";
const sellerContact = "https://t.me/dexterw4tts";
function Steps({ checkout }) {
  return (
    <>
    <ol className="commerce-steps" aria-label="Purchase steps">
      <li
        className={!checkout ? "current" : ""}
        aria-current={!checkout ? "step" : undefined}
      >
        <span>01</span> Your cart
      </li>
      <li
        className={checkout ? "current" : ""}
        aria-current={checkout ? "step" : undefined}
      >
        <span>02</span> Checkout
      </li>
      <li>
        <span>03</span> Seller confirmation
      </li>
    </ol>
    {checkout && <p className="commerce-policy-link"><a href="/payment-refund-policy/">Read the Payment &amp; Refund Policy</a></p>}
    </>
  );
}
function Empty() {
  return (
    <div className="commerce-empty">
      <span>
        <ShoppingCart size={32} aria-hidden="true" />
      </span>
      <h2>Your next project starts here.</h2>
      <p>
        Your cart is empty. Explore the collection and choose an account
        package.
      </p>
      <a className="primary" href="/marketplace/">
        Explore accounts
        <ArrowRight size={17} aria-hidden="true" />
      </a>
      <PaymentOptions />
    </div>
  );
}
function Summary({ cart, checkout = false }) {
  return (
    <aside className="commerce-summary" aria-labelledby="order-summary-title">
      <span className="commerce-eyebrow">YOUR SELECTION</span>
      <h2 id="order-summary-title">Order summary</h2>
      <dl>
        <div>
          <dt>Accounts</dt>
          <dd>{cart.count}</dd>
        </div>
        <div>
          <dt>Listed subtotal</dt>
          <dd>{formatPrice(cart.total)} USD</dd>
        </div>
      </dl>
      <div className="commerce-total">
        <span>Reference total</span>
        <strong>
          {formatPrice(cart.total)}
          <small>USD</small>
        </strong>
      </div>
      <p>
        Confirm availability, final pricing, delivery, and refund terms with the
        seller before payment. Any network fees are paid through your wallet.
      </p>
      {!checkout && !cart.blockedLines?.length && (
        <a className="primary" href="/checkout/">
          Continue to checkout
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      )}
      {!!cart.blockedLines?.length && (
        <p className="commerce-notice">
          Ordering unavailable: selected items are not currently eligible for
          checkout.
        </p>
      )}
      <div className="commerce-summary-networks">
        <PaymentIcon />
        <div>
          <strong>USDT payments</strong>
          <span>TRC20 · BEP20 · ERC20</span>
        </div>
      </div>
      <a
        className="commerce-help"
        href={sellerContact}
        target="_blank"
        rel="noopener noreferrer"
      >
        Questions? Contact the seller
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </aside>
  );
}
function CommerceSidebar({ cart, checkout = false }) {
  return (
    <div className="commerce-sidebar">
      {cart.lines.length > 0 && <Summary cart={cart} checkout={checkout} />}
      <SellerProfileCard />
    </div>
  );
}
export function CartPage({ cart }) {
  return (
    <main
      id="page-content"
      tabIndex={-1}
      className="section inner commerce-page"
    >
      <Steps />
      <div className="commerce-heading">
        <div>
          <span className="section-label">READY FOR YOUR NEXT PROJECT</span>
          <h1>Shopping Cart.</h1>
          <p>
            Review your products, adjust quantities, and continue when you’re
            ready.
          </p>
        </div>
        <a href="/marketplace/" className="commerce-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Continue shopping
        </a>
      </div>
      {cart.storageError && (
        <p className="commerce-notice" role="status">
          Your browser cannot save this cart. Keep this tab open while you
          checkout.
        </p>
      )}
      {!cart.lines.length ? (
        <div className="commerce-layout">
          <Empty />
          <CommerceSidebar cart={cart} />
        </div>
      ) : (
        <div className="commerce-layout">
          <section className="commerce-items" aria-label="Cart items">
            <div className="commerce-list-heading">
              <h2>
                Selected products <span>({cart.count})</span>
              </h2>
              <button className="commerce-text-button" onClick={cart.clear}>
                Clear cart
              </button>
            </div>
            {cart.lines.map(({ id, product, quantity }) => (
              <article className="commerce-item" key={id}>
                <div className="commerce-item-provider">
                  <ProviderLogo name={product.provider} decorative />
                </div>
                <div className="commerce-item-copy">
                  <span>{product.provider}</span>
                  <h3>
                    <a href={"/" + id + "/"}>{product.name}</a>
                  </h3>
                  <p>{formatPrice(product.price)} / account</p>
                </div>
                <div
                  className="commerce-quantity"
                  role="group"
                  aria-label={`${product.provider} ${product.name} quantity`}
                >
                  <button
                    aria-label={`Decrease ${product.provider} ${product.name} quantity`}
                    disabled={quantity === 1}
                    onClick={() => cart.quantity(id, quantity - 1)}
                  >
                    <Minus size={14} aria-hidden="true" />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    aria-label={`Increase ${product.provider} ${product.name} quantity`}
                    disabled={quantity === 99}
                    onClick={() => cart.quantity(id, quantity + 1)}
                  >
                    <Plus size={14} aria-hidden="true" />
                  </button>
                </div>
                <strong className="commerce-line-total">
                  {formatPrice(product.price * quantity)}
                </strong>
                <button
                  className="commerce-remove"
                  aria-label={`Remove ${product.provider} ${product.name}`}
                  onClick={() => cart.remove(id)}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </article>
            ))}
            <PaymentOptions />
            <p className="commerce-items-note">
              <Info size={17} aria-hidden="true" />
              Your cart is saved on this browser. Adding an account does not
              reserve availability.
            </p>
          </section>
          <CommerceSidebar cart={cart} />
        </div>
      )}
    </main>
  );
}
export function CheckoutPage({ cart }) {
  const [network, setNetwork] = useState("trc20"),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [telegram, setTelegram] = useState(""),
    [txid, setTxid] = useState(""),
    [note, setNote] = useState(""),
    [agreed, setAgreed] = useState(false),
    [draft, setDraft] = useState(null),
    [copyStatus, setCopyStatus] = useState(""),
    [walletStatus, setWalletStatus] = useState("");
  const method = paymentMethods.find((m) => m.id === network);
  const check = usePaymentVerification({
    network,
    txid,
    items: cart.lines.map(({ id, quantity }) => ({ id, quantity })),
  });
  const orderText = `ACCOUNT ORDER REQUEST\nName: ${name.trim()}\nEmail: ${email.trim()}\nPhone: ${phone.trim() || "Not provided"}\nTelegram: ${telegram.trim() || "Not provided"}\n\n${cart.lines.map(({ product, quantity }) => `${product.provider} ${product.name} × ${quantity} — ${formatPrice(product.price * quantity)}`).join("\n")}\nReference total: ${formatPrice(cart.total)} USD\nPreferred payment: ${method.label} (${method.network})\nTXID: ${txid.trim() || "Not provided"}\nBlockchain check: ${check.result?.status || "Not checked"}${check.result?.checkedAt ? " at " + check.result.checkedAt : ""}\n${check.result?.receivedAmount ? "Received: " + check.result.receivedAmount + " USDT\n" : ""}${note.trim() ? "Notes: " + note.trim() + "\n" : ""}\nPlease confirm availability, the final USDT amount, receiving wallet, delivery and refund terms. This request is not proof of payment.`;
  const signature = JSON.stringify({
    lines: cart.lines.map(({ id, quantity }) => ({ id, quantity })),
    network,
    name,
    email,
    phone,
    telegram,
    txid,
    payment: check.result,
    note,
    agreed,
  });
  const ready = draft?.signature === signature;
  async function copy(text, success, wallet = false) {
    const status = wallet ? setWalletStatus : setCopyStatus;
    try {
      await navigator.clipboard.writeText(text);
      status(success);
    } catch {
      status("Copy unavailable. Select and copy the text manually.");
    }
  }
  function prepare(e) {
    e.preventDefault();
    if (!agreed || !cart.lines.length) return;
    setDraft({ signature, text: orderText });
    setCopyStatus("");
    setTimeout(
      () => document.getElementById("checkout-request-title")?.focus(),
      0,
    );
  }
  if (cart.lines.some((line) => !canPurchaseProduct(line.product)))
    return (
      <main
        id="page-content"
        tabIndex={-1}
        className="section inner commerce-page"
      >
        <Steps checkout />
        <div className="commerce-heading">
          <h1>Checkout.</h1>
        </div>
        <section className="checkout-publication-hold">
          <h2>Ordering is unavailable for these references</h2>
          <p>
            Your saved selections and original prices have been retained.
            Payment instructions and verification are withheld until every
            selected item has an approved publication record.
          </p>
          <ul>
            {cart.lines.map((line) => (
              <li key={line.id}>
                {line.product.provider} · {line.product.name} —{" "}
                {formatPrice(line.product.price)} reference price
              </li>
            ))}
          </ul>
          <a className="secondary" href="/cart/">
            Review saved selections
          </a>
          <a className="secondary" href="/contact-sales/">
            Ask about requirements
          </a>
        </section>
      </main>
    );
  return (
    <main
      id="page-content"
      tabIndex={-1}
      className="section inner commerce-page"
    >
      <Steps checkout />
      <div className="commerce-heading">
        <div>
          <span className="section-label">A CLEARER WAY TO ORDER</span>
          <h1>Checkout.</h1>
          <p>
            Choose your USDT network and prepare an order request for the
            seller.
          </p>
        </div>
        <a href="/cart/" className="commerce-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to cart
        </a>
      </div>
      {!cart.lines.length ? (
        <div className="commerce-layout">
          <Empty />
          <CommerceSidebar cart={cart} />
        </div>
      ) : (
        <div className="commerce-layout">
          <form className="commerce-checkout" onSubmit={prepare}>
            <section className="commerce-form-panel">
              <div className="commerce-panel-title">
                <span>01</span>
                <div>
                  <h2>Contact details</h2>
                  <p>
                    Enter your email so the seller can reply about your order.
                  </p>
                </div>
              </div>
              <div className="commerce-fields">
                <label>
                  Your name
                  <input
                    required
                    pattern={".*\\S.*"}
                    maxLength={100}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Phone number <span>(optional)</span>
                  <input
                    type="tel"
                    maxLength={32}
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                  />
                </label>
                <label>
                  Telegram username <span>(optional)</span>
                  <input
                    maxLength={64}
                    autoComplete="off"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@username"
                  />
                </label>
                <label className="commerce-field-full">
                  Order notes <span>(optional)</span>
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Regions, requirements, or questions for the seller"
                  />
                </label>
              </div>
              <p className="commerce-form-note">
                These details stay in this tab until you copy and send the
                request to the seller.
              </p>
            </section>
            <section className="commerce-form-panel">
              <div className="commerce-panel-title">
                <span>02</span>
                <div>
                  <h2>USDT payment method</h2>
                  <p>Select the network you plan to use.</p>
                </div>
              </div>
              <fieldset className="commerce-networks">
                <legend className="sr-only">USDT network</legend>
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={network === m.id ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="payment-network"
                      value={m.id}
                      checked={network === m.id}
                      onChange={() => {
                        setNetwork(m.id);
                        trackEvent("add_payment_info", {
                          currency: "USD",
                          value: cart.total,
                          payment_type: m.label,
                          items: cart.lines.map((l) =>
                            publicAnalyticsItem(l.product, l.quantity),
                          ),
                        });
                        setCopyStatus("");
                        setWalletStatus("");
                      }}
                    />
                    <PaymentIcon network={m.id} />
                    <span>
                      <strong>{m.id.toUpperCase()}</strong>
                      <small>{m.network}</small>
                    </span>
                    {network === m.id && <Check size={17} aria-hidden="true" />}
                  </label>
                ))}
              </fieldset>
              <div className="commerce-payment-detail">
                <div className="commerce-payment-heading">
                  <PaymentIcon />
                  <h3>{method.label}</h3>
                  <span className="commerce-network-tag">{method.network}</span>
                </div>
                <p>
                  Use USDT on {method.network} only. The sending network must
                  match the receiving network.
                </p>
                {method.address ? (
                  <>
                    <div className="commerce-wallet-layout">
                      <figure className="commerce-wallet-qr">
                        <img
                          key={method.id}
                          src={`/payments/usdt-${method.id}.svg`}
                          width="208"
                          height="208"
                          alt={`Scan the ${method.label} receiving wallet address`}
                          decoding="async"
                        />
                        <figcaption>
                          <strong>Scan to get the wallet address</strong>
                          <span>
                            USDT · {method.network} ({method.id.toUpperCase()})
                          </span>
                        </figcaption>
                      </figure>
                      <div className="commerce-wallet-information">
                        <p className="commerce-qr-instructions">
                          The QR code contains the wallet address only. Select{" "}
                          {method.network} in your wallet before sending USDT.
                        </p>
                        <label>
                          Receiving wallet
                          <input
                            readOnly
                            spellCheck={false}
                            value={method.address}
                            aria-label={`${method.label} receiving wallet`}
                          />
                        </label>
                        <button
                          type="button"
                          className="secondary"
                          onClick={() =>
                            copy(method.address, "Wallet address copied", true)
                          }
                        >
                          <Copy size={15} aria-hidden="true" />
                          Copy wallet address
                        </button>
                        <a
                          className="commerce-qr-download"
                          href={`/payments/usdt-${method.id}.png`}
                          download={`BuyAWSAccountsAI-USDT-${method.id.toUpperCase()}.png`}
                        >
                          Download QR code
                        </a>
                        <p role="status" className="commerce-wallet-status">
                          {walletStatus}
                        </p>
                        <p>
                          Confirm this address and the final USDT amount with
                          the seller before transferring. After sending USDT,
                          enter the TXID below to check the transaction
                          automatically.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="commerce-wallet-pending">
                    Payment instructions are provided by the seller. Request the{" "}
                    {method.label} receiving address and final amount on
                    Telegram before sending funds.
                  </p>
                )}
              </div>
            </section>
            <PaymentVerification
              method={method}
              total={cart.total}
              txid={txid}
              setTxid={setTxid}
              check={check}
            />
            <section className="commerce-form-panel">
              <div className="commerce-panel-title">
                <span>04</span>
                <div>
                  <h2>Review &amp; contact the seller</h2>
                  <p>Your request is ready to review before you send it.</p>
                </div>
              </div>
              <ul className="commerce-checkout-lines">
                {cart.lines.map(({ id, product, quantity }) => (
                  <li key={id}>
                    <span>
                      {product.provider} · {product.name}{" "}
                      <small>× {quantity}</small>
                    </span>
                    <strong>{formatPrice(product.price * quantity)}</strong>
                  </li>
                ))}
              </ul>
              <label className="commerce-agreement">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  I understand that listed prices are references and will
                  confirm availability, final payment instructions, delivery,
                  and refund terms with the seller before payment.
                </span>
              </label>
              <button className="primary commerce-prepare" type="submit">
                Prepare order request
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <p className="commerce-form-note">
                Preparing a request does not place a paid order or send your
                details automatically.
              </p>
            </section>
            {ready && (
              <section
                className="commerce-request"
                aria-labelledby="checkout-request-title"
              >
                <h2 id="checkout-request-title" tabIndex={-1}>
                  Your request is ready to send.
                </h2>
                <p>
                  Copy the details, open Telegram, and paste them into your
                  conversation with @dexterw4tts. The seller will match any
                  payment to your order and confirm delivery details.
                </p>
                <textarea
                  readOnly
                  rows={10}
                  aria-label="Prepared order request"
                  value={draft.text}
                />
                <div>
                  <button
                    type="button"
                    className="primary"
                    onClick={() => copy(draft.text, "Order request copied")}
                  >
                    <Copy size={16} aria-hidden="true" />
                    Copy request
                  </button>
                  <a
                    className="secondary"
                    href={sellerContact}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Send size={16} aria-hidden="true" />
                    Open Telegram
                  </a>
                </div>
              </section>
            )}
            <p role="status" className="commerce-copy-status">
              {copyStatus}
            </p>
          </form>
          <CommerceSidebar cart={cart} checkout />
        </div>
      )}
    </main>
  );
}
