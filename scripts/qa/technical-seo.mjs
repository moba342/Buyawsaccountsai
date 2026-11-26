// Browser QA is optional tooling, intentionally separate from runtime dependencies.
// Set QA_TOOLS_PACKAGE_JSON to a tools package with playwright and @axe-core/playwright.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(
  process.env.QA_TOOLS_PACKAGE_JSON || import.meta.url,
);
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const evidence =
  process.env.QA_EVIDENCE_DIR ||
  fileURLToPath(new URL("../../docs/seo/evidence/", import.meta.url));
const chrome = process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH }
  : { channel: "chrome" };

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { routeIds, routePath } from "../../routing.js";
import { getPageSeo, siteSchema, metaKeywordContent } from "../../seo.js";
import { products, brands } from "../../catalog.js";
import { productRoute, providerRoute } from "../../catalogPaths.js";
import { pageSeo } from "../../site-config.js";
import { breadcrumbsFor } from "../../breadcrumbData.js";
import { guideRoute } from "../../guideRoutes.js";
import { guides } from "../../editorialContent.js";
const base = process.env.QA_URL || "http://localhost:4173",
  out = evidence;
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ ...chrome });
const rawContext = await browser.newContext({ javaScriptEnabled: false });
const raw = await rawContext.newPage();
const pages = [
  { id: "products", path: "/" },
  ...routeIds.map((id) => ({ id, path: routePath(id) })),
];
const report = {
  date: "2026-11-27",
  rawPages: 0,
  hydratedPages: 0,
  responsiveViews: 0,
  accessibilityScans: 0,
  internalLinks: 0,
  images: 0,
  redirects: 0,
  orphanPages: [],
  headingNotes: [],
  errors: [],
  overflow: [],
  accessibility: [],
};
const links = new Map(),
  images = new Set(),
  linkedPages = new Set(["/"]);
