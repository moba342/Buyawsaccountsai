// SEO describes supplied catalog information. It never authorizes purchases.
import { brands, products } from "./catalog.js";
import { productRoute, providerRoute, buyingKeyword } from "./catalogPaths.js";
export function buyingTitle(name) {
  const prefix = `Buy ${name}`;
  if (prefix.length >= 50) return prefix;
  const suffixes = [' | Pricing, Limits & Account Details', ' | Product Details & Listed Pricing', ' | Compare Plans & Pricing', ' | Specifications & Pricing', ' | Plans & Pricing', ' | Compare Plans', ' | Pricing', ' | Details'];
  const candidates = suffixes.map(s => prefix + s).filter(s => s.length >= 50 && s.length <= 60);
  return candidates.sort((a,b) => Math.abs(a.length-55)-Math.abs(b.length-55))[0] || prefix;
}
export function buyingDescription(name, detail) {
  const prefix = `Buy ${name}`;
  const candidates = [];
  for (const body of [
    `compare ${detail}, listed pricing and account requirements before ordering.`,
    `review ${detail} and listed prices. Compare specifications and purchase requirements before ordering.`,
    'compare specifications and listed prices. Review billing and account requirements before choosing a product.',
    'review specifications, listed prices and account requirements before ordering.',
  ]) for (const tail of ['', ' Compare related products.', ' Explore the product details.', ' Ask about account details.', ' Compare plans.']) candidates.push(prefix + ': ' + body + tail);
  const suitable = candidates.filter(s => s.length >= 140 && s.length <= 160);
  if (!suitable.length) throw Error('No natural description length for ' + name);
  return suitable.sort((a,b) => Math.abs(a.length-150)-Math.abs(b.length-150))[0];
}
const productDetail = p => p.kind === 'AI' ? 'listed AI access and quota details' : p.credit ? 'the listed $' + p.credit.toLocaleString('en-US') + ' credit value' : p.vcpus ? 'compute quota and billing details' : p.port25 ? 'listed connectivity and account limits' : p.capacity ? 'listed capacity and region requirements' : p.kind === 'Trial' ? 'trial eligibility and billing details' : 'account access and billing details';
const metadata = (name, label, description, category) => ({
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
  seoTitle: buyingTitle(label),
  metaDescription: description,
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
        buyingDescription(name, `${list.length} listed account variations`),
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
        buyingDescription(name, productDetail(product)),
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
