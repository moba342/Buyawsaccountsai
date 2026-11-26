# Technical SEO implementation

Date: 2026-11-26 (Asia/Dhaka). Project: BuyAWSAccountsAI. Preferred origin: `https://www.buyawsaccountsai.com`. Changes are local on `seo/technical-audit-2026-11-26`; production has not been deployed or main pushed for this brief.

## Architecture and preserved behavior — PASS

The existing React 19 / Vite 6 application remains intact. Vite builds the browser bundle and a temporary Node server-rendering bundle. `scripts/generate-seo.mjs` renders the actual React application into each route's initial HTML, after asynchronous route components finish. The browser hydrates that same application. There is no framework migration or request-time rendering server to operate. This uses [Vite’s SSR build and React hydration model](https://vite.dev/guide/ssr).

The source catalog remains unchanged: 68 variants across 14 providers, including all owner-confirmed unusual prices. Existing cart IDs, quantity limits, USDT addresses, QR generation, transaction verifier, contact channels, first-party seller disclosures, logos, colors, fonts and premium layouts remain. There is no database/authentication migration. Headings change only as required by the SEO brief; breadcrumbs, useful error content, guide article routes and an explicit availability label are added.

Initial route modules preload before hydration. This prevents an early cart-storage state update from replacing prerendered content with a loading fallback. A performance regression discovered during testing was fixed this way; it was not accepted as a final result. Stored carts load after matching empty server/client initial states, and persistence waits until storage has been read, avoiding hydration mismatches and accidental saved-cart deletion.

## Metadata and canonical configuration — PASS

- `site-config.js`: preferred origin, business identity, language/locale, default title, title template, social dimensions and exact eight requested title/description/H1 sets. Secondary targets are editorial data, never obsolete meta keyword tags.
- `seo.js`: one reusable metadata/schema implementation for static generation and SPA navigation; dynamic product/provider/guide metadata, canonical URLs, noindex handling, safe inline JSON-LD and social tags.
- `seo-overrides.js`: optional per-route title, description, H1, primary/secondary keyword, social image/alt and noindex overrides. Homepage override ID is `home`; existing route IDs are used elsewhere. Core, product, collection and guide headings use these settings. Do not change the slug just to edit a title.
- All 96 generated pages have unique titles, descriptions and H1s. Product H1s include the platform to distinguish similarly named variants. Exact core-page wording takes precedence over approximate title lengths.
- All real routes self-canonicalize to the preferred HTTPS/www domain and trailing-slash paths. Tracking queries do not enter canonical URLs. Client filters/sorts do not generate new indexable URLs. Case-mismatched production paths return 404 rather than duplicate indexable pages.
- Cart and checkout use `noindex, follow`. The useful custom 404 has no canonical or Product schema and is noindex. No sitewide noindex is introduced.

## Crawlability, routes and internal links — PASS

96 application documents are prerendered, plus a custom `404.html`: homepage, 68 product pages, 14 platform collections, 3 guide articles, and 10 other pages. Product names, listed prices, specifications, descriptions, headings, links and structured data are present without JavaScript. Interactive cart, search, filters and checkout remain React components.

The original three guides now have distinct article URLs under `/buying-guides/`, linked from the guide directory and footer. No artificial dates or author credentials are invented. Related products and existing buying articles remain. Visible, wrapping mobile breadcrumbs share their source with `BreadcrumbList`; no nonexistent category pages are inserted. Link crawling found no orphan application pages. Products are discoverable through the marketplace within roughly two navigation steps from home.

Existing seven renamed-page redirects and 42 retired-product/provider redirects are preserved as permanent 308 responses. No new generic home redirects replace missing URLs. Unknown product, guide and arbitrary URLs have a real 404 locally; production already returned genuine 404s before this work. The new custom body and new guide rewrites require the post-approval Vercel smoke test. A separate live four-origin trace found HTTP apex still takes two hosting-managed 308 hops (HTTPS apex → HTTPS www). Hosting normalization review is a remaining manual action after approval; internal links/canonicals already avoid these hops. Retired Alibaba/Atlantic redirects remain an owner/Search Console review item because their replacements are broad, not equivalent products.

## Sitemap and robots — PASS

`dist/sitemap.xml` is regenerated from actual canonical routes and current noindex settings each build. It contains 94 absolute HTTPS public URLs; cart, checkout, missing pages, APIs, redirected URLs and unpublished policies are absent. Product additions/removals automatically affect it on the next build. No fabricated `lastmod`, ranking `priority` or `changefreq` values are emitted. A sitemap index is unnecessary at this size.

