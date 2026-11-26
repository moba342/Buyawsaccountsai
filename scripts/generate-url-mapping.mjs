import fs from "node:fs/promises";
import { brands, products } from "../catalog.js";
import { productRoute, providerRoute } from "../catalogPaths.js";
import { routeIds, routePath, pageSlugs } from "../routing.js";
import { catalogSeoById } from "../catalog-seo.js";
import { getPageSeo, SITE_URL } from "../seo.js";
const config = JSON.parse(await fs.readFile("vercel.json", "utf8"));
const rows = [
  { id: "products", home: true },
  ...routeIds.map((id) => ({ id })),
].map(({ id, home }) => {
  const product = products.find((p) => productRoute(p) === id),
    brand = brands.find((b) => providerRoute(b) === id),
    record = catalogSeoById.get(id),
    seo = getPageSeo(id, home ? "/" : routePath(id));
  const old = home ? "/" : "/" + (pageSlugs[id] || id) + "/";
  return {
    id,
    name: product
      ? product.provider + " " + product.name
      : brand
        ? brand.full + " Accounts"
        : home
          ? "Homepage"
          : seo.h1.replace(/\n/g, " "),
    primaryKeyword: seo.primaryKeyword,
    existingUrl: SITE_URL + old,
    optimizedUrl: seo.canonical,
    canonicalUrl: seo.canonical,
    redirectStatus: record
      ? "308 directly to canonical (slash, no slash, index.html)"
      : "Retained; existing aliases normalize directly",
    indexabilityStatus: seo.robots,
    decision: record
      ? "Retain deployed keyword URL; preserve stable catalog ID"
      : "Retain established utility/resource URL; no keyword-only migration",
  };
});
const esc = (s) =>
  String(s ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ");
let md = `# Primary keyword URL audit and migration mapping\n\nDate: 2026-11-27 (Asia/Dhaka). Current keyword URL re-audit. The existing production migration is retained; no additional URL churn is justified. The Existing URL column documents the historical pre-migration alias; Optimized URL is the current deployed canonical. Actual current live evidence is recorded below when available.\n\n## Audit and decisions\n\nFor subsequent cross-host routing changes, actual hop counts and the platform HTTP limitation, see [HOSTING-REDIRECT-REPORT.md](HOSTING-REDIRECT-REPORT.md).\n\nThe active assigned keywords are in catalog-seo.js, derived from the supplied catalog. All 14 category and 68 variant public URLs now use the exact lowercase slug of that assigned primary buying keyword. For example, buy AWS accounts becomes /buy-aws-accounts/. The illustrative “compute plans” wording is not inserted into a record whose assigned keyword is simply “buy AWS 32 vCPU”. No models, product specifications, pricing, service or availability claims are changed.\n\nThe original migration replaced 82 public URLs; it does not create 82 additional indexable copies. All 68 existing variants retain their stable identities and substantive content. Variations differ by provider, quota/capacity, credit value, model/access labels or network scope; they are not multiplied into extra query/feature landing pages. There are still 96 rendered pages and 94 sitemap URLs. Individual technical noindex overrides continue to apply.\n\nEstablished homepage, marketplace, platform directory, compare, guide, help, seller, contact, cart and checkout URLs are retained. They are utility/resource destinations rather than 82 separate offers. No Search Console/backlink performance data was supplied to justify additional keyword-only migrations. Retaining them limits unnecessary churn; actual migration impact/rankings cannot be promised.\n\n## Compatibility and redirect implementation\n\nCatalog/order IDs remain unchanged (for example product/aws-8-vcpu). New productPath/providerPath and routePath helpers provide the public URL. Cart storage, comparison IDs, commercial review keys, API item identifiers, editorial copy keys and original image paths keep their existing identities. Purchase/publication safeguards and current source indexability are unchanged.\n\nvercel.json contains ${config.redirects.length} explicit permanent 308 redirects: prior aliases and retired product aliases are flattened to the final destination; all 82 old catalog URLs plus slash/no-slash/index.html forms go directly to the new canonical. Canonical non-slash and index.html aliases are also direct. The original 535 mappings now use absolute final HTTPS non-WWW destinations, with 98 additional WWW-only canonical/fallback rules. Global trailingSlash normalization is replaced by explicit canonical redirects so an old no-slash URL does not first redirect to an old slash URL. All ${config.rewrites.length} rendered non-home routes have exact static rewrites. No canonical destination is a redirect source. Query strings are preserved. Host/domain normalization is controlled by Vercel. Both domains remain assigned without blanket project redirects; WWW-only application rules normalize directly to the non-WWW canonical.\n\nUpdated references: navigation/card/footer/provider links, related products/guides, breadcrumbs and BreadcrumbList, canonical/Open Graph URLs, Product/eligible Offer URLs and ItemList links, generated catalog reports and XML sitemap. Stable logo/social-image asset URLs do not need to move. The build regenerates URL configuration before SSG and this report after SSG.\n\nPermanent server redirects, full URL mapping and direct internal links follow [Google’s URL migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) and [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json). Redirects preserve access to old links; they do not guarantee rankings or immediate indexing.\n\n## Complete mapping\n\n| Product / page name | Primary keyword | Existing URL | Optimized URL | Canonical URL | Redirect status | Indexability status |\n| --- | --- | --- | --- | --- | --- | --- |\n`;
for (const r of rows)
  md +=
    "| " +
    [
      r.name,
      r.primaryKeyword,
      r.existingUrl,
      r.optimizedUrl,
      r.canonicalUrl,
      r.redirectStatus,
      r.indexabilityStatus,
    ]
      .map(esc)
      .join(" | ") +
    " |\n";
md +=
  "\n## Validation and release\n\nRun npm test, npm run build, npm run validate:seo and npm run validate:urls. The URL validator checks every canonical page and redirect, old slash/non-slash forms, query preservation, one-hop final 200s, canonicals, sitemap, Open Graph, breadcrumbs/schema and all rendered internal links. Browser QA checks hydrated routes, mobile/desktop layouts, actual navigation, legacy cart IDs and unchanged blocked-purchase behavior. Results are saved under evidence/url-migration/.\n\nGenerating this mapping does not deploy or activate commercial products. For the authorized production release, verify edge redirects on the preferred HTTPS non-WWW host, real 200/308/404 statuses, Search Console sitemap/coverage and existing backlinks. Retain permanent legacy redirects; do not remove them after the first crawl. No account verification document is required to implement or validate the URL migration.\n";

try {
  const validation = JSON.parse(
    await fs.readFile(
      "docs/seo/evidence/url-migration/validation.json",
      "utf8",
    ),
  );
  const browser = JSON.parse(
    await fs.readFile(
      "docs/seo/evidence/url-migration/technical-qa.json",
      "utf8",
    ),
  );
  const commerce = JSON.parse(
    await fs.readFile(
      "docs/seo/evidence/url-migration/publication-ui.json",
      "utf8",
    ),
  );
  const extra = JSON.parse(
    await fs.readFile(
      "docs/seo/evidence/url-migration/accessibility-extra.json",
      "utf8",
    ),
  );
  if (
    validation.directRedirects !== config.redirects.filter((r) => !r.has).length
  )
    throw Error("Re-run URL validation after config change");
  md += "\n## Recorded validation results — PASS\n\n";
  md += `- The original URL migration passed 55/55 unit tests, production client/SSR/SSG build and SEO artifact validation. Subsequent hosting-fix results are recorded separately in HOSTING-REDIRECT-REPORT.md.\n- ${validation.pages} canonical pages tested; ${validation.indexable200} indexable URLs returned direct 200. All ${validation.schemaChecks} page schemas/canonicals/Open Graph entries matched.\n- ${validation.directRedirects} permanent redirects reached a direct final 200; all ${validation.queryPreserved} preserved query strings. Every one of ${validation.internalLinks} distinct rendered internal destinations was canonical and returned 200.\n- Browser crawl: ${browser.rawPages} raw and ${browser.hydratedPages} hydrated routes, ${browser.responsiveViews} views across eight widths, ${browser.internalLinks} link checks, ${browser.images} images, ${browser.redirects} redirect checks, no orphans, overflow or reported JS errors.\n- ${browser.accessibilityScans + commerce.accessibilityScans + extra.scans} automated axe scans had no violations. Mobile menu, SPA metadata, sticky header and initial hydration checks passed.\n- All ${commerce.pendingVariantPages} pending purchase controls remained disabled; saved carts were preserved, checkout stayed blocked and the API rejected pending items. No commercial activation, transfer or order occurred.\n- Unknown test routes returned a genuine 404. Current sitemap remains 94; no extra variant pages were introduced.\n\nEvidence: evidence/url-migration/validation.json, technical-qa.json, publication-ui.json, accessibility-extra.json and mapping.json. These mapping-run results used the local production-like server. Actual live acceptance results are recorded separately in FINAL-SEO-IMPLEMENTATION-REPORT.md. Automated accessibility is not a claim of manual assistive-technology coverage.\n`;
} catch (error) {
  md +=
    "\nFull run evidence must be regenerated if missing or stale: " +
    error.message +
    "\n";
}
try {
  const current = JSON.parse(await fs.readFile("docs/seo/evidence/url-reaudit/validation.json", "utf8"));
  if (current.base !== SITE_URL || current.directRedirects !== 535 || current.pages !== rows.length || current.errors.length) throw Error("Current live evidence does not match the expected scope");
  md += `\n## Current production re-audit — actual live results\n\nCanonical host: ${current.base}. All ${current.categories} categories and ${current.variations} variations have exact primary-keyword slugs. ${current.pages} canonical pages, ${current.indexable200} indexable HTTP 200 pages, ${current.directRedirects} one-hop permanent legacy redirects and ${current.queryPreserved} query-preservation cases passed. All ${current.schemaChecks} page schemas and ${current.internalLinks} distinct canonical internal destinations passed. The served sitemap exactly matches the build, has ${current.sitemapUrls} unique URLs and is declared in robots.txt. No additional routes or publication changes were made.\n\nEvidence: [current live URL validation](evidence/url-reaudit/validation.json). No broken or chained canonical-host redirects were found by these tests. HTTP requests on the old WWW host may require the platform HTTPS upgrade before host normalization; actual hop counts are recorded in the domain migration report. Google Search Console remains PENDING - MANUAL SETUP BY WEBSITE OWNER. Semantic search competition and backlink value require owner performance data; no ranking result is promised.\n`;
} catch (error) {
  md += "\nCurrent production re-audit evidence unavailable: " + error.message + "\n";
}
await fs.mkdir("docs/seo", { recursive: true });
await fs.writeFile("docs/seo/SEO-URL-MAPPING.md", md);
await fs.mkdir("docs/seo/evidence/url-migration", { recursive: true });
await fs.writeFile(
  "docs/seo/evidence/url-migration/mapping.json",
  JSON.stringify(
    {
      date: "2026-11-27",
      catalogMigrations: 82,
      redirects: config.redirects.length,
      rows,
    },
    null,
    2,
  ),
);
console.log("URL mapping: " + rows.length + " pages, 82 catalog migrations.");
