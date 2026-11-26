# Catalog SEO deployment checklist

Release update: **Owner approved production on 2026-11-27** with “Run the production deployment all seo”. See `PRODUCTION-RELEASE-2026-11-27.md` for live results. The pre-release checklist and remaining evidence requirements below are retained for context.

Pre-release status: **MANUAL ACTION REQUIRED — no new production approval**. The new master brief says “Do not deploy without owner approval.” The earlier approval applied to the previous release; this new catalog/publication change is kept on its review branch.

## Review the release impact first

1. Review all 82 records in `PRODUCT-SEO-CATALOG.json` and the buying-keyword CSV. Check exact route, price, credit face value, model/quota/network labels and proposed service conversion.
2. Supply actual permitted offering/authorization/program/stock/specification facts and have a named human complete the review. Only add genuine, public/redacted review summaries to `offer-review-records.js`; never credentials or confidential proofs.
3. For a service, explicitly update the actual catalog's offering type and document real customer-owned scope without account/credit resale. A metadata proposal cannot create that service. Confirm price scope, delivery/support terms and applicable business policies.
4. Review and approve original product copy. Separately approve distinct content/indexing and any proposed metadata that truly matches the offering.
5. If evidence stays absent, this branch holds all **82** references: no purchase actions, blocked checkout/API verification, no commercial schema, noindex and a **12-URL sitemap**. Existing URLs/specifications/prices/cart selections are retained. Make an explicit release decision with that impact understood; no silent live deindexing is authorized.

## Reproduce checks

```sh
npm ci
npm test
npm run build
npm run validate:seo
npm run preview:production
```

The original postbuild pipeline also generates the 82-record JSON/CSV reports. No new runtime dependency is required. Optional browser scripts use a separate tools package containing Playwright and axe; set `QA_TOOLS_PACKAGE_JSON` to its package.json. Run `scripts/qa/technical-seo.mjs`, `scripts/qa/catalog-publication.mjs`, and `scripts/qa/seo-accessibility-extra.mjs`. Archived historical purchase-flow evidence is not proof that current pending records can be bought. Approved payment receipt logic is exercised with explicitly synthetic reviews in Node tests.

Confirm 96 complete documents and actual dynamic sitemap count, unique metadata, policy-consistent schema, raw HTML, 200/308/404 responses, internal links, all eight requested widths, accessibility, blocked and saved-cart states, server rejection before RPC, and exact original prices/addresses. Review actual lab metrics, not an invented FPS/field-INP promise.

## Owner configuration still required

- Genuine Privacy, Terms and Refund content; no made-up policy pages or guarantees are added.
- Search Console Domain/DNS or URL-prefix verification using the owner's real `GOOGLE_SITE_VERIFICATION` token/file, then approved release and actual sitemap submission/URL inspection.
- Optional real GA4/GTM ID and published privacy notice, with consent. Never add fake measurement IDs or purchase events from contact clicks/receipt checks.
- Actual provider permissions, supported models/regions/quotas, availability and human review. Public provider documentation is not proof of this seller's authorization.
- Complete any external validator login/live checks documented in the validation report.

## Only after explicit release approval

Merge/push the reviewed commit or use the approved Vercel release path. Preserve the preferred HTTPS/www origin and all established paths. Protect previews with deployment protection; local validation has not exposed staging. Verify the live sitemap count and each indexing hold, public HTML/headers, preserved redirects, custom 404, actual product/Service schema if any offers have been approved, wallet/QR consistency for eligible checkout and strict rejection for pending selections. Recheck mobile/desktop performance on the actual release.

Submit only genuinely eligible/indexable URLs to Search Console. Do not use Google's Indexing API for ordinary e-commerce pages. Do not claim rankings, rich results or indexing unless observed. Retain the prior deployment for rollback. Do not delete preserved references or silently change user prices as a release shortcut.
