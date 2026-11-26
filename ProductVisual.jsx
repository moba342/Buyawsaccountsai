import React from 'react';
import { Cpu, CreditCard, Sparkles, SlidersHorizontal } from 'lucide-react';
import ProviderLogo from './ProviderLogo';
import { brands, products } from './catalog';

const kinds = {
  Compute: 'Compute options',
  Droplet: 'Droplet options',
  Server: 'Server options',
  Credit: 'Credit packages',
  AI: 'AI variants',
  SMTP: 'SMTP options',
  Trial: 'Trial accounts',
  Account: 'Account options',
};
const collections = Object.fromEntries(
  brands.map((brand) => {
    const available = new Set(
      products.filter((p) => p.provider === brand.name).map((p) => p.kind),
    );
    const options = Object.entries(kinds)
      .filter(([kind]) => available.has(kind))
      .map(([, label]) => label)
      .slice(0, 3);
    for (const label of ['Account details', 'Purchase terms'])
      if (options.length < 3) options.push(label);
    return [brand.name, { name: brand.name, full: brand.full, options }];
  }),
);

export default function ProductVisual({ provider, title, className = '' }) {
  const collection = collections[provider];
  if (!collection) return null;
  const productTitle = title || collection.name + ' Accounts';
  return (
    <figure
      className={`account-product-visual ${className}`}
      role="img"
      aria-label={`${productTitle}: ${collection.options.join(', ')}`}
    >
      <div className="product-visual-topline">
        <span title={productTitle}>{productTitle}</span>
        <span className="product-visual-edition">CLOUD COLLECTION</span>
      </div>
      <svg
        className="product-visual-scene"
        viewBox="0 0 400 220"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M114 101H194Q207 101 207 88V58H278M207 101H278M207 101V143Q207 155 219 155H278"
          stroke="#A8C1E2"
          strokeWidth="1.3"
          opacity=".65"
        />
        <path
          d="m49 142 66 36 65-36-66-36-65 36Z"
          fill="#263D68"
          stroke="#7086A6"
        />
        <path
          d="m49 153 66 36 65-36M49 164l66 36 65-36"
          stroke="#7086A6"
          opacity=".5"
        />
        <circle cx="207" cy="101" r="3" fill="#FFB347" />
        <path d="M26 56V35h21M368 166v21h-21" stroke="#7086A6" opacity=".45" />
      </svg>
      <span className="product-visual-logo">
        <ProviderLogo name={provider} decorative priority />
      </span>
      <div className="product-visual-options">
        {collection.options.map((label, index) => {
          const Icon = label.includes('AI')
            ? Sparkles
            : label.includes('Credit')
              ? CreditCard
              : index === 0
                ? Cpu
                : SlidersHorizontal;
          return (
            <span className="product-visual-option" key={label}>
              <Icon aria-hidden="true" />
              {label}
            </span>
          );
        })}
      </div>
      <figcaption className="product-visual-caption">
        <strong title={productTitle}>{productTitle}</strong>
        <small>
          Explore your
          <br />
          cloud options
        </small>
      </figcaption>
      <span className="product-visual-sheen" aria-hidden="true" />
    </figure>
  );
}
