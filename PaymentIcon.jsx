import React from 'react';
// Local vector marks stay crisp without contacting an external image service.
export default function PaymentIcon({ network = 'usdt', className = '' }) {
  return (
    <span
      className={`payment-mark payment-mark-${network} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" fill="none">
        {network === 'usdt' ? (
          <>
            <circle cx="16" cy="16" r="16" fill="#167E67" />
            <path
              d="M9 8h14v4h-5v3c5 .2 8 1 8 2s-4 2-10 2-10-1-10-2 3-1.8 8-2v-3H9Z"
              fill="#FFF"
            />
            <path d="M14 17h4v8h-4Z" fill="#FFF" />
            <ellipse cx="16" cy="16.5" rx="7" ry=".8" fill="#167E67" />
          </>
        ) : network === 'trc20' ? (
          <>
            <rect width="32" height="32" rx="9" fill="#FFF0F1" />
            <path
              d="m7 6 20 4-13 17L7 6Zm0 0 10 10 10-6M17 16l-3 11"
              stroke="#B52333"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </>
        ) : network === 'bep20' ? (
          <>
            <rect width="32" height="32" rx="9" fill="#FFF7DB" />
            <g fill="#8A6300">
              <path d="m16 4 6 6-3 3-3-3-3 3-3-3 6-6ZM16 28l-6-6 3-3 3 3 3-3 3 3-6 6ZM4 16l4-4 4 4-4 4-4-4ZM28 16l-4 4-4-4 4-4 4 4Z" />
              <path d="m16 12 4 4-4 4-4-4 4-4Z" />
            </g>
          </>
        ) : (
          <>
            <rect width="32" height="32" rx="9" fill="#EFF1FA" />
            <path d="m16 3-8 13 8 5 8-5-8-13Z" fill="#667395" />
            <path d="m16 3 8 13-8 5V3Z" fill="#34415F" />
            <path d="m8 18 8 11 8-11-8 5-8-5Z" fill="#667395" />
          </>
        )}
      </svg>
    </span>
  );
}
export function PaymentOptions() {
  return (
    <section
      className="commerce-payment-options"
      aria-label="Accepted payment networks"
    >
      <div className="payment-options-title">
        <PaymentIcon />
        <div>
          <h3>Pay with USDT</h3>
          <p>Choose the network that matches your wallet.</p>
        </div>
      </div>
      <div className="payment-option-list">
        {[
          ['trc20', 'TRON', 'TRC20'],
          ['bep20', 'BNB Smart Chain', 'BEP20'],
          ['erc20', 'Ethereum', 'ERC20'],
        ].map(([id, name, code]) => (
          <span key={id}>
            <PaymentIcon network={id} />
            <span>
              <strong>{name}</strong>
              <small>{code}</small>
            </span>
          </span>
        ))}
      </div>
      <p className="payment-options-note">
        USDT only. Network fees are set by your wallet and are separate from the
        listed total.
      </p>
    </section>
  );
}
