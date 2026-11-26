// Optional editorial overrides keyed by an existing route ID. Never add secrets here.
// Allowed fields: title, description, h1, primaryKeyword, secondaryKeywords, image, imageAlt, noindex.
export const seoOverrides = {};
// Optional legacy commercial overrides; stock and selling prices come from
// inventory.js and catalog.js. SEO overrides do not enable/disable purchasing.
export { publicationReviews as confirmedCommerceFacts } from "./offer-review-records.js";
