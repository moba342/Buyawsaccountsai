import { routePath } from "./routing";
import { categoryPurchaseState } from "./purchase-state";
import { products } from "./catalog";
import React from "react";
import { ArrowRight } from "lucide-react";
import ProviderLogo from "./ProviderLogo";
import { providerRoute } from "./catalogPaths";
import { formatPrice } from "./catalog";
export default function ProviderCard({
  brand,
  count,
  navigate,
  heading = "h3",
}) {
  const Heading = heading;
  const route = providerRoute(brand);
  const publication = categoryPurchaseState(
    brand,
    products.filter((p) => p.provider === brand.name),
  );
  return (
    <article className="provider-showcase-card">
      <div className="provider-showcase-banner">
        <div className="provider-showcase-top">
          <span className="provider-showcase-logo">
            <ProviderLogo name={brand.name} />
          </span>
          <span className="provider-showcase-count">
            <ProviderLogo name={brand.name} decorative />
            <strong>{count}</strong>
            <span>variations</span>
          </span>
        </div>
        <span className="provider-showcase-eyebrow">Premium cloud</span>
        <Heading>{brand.full}</Heading>
        <p>{publication.published ? "Cloud account collection" : "Cloud account reference collection"}</p>
      </div>
      <div className="provider-showcase-copy">
        <div className="provider-showcase-price">
          <span>{publication.priceLabel}</span>
          <strong>{formatPrice(publication.priceFrom ?? brand.from)}</strong>
        </div>
        <p>{brand.summary}</p>
        {!publication.published && (
          <span className="reference-status">Pending publication review</span>
        )}
        {publication.published && !publication.availableCount && <span className="reference-status">Currently unavailable to order</span>}
      </div>
      <div className="provider-showcase-bottom">
        <a
          href={routePath(route)}
          onClick={() => navigate(route)}
          className="provider-showcase-action"
        >
          <span>View Accounts</span>
          <ArrowRight size={18} aria-hidden="true" />
        </a>
        <a
          href={routePath(route)}
          onClick={() => navigate(route)}
          className="secondary"
          aria-label={"View details for " + brand.full}
        >
          View Details
        </a>
      </div>
    </article>
  );
}
