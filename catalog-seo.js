// SEO describes supplied catalog information. It never authorizes purchases.
import { brands, products } from "./catalog.js";
import { productRoute, providerRoute, buyingKeyword } from "./catalogPaths.js";
import { catalogMetadataCopy } from "./catalog-metadata-copy.js";
function curatedMetadata(id, name) {
  const copy = catalogMetadataCopy[id];
  if (!copy) throw Error("Missing product-specific metadata: " + id);
  return {
    seoTitle: `Buy ${name}${copy.titleSuffix ? " | " + copy.titleSuffix : ""}`,
    metaDescription: `Buy ${name}: ${copy.descriptionBody}`,
  };
}
const metadata = (name, id) => ({
  primaryKeyword: buyingKeyword(name),
  secondaryKeywords: [
    `buy ${name.toLowerCase()} online`,
    `purchase ${name.toLowerCase()}`,
    `order ${name.toLowerCase()}`,
    `${name.toLowerCase()} pricing`,
    `${name.toLowerCase()} specifications`,
    `compare ${name.toLowerCase()}`,
  ],
  longTailKeywords: [
    `compare ${name.toLowerCase()} prices and specifications`,
    `buy ${name.toLowerCase()} for cloud projects`,
    `${name.toLowerCase()} buying requirements and listed price`,
  ],
  ...curatedMetadata(id, name),
  h1: `Buy ${name}`,
  searchIntent: "Transactional",
});
export const catalogSeoRecords = [
  ...brands.map((brand) => {
    const name = brand.name + " Accounts";
    return {
      id: providerRoute(brand),
      type: "category",
      provider: brand.name,
      ...metadata(
        name,
        providerRoute(brand),
      ),
    };
  }),
  ...products.map((product) => {
    const name = product.provider + " " + product.name;
    return {
      id: productRoute(product),
      type: "variant",
      provider: product.provider,
      ...metadata(
        name,
        productRoute(product),
      ),
    };
  }),
];
export const catalogSeoById = new Map(
  catalogSeoRecords.map((record) => [record.id, record]),
);
// Crawl readiness is independent of authorization, inventory and checkout eligibility.
export function catalogSeoReadiness(id) {
  const record = catalogSeoById.get(id);
  return {
    ready: Boolean(record),
    reason: record
      ? "Catalog content and unique transactional metadata prepared; commercial activation is separate."
      : "No catalog SEO record.",
  };
}
