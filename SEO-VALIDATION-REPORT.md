> Historical release/audit record. Current SEO requirements are defined in [the independent SEO implementation report](docs/seo/SEO-INDEPENDENCE-REPORT.md). Any earlier requirement to verify commercial documents before SEO development, metadata, crawlability or sitemap inclusion is superseded. Commercial purchase safeguards remain separate.

# Technical SEO validation report

Date: 2026-11-26 (Asia/Dhaka). Baseline: `89d09ac`. Review branch: `seo/technical-audit-2026-11-26`. Production deployment: **PASS — owner approved and release deployed**. See `SEO-PRODUCTION-RELEASE.md` for live verification; the detailed lab results below describe the pre-release validation.

## Executed checks

| Check | Result | Actual evidence / limit |
| --- | --- | --- |
| Existing and new automated tests | PASS | `npm test`: 39/39. Includes catalog/prices, URL migrations, receipt validation, API input/security checks, SEO/schema safety and public-only analytics payloads. |
| Production build | PASS | Browser bundle + SSR build + prerendering; 96 application pages, custom 404 and 94 sitemap URLs. |
| Generated artifact validation | PASS | `npm run validate:seo`: 96 unique titles/descriptions, matching canonical/schema output, 69 correctly sized social images and custom noindex 404. H1 uniqueness is also unit-tested. |
| TypeScript checking | NOT APPLICABLE | JavaScript/JSX repository, no TypeScript configuration or type-check script. |
| ESLint/existing lint | NOT APPLICABLE | No ESLint configuration or lint script. New/refactored files formatted with Prettier; `git diff --check` run separately. No lint/type-check pass is invented. |
| Dependency audit | PASS | `npm audit`: zero reported vulnerabilities in installed dependency tree at test time. |
| Raw HTML crawlability | PASS | JavaScript disabled: all 96 pages return 200, contain one expected H1, meaningful content, metadata, matching JSON-LD and crawlable links; all 68 products include their real reference price and availability wording. |
| Hydration and metadata | PASS | All 96 routes hydrate with no page errors; raw/rendered titles and H1s match. Client-side navigation updates title/canonical/schema. Initial route modules preload to prevent fallback flashes; a delayed-chunk regression test also records zero initial loading fallbacks. |
| Duplicate metadata/headings | PASS | Unique title, description, canonical and H1 across all 96 generated pages; no obsolete meta keyword tags; no empty/skipped-level main heading sequence in the browser audit. |
| Canonical URLs | PASS locally / MANUAL live | Preferred HTTPS/www canonical mapping and stable trailing slashes; tracking parameters excluded. Seven established main-page slugs preserved. Post-approval live check required. |
| Sitemap XML | PASS locally / MANUAL submission | Browser DOMParser confirms valid XML, 94 unique absolute canonical public URLs, no invented lastmod and no excluded routes. Every sitemap path belongs to the validated 200 route set. |
| Robots | PASS | Public assets/pages allowed; API disallowed; cart/checkout crawlable so noindex can be processed. No blanket block or misleading security claim. |
| Breadcrumbs | PASS | Visible names/order match JSON-LD exactly, positions sequential, parents canonical and functional; mobile wraps. |
| Internal links / orphan pages | PASS | 194 unique internal path/anchor targets checked; no broken/noncanonical targets or orphan application pages. This is a public internal-link crawl, not an external-contact delivery test. |
| Images | PASS | 91 unique on-page/social image URLs return 200; alt and explicit dimensions present on page images; social assets are 1200×630. Responsive WebP/media optimization measured below. |
| Redirects | PASS locally / MANUAL live | All 49 existing permanent mappings return one-hop 308 with query preservation and final 200 destinations. No chains/loops found. |
| HTTP apex normalization | PARTIAL / MANUAL ACTION REQUIRED | Live HTTP apex takes two hosting-managed 308 hops; HTTP www and HTTPS apex take one, preferred origin is 200. No loop/indexable duplicate. All app links/canonicals use HTTPS www directly. Review edge/domain settings after approval; no unapproved hosting change made. |
| Missing URL status | PASS locally / MANUAL custom live body | Arbitrary, product, guide and uppercase missing paths return genuine noindex 404, no canonical. Live baseline already had 404 status; new custom content waits for release. |
| Responsive layouts | PASS | 268 views: eight required widths on 13 page samples, plus all 68 individual products and 14 provider collections at mobile/desktop widths. No horizontal document overflow. |
| Accessibility | PASS for automated coverage | 26 whole-page axe scans at 375/1440px across all core pages, provider/product/guide and populated commerce representatives; zero WCAG A/AA violations in these scans. Automated checks are not a full human accessibility certification. |
| Navigation and motion | PASS | Mobile menu open/Escape/follow-link, sticky header position, reduced-motion browsing and SPA metadata checked. Existing pointer effects preserved; no hardware FPS guarantee asserted. |
| Catalog and comparison | PASS | Original 68 prices/14 providers verified by catalog tests; product add-to-cart and Buy Now → dialog → checkout flow, three-item comparison and guide-article navigation exercised. |
| Cart | PASS | Empty state, saved-cart reload, totals, increment/decrement, removal and clear tested. No stored-cart overwrite during hydration. |
| Checkout | PASS for tested flow | Name/email/phone entry, agreement, request preparation, all network wallet/QR paths and clipboard checked. Owner wallet values unchanged. No funds sent or seller message transmitted. |
| Payment verification | PASS for unit/controlled UI coverage | Real verifier logic tested with deterministic receipt/RPC fixtures; 8 UI statuses plus mismatched-network and failing-HTTP “confirmed” rejection tested. No live transfer, merchant certification or fulfilled-order claim. |
| Contact form | NOT APPLICABLE | There is no contact form. Actual Telegram, mailto and tel destinations verified as links; no message sent, email delivered or phone called. |
| Structured data | PASS local + Schema.org samples / MANUAL Google/live | Every route's JSON-LD matches the shared source; names/specifications/prices/crumbs tested; script-breaking injection safely round-trips. Schema.org Validator code tests for five representative samples report zero errors/warnings. Google Rich Results Test code submission was attempted but returned “Something went wrong. Log in and try again”; no Google pass is claimed. Live URL validation awaits release. |
| Product rich-result eligibility | PARTIAL | No authoritative stock/final offers, genuine reviews or SKUs supplied. Product data is factual but richer Google features are not claimed. Add only actual owner records and revalidate. |
| Security/HTTPS | PASS for tested scope / MANUAL live headers | Existing API security regressions pass; safe static header configuration and no mixed HTTP resources verified. Baseline HTTPS/apex redirects/HSTS checked. New Vercel headers/custom guide routing await approved release. This is not a penetration test. |
| Analytics | PASS unconfigured / MANUAL real-ID validation | No Google requests/dataLayer with blank config. Public-event sanitization tested; raw PII/payment fields omitted, URL queries stripped. Actual GA/GTM container, consent and DebugView testing require real owner configuration and privacy policy. |
| Purchase/lead-success tracking | NOT APPLICABLE to current backend | No persisted order/lead-receipt or deduplicated fulfillment system. TXID confirmation/contact click intentionally does not emit purchase or generate_lead. |
| Search Console | MANUAL ACTION REQUIRED | No token/property access supplied. Build supports real verification values; DNS/HTML verification, sitemap submission, URL inspection and index monitoring not claimed. |
| Legal/trust policy pages | MANUAL ACTION REQUIRED | Privacy, Terms and Refund pages/content absent. No fabricated policy, registration, independent verification, official affiliation or fake review schema added. |
| Real-user CWV / INP / indexing | MANUAL ACTION REQUIRED | No CrUX/Search Console field dataset or verified indexing access. Lighthouse/TBT is not field INP or a 75th-percentile CWV result. |
| Production release | PASS | Owner approval received. Source `c93f234` merged/pushed to main and deployed on Vercel; all 96 live pages, sitemap, redirects, custom 404s and assets checked. See the production release report for the full scope. |

