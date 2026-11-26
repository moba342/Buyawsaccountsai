import fs from "node:fs/promises";
import { products, brands } from "../catalog.js";
import { productRoute, providerRoute } from "../catalogPaths.js";
import { suppliedProductSeo } from "../product-seo-records.js";
import {
  productPublication,
  categoryPublication,
  specificationSnapshot,
} from "../offer-publication.js";
import { getPageSeo, SITE_URL } from "../seo.js";
import { guides } from "../editorialContent.js";
import { guideRoute } from "../guideRoutes.js";
import { catalogEditorial } from "../catalog-editorial-data.js";
const folder = "docs/seo";
await fs.mkdir(folder, { recursive: true });
const data = suppliedProductSeo.map((record) => {
  const product = products.find((p) => productRoute(p) === record.id),
    brand = brands.find((b) => b.name === record.provider),
    list = products.filter((p) => p.provider === record.provider),
    publication = product
      ? productPublication(product)
      : categoryPublication(brand, list),
    seo = getPageSeo(record.id);
  const related = product
    ? list
        .filter((p) => p.name !== product.name)
        .slice(0, 4)
        .map((p) => SITE_URL + "/" + productRoute(p) + "/")
    : list.map((p) => SITE_URL + "/" + productRoute(p) + "/");
  return {
    productId: record.id,
    parentProductId: product ? providerRoute(brand) : null,
    recordType: record.type,
    provider: record.provider,
    productName: product
      ? product.provider + " " + product.name
      : brand.full + " accounts",
    variantName: product?.name || null,
    suppliedName: record.suppliedName,
    slug: record.id,
    canonicalUrl: seo.canonical,
    primaryKeyword: record.primaryKeyword,
    secondaryKeywords: record.secondaryKeywords,
    longTailKeywords: record.longTailKeywords,
    seoTitle: record.seoTitle,
    metaDescription: record.metaDescription,
    h1: record.h1,
    searchIntent: record.searchIntent,
    proposedOfferingType: record.proposedOfferingType,
    actualOfferingType: product
      ? product.offeringType || "account"
      : "collection",
    proposedMetadataStatus: publication.metadataProposalEligible
      ? "APPROVED"
      : "PENDING HUMAN SCOPE REVIEW",
    effectiveMetadata: {
      title: seo.title,
      description: seo.description,
      h1: seo.h1,
      primaryKeyword: seo.primaryKeyword,
      secondaryKeywords: seo.secondaryKeywords,
      searchIntent: seo.searchIntent,
    },
    headings: product
      ? [
          "Reference overview",
          "Product specifications",
          "Available configurations",
          "Pricing and billing",
          "Product requirements and publication review",
          "Delivery or deployment conditions",
          "Compare plans and discuss requirements",
          "Frequently asked questions",
          "Related reference records",
        ]
      : [
          "Reference collection",
          "Catalog variants",
          "Provider requirements",
          "Buying guidance",
        ],
    productDescription: product
      ? publication.published
        ? publication.review.publicDescription
        : catalogEditorial[record.id].intro
      : brand.summary,
    openGraphTitle: seo.title,
    openGraphDescription: seo.description,
    openGraphImage: seo.image,
    imageAlt: seo.imageAlt,
    price: product?.price ?? null,
    referencePriceFrom: product ? null : Math.min(...list.map((p) => p.price)),
    priceCurrency: "USD",
    creditFaceValue: product?.credit || null,
    purchasePriceVerified: !!product && publication.published,
    availability: publication.review?.availability || null,
    sku: publication.published ? publication.review?.sku || null : null,
    originalSpecifications: product ? specificationSnapshot(product) : null,
    verifiedSpecifications: publication.published
      ? publication.review?.verifiedSpecifications || null
      : null,
    supportedRegions: publication.published
      ? publication.review?.supportedRegions || []
      : [],
    relatedProducts: related,
    relatedGuides: guides.map((g) => SITE_URL + "/" + guideRoute(g) + "/"),
    publicationStatus: publication.publicationStatus,
    verificationStatus: publication.status,
    robotsDirective: seo.robots,
    indexable: publication.indexable,
    purchasable: product ? publication.purchasable : false,
    indexabilityReason:
      publication.indexingReason || publication.reasons.join("; "),
    verificationBlockers: publication.reasons,
    dateModified: publication.review?.contentUpdatedAt || null,
    humanEditorialReview: publication.published
      ? "Actual offer reviewed; proposal requires separate matching-scope approval"
      : "PENDING HUMAN REVIEW",
  };
});
if (
  data.length !== 82 ||
  data.filter((r) => r.recordType === "variant").length !== 68
)
  throw Error("Catalog SEO reconciliation mismatch");
await fs.writeFile(
  folder + "/PRODUCT-SEO-CATALOG.json",
  JSON.stringify(
    {
      website: "BuyAWSAccountsAI",
      reviewDate: "2026-11-26",
      sourceCommit: "a5ed490",
      note: "Proposed buying metadata is preserved exactly. Effective pending-reference metadata, publication and indexability are generated from the same runtime policy as the storefront. No authorization, stock, service or legal fact is inferred.",
      records: data,
    },
    null,
    2,
  ) + "\n",
);
const columns = [
  "productId",
  "parentProductId",
  "provider",
  "suppliedName",
  "primaryKeyword",
  "secondaryKeywords",
  "longTailKeywords",
  "seoTitle",
  "metaDescription",
  "h1",
  "canonicalUrl",
  "publicationStatus",
  "verificationStatus",
  "proposedMetadataStatus",
  "robotsDirective",
  "indexabilityReason",
];
const csv = (v) =>
  '"' +
  String(Array.isArray(v) ? v.join(" | ") : (v ?? "")).replaceAll('"', '""') +
  '"';
await fs.writeFile(
  folder + "/PRODUCT-KEYWORD-MAPPING.csv",
  columns.map(csv).join(",") +
    "\r\n" +
    data.map((r) => columns.map((k) => csv(r[k])).join(",")).join("\r\n") +
    "\r\n",
);
const count = {
  records: data.length,
  categories: data.filter((r) => r.recordType === "category").length,
  variants: data.filter((r) => r.recordType === "variant").length,
  proposedServices: data.filter((r) => r.proposedOfferingType === "service")
    .length,
  published: data.filter((r) => r.publicationStatus === "published").length,
  indexable: data.filter((r) => r.indexable).length,
  pending: data.filter((r) => r.verificationStatus === "PENDING VERIFICATION")
    .length,
};
await fs.writeFile(
  folder + "/catalog-summary.json",
  JSON.stringify(count, null, 2) + "\n",
);
console.log("Catalog SEO report:", JSON.stringify(count));
