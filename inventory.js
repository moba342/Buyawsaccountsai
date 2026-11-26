// Merchant-managed availability. Owner confirmed all current catalog stock on 2026-11-27.
// This records inventory, not independent verification or provider endorsement.
import { products } from "./catalog.js";
import { productRoute } from "./catalogPaths.js";
export const inventory = Object.fromEntries(products.map(product => [productRoute(product), {
  availability: "InStock",
  saleEnabled: true,
  source: "website-owner",
  updatedAt: "2026-11-27",
}]));
// Per-product overrides: saleEnabled:false pauses sales; OutOfStock stops checkout.
// Restriction flags are enforced separately from stock and SEO.
export function inventoryFor(product) {
  return inventory[productRoute(product)] || { availability: "OutOfStock", saleEnabled: false };
}
