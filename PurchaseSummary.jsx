import { canPurchaseProduct } from "./offer-publication";
import React from "react";
import { ArrowDown, Check, ShoppingBag } from "lucide-react";
import { formatPrice } from "./catalog";
export default function PurchaseSummary({ brand, product, packages, onOrder }) {
  const price = product
    ? product.price
    : Math.min(...packages.map((p) => p.price));
  return (
    <aside className="purchase-summary">
      <div className="purchase-summary-heading">
        <span>
          <ShoppingBag size={19} aria-hidden="true" />
        </span>
        <span>YOUR ACCOUNT PURCHASE</span>
      </div>
      <p className="purchase-summary-label">
        {product ? "Listed package price" : "Packages starting from"}
      </p>
      <div className="purchase-summary-price">
        {formatPrice(price)}
        <span>/ account</span>
      </div>
      <h2>{product ? product.name : brand.name + " account options"}</h2>
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
        disabled={!canPurchaseProduct(product || packages[0])}
        className="primary"
        onClick={() => onOrder(product || packages[0])}
      >
        {canPurchaseProduct(product || packages[0])
          ? product
            ? "Buy Now"
            : "Discuss a package"
          : "Pending publication review"}
      </button>
      <a href="#package-options">
        {product ? "Review package details" : "Browse account variants"}{" "}
        <ArrowDown size={14} aria-hidden="true" />
      </a>
    </aside>
  );
}
