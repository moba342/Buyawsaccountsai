import React from "react";
import { productPublication, pendingMessage } from "./offer-publication";
export default function CatalogPublicationNotice({ product }) {
  const state = product ? productPublication(product) : null;
  if (state?.published) return null;
  return (
    <aside
      className="catalog-publication-notice"
      aria-label="Catalog publication status"
    >
      <strong>
        {product
          ? "Reference record · pending verification"
          : "Catalog references · publication review pending"}
      </strong>
      <p>
        {product
          ? pendingMessage
          : "Seller-supplied names, specifications and prices are retained for review. Unverified entries are not available to order. Setup or consulting services are not offered without a documented scope."}
      </p>
      <a href="/contact-sales/">Ask about requirements</a>
    </aside>
  );
}
