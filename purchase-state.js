// Presentation of commercial facts only. This never approves or activates an offer.
import { productPublication, categoryPublication } from "./offer-publication.js";
const stockLabels = {
  InStock: "Available to order",
  LimitedAvailability: "Limited availability",
  OutOfStock: "Out of stock",
  PreOrder: "Pre-order unavailable",
  BackOrder: "Back-order unavailable",
};
export function productPurchaseState(product, review) {
  const state = productPublication(product, review);
  const unavailableLabel = state.published
    ? stockLabels[state.review.availability]
    : "Pending review";
  return {
    ...state,
    price: state.published ? state.review.price : product.price,
    priceLabel: state.published ? "Price" : "Reference price",
    statusText: state.published
      ? "Reviewed offer · " + stockLabels[state.review.availability]
      : "Pending verification · not available to order",
    unavailableLabel,
    cartLabel: state.purchasable ? "Add to cart" : unavailableLabel,
    buyLabel: state.purchasable ? "Buy Now" : unavailableLabel,
  };
}
export function categoryPurchaseState(brand, list, review) {
  const state = categoryPublication(brand, list, review);
  const published = list.filter(product => productPublication(product).published);
  const available = published.filter(product => productPublication(product).purchasable);
  const priced = state.published ? (available.length ? available : published) : list;
  return {
    ...state,
    priceFrom: priced.length ? Math.min(...priced.map(product => product.price)) : null,
    priceLabel: state.published ? "Prices from" : "Reference prices from",
    availableCount: available.length,
  };
}
