import { approvedReview } from "./fixtures/publication.js";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { catalogSeoRecords } from "../catalog-seo.js";
import { products, brands } from "../catalog.js";
import { routePath, pathRoute } from "../routing.js";
import {
  productRoute,
  providerRoute,
  productPath,
  providerPath,
  slug,
} from "../catalogPaths.js";
import { getPageSeo, siteSchema, confirmedOffer } from "../seo.js";
const config = JSON.parse(
  fs.readFileSync(new URL("../vercel.json", import.meta.url)),
);
test("all 82 canonical paths exactly match assigned buying keywords without changing IDs", () => {
  assert.equal(catalogSeoRecords.length, 82);
  const urls = catalogSeoRecords.map((r) => routePath(r.id));
  assert.equal(new Set(urls).size, 82);
  for (const r of catalogSeoRecords) {
    const url = routePath(r.id);
    assert.equal(url, "/" + slug(r.primaryKeyword) + "/");
    assert.equal(pathRoute(url), r.id);
    assert.equal(pathRoute("/" + r.id + "/"), r.id);
    assert.match(url, /^\/buy-[a-z0-9-]+\/$/);
    assert.equal(
      getPageSeo(r.id).canonical,
      "https://buyawsaccountsai.com" + url,
    );
  }
  for (const p of products) {
    assert(productRoute(p).startsWith("product/"));
    assert.equal(productPath(p), routePath(productRoute(p)));
  }
  for (const b of brands)
    assert.equal(providerPath(b), routePath(providerRoute(b)));
});
test("every old catalog URL directly redirects and no configured redirect chains or loops exist", () => {
  const map = new Map(
    config.redirects
      .filter((r) => !r.has)
      .map((r) => [r.source, new URL(r.destination).pathname]),
  );
  assert.equal(map.size, 538);
  assert.equal(config.trailingSlash, undefined);
  for (const r of catalogSeoRecords)
    for (const source of [
      "/" + r.id + "/",
      "/" + r.id,
      "/" + r.id + "/index.html",
    ])
      assert.equal(map.get(source), routePath(r.id));
  for (const r of config.redirects.filter((r) => !r.has)) {
    assert(r.permanent);
    assert(!map.has(new URL(r.destination).pathname), r.source);
    assert(pathRoute(new URL(r.destination).pathname));
    assert.notEqual(r.source, new URL(r.destination).pathname);
  }
});
test("product, eligible-offer, breadcrumb and social URL sources use the canonical path", () => {
  for (const r of catalogSeoRecords) {
    const seo = getPageSeo(r.id),
      graph = siteSchema(seo)["@graph"];
    for (const n of graph) {
      if (n["@type"] === "Product") assert.equal(n.url, seo.canonical);
      if (n.offers) assert.equal(n.offers.url, seo.canonical);
      if (n["@type"] === "BreadcrumbList")
        assert.equal(n.itemListElement.at(-1).item, seo.canonical);
    }
  }
});

test("an eligible offer uses the migrated canonical while keeping the same product ID", () => {
  const p = products[1];
  assert.equal(
    confirmedOffer(p, approvedReview(p)).url,
    getPageSeo(productRoute(p)).canonical,
  );
  assert.equal(productRoute(p), "product/aws-8-vcpu");
});
