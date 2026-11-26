import React from "react";
import { productPublication, pendingMessage } from "./offer-publication";
export default function CatalogPublicationNotice({ product }) {
  if (!product || productPublication(product).published) return null;
  return (
    <aside
      className="catalog-publication-notice"
      aria-label="Catalog publication status"
    >
      <strong>Reference record · pending verification</strong>
      <p>{pendingMessage}</p>
      <a href="/contact-sales/">Ask about requirements</a>
    </aside>
  );
}