Browser widths: **320, 375, 390, 414, 768, 1024, 1440, 1920 px**. Core coverage includes home, marketplace, platforms, compare, guides, help, seller and contact. The 13 representative responsive samples also include the AWS collection, longest product name, an article, populated cart and populated checkout. Independent mobile/desktop checks cover every current individual product and platform collection.

Compact machine evidence: `seo-evidence/technical-qa.json`, `commerce-qa.json`, `accessibility-extra.json`, `page-metadata.json`, `lighthouse-summary.json`, `asset-summary.json`, and `external-validator-results.json`, and `production-baseline-http.json`. Reproducible browser scripts are in `scripts/qa/`. Large raw Lighthouse runs stay local in ignored `.qa-seo/`.

## Performance measurements

Lighthouse **13.6.0**, installed Google Chrome, same workstation. Mobile uses Lighthouse's simulated mobile preset; desktop uses its desktop preset. These are actual single-run laboratory results, not statistical field measurements. The CLI ran successfully under local Node 22.14.0 despite its newer recommended engine warning; site build/tests also passed. Before/after compressed local runs use the same preview server, gzip text responses, machine, Chrome and presets. Baseline source was independently built from `89d09ac` without copying environment files.

The public production baseline is retained separately because Internet/CDN conditions differ from localhost. Do not treat a production-to-local score difference as proof of a causal speed gain. Normal lab variation applies, especially to already-fast pages.

