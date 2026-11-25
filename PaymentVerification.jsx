import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Search,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react';
export function usePaymentVerification({ network, txid, items }) {
  const key = JSON.stringify({
    network,
    txid: txid.trim().toLowerCase(),
    items,
  });
  const active = useRef(key);
  active.current = key;
  const controller = useRef(null);
  const [state, setState] = useState(null);
  useEffect(() => {
    setState(null);
    return () => controller.current?.abort();
  }, [key]);
  const result = state?.key === key ? state.result : null;
  const checking = state?.key === key && state.checking;
  async function verify() {
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    const requestKey = key;
    setState({ key: requestKey, checking: true });
    const timer = setTimeout(() => abort.abort(), 25000);
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ network, txid: txid.trim(), items }),
        signal: abort.signal,
      });
      const value = await response.json();
      if (
        ![
          'confirmed',
          'pending',
          'not_found',
          'failed',
          'unmatched',
          'amount_mismatch',
          'unavailable',
          'invalid',
        ].includes(value.status) ||
        (!response.ok && value.status === 'confirmed')
      )
        throw new Error('Invalid response');
      if (
        value.status === 'confirmed' &&
        (value.network !== network ||
          typeof value.txid !== 'string' ||
          value.txid.replace(/^0x/i, '').toLowerCase() !==
            txid.trim().replace(/^0x/i, '').toLowerCase())
      )
        throw new Error('Transaction response does not match');
      if (active.current === requestKey)
        setState({ key: requestKey, checking: false, result: value });
    } catch {
      if (active.current === requestKey)
        setState({
          key: requestKey,
          checking: false,
          result: {
            status: 'unavailable',
            message:
              'Payment could not be checked right now. Please try again. No payment has been confirmed.',
          },
        });
    } finally {
      clearTimeout(timer);
    }
  }
  return { key, result, checking, verify };
}
export default function PaymentVerification({
  method,
  total,
  txid,
  setTxid,
  check,
}) {
  const result = check.result;
  const confirmed = result?.status === 'confirmed';
  const titles = {
    confirmed: 'Payment confirmed on-chain',
    pending: 'Awaiting network finality',
    not_found: 'Transaction not found yet',
    failed: 'Transaction failed',
    unmatched: 'Payment does not match',
    amount_mismatch: 'Payment amount does not match',
    unavailable: 'Unable to check payment',
    invalid: 'Check your transaction details',
  };
  const Icon = confirmed
    ? CheckCircle2
    : ['pending', 'not_found'].includes(result?.status)
      ? Clock3
      : AlertCircle;
  return (
    <section
      className="commerce-form-panel commerce-verification"
      aria-labelledby="payment-verification-title"
    >
      <div className="commerce-panel-title">
        <span>03</span>
        <div>
          <h2 id="payment-verification-title">Verify your payment</h2>
          <p>
            Already sent USDT? Enter your transaction hash to check the transfer
            automatically.
          </p>
        </div>
      </div>
      <div className="commerce-expected">
        <span>Amount checked against this cart</span>
        <strong>{total.toLocaleString('en-US')} USDT</strong>
      </div>
      <p className="commerce-form-note">
        The check uses the listed cart total. If your agreed quote differs,
        contact the seller with your TXID for review.
      </p>
      <label className="commerce-txid-label" htmlFor="payment-txid">
        Transaction hash (TXID) <span>(optional before payment)</span>
      </label>
      <input
        className="commerce-txid-input"
        id="payment-txid"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={66}
        value={txid}
        onChange={(e) => setTxid(e.target.value)}
        placeholder={
          method.id === 'trc20'
            ? '64-character TRON transaction hash'
            : '0x… transaction hash'
        }
      />
      <p className="commerce-form-note">
        Checking {method.label} on {method.network}. Only a finalized USDT
        transfer to the displayed wallet for this cart amount can be confirmed.
      </p>
      <button
        type="button"
        className="primary commerce-check-payment"
        disabled={check.checking || !txid.trim()}
        onClick={check.verify}
      >
        {check.checking ? (
          <LoaderCircle
            size={17}
            className="commerce-check-spinner"
            aria-hidden="true"
          />
        ) : (
          <Search size={17} aria-hidden="true" />
        )}
        {check.checking
          ? 'Checking blockchain…'
          : result
            ? 'Check payment again'
            : 'Verify payment'}
      </button>
      <div className="commerce-payment-live" role="status" aria-live="polite">
        {check.checking ? (
          <p>
            Checking the transaction, token, receiving wallet, amount, and
            network finality.
          </p>
        ) : result ? (
          <div
            className={
              'commerce-payment-result ' + (confirmed ? 'is-confirmed' : '')
            }
          >
            <Icon size={22} aria-hidden="true" />
            <div>
              <h3>{titles[result.status]}</h3>
              <p>{result.message}</p>
              {result.receivedAmount && (
                <dl>
                  <div>
                    <dt>Received</dt>
                    <dd>{result.receivedAmount} USDT</dd>
                  </div>
                  <div>
                    <dt>Expected</dt>
                    <dd>{result.expectedAmount} USDT</dd>
                  </div>
                  {result.blockNumber !== undefined && (
                    <div>
                      <dt>Block</dt>
                      <dd>{result.blockNumber.toLocaleString('en-US')}</dd>
                    </div>
                  )}
                </dl>
              )}
              {confirmed && (
                <p>
                  Send your contact details and TXID to the seller to match this
                  transfer to your order and arrange delivery.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p>No payment has been checked yet.</p>
        )}
      </div>
    </section>
  );
}
