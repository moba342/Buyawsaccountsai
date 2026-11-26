import { productPurchaseState } from "./purchase-state";
import { canPurchaseProduct } from "./offer-publication";
import React from "react";
import { ArrowDown, Check, ShoppingBag } from "lucide-react";
import { formatPrice } from "./catalog";
export default function PurchaseSummary({ brand, product, packages, onOrder }) {
  const selectedProduct = product || packages.find(canPurchaseProduct) || null;
  const state = selectedProduct ? productPurchaseState(selectedProduct) : null;
  const price = selectedProduct ? state.price : Math.min(...packages.map(p => p.price));
  return (
    <aside className="purchase-summary">
      <div className="purchase-summary-heading">
        <span>
          <ShoppingBag size={19} aria-hidden="true" />
        </span>
        <span>YOUR ACCOUNT PURCHASE</span>
      </div>
      <p className="purchase-summary-label">
        {state?.published ? "Package price" : product ? "Package price" : "Prices from"}
      </p>
      <div className="purchase-summary-price">
        {formatPrice(price)}
        <span>/ account</span>
      </div>
      <h2>{selectedProduct ? selectedProduct.name : brand.name + " account options"}</h2>
      <p className="purchase-summary-copy">
        {product
          ? "Review the proposed scope, then confirm current account details and your final quote."
          : "Compare " +
            packages.length +
            " variants, then confirm account details and your final quote."}
      </p>
      <ul>
        {[
          "Account details to review",
          "Written pricing and delivery terms",
          "Direct contact before purchase",
        ].map((text) => (
          <li key={text}>
            <Check size={14} aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>
      <button
        disabled={!state?.purchasable}
        className="primary"
        onClick={() => { if (state?.purchasable) onOrder(selectedProduct); }}
      >
        {state ? state.buyLabel : "Currently unavailable"}
      </button>
      <a href="#package-options">
        {product ? "Review package details" : "Browse account variants"}{" "}
        <ArrowDown size={14} aria-hidden="true" />
      </a>
    </aside>
  );
}