| Environment/page/device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| before-local-home-mobile | 98 | 100 | 100 | 100 | 1.84 s | 0 ms | 0.000 |
| after-local-home-mobile | 100 | 100 | 100 | 100 | 1.05 s | 0 ms | 0.000 |
| before-local-product-mobile | 100 | 100 | 100 | 100 | 1.05 s | 0 ms | 0.000 |
| after-local-product-mobile | 100 | 100 | 100 | 100 | 1.05 s | 7 ms | 0.000 |
| before-local-home-desktop | 100 | 100 | 100 | 100 | 0.28 s | 0 ms | 0.000 |
| after-local-home-desktop | 100 | 100 | 100 | 100 | 0.28 s | 0 ms | 0.000 |
| before-local-product-desktop | 100 | 100 | 100 | 100 | 0.28 s | 0 ms | 0.000 |
| after-local-product-desktop | 100 | 100 | 100 | 100 | 0.28 s | 0 ms | 0.000 |
| before-home-mobile | 74 | 100 | 100 | 100 | 1.76 s | 1260 ms | 0.000 |
| before-product-mobile | 100 | 100 | 100 | 100 | 1.11 s | 0 ms | 0.000 |

The final four local runs all score 100 in each category, with zero CLS. No field INP is inferred from TBT. Production remeasurement and real-user monitoring remain required after approval. An intermediate product hydration/layout-shift regression was detected and corrected through initial-route preloading before these final runs. Uncompressed exploratory reports are kept separately and are not presented as the final controlled comparison.

## Asset changes

| Asset | Before | After |
| --- | --- | --- |
| Initial entry JavaScript | 428,109 bytes (123,706 gzip) | 378,241 bytes (112,931 gzip) |
| Shared CSS | 338,408 bytes (56,112 gzip) | 341,708 bytes (56,702 gzip) |
| Seller portrait | 2,018,615-byte source PNG | 15,680-byte 400px WebP; 7,850-byte 240px alternative |
| 840px header logo | 150,345-byte PNG | 48,252-byte WebP |

The JavaScript reduction is about 11.6% uncompressed / 8.7% gzip. CSS grows modestly for breadcrumbs, guide/article/error layouts and optional consent UI; wholesale removal of accumulated design rules was deliberately avoided. Original images are retained, with generated responsive alternatives. Social images are separate sharing assets, not images injected into product cards.

## Remaining manual actions

Approve release, provide genuine legal policy content and confirmed merchant facts, configure actual Search Console/optional analytics, complete the authenticated Google rich-results test, and verify live HTTP/header/performance behavior after deployment. Use `SEO-DEPLOYMENT-CHECKLIST.md`. No ranking, rich-result or indexing guarantee is made.

## Post-approval production verification

The approved `c93f234` application is live. All 96 public/commerce route responses, 94 sitemap URLs, 49 redirects, 69 social images, custom 404s, headers/compression/cache and invalid-payment rejection were checked on the public canonical domain. Browser cart/checkout, network wallets/QRs, prepared request, product actions, comparison, menu, guide and contact checks also passed with controlled payment-status fixtures and no real transfer or message. Live mobile Lighthouse performance: homepage **100**, product **98**; accessibility/best-practices/SEO **100** for both; CLS **0**. Full scope and remaining manual inputs: `SEO-PRODUCTION-RELEASE.md`, `seo-evidence/production-release.json`, `seo-evidence/production-lighthouse.json`.
