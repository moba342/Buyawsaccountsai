import test from "node:test";
import assert from "node:assert/strict";
import { catalogSeoRecords } from "../catalog-seo.js";
import { products } from "../catalog.js";
import { productRoute } from "../catalogPaths.js";
import { getPageSeo, siteSchema, confirmedOffer } from "../seo.js";
import { publicationReviews } from "../offer-review-records.js";
import { productPublication } from "../offer-publication.js";
test("all 82 catalog SEO records are transactional, unique, useful and catalog-aligned", () => {
  assert.equal(catalogSeoRecords.length, 82);
  for (const key of [
    "id",
    "primaryKeyword",
    "seoTitle",
    "metaDescription",
    "h1",
  ])
    assert.equal(new Set(catalogSeoRecords.map((r) => r[key])).size, 82, key);
  for (const r of catalogSeoRecords) {
    assert(r.primaryKeyword.startsWith("buy "));
    assert(r.secondaryKeywords.length >= 5);
    assert(r.longTailKeywords.length >= 3);
    assert(r.seoTitle.length <= Math.max(60, r.primaryKeyword.length));
    assert(r.seoTitle.toLowerCase().includes(r.primaryKeyword));
    assert(r.metaDescription.toLowerCase().includes(r.primaryKeyword));
    assert(r.metaDescription.length <= 160 && r.metaDescription.length >= 140);
    assert(
      !/verified seller|in stock|guaranteed|instant delivery|setup services|consulting services/i.test(
        r.metaDescription + " " + r.seoTitle,
      ),
    );
    const seo = getPageSeo(r.id);
    assert.equal(seo.title, r.seoTitle);
    assert.equal(seo.robots, "index, follow");
  }
});
test("SEO completes with no approval records and does not activate purchases or offers", () => {
  assert.deepEqual(publicationReviews, {});
  for (const p of products) {
    const seo = getPageSeo(productRoute(p));
    assert.equal(seo.robots, "index, follow");
    assert(!productPublication(p).purchasable);
    assert.equal(confirmedOffer(p), null);
    const node = siteSchema(seo)["@graph"].find(
      (n) => n["@type"] === "Product",
    );
    assert(node);
    assert.equal(node.offers, undefined);
    assert.equal(node.aggregateRating, undefined);
    assert.equal(node.sku, undefined);
  }
});

test("compatibility keyword metadata is deduplicated and catalog sourced", async () => {
  const { metaKeywordContent } = await import("../seo.js");
  assert.equal(metaKeywordContent({}), "");
  assert.equal(metaKeywordContent({ primaryKeyword: "buy accounts", secondaryKeywords: ["buy accounts", "account pricing"] }), "buy accounts, account pricing");
  for (const record of catalogSeoRecords) {
    assert.equal(metaKeywordContent(getPageSeo(record.id)), [record.primaryKeyword, ...record.secondaryKeywords, ...record.longTailKeywords].join(", "));
  }
});


test("editorial metadata covers all records without generic suffix filling", async () => {
  const { catalogMetadataCopy } = await import("../catalog-metadata-copy.js");
  assert.equal(Object.keys(catalogMetadataCopy).length, 82);
  assert.equal(new Set(Object.values(catalogMetadataCopy).map(r => r.descriptionBody)).size, 82);
  for (const record of catalogSeoRecords) {
    assert(catalogMetadataCopy[record.id]);
    assert(!record.seoTitle.includes("Pricing, Limits & Account Details"));
    assert(record.metaDescription.endsWith(catalogMetadataCopy[record.id].descriptionBody));
  }
});