`robots.txt` allows public pages and required assets and disallows `/api/`. Cart/checkout remain crawlable so their HTML noindex can be processed. No nonexistent admin routes are presented as security controls. Local previews bind to loopback; any hosted staging deployment must use Vercel Deployment Protection before public exposure. Robots is not authentication. The crawlable noindex approach follows [Google’s technical indexing requirements](https://developers.google.com/search/docs/essentials/technical).

## Structured data — PASS for factual schema; PARTIAL for Google product rich results

- Organization and WebSite use the actual supplied business/contact data. No legal registration, certificates, awards, independent verification, official partnerships or unverified social `sameAs` entries are fabricated.
- Individual products use Product with real names, visible article descriptions, product-specific images, category and genuine specifications. The visible reference price is a PropertyValue, not an invented binding Offer.
- `confirmedCommerceFacts` is intentionally empty. Only explicit `confirmed: true`, an exact matching current price, USD currency and supported actual availability allow an Offer. Optional genuine SKU/price-validity facts must come from owner records. The selected product's visible availability then matches those facts; until then it says “Confirm with seller.”
- No SKU, GTIN, MPN, reviews, aggregateRating, stock, manufacturer affiliation, returns or shipping guarantees are invented. Existing illustrative testimonials are not marked up as customer reviews.
- Collections use CollectionPage + ItemList, never a collection-wide Product. The homepage ItemList describes only its initially visible six variants; marketplace/platform lists match their visible products. Guides use Article and a directory ItemList.
- All breadcrumb positions/parents match the visible trails. JSON-LD serialization escapes script-breaking characters and is tested against script injection.
- ProductGroup was not fabricated for this heterogeneous catalog of compute, credit, AI and sending-limit packages. Each existing, distinct variant keeps its own canonical URL and specific buying information.

[Google’s Product snippet requirements](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) require supported Offer/review/rating data. This work intentionally does not claim eligibility without those facts. Schema.org Validator code-mode tests were actually run for homepage, marketplace, AWS collection, AWS product and guide samples, all with zero errors and warnings. Google Rich Results Test code submission was attempted but returned “Something went wrong. Log in and try again”; no Google result or pass is claimed. Owner-authenticated Google testing and live post-release tests remain manual actions. See `seo-evidence/external-validator-results.json`.

## Images, performance and security — PASS, with measured limits

The original brand assets remain the source of truth. Prebuild generates responsive portrait/header/footer WebP variants and 69 branded 1200×630 sharing images (fallback + 68 individual products). Browser images keep alt attributes, explicit dimensions, srcset/sizes where useful, below-fold lazy loading and above-fold priority. Product logos remain local; no external image service or new runtime tracker is introduced.

Route-level chunks reduce initial JavaScript. Above-fold reveal effects do not delay first paint; reduced-motion support and existing event-driven animation guards remain. Fonts stay local with existing preload/swap behavior. Hashed assets receive immutable cache headers; regenerated images revalidate. [Vercel’s CDN provides compression](https://vercel.com/docs/how-vercel-cdn-works/compression); the local production-like validation server applies gzip to text assets so controlled comparisons emulate compressed hosting.

Safe response headers add nosniff, a strict-origin referrer policy, same-origin framing, restricted unused browser permissions, and a limited CSP for object/base/frame restrictions plus HTTPS upgrades. No brittle script policy breaks React, payment checks or optional consented analytics. Existing HSTS/HTTPS hosting behavior is preserved. Public build output contains only public route/catalog information; server RPC secrets are never VITE-prefixed or embedded in metadata.

See the validation report for actual Lighthouse numbers. No field INP, CrUX percentile or real-user CWV pass is asserted. The accumulated legacy stylesheet is retained to avoid visual regressions; larger CSS cleanup is a separate measured refactor, not an unsafe deletion in this SEO change.

## Search Console and analytics — MANUAL ACTION REQUIRED

`.env.example` documents `GOOGLE_SITE_VERIFICATION`, `VITE_GA_MEASUREMENT_ID`, `VITE_GTM_ID`, and `VITE_ANALYTICS_PRIVACY_URL`. Values remain blank. GSC's real HTML verification token is validated and added at build time without deleting existing verification records. Genuine HTML verification files can be placed in `public/`; Domain Property verification requires the owner's DNS TXT record. No property verification, sitemap submission or indexing is claimed.

Optional GA4/GTM scripts load only with a valid owner measurement ID, an actual published same-origin privacy-notice URL, and affirmative user consent. Decline/revocation suppresses further application tracking and updates analytics consent. Advertising consent remains denied. Optional settings do not appear while unconfigured. GTM takes precedence if both IDs exist: do not configure a second GA4 path in parallel. The owner must audit their actual GTM container, consent behavior and privacy notice before activation; arbitrary container tags are not controlled by this repository.

Supported public events: page_view, view_item_list, select_item, view_item, add_to_cart, remove_from_cart, begin_checkout, add_payment_info and contact_sales. Public catalog fields and reference values only; email, phone, notes, wallet and TXID fields are not event payloads. Application page/referrer URLs strip queries/hashes. Checkout analytics do not turn blockchain checks into sales. `purchase` and `generate_lead` deliberately remain unimplemented: there is no persisted, deduplicated order/lead receipt or fulfillment backend. Add those only with genuine order IDs, final revenue, consent and server-side deduplication.

## Remaining owner facts — MANUAL ACTION REQUIRED

Publish genuine Privacy, Terms and Refund policies, including business identity/jurisdiction, privacy processors/retention, product eligibility and transfer requirements, payment/finality, delivery/support scope, and actual cancellation/refund conditions. These pages were absent; none are fabricated or linked to nonexistent URLs. Confirm provider transfer/resale conditions and account-specific rights before offering any package; no official provider authorization is inferred. Supply actual inventory/final-price records and genuine third-party proof if stronger merchant/verification claims are desired.

## Files and reproducibility

The complete changed/created file inventory is in `seo-evidence/changed-files.txt`. `SEO-KEYWORD-MAPPING.md` and `seo-evidence/page-metadata.json` document final titles, descriptions, H1s, intent and canonicals. `seo-evidence/indexing-priority.txt` lists the public indexing candidates. Browser test scripts and controlled payment fixtures are in `scripts/qa/`; instructions are in README. Generated `dist/`, `.ssg-build/`, large raw Lighthouse reports and regenerated media are ignored by Git; the source generators and compact evidence are retained.

Deploy only after the owner's approval, following `SEO-DEPLOYMENT-CHECKLIST.md`.
