import { catalogSeoRecords, catalogSeoReadiness } from "../catalog-seo.js";
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
const data = catalogSeoRecords.map((record) => {
  const proposal = suppliedProductSeo.find((r) => r.id === record.id);
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
    suppliedName: proposal?.suppliedName || record.id,
    archivedProposal: proposal,
    archivedProposalApplied: false,
    activeMetadataSource: "catalog-seo.js",
    slug: record.id,
    canonicalUrl: seo.canonical,
    primaryKeyword: record.primaryKeyword,
    secondaryKeywords: record.secondaryKeywords,
    longTailKeywords: record.longTailKeywords,
    seoTitle: record.seoTitle,
    metaDescription: record.metaDescription,
    h1: record.h1,
    searchIntent: record.searchIntent,
    proposedOfferingType: proposal?.proposedOfferingType,
    actualOfferingType: product
      ? product.offeringType || "account"
      : "collection",
    proposedMetadataStatus: "CATALOG-ALIGNED SEO IMPLEMENTED",
    seoReady: catalogSeoReadiness(record.id).ready,
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
          "Product buying guide",
          "Product specifications",
          "Compare product configurations",
          "Pricing and billing",
          "Purchase requirements and commercial eligibility",
          "Delivery or deployment conditions",
          "Compare plans and discuss requirements",
          "Frequently asked questions",
          "Related reference records",
        ]
      : [
          "Product collection",
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
    seoStatus: "IMPLEMENTED",
    commercialPublicationStatus: publication.publicationStatus,
    commercialVerificationStatus: publication.status,
    robotsDirective: seo.robots,
    indexable: !seo.robots.startsWith("noindex"),
    purchasable: product ? publication.purchasable : false,
    indexabilityReason: catalogSeoReadiness(record.id).reason,
    commercialActivationBlockers: publication.reasons,
    seoDocumentPrerequisites: [],
    dateModified: publication.review?.contentUpdatedAt || null,
    humanEditorialReview: publication.published
      ? "Commercial offer reviewed separately"
      : "Commercial review pending; SEO development complete",
  };
});
if (
  data.length !== products.length + brands.length ||
  data.filter((r) => r.recordType === "variant").length !== products.length
)
  throw Error("Catalog SEO reconciliation mismatch");
await fs.writeFile(
  folder + "/PRODUCT-SEO-CATALOG.json",
  JSON.stringify(
    {
      website: "BuyAWSAccountsAI",
      reviewDate: "2026-11-27",
      baselineCommit: "ec7a7bc",
      note: "Active SEO is generated from the existing catalog independently of commercial approval. Earlier proposals are archived without inventing services. SEO readiness is not availability, authorization or purchase activation.",
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
  "seoStatus",
  "commercialPublicationStatus",
  "commercialVerificationStatus",
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
    "\n" +
    data.map((r) => columns.map((k) => csv(r[k])).join(",")).join("\n") +
    "\n",
);
const count = {
  records: data.length,
  categories: data.filter((r) => r.recordType === "category").length,
  variants: data.filter((r) => r.recordType === "variant").length,
  archivedServiceProposals: data.filter(
    (r) => r.proposedOfferingType === "service",
  ).length,
  seoReady: data.filter((r) => r.seoReady).length,
  commercialPublished: data.filter(
    (r) => r.commercialPublicationStatus === "published",
  ).length,
  purchasable: data.filter((r) => r.purchasable).length,
  indexable: data.filter((r) => r.indexable).length,
  commercialPending: data.filter(
    (r) => r.commercialVerificationStatus === "PENDING VERIFICATION",
  ).length,
};
await fs.writeFile(
  folder + "/catalog-summary.json",
  JSON.stringify(count, null, 2) + "\n",
);
console.log("Catalog SEO report:", JSON.stringify(count));
