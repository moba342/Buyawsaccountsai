# Deployment and indexing checklist

Date: 2026-11-26. Status: **PASS — owner approved; production release deployed**. See `SEO-PRODUCTION-RELEASE.md` for executed live checks. Remaining legal/measurement inputs below are still manual. The attached brief explicitly says “Do not deploy to production without approval.” That approval was subsequently received before source `c93f234` was pushed to main and deployed.

## Review before approval

1. Review `SEO-AUDIT.md`, `SEO-IMPLEMENTATION.md`, `SEO-KEYWORD-MAPPING.md`, `SEO-VALIDATION-REPORT.md`, and compact evidence in `seo-evidence/`.
2. Preview the generated site locally with `npm run preview:production`. Review the homepage, marketplace, an AWS collection, representative compute/credit/AI products, all three guides, cart and checkout. Confirm the existing brand/design and owner-supplied prices are intact.
3. Supply real Privacy, Terms and Refund policy content before publishing those pages or activating analytics. No policy timeline or eligibility condition has been invented. Product offers/stock need confirmed business records; leave `confirmedCommerceFacts` empty until then.
4. Confirm that actual provider account-transfer/resale and credit eligibility requirements are met for each offered product. This implementation does not confer provider permission or independent verification.
5. Obtain explicit owner approval to merge/release this SEO change. A main-branch push can trigger production automatically; it is intentionally on hold too.

## Clean-build commands — PASS locally

```sh
npm ci
npm test
npm run build
npm run validate:seo
npm run preview:production
```

`npm run build` runs payment QR/media generation, the Vite browser build, the Vite SSR build, and complete route prerendering. `dist/` is the publish directory; `.ssg-build/` is temporary build tooling, not the deployment output. Use Node 22 LTS compatible with the installed dependencies. No TypeScript/ESLint commands exist in this JavaScript repository; do not claim they passed. Optional Playwright/axe tests and separate-tool-package setup are documented in README.

## Optional environment setup — MANUAL ACTION REQUIRED

| Variable | Purpose | Required for storefront? |
| --- | --- | --- |
| `GOOGLE_SITE_VERIFICATION` | Actual URL-prefix HTML verification token from Search Console, build-time only | No |
| `VITE_GA_MEASUREMENT_ID` | Actual public GA4 ID, if GA4 is selected | No |
| `VITE_GTM_ID` | Actual public GTM container ID, if GTM is selected | No |
| `VITE_ANALYTICS_PRIVACY_URL` | Actual published privacy notice on the preferred domain | Required to enable optional analytics |

Blank/unavailable values remain blank. Never invent IDs or put RPC/private keys in a `VITE_` variable. Existing server-only payment configuration remains unchanged. If GTM already manages GA4, use that path alone; audit the real container and consent rules before release. Do not add purchase/lead-success tags for a TXID check or contact click.

For local GSC testing, export the actual verification token before building. In Vercel, set it for the appropriate build environment. Do not publish staging with production analytics enabled. Protect any preview deployment using Deployment Protection; no public staging deployment is created by this change.

## Approved release procedure — EXECUTED (see release evidence)

