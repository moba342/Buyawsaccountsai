import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  SITE_URL,
  getPageSeo,
  siteSchema,
  safeJson,
  confirmedOffer,
  socialEntries,
  twitterEntries,
} from "../seo.js";
import { SITE, pageSeo, pageHeading } from "../site-config.js";
import { seoOverrides, confirmedCommerceFacts } from "../seo-overrides.js";
import { products, brands } from "../catalog.js";
import { productRoute, providerRoute } from "../catalogPaths.js";
import { routeIds, routePath, pathRoute } from "../routing.js";
import { breadcrumbsFor } from "../breadcrumbData.js";
import { guides } from "../editorialContent.js";
import { guideRoute } from "../guideRoutes.js";

test("the eight core pages use the supplied SEO titles, descriptions and H1s", () => {
  for (const [id, entry] of Object.entries(pageSeo)) {
    const seo = getPageSeo(
      id === "home" ? "products" : id,
      id === "home" ? "/" : routePath(id),
    );
    assert.equal(seo.title, entry.title);
    assert.equal(seo.description, entry.description);
    assert.equal(seo.h1, entry.h1);
    assert.equal(seo.primaryKeyword, entry.primaryKeyword);
  }
  assert.equal(
    getPageSeo("products", "/").title,
    "Buy AWS Accounts Online | AWS Cloud Accounts for Sale",
  );
  assert.equal(getPageSeo("products", "/").keywords, undefined);
});
test("all 96 generated pages have unique metadata and self-referencing canonical URLs", () => {
  const pages = [
    getPageSeo("products", "/"),
    ...routeIds.map((id) => getPageSeo(id)),
  ];
  assert.equal(pages.length, 96);
  for (const key of ["title", "description", "canonical", "h1"])
    assert.equal(new Set(pages.map((p) => p[key])).size, pages.length, key);
  for (const id of routeIds) {
    const seo = getPageSeo(id);
    assert.equal(seo.canonical, SITE_URL + routePath(id));
    assert.equal(
      seo.robots,
      ["cart", "checkout"].includes(id) ? "noindex, follow" : "index, follow",
    );
  }
  for (const p of pages) {
    assert(p.title.length > 10);
    assert(p.description.length > 40);
    assert.equal(new URL(p.canonical).protocol, "https:");
  }
});
test("dynamic product schemas use visible facts and do not invent offers, ratings or IDs", () => {
  for (const p of products) {
    const seo = getPageSeo(productRoute(p)),
      schema = siteSchema(seo),
      item = schema["@graph"].find((n) => n["@type"] === "Product");
    assert.equal(item.name, p.provider + " " + p.name);
    assert.equal(item.url, seo.canonical);
    assert.equal(item.category, p.group);
    assert.equal(item.additionalProperty.at(-1).value, p.price);
    for (const key of [
      "offers",
      "sku",
      "gtin",
      "mpn",
      "review",
      "aggregateRating",
    ])
      assert.equal(item[key], undefined);
    assert.equal(item.image[0], seo.image);
    assert(item.image[0].startsWith(SITE_URL + "/social/products/"));
  }
});
test("offers require explicitly confirmed matching prices and real stock facts", () => {
  const p = products[0],
    facts = {
      confirmed: true,
      price: p.price,
      priceCurrency: "USD",
      availability: "InStock",
    };
  assert.equal(confirmedOffer(p), null);
  assert.equal(confirmedOffer(p, { ...facts, confirmed: "false" }), null);
  assert.equal(confirmedOffer(p, { ...facts, confirmed: false }), null);
  assert.equal(confirmedOffer(p, { ...facts, price: p.price + 1 }), null);
  assert.equal(confirmedOffer(p, { ...facts, availability: "Unknown" }), null);
  const offer = confirmedOffer(p, facts);
  assert.equal(offer.price, p.price);
  assert.equal(offer.availability, "https://schema.org/InStock");
  assert.equal(offer.seller["@id"], SITE_URL + "/#organization");
});
test("breadcrumbs use real canonical parents and sequential schema positions", () => {
  for (const id of routeIds) {
    const crumbs = breadcrumbsFor(id),
      schema = siteSchema(getPageSeo(id))["@graph"].find(
        (n) => n["@type"] === "BreadcrumbList",
      );
    if (!crumbs.length) {
      assert.equal(schema, undefined);
      continue;
    }
    assert.equal(schema.itemListElement.length, crumbs.length);
    crumbs.forEach((c, i) => {
      assert(pathRoute(c.path));
      assert.equal(schema.itemListElement[i].item, SITE_URL + c.path);
      assert.equal(schema.itemListElement[i].position, i + 1);
      assert.equal(schema.itemListElement[i].name, c.name);
    });
  }
});
test("collection ItemLists contain actual individual products and guides", () => {
  for (const brand of brands) {
    const graph = siteSchema(getPageSeo(providerRoute(brand)))["@graph"];
    assert(graph.some((n) => n["@type"] === "CollectionPage"));
    assert(!graph.some((n) => n["@type"] === "Product"));
    const list = graph.find((n) => n["@type"] === "ItemList");
    assert.equal(
      list.numberOfItems,
      products.filter((p) => p.provider === brand.name).length,
    );
  }
  const graph = siteSchema(getPageSeo("guides"))["@graph"];
  assert.equal(graph.find((n) => n["@type"] === "ItemList").numberOfItems, 3);
  for (const g of guides)
    assert(
      siteSchema(getPageSeo(guideRoute(g)))["@graph"].some(
        (n) => n["@type"] === "Article",
      ),
    );
});
test("editorial overrides apply without changing routes and noindex can remove a public URL", () => {
  seoOverrides.products = {
    title: "Editorial title",
    description: "Editorial description",
    h1: "Editorial heading",
    noindex: true,
  };
  try {
    assert.equal(getPageSeo("products").title, "Editorial title");
    assert.equal(pageHeading("products"), "Editorial heading");
    assert.equal(getPageSeo("products").robots, "noindex, follow");
    assert.equal(getPageSeo("products").canonical, SITE_URL + "/marketplace/");
  } finally {
    delete seoOverrides.products;
  }
  assert.deepEqual(confirmedCommerceFacts, {});
});
test("JSON-LD is safe in an inline script and round-trips exactly", () => {
  const data = { name: '</script><script>alert("x")</script>&\u2028\u2029' };
  const json = safeJson(data);
  assert(!json.includes("<"));
  assert(!json.includes(">"));
  assert(!json.includes("&"));
  assert.deepEqual(JSON.parse(json), data);
});
test("social metadata uses HTTPS assets and custom 404 is noindex without canonical/schema", () => {
  for (const id of routeIds) {
    const seo = getPageSeo(id),
      og = socialEntries(seo),
      tw = twitterEntries(seo);
    assert.equal(og["og:image:width"], "1200");
    assert.equal(og["og:image:height"], "630");
    assert.equal(tw["twitter:card"], "summary_large_image");
    assert.equal(tw["twitter:image"], og["og:image"]);
    assert.equal(og["og:locale"], SITE.locale);
  }
  const missing = getPageSeo("not-found", "/missing/");
  assert.equal(missing.canonical, null);
  assert.equal(missing.robots, "noindex, follow");
  assert.equal(siteSchema(missing), null);
  assert(!missing.h1.includes("undefined"));
});
test("static rewrites and build pipeline preserve generated public HTML and security headers", () => {
  const config = JSON.parse(
    fs.readFileSync(new URL("../vercel.json", import.meta.url)),
  );
  for (const rewrite of config.rewrites)
    assert.equal(rewrite.destination, rewrite.source + "index.html");
  const pkg = JSON.parse(
    fs.readFileSync(new URL("../package.json", import.meta.url)),
  );
  assert(pkg.scripts.build.includes("--ssr entry-server.jsx"));
  assert.equal(pkg.scripts.postbuild, "node scripts/generate-seo.mjs");
  assert(
    config.headers.some((h) =>
      h.headers.some((v) => v.key === "X-Content-Type-Options"),
    ),
  );
});
