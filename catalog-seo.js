// SEO describes supplied catalog information. It never authorizes purchases.
import { brands, products } from "./catalog.js";
import { productRoute, providerRoute } from "./catalogPaths.js";
const compact = (value, length) =>
  value.length <= length
    ? value
    : value.slice(0, length - 1).replace(/\s+\S*$/, "") + "…";
const metadata = (name, label, description, category) => ({
  primaryKeyword: "buy " + name.toLowerCase(),
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
  seoTitle:
    compact(`Buy ${label}`, 49) +
    (category ? " | Compare Plans" : " | Plans & Pricing"),
  metaDescription: compact(description, 160),
  h1: `Buy ${name}`,
  searchIntent: "Transactional",
});
export const catalogSeoRecords = [
  ...brands.map((brand) => {
    const list = products.filter((p) => p.provider === brand.name);
    const name = brand.name + " Accounts";
    return {
      id: providerRoute(brand),
      type: "category",
      provider: brand.name,
      ...metadata(
        name,
        name,
        `Compare ${list.length} ${brand.full} account variants, listed prices and specifications. Explore product details and purchase requirements to plan your next cloud project.`,
        true,
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
        name,
        `Compare ${name} at a listed $${product.price.toLocaleString("en-US")}. Review ${product.group} specifications, billing requirements and related products before buying.`,
        false,
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
