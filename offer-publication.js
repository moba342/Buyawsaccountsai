// Commercial availability only; SEO indexing never authorizes or disables sales.
import { publicationReviews } from "./offer-review-records.js";
import { inventoryFor } from "./inventory.js";
import { productRoute, providerRoute } from "./catalogPaths.js";
const specKeys = ["name", "kind", "vcpus", "credit", "rpm", "tpm", "models", "capacity", "dailyLimit", "regions", "ips", "port25"];
export const specificationSnapshot = product => Object.fromEntries(specKeys.map(k => [k, product[k] ?? null]));
const stocks = ["InStock", "LimitedAvailability", "OutOfStock", "PreOrder", "BackOrder"];
export function productPublication(product, overrides = publicationReviews[productRoute(product)]) {
  const stock = inventoryFor(product);
  const facts = { ...stock, ...overrides, price: product.price, priceCurrency: "USD" };
  const reasons = [];
  if (facts.saleEnabled !== true || facts.status === "disabled") reasons.push("Sales disabled by merchant");
  if (!stocks.includes(facts.availability)) reasons.push("Invalid inventory status");
  if (!Number.isFinite(product.price) || product.price <= 0) reasons.push("Invalid selling price");
  // Known provider/program restrictions always override merchant stock. Unknown
  // details are not presented as independently verified or provider-approved.
  if (product.offeringType === "service") {
    if (facts.customerOwnedAccount !== true || facts.noAccountTransfer !== true || facts.creditsIncluded !== false || facts.serviceScopePermitted !== true || facts.serviceProvided !== true || !facts.serviceScope)
      reasons.push("Service scope or customer-account conditions not established");
  } else if (facts.resaleAuthorized === false || facts.transferEligible === false || facts.nonTransferable === true) {
    reasons.push("Provider resale or transfer restriction");
  }
  for (const key of ["resaleAuthorized", "transferEligible", "nonTransferable", "programPermitted", "networkPermitted", "modelsVerified", "quotasVerified"])
    if (facts[key] !== undefined && typeof facts[key] !== "boolean") reasons.push("Invalid restriction flag: " + key);
  if (product.models && facts.modelsVerified === false) reasons.push("Model specifications require correction");
  if (facts.quotasVerified === false) reasons.push("Quota specifications require correction");
  if (facts.programPermitted === false) reasons.push("Provider program restriction");
  if (product.port25 && facts.networkPermitted === false) reasons.push("Provider network restriction");
  const published = reasons.length === 0;
  return {
    id: productRoute(product), status: published ? "ACTIVE" : "UNAVAILABLE",
    publicationStatus: published ? "published" : "unavailable", published,
    purchasable: published && ["InStock", "LimitedAvailability"].includes(facts.availability),
    review: facts, reasons,
  };
}
export const canPurchaseProduct = product => Boolean(product && productPublication(product).purchasable);
export function categoryPublication(brand, list, overrides) {
  const published = list.some(product => productPublication(product).published) && overrides?.saleEnabled !== false;
  return { id: providerRoute(brand), review: overrides, status: published ? "ACTIVE" : "UNAVAILABLE", publicationStatus: published ? "published" : "unavailable", published, reasons: published ? [] : ["No active products in this category"] };
}
export const pendingMessage = "This product is currently unavailable to order.";