for (const { id, path } of pages) {
  const response = await raw.goto(base + path);
  assert.equal(response.status(), 200, path);
  const seo = getPageSeo(id, path);
  assert.equal(await raw.title(), seo.title, path);
  assert.equal(
    await raw.locator("meta[name=description]").getAttribute("content"),
    seo.description,
    path,
  );
  assert.equal(
    await raw.locator("link[rel=canonical]").getAttribute("href"),
    seo.canonical,
    path,
  );
  assert.equal(
    await raw.locator("meta[name=robots]").getAttribute("content"),
    seo.robots,
    path,
  );
  assert.equal(await raw.locator("meta[name=keywords]").count(), metaKeywordContent(seo) ? 1 : 0, path);
  if (metaKeywordContent(seo)) assert.equal(await raw.locator("meta[name=keywords]").getAttribute("content"), metaKeywordContent(seo));
  assert.equal(await raw.locator("h1").count(), 1, path);
  assert.equal(await raw.locator("h1").innerText(), seo.h1, path);
  assert.deepEqual(
    JSON.parse(await raw.locator("#site-seo-schema").textContent()),
    siteSchema(seo),
    path,
  );
  assert((await raw.locator("main").innerText()).length > 200, path);
  if (seo.product) {
    assert(
      (await raw.locator("main").innerText()).includes(
        "$" + seo.product.price.toLocaleString("en-US"),
      ),
      path,
    );
    assert(
      (await raw.locator("main").innerText()).includes("Pending verification"),
      path,
    );
  }
  const crumbs = breadcrumbsFor(id, path);
  const visible = await raw
    .locator(".site-breadcrumbs li a,.site-breadcrumbs li [aria-current]")
    .allTextContents();
  assert.deepEqual(
    visible.map((v) => v.replace(/›/g, "").trim()),
    crumbs.map((c) => c.name),
    path,
  );
  const data = await raw.evaluate(() => ({
    links: [...document.querySelectorAll("a[href]")].map((a) =>
      a.getAttribute("href"),
    ),
    images: [...document.images].map((i) => ({
      src: i.getAttribute("src"),
      alt: i.getAttribute("alt"),
      width: i.getAttribute("width"),
      height: i.getAttribute("height"),
    })),
    headings: [
      ...document.querySelectorAll("main h1,main h2,main h3,main h4"),
    ].map((h) => ({ level: +h.tagName[1], text: h.textContent.trim() })),
  }));
  for (const href of data.links) {
    let u;
    try {
      u = new URL(href, base + path);
    } catch {
      throw Error("Invalid link " + href);
    }
    if (u.origin === base || u.origin === "https://www.buyawsaccountsai.com") {
      const local = u.pathname + u.hash;
      links.set(local, true);
      linkedPages.add(u.pathname);
    }
  }
  for (const i of data.images) {
    assert.notEqual(i.alt, null, "missing alt " + path + " " + i.src);
    assert(i.width && i.height, "missing dimensions " + path + " " + i.src);
    if (i.src?.startsWith("/")) images.add(i.src);
  }
  const social = await raw
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  images.add(new URL(social).pathname);
  let previous = 1;
  for (const h of data.headings) {
    if (h.level > previous + 1)
      report.headingNotes.push({
        path,
        previous,
        level: h.level,
        text: h.text,
      });
    previous = h.level;
    assert(h.text, "empty heading " + path);
  }
  report.rawPages++;
}
console.log("Raw HTML checked:", report.rawPages);
const sitemapResponse = await raw.goto(base + "/sitemap.xml");
assert.equal(sitemapResponse.status(), 200);
const xml = await raw.evaluate(async () => {
  const s = await (await fetch("/sitemap.xml")).text();
  const d = new DOMParser().parseFromString(s, "application/xml");
  return {
    error: !!d.querySelector("parsererror"),
    urls: [...d.querySelectorAll("loc")].map((n) => n.textContent),
    lastmods: d.querySelectorAll("lastmod").length,
  };
});
assert.equal(xml.error, false);
assert.equal(
  xml.urls.length,
  pages.filter((p) => !getPageSeo(p.id, p.path).robots.startsWith("noindex"))
    .length,
);
assert.equal(xml.lastmods, 0);
assert.equal(new Set(xml.urls).size, xml.urls.length);
for (const url of xml.urls) {
  assert(url.startsWith("https://www.buyawsaccountsai.com/"));
  assert(
    !["/cart/", "/checkout/", "/api/"].some((s) =>
      new URL(url).pathname.startsWith(s),
    ),
  );
  assert(pages.some((p) => p.path === new URL(url).pathname));
}
report.sitemapUrls = xml.urls.length;
for (const [target] of links) {
  const u = new URL(target, base);
  const res = await fetch(base + u.pathname, { redirect: "manual" });
  assert.equal(res.status, 200, "broken/noncanonical internal link " + target);
  if (u.hash) {
    await raw.goto(base + u.pathname);
    assert(
      await raw
        .locator("[id]")
        .evaluateAll(
          (nodes, id) => nodes.some((n) => n.id === id),
          decodeURIComponent(u.hash.slice(1)),
        ),
      "broken anchor " + target,
    );
  }
  report.internalLinks++;
}
report.orphanPages = pages
  .filter((p) => !linkedPages.has(p.path))
  .map((p) => p.path);
