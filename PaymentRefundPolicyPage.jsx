import React from "react";
import { ArrowUpRight, Mail, MessageCircle, ReceiptText, WalletCards } from "lucide-react";
import PaymentIcon from "./PaymentIcon";
import { paymentMethods } from "./payments";
import { refundPolicyReady } from "./refund-policy";
import { SITE } from "./site-config";
import "./payment-refund-policy.css";

export default function PaymentRefundPolicyPage() {
  return (
    <main id="page-content" tabIndex={-1} className="payment-policy-page section inner">
      <section className="payment-policy-hero" aria-labelledby="payment-policy-heading">
        <div>
          <span className="eyebrow">PURCHASE INFORMATION</span>
          <h1 id="payment-policy-heading">Payment &amp; Refund Policy</h1>
          <p>Understand the payment process, keep your transaction records, and know how to raise a refund request with Buy AWS Accounts AI.</p>
          <a className="secondary" href="/contact-sales/">Contact sales <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <aside className="payment-policy-summary">
          <WalletCards size={28} aria-hidden="true" />
          <span>USDT PAYMENTS</span>
          <h2>The right network. Clear order terms.</h2>
          <p>Confirm the product, final amount, receiving details and written purchase terms before sending payment.</p>
          <div>{paymentMethods.map(method => <span key={method.id}>{method.id.toUpperCase()}</span>)}</div>
        </aside>
      </section>

      {!refundPolicyReady && <aside className="payment-policy-draft" role="note"><strong>Refund terms are awaiting owner confirmation.</strong><p>The refund window, eligibility and processing terms have not been published. Confirm them directly with the seller before payment.</p></aside>}

      <div className="payment-policy-layout">
        <nav className="payment-policy-nav" aria-label="On this page">
          <span>ON THIS PAGE</span>
          <a href="#accepted-payments">Payment methods</a>
          <a href="#payment-records">Payment confirmation</a>
          <a href="#request-refund">Request a review</a>
          <a href="#policy-contact">Contact support</a>
        </nav>
        <div className="payment-policy-content">
          <section id="accepted-payments" aria-labelledby="accepted-payments-title">
            <span className="payment-policy-section-label"><WalletCards size={19} aria-hidden="true" /> PAYMENTS</span>
            <h2 id="accepted-payments-title">Supported USDT networks</h2>
            <p>For orders cleared for purchase, checkout supports USDT on the networks below. The availability of a payment method does not mean every catalog entry is available to order.</p>
            <div className="payment-policy-networks">{paymentMethods.map(method => <article key={method.id}><PaymentIcon network={method.id} /><div><h3>{method.label}</h3><p>{method.network}</p></div></article>)}</div>
            <p>Match the selected network and receiving address to the current checkout instructions. Confirm the final USDT amount and any network fees before transferring. Catalog reference prices are not a substitute for your confirmed order total.</p>
          </section>
          <section id="payment-records" aria-labelledby="payment-records-title">
            <span className="payment-policy-section-label"><ReceiptText size={19} aria-hidden="true" /> TRANSACTION RECORDS</span>
            <h2 id="payment-records-title">Keep your payment reference</h2>
            <p>Keep your order reference, selected network, amount and transaction hash (TXID). Checkout checks the submitted transaction on the selected network; a blockchain result does not by itself confirm order acceptance, delivery or refund approval.</p>
            <p>If the transaction cannot be matched, contact support with the reference and TXID. Do not send a second payment solely because a check is pending or has not found the transfer.</p>
          </section>
          <section id="request-refund" aria-labelledby="request-refund-title">
            <span className="payment-policy-section-label"><MessageCircle size={19} aria-hidden="true" /> SUPPORT PROCESS</span>
            <h2 id="request-refund-title">How to request a review</h2>
            <ol className="payment-policy-steps"><li><strong>Identify your order.</strong><p>Send your order reference, the email used for the inquiry, payment network, amount and TXID.</p></li><li><strong>Describe the issue.</strong><p>Explain what happened and include relevant, non-sensitive evidence. Keep passwords, private keys and recovery phrases out of support messages.</p></li><li><strong>Confirm the outcome in writing.</strong><p>A submitted request is not an approval. Ask for the decision and, if approved, confirmation of the amount, return network, address, timing and fee handling.</p></li></ol>
          </section>
          <section id="policy-contact" className="payment-policy-contact" aria-labelledby="policy-contact-title"><h2 id="policy-contact-title">Questions about a payment?</h2><p>Contact us with your order reference so the conversation stays connected to the right transaction.</p><div><a className="primary" href="https://t.me/dexterw4tts" target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" /> @dexterw4tts</a><a className="secondary" href={`mailto:${SITE.email}`}><Mail size={17} aria-hidden="true" /> Email support</a></div></section>
        </div>
      </div>
    </main>
  );
}
