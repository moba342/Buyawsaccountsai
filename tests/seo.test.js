import { catalogSeoById } from "../catalog-seo.js";
import { approvedReview } from "./fixtures/publication.js";
import { publicationReviews } from "../offer-review-records.js";
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
    "Buy Cloud Products & Compare Plans | BuyAWSAccountsAI",
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
      ["cart", "checkout"].includes(id) || pageSeo[id]?.noindex ? "noindex, follow" : "index, follow",
    );
  }
  for (const p of pages) {
    assert(p.title.length > 10);
    assert(p.description.length > 40);
    assert.equal(new URL(p.canonical).protocol, "https:");
  }
});
test("catalog Product offers match owner-confirmed inventory and current prices", () => {
  for (const p of products) {
    const seo = getPageSeo(productRoute(p)),
      schema = siteSchema(seo);
    const item = schema["@graph"].find(n => n["@type"] === "Product");
    assert.equal(item.offers.price, p.price);
    assert.equal(item.offers.availability, "https://schema.org/InStock");
    assert.equal(item.aggregateRating, undefined);
    assert.equal(seo.robots, "index, follow");
    assert(seo.description && seo.h1);
  }
});
test("optional descriptions preserve metadata while inventory controls Offers", () => {
  const p = products[1],
    id = productRoute(p),
    facts = approvedReview(p);
  assert.equal(confirmedOffer(p).price, p.price);
  assert.equal(confirmedOffer(p, {saleEnabled:false}), null);
  const offer = confirmedOffer(p, facts);
  assert.equal(offer.price, p.price);
  assert.equal(offer.availability, "https://schema.org/InStock");
  publicationReviews[id] = facts;
  try {
    const seo = getPageSeo(id),
      item = siteSchema(seo)["@graph"].find((n) => n["@type"] === "Product");
    assert(item);
    assert.equal(item.offers.price, p.price);
    assert.equal(item.description, facts.publicDescription);
    assert.equal(seo.title, catalogSeoById.get(id).seoTitle);
    assert.equal(seo.secondaryKeywords.length, 6);
    assert.equal(seo.robots, "index, follow");
    assert(!item.aggregateRating);
    assert(!item.sku);
  } finally {
    delete publicationReviews[id];
  }
});
test("SEO controls are independent of commercial activation", () => {
  const id = productRoute(products[0]);
  seoOverrides[id] = {
    title: "AWS Trial Account Buying Requirements",
    noindex: true,
  };
  try {
    assert.equal(getPageSeo(id).title, "AWS Trial Account Buying Requirements");
    assert.equal(getPageSeo(id).robots, "noindex, follow");
    assert.equal(confirmedOffer(products[0]).price, products[0].price);
    assert.equal(getPageSeo(id).publication.purchasable, true);
  } finally {
    delete seoOverrides[id];
  }
  assert.equal(getPageSeo(id).robots, "index, follow");
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
test("categories link factual catalog ItemLists without assuming commercial offers", () => {
  for (const brand of brands) {
    const graph = siteSchema(getPageSeo(providerRoute(brand)))["@graph"];
    assert(graph.some((n) => n["@type"] === "CollectionPage"));
    assert(graph.some((n) => n["@type"] === "ItemList"));
    assert(!graph.some((n) => n.offers));
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

test("a real service catalog annotation and reviewed scope use Service instead of Product", () => {
  const p = products[0],
    id = productRoute(p),
    old = p.offeringType;
  p.offeringType = "service";
  publicationReviews[id] = {
    ...approvedReview(p),
    serviceProvided: true,
    customerOwnedAccount: true,
    noAccountTransfer: true,
    creditsIncluded: false,
    serviceScopePermitted: true,
    serviceName: "Test-only reviewed setup scope",
    serviceScope: "Test-only service scope",
    evidence: [
      ...approvedReview(p).evidence,
      { kind: "service-scope", reference: "TEST FIXTURE scope" },
      {
        kind: "customer-authorization",
        reference: "TEST ONLY customer authorization",
      },
    ],
  };
  try {
    const seo = getPageSeo(id),
      graph = siteSchema(seo)["@graph"],
      service = graph.find((n) => n["@type"] === "Service");
    assert(service);
    assert(!graph.some((n) => n["@type"] === "Product"));
    assert.equal(service.name, publicationReviews[id].serviceName);
    assert.equal(seo.title, catalogSeoById.get(id).seoTitle);
    assert(!service.sku);
    assert(!service.additionalProperty);
  } finally {
    delete publicationReviews[id];
    if (old === undefined) delete p.offeringType;
    else p.offeringType = old;
  }
});
test("category SEO lists all catalog children independently of commercial approval", () => {
  const p = products[1],
    id = productRoute(p),
    cat = "aws-accounts";
  publicationReviews[id] = approvedReview(p);
  publicationReviews[cat] = {
    status: "approved",
    reviewedBy: "Test category reviewer",
    reviewedAt: "2026-01-01",
    editorialReview: {
      approved: true,
      actualOfferApproved: true,
      metadataMatchesOffering: true,
      proposalApproved: true,
      distinctContentApproved: true,
      indexApproved: true,
    },
  };
  try {
    const seo = getPageSeo(cat);
    assert.equal(seo.title, catalogSeoById.get(cat).seoTitle);
    assert.equal(seo.robots, "index, follow");
    const items = siteSchema(seo)["@graph"].find(
      (n) => n["@type"] === "ItemList",
    );
    assert.equal(
      items.numberOfItems,
      products.filter((p) => p.provider === "AWS").length,
    );
  } finally {
    delete publicationReviews[id];
    delete publicationReviews[cat];
  }
});
