import React from 'react';
import { ArrowRight, Plus, ShoppingCart, Layers } from 'lucide-react';
import ProviderLogo from './ProviderLogo';
import { productRoute } from './catalogPaths';
import { formatPrice } from './catalog';
import { productSpecifications } from './productSpecs';
export default function CatalogAccountCard({
  product,
  brand,
  onOrder,
  onCompare,
  onAddToCart,
}) {
  const facts = productSpecifications(product).slice(1, 3);
  return (
    <article className="account-card">
      <div className="account-card-top">
        <span>
          <ProviderLogo name={product.provider} decorative />
          {brand?.name || product.provider}
        </span>
        <span className="account-card-kind">
          <Layers size={12} aria-hidden="true" />
          {product.kind === 'AI' ? 'AI access' : product.kind}
        </span>
      </div>
      <div className="account-card-copy">
        <h3>
          <a href={'/' + productRoute(product) + '/'}>{product.name}</a>
        </h3>
        <p>{product.type}</p>
        {facts.length > 0 && (
          <dl>
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <ul>
          {product.features.slice(facts.length ? 1 : 0).map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
      <div className="account-card-bottom">
        <div className="account-card-price">
          <span>Reference price</span>
          <strong>
            {formatPrice(product.price)}
            <small> / account</small>
          </strong>
        </div>
        <div className="account-card-actions">
          <button
            className="primary"
            onClick={() =>
              onAddToCart ? onAddToCart(product) : onOrder(product)
            }
            aria-label={'Add to cart: ' + product.provider + ' ' + product.name}
          >
            <ShoppingCart size={16} aria-hidden="true" />
            Add to cart
          </button>
          <a
            className="secondary"
            href={'/' + productRoute(product) + '/'}
            aria-label={
              'View details: ' + product.provider + ' ' + product.name
            }
          >
            Details
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        {onCompare && (
          <button
            className="account-card-compare"
            onClick={() => onCompare(product)}
            aria-label={'Compare ' + product.provider + ' ' + product.name}
          >
            <Plus size={13} aria-hidden="true" />
            Compare this product
          </button>
        )}
      </div>
    </article>
  );
}