assert.deepEqual(report.orphanPages, []);
for (const src of images) {
  const res = await fetch(base + src);
  assert.equal(res.status, 200, src);
  if (src.startsWith("/social/")) {
    await raw.goto(base + src);
    assert.equal(
      await raw.locator("img").evaluate((i) => i.naturalWidth),
      1200,
    );
    assert.equal(
      await raw.locator("img").evaluate((i) => i.naturalHeight),
      630,
    );
  }
  report.images++;
}
const config = JSON.parse(
  await fs.readFile(new URL("../../vercel.json", import.meta.url), "utf8"),
);
for (const r of config.redirects.filter((r) => !r.has)) {
  const res = await fetch(base + r.source + "?campaign=qa", {
    redirect: "manual",
  });
  assert.equal(res.status, 308, r.source);
  assert.equal(res.headers.get("location"), r.destination + "?campaign=qa");
  assert.equal(
    (
      await fetch(base + new URL(r.destination, base).pathname, {
        redirect: "manual",
      })
    ).status,
    200,
  );
  report.redirects++;
}
for (const path of [
  "/not-real/",
  "/product/not-real/",
  "/buying-guides/not-real/",
  "/MARKETPLACE/",
]) {
  const res = await raw.goto(base + path);
  assert.equal(res.status(), 404, path);
  assert.equal(
    await raw.locator("meta[name=robots]").getAttribute("content"),
    "noindex, follow",
  );
  assert.equal(await raw.locator("link[rel=canonical]").count(), 0);
  assert((await raw.locator("h1").innerText()).includes("find"));
}
const robots = await (await fetch(base + "/robots.txt")).text();
assert(robots.includes("Disallow: /api/"));
assert(!robots.includes("Disallow: /cart/"));
assert(
  robots.includes("Sitemap: https://www.buyawsaccountsai.com/sitemap.xml"),
);
report.robots = true;
await rawContext.close();
const context = await browser.newContext({ reducedMotion: "reduce" });
const p = await context.newPage();
p.on("pageerror", (e) => report.errors.push(e.message));
let googleRequests = 0;
p.on("request", (r) => {
  if (/googletagmanager|google-analytics/.test(r.url())) googleRequests++;
});
for (const { id, path } of pages) {
  await p.goto(base + path);
  await p.waitForFunction(() =>
    document.querySelector("main:not(.route-loading)"),
  );
  await p.waitForTimeout(35);
  assert.equal(
    await p.locator("h1").innerText(),
    getPageSeo(id, path).h1,
    path,
  );
  assert.equal(await p.title(), getPageSeo(id, path).title, path);
  report.hydratedPages++;
}
console.log("Hydration checked:", report.hydratedPages);
const widths = [320, 375, 390, 414, 768, 1024, 1440, 1920];
const core = [
  "/",
  "/marketplace/",
  "/cloud-platforms/",
  "/compare-products/",
  "/buying-guides/",
  "/help-center/",
  "/seller-profile/",
  "/contact-sales/",
];
await p.evaluate(() =>
  localStorage.setItem(
    "baa-cart-v2",
    JSON.stringify([
      { id: "product/aws-8-vcpu", quantity: 1 },
      { id: "product/aws-32-vcpu-10-rpm-bedrock-enabled", quantity: 1 },
    ]),
  ),
);
const samples = [
  ...core,
  "/aws-accounts/",
  "/" +
    productRoute(
      products.reduce((a, b) => (a.name.length > b.name.length ? a : b)),
    ) +
    "/",
  routePath(guideRoute(guides[0])),
  "/cart/",
  "/checkout/",
];
for (const width of widths) {
  await p.setViewportSize({ width, height: 960 });
  for (const path of samples) {
    await p.goto(base + path);
    await p.waitForFunction(() =>
      document.querySelector("main:not(.route-loading)"),
    );
    await p.waitForTimeout(90);
    if (
      await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      )
    ) {
      report.overflow.push({
        width,
        path,
        details: await p.evaluate(() =>
          [...document.querySelectorAll("main *")]
            .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
            .slice(0, 8)
            .map((e) => ({
              tag: e.tagName,
              cls: e.className,
              right: e.getBoundingClientRect().right,
            })),
        ),
      });
    }
    report.responsiveViews++;
    if (
      [375, 1440].includes(width) &&
      [
        "/",
        "/marketplace/",
        "/contact-sales/",
        "/seller-profile/",
        "/cart/",
        "/checkout/",
        "/aws-accounts/",
      ].includes(path)
    ) {
      const a = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      if (a.violations.length)
        report.accessibility.push({
          width,
          path,
          violations: a.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            targets: v.nodes.map((n) => n.target),
          })),
        });
      report.accessibilityScans++;
    }
    if (width === 375 && ["/", "/marketplace/", "/checkout/"].includes(path))
      await p.screenshot({
        path:
          out + "/" + (path === "/" ? "home" : path.split("/")[1]) + "-375.png",
        fullPage: false,
      });
  }
}
for (const width of [375, 1440]) {
  await p.setViewportSize({ width, height: 960 });
  for (const path of [
    ...brands.map((b) => routePath(providerRoute(b))),
    ...products.map((product) => routePath(productRoute(product))),
  ]) {
    await p.goto(base + path);
    await p.waitForFunction(() =>
      document.querySelector("main:not(.route-loading)"),
    );
    if (
      await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      )
    )
      report.overflow.push({ width, path });
    report.responsiveViews++;
  }
}
assert.equal(googleRequests, 0);
assert.equal(await p.evaluate(() => !!window.dataLayer), false);
report.unconfiguredAnalyticsNoRequests = true;
await fs.writeFile(out + "/technical-qa.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
assert.deepEqual(report.errors, []);
assert.deepEqual(report.overflow, []);
assert.deepEqual(report.accessibility, []);
assert.deepEqual(report.headingNotes, []);
