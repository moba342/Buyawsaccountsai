import path from "node:path";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { routeIds, routePath, pathRoute } from "../routing.js";
import { getPageSeo, SITE_URL, siteSchema, socialEntries } from "../seo.js";
import { catalogSeoRecords } from "../catalog-seo.js";
import { slug } from "../catalogPaths.js";
const base = process.env.QA_URL || "http://localhost:4173";
const evidence =
  process.env.QA_EVIDENCE_DIR || "docs/seo/evidence/url-migration";
const config = JSON.parse(await fs.readFile("vercel.json", "utf8"));
const pages = [
  { id: "products", url: "/" },
  ...routeIds.map((id) => ({ id, url: routePath(id) })),
];
const report = {
  date: "2026-11-27",
  base,
  pages: 0,
  indexable200: 0,
  directRedirects: 0,
  queryPreserved: 0,
  internalLinks: 0,
  schemaChecks: 0,
  errors: [],
};
const esc = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const sitemapResponse = await fetch(base + "/sitemap.xml", { redirect: "manual" });
assert.equal(sitemapResponse.status, 200, "live sitemap status");
const xml = await sitemapResponse.text();
assert.equal(xml, await fs.readFile("dist/sitemap.xml", "utf8"), "served sitemap matches build");
const sitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert.equal(new Set(sitemap).size, sitemap.length, "duplicate sitemap URLs");
const robotsResponse = await fetch(base + "/robots.txt", { redirect: "manual" });
assert.equal(robotsResponse.status, 200, "robots status");
assert((await robotsResponse.text()).includes("Sitemap: " + SITE_URL + "/sitemap.xml"), "robots sitemap declaration");
for (const record of catalogSeoRecords) assert.equal(routePath(record.id), "/" + slug(record.primaryKeyword) + "/", record.id + " assigned keyword URL");
Object.assign(report, { categories: catalogSeoRecords.filter(r => r.type === "category").length, variations: catalogSeoRecords.filter(r => r.type === "variant").length, sitemapUrls: sitemap.length, servedSitemapMatchesBuild: true, robots: true });
const internal = new Set();
async function batches(items, fn) {
  for (let i = 0; i < items.length; i += 8)
    await Promise.all(items.slice(i, i + 8).map(fn));
}
await batches(pages, async ({ id, url }) => {
  const seo = getPageSeo(id, url),
    r = await fetch(base + url, { redirect: "manual" });
  assert.equal(r.status, 200, url);
  const html = await r.text();
  assert(
    html.includes('rel="canonical" href="' + esc(seo.canonical) + '"'),
    url + " canonical",
  );
  assert(
    html.includes('property="og:url" content="' + esc(seo.canonical) + '"'),
    url + " og:url",
  );
  assert(
    html.includes('name="robots" content="' + seo.robots + '"'),
    url + " robots",
  );
  assert.equal(
    sitemap.includes(seo.canonical),
    !seo.robots.startsWith("noindex"),
    url + " sitemap",
  );
  const data = JSON.parse(
    html.match(/<script id="site-seo-schema"[^>]*>([\s\S]*?)<\/script>/)[1],
  );
  assert.deepEqual(data, siteSchema(seo));
  report.schemaChecks++;
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const target = new URL(m[1].replaceAll("&amp;", "&"), SITE_URL + url);
    if (target.origin !== SITE_URL || m[1].startsWith("#")) continue;
    const targetId = pathRoute(target.pathname);
    if (target.pathname !== "/") {
      assert(targetId, "unknown link " + m[1] + " on " + url);
      assert.equal(
        target.pathname,
        routePath(targetId),
        "noncanonical link " + m[1] + " on " + url,
      );
    }
    internal.add(target.pathname);
  }
  report.pages++;
  if (!seo.robots.startsWith("noindex")) report.indexable200++;
});
await batches(
  config.redirects.filter((r) => !r.has),
  async (r) => {
    const response = await fetch(
      base + r.source + "?utm_source=url-audit&keep=1",
      { redirect: "manual" },
    );
    assert.equal(response.status, 308, r.source);
    const target = new URL(response.headers.get("location"), base);
    assert.equal(
      target.href,
      r.destination + "?utm_source=url-audit&keep=1",
      r.source,
    );
    assert.equal(
      target.search,
      "?utm_source=url-audit&keep=1",
      r.source + " query",
    );
    const final = await fetch(base + target.pathname + target.search, {
      redirect: "manual",
    });
    assert.equal(final.status, 200, r.source + " final must be one-hop 200");
    report.directRedirects++;
    report.queryPreserved++;
  },
);
await batches([...internal], async (url) => {
  assert.equal(
    (await fetch(base + url, { redirect: "manual" })).status,
    200,
    url,
  );
  report.internalLinks++;
});
assert.equal(
  (await fetch(base + "/missing-url-migration-test/", { redirect: "manual" }))
    .status,
  404,
);
await fs.mkdir(evidence, { recursive: true });
await fs.writeFile(
  path.join(evidence, "validation.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