1. After approval, review and merge the feature branch into the deployment branch, or use the owner's approved Vercel production release path for project `buyawsaccountsai`. Do not deploy an outdated `dist/` or omit the postbuild step.
2. Keep the existing preferred-domain configuration: HTTP → HTTPS and apex → `https://www.buyawsaccountsai.com`. Confirm certificate/HSTS behavior. Existing HTTP apex takes two hosting-managed hops; review whether edge/domain settings can safely collapse this after approval, without redirect loops. Application links already bypass it. Protect preview deployments before they become public.
3. Check the deployment build log reports 96 prerendered pages and 94 sitemap URLs, unless genuine catalog/route/noindex facts have changed.
4. Inspect the release's raw HTML without JavaScript. Confirm exact metadata, one H1, meaningful main content, product reference price, current availability wording, links and JSON-LD.
5. Check all eight core pages, one product per provider and all three guide article URLs. Confirm initial-route hydration never flashes a loading page, saved carts survive reload, all three USDT networks show the correct owner wallet and QR, and TXID failures never show confirmation.
6. Confirm `/products/`, `/providers/`, `/compare/`, `/guides/`, `/faq/`, `/verified/`, `/contact/` return permanent 308 to the established new slugs, with no redirect chains. Check preserved retired mappings separately.
7. Verify arbitrary, unknown product and unknown guide URLs return real 404 with the custom body; no universal SPA 200 fallback. Case-mismatched `/MARKETPLACE/` should stay 404 or receive an intentional clean canonical redirect, not duplicate indexable content.
8. Fetch `/sitemap.xml` and `/robots.txt`; ensure every sitemap URL returns 200, canonical/index directives agree, and no cart/checkout/API/redirect/error pages enter the sitemap. Check tracking-query versions canonicalize cleanly.
9. Inspect live response headers, compression and immutable hashed-asset caching. Confirm no mixed content and no secrets in built files. Rerun mobile/desktop Lighthouse after deployment; local lab scores are not production field measurements.
10. If a material regression is found, roll back to the previous verified Vercel deployment. Do not erase or “correct” owner prices or payment configuration as a rollback shortcut.

## Search Console setup and submission — MANUAL ACTION REQUIRED

1. Sign in to the owner's Google Search Console account. For a Domain Property, add `buyawsaccountsai.com` and publish exactly the DNS TXT verification value supplied by Google at the domain's authoritative DNS provider. DNS verification covers protocols/subdomains; no fake record or API call is provided here.
2. Alternatively, add the URL-prefix property `https://www.buyawsaccountsai.com/`. Choose HTML-tag verification, copy the exact `content` token to `GOOGLE_SITE_VERIFICATION`, and include it in an approved rebuild/release. Existing verification tags are preserved. For HTML-file verification, place Google's exact supplied file in `public/`, build and verify its live URL. Never rename or replace its contents.
3. Only after the optimized release is live, verify the property and submit `https://www.buyawsaccountsai.com/sitemap.xml` in Sitemaps. Check that the fetch succeeds and review actual discovered/processed counts. No submission is claimed in this work.
4. Use URL Inspection → Test Live URL for the homepage, marketplace, cloud platforms, comparison, guide directory, help center, seller profile and contact sales. Inspect canonical, crawl permission, rendered HTML, response status and mobile content. Repeat for important product pages, platform pages and the three guides using `seo-evidence/indexing-priority.txt`.
5. Request indexing for the highest-priority genuine public pages only after live checks succeed. Use the sitemap for the rest; do not use Google's Indexing API for ordinary product pages. Requests do not guarantee indexing or ranking.
6. Monitor Page Indexing, duplicate/canonical reports, crawl statistics, Search Performance and Core Web Vitals. Field CWV needs real-user data; no INP/CrUX percentile can be inferred from local tests. Review retired Alibaba/Atlantic redirect relevance with actual backlink/indexing evidence.

## External structured-data and social validation — MANUAL ACTION REQUIRED

- Five Schema.org Validator code-mode samples already returned zero errors/warnings. Google Rich Results Test submission was attempted but the tool requested login; no Google result is claimed. For owner rechecking, paste the public JSON-LD samples in `seo-evidence/structured-data-samples/` into [Schema.org Validator](https://validator.schema.org/) and use code mode in [Google Rich Results Test](https://search.google.com/test/rich-results). After approval/release, test actual live product/collection/guide URLs too.
- Expect no Google product-rich-result claim while offers/reviews are intentionally absent. Resolve genuine errors without inventing merchant offers, ratings, IDs, stock or policies. Schema.org validity alone does not guarantee Google's feature eligibility.
- Confirm live 1200×630 OG/Twitter assets load publicly, then inspect a sample share in the intended social platforms. Never treat a validator run against the old production version as validation of this unpublished change.

## Existing limitations kept explicit

There is no order database, TXID consumption/deduplication ledger, automated fulfillment or verified lead-success callback. On-chain confirmation is not a persisted completed order. The payment verifier was regression-tested, not a live transfer or merchant-system certification. Contact Sales uses genuine Telegram/email/phone links, not a contact form. Legal policy content, inventory, independent evidence, GSC access and real analytics IDs are owner inputs, not fabricated implementation data.
