// Additional release checks beyond the complete URL and browser crawls.
import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { routeIds, routePath } from "../routing.js";
import { products, brands } from "../catalog.js";
import {
  productPublication,
  categoryPublication,
} from "../offer-publication.js";
import { getPageSeo } from "../seo.js";
const out =
  process.env.QA_EVIDENCE_DIR || "docs/seo/evidence/production-readiness";
const hash = (data) => createHash("sha256").update(data).digest("hex");
const checks = {
  date: "2026-11-27",
  migrationCommit: "7600b60",
  candidateCommit: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  categories: brands.length,
  variants: products.length,
  headUniqueness: 0,
  filesUnchangedFromMigration: [],
  rewriteFiles: 0,
  commercial: {
    published: products.filter((p) => productPublication(p).published).length,
    purchasable: products.filter((p) => productPublication(p).purchasable)
      .length,
    categoriesPublished: brands.filter(
      (b) =>
        categoryPublication(
          b,
          products.filter((p) => p.provider === b.name),
        ).published,
    ).length,
  },
  fingerprints: {},
  productionBaseline: [],
};
function ensure(condition, message) {
  if (!condition) throw Error(message);
}
for (const file of [
  "catalog-data.js",
  "catalog.js",
  "payments.js",
  "cart.js",
  "offer-review-records.js",
  "offer-publication.js",
  "server/payment-verifier.js",
  "api/verify-payment.js",
  "routing.js",
  "catalogPaths.js",
]) {
  const old = execFileSync("git", ["show", "7600b60:" + file]),
    current = await fs.readFile(file);
  ensure(old.equals(current), "Unexpected migration baseline change: " + file);
  checks.filesUnchangedFromMigration.push(file);
}
const pages = [
  { id: "products", url: "/" },
  ...routeIds.map((id) => ({ id, url: routePath(id) })),
];
for (const { id, url } of pages) {
  const html = await fs.readFile("dist" + url + "index.html", "utf8"),
    head = html.split("</head>")[0],
    seo = getPageSeo(id, url);
  for (const [name, pattern] of [
    ["title", /<title(?:\s|>)/g],
    ["canonical", /<link\s[^>]*rel="canonical"/g],
    ["description", /<meta\s[^>]*name="description"/g],
    ["robots", /<meta\s[^>]*name="robots"/g],
    ["og:url", /<meta\s[^>]*property="og:url"/g],
    ["JSON-LD", /<script\s[^>]*id="site-seo-schema"/g],
  ])
    ensure(
      (head.match(pattern) || []).length === 1,
      url + " duplicate/missing " + name,
    );
  ensure((html.match(/<h1(?:\s|>)/g) || []).length === 1, url + " H1 count");
  if (seo.product || seo.provider)
    ensure(
      seo.robots === "index, follow",
      url + " unexpected catalog indexing change",
    );
  if (["cart", "checkout"].includes(id))
    ensure(seo.robots === "noindex, follow", url + " private-state indexing");
  checks.headUniqueness++;
}
const config = JSON.parse(await fs.readFile("vercel.json", "utf8"));
for (const rewrite of config.rewrites) {
  ensure(
    rewrite.destination === rewrite.source + "index.html",
    "Unexpected rewrite destination",
  );
  await fs.access("dist" + rewrite.destination);
  checks.rewriteFiles++;
}
const robots = await fs.readFile("dist/robots.txt", "utf8");
ensure(
  robots.includes("Allow: /") && robots.includes("Disallow: /api/"),
  "robots policy",
);
ensure(
  !/Disallow:\s*\/(?:buy-|cart|checkout)/.test(robots),
  "unintended public/cart robots block",
);
for (const file of [
  "package-lock.json",
  "vercel.json",
  "dist/sitemap.xml",
  "dist/robots.txt",
])
  checks.fingerprints[file] = hash(await fs.readFile(file));
// Read-only live baseline; the candidate is not expected to be deployed yet.
for (const path of [
  "/",
  "/sitemap.xml",
  "/aws-accounts/",
  "/buy-aws-accounts/",
]) {
  const response = await fetch("https://www.buyawsaccountsai.com" + path, {
      redirect: "manual",
    }),
    text = await response.text();
  checks.productionBaseline.push({
    path,
    status: response.status,
    robots: text.match(/name="robots" content="([^"]+)"/)?.[1] || null,
    sitemapUrls:
      path === "/sitemap.xml" ? (text.match(/<loc>/g) || []).length : null,
  });
}
ensure(
  checks.commercial.published === 0 &&
    checks.commercial.purchasable === 0 &&
    checks.commercial.categoriesPublished === 0,
  "Commercial activation changed",
);
await fs.mkdir(out, { recursive: true });
await fs.writeFile(
  out + "/release-integrity.json",
  JSON.stringify(checks, null, 2),
);
console.log(JSON.stringify(checks, null, 2));
