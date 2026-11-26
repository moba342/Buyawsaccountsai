// Optional editorial overrides keyed by an existing route ID. Never add secrets here.
// Allowed fields: title, description, h1, primaryKeyword, secondaryKeywords, image, imageAlt, noindex.
export const seoOverrides = {};
// Optional confirmed commerce facts, also keyed by an existing product route ID.
// An Offer is emitted ONLY with an explicit final price, currency, availability and
// confirmed:true. Leave empty while prices are references and stock is unconfirmed.
// Accepted availability: InStock, OutOfStock, PreOrder, BackOrder, LimitedAvailability,
// Discontinued. Optional genuine sku/priceValidUntil must come from your records.
export { publicationReviews as confirmedCommerceFacts } from "./offer-review-records.js";
