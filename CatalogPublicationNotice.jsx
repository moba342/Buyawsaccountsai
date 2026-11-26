import React from "react";
import { productPublication, pendingMessage } from "./offer-publication";
export default function CatalogPublicationNotice({ product }) {
  if (!product || productPublication(product).published) return null;
  return (
    <aside
      className="catalog-publication-notice"
      aria-label="Product availability"
    >
      <strong>Product currently unavailable</strong>
      <p>{pendingMessage}</p>
      <a href="/contact-sales/">Ask about requirements</a>
    </aside>
  );
}
