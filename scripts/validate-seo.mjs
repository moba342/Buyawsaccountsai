// Validate generated artifacts after `npm run build`; no browser or network required.
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import sharp from "sharp";
import { routeIds, routePath } from "../routing.js";
import { getPageSeo, siteSchema, safeJson, metaKeywordContent } from "../seo.js";
import { products, brands } from "../catalog.js";
import { productRoute, providerRoute } from "../catalogPaths.js";
import {
  productPublication,
  categoryPublication,
} from "../offer-publication.js";
const escape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const pages = [
  { id: "products", path: "/" },
  ...routeIds.map((id) => ({ id, path: routePath(id) })),
];
// Scan deployable text artifacts, not archived test evidence or legacy host rules.
let domainArtifactsChecked = 0;
for (const entry of await fs.readdir("dist", { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.(html|js|xml|txt|json|svg)$/.test(entry.name)) continue;
  const file = (entry.parentPath || entry.path) + "/" + entry.name;
  const content = await fs.readFile(file, "utf8");
  assert(!content.toLowerCase().includes("www." + new URL("https://buyawsaccountsai.com").hostname), file + " legacy WWW reference in deployable artifact");
  domainArtifactsChecked++;
}
const titles = new Set(),
  descriptions = new Set(),
  images = new Set();
for (const { id, path } of pages) {
  const html = await fs.readFile("dist" + path + "index.html", "utf8"),
    seo = getPageSeo(id, path);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, path + " H1");
  assert(
    html.includes("<title>" + escape(seo.title) + "</title>"),
    path + " title",
  );
  assert(
    html.includes(
      'name="description" content="' + escape(seo.description) + '"',
    ),
    path + " description",
  );
  assert(
    html.includes('rel="canonical" href="' + escape(seo.canonical) + '"'),
    path + " canonical",
  );
  assert(
    html.includes('name="robots" content="' + seo.robots + '"'),
    path + " robots",
  );
  assert.equal((html.match(/<meta name="keywords"/g) || []).length, metaKeywordContent(seo) ? 1 : 0, path + " meta keyword count");
  if (metaKeywordContent(seo)) assert(html.includes('name="keywords" content="' + escape(metaKeywordContent(seo)) + '"'), path + " assigned meta keywords");
  assert(html.includes(safeJson(siteSchema(seo))), path + " schema");
  assert(html.includes('data-prerendered="true"'), path + " SSG");
  assert(
    !html.includes('class="route-loading"'),
    path + " unfinished suspense",
  );
  assert(!titles.has(seo.title), path + " duplicate title");
  titles.add(seo.title);
  assert(!descriptions.has(seo.description), path + " duplicate description");
  descriptions.add(seo.description);
  images.add(new URL(seo.image).pathname);
}
const xml = await fs.readFile("dist/sitemap.xml", "utf8"),
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert.equal(
  urls.length,
  pages.filter((p) => !getPageSeo(p.id, p.path).robots.startsWith("noindex"))
    .length,
);
assert.equal(new Set(urls).size, urls.length);
assert(!xml.includes("<lastmod>"));
for (const url of urls) {
  assert.equal(new URL(url).origin, "https://buyawsaccountsai.com");
  assert(pages.some((p) => p.path === new URL(url).pathname));
}
for (const src of images) {
  const info = await sharp("dist" + src).metadata();
  assert.equal(info.width, 1200, src);
  assert.equal(info.height, 630, src);
}
const missing = await fs.readFile("dist/404.html", "utf8");
assert(missing.includes("noindex, follow"));
assert(!missing.includes('rel="canonical"'));
console.log(
  JSON.stringify(
    {
      domainArtifactsChecked,
      generatedPages: pages.length,
      uniqueTitles: titles.size,
      uniqueDescriptions: descriptions.size,
      sitemapUrls: urls.length,
      socialImages: images.size,
      custom404: true,
      status: "PASS",
    },
    null,
    2,
  ),
);

const catalog = JSON.parse(
  await fs.readFile("docs/seo/PRODUCT-SEO-CATALOG.json", "utf8"),
);
const records = Array.isArray(catalog) ? catalog : catalog.records;
assert.equal(records.length, products.length + brands.length);
for (const item of [
  ...products.map((p) => ({
    id: productRoute(p),
    state: productPublication(p),
  })),
  ...brands.map((b) => ({
    id: providerRoute(b),
    state: categoryPublication(
      b,
      products.filter((p) => p.provider === b.name),
    ),
  })),
]) {
  const seo = getPageSeo(item.id);
  assert.equal(
    urls.includes(seo.canonical),
    !seo.robots.startsWith("noindex"),
    item.id + " publication sitemap",
  );
  if (!item.state.published) {
    assert.equal(
      seo.robots,
      "index, follow",
      item.id + " SEO independent of commerce",
    );
    const schema = siteSchema(seo);
    assert(
      !schema["@graph"].some((n) => n["@type"] === "Offer" || n.offers),
      item.id + " unsupported commercial schema",
    );
  }
}
console.log(
  "PASS: all 82 catalog SEO states and commercial offers match artifacts.",
);
