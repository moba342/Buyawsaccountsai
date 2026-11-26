// Presentation of commercial facts only. This never approves or activates an offer.
import { productPublication, categoryPublication } from "./offer-publication.js";
const stockLabels = {
  InStock: "In Stock",
  LimitedAvailability: "Limited availability",
  OutOfStock: "Out of stock",
  PreOrder: "Pre-order unavailable",
  BackOrder: "Back-order unavailable",
};
export function productPurchaseState(product, review) {
  const state = productPublication(product, review);
  const unavailableLabel = state.published
    ? stockLabels[state.review.availability]
    : "Unavailable";
  return {
    ...state,
    price: state.published ? state.review.price : product.price,
    priceLabel: state.published ? "Price" : "Price",
    statusText: state.published
      ? stockLabels[state.review.availability]
      : "Currently unavailable",
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
    priceLabel: state.published ? "Prices from" : "Prices from",
    availableCount: available.length,
  };
}
