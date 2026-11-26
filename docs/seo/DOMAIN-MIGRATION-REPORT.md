# Canonical domain migration — non-WWW

Date: 2026-11-27 (Asia/Dhaka). New sole canonical production origin: **https://buyawsaccountsai.com**. Optimized URL paths remain unchanged across 14 categories and 68 variations.

## Implementation

- Central SITE.url, header/footer logo destinations, seller website references, social-image generation, validators and URL generators use the non-WWW origin.
- The existing build-time SSR/SSG system regenerates all canonicals, Open Graph/Twitter metadata, BreadcrumbList/Product/eligible Offer/collection URLs, sitemap and robots declaration from the canonical origin. Stable catalog/order IDs, prices, product content, commercial publication controls and payment configuration are unchanged.
- All 535 existing legacy redirect source→final-path mappings are preserved under the original SHA-256 contract. Their absolute destinations now use HTTPS non-WWW. A further 98 WWW-only canonical/fallback rules normalize directly to the final path, including slash-ending paths and query strings. Canonical apex requests never match a host-normalization rule; a new regression test checks this loop-prevention invariant.
- Both apex and WWW domains remain verified in the same Vercel production project, with blanket project domain redirects disabled. This permits legacy host and legacy path normalization in one application redirect. No DNS changes or new third-party domain changes are required.
- There are no project environment variables configured in Vercel. Local .env files were checked for the old first-party domain without printing secrets. Functional external contact/provider URLs are retained.

## Reference handling

Generated public HTML/JavaScript, sitemap and robots files are checked for old first-party WWW URLs. The WWW hostname remains intentionally in the redirect policy as an incoming legacy hostname. Historical measured evidence and past release reports retain the exact URLs that were tested at the time; they are archival records, not runtime configuration, canonicals or active internal links. Rewriting them would falsify the prior measurements. This report supersedes their previous preferred-WWW instructions.

## Actual local results

- `npm test`: **59 passed, 0 failed**.
- `npm run build` and `npm run validate:seo`: passed, 96 generated pages, 94 unique sitemap URLs, 69 social images, custom 404; all 82 metadata records remain catalog aligned.
- Enhanced URL validation: 96 canonical pages, 94 indexable HTTP 200s, all 535 direct permanent redirects and query preservation, 96 schema checks and 96 canonical internal destinations passed. The served sitemap matches the build, contains no duplicate URLs and is declared in served robots.txt.
- Host simulation: 1,070 legacy-host/path combinations, 96 WWW canonical-path redirects and 96 direct apex pages passed; 1,166 query-preservation checks; unknown-host-normalized paths retain their final 404 status.
- Generated public text scan: **129 HTML/JS/XML/TXT/JSON/SVG artifacts** checked by the SEO validator, no old first-party WWW references found.
- Local browser technical audit: 96 raw and hydrated pages, 268 responsive views, 14 accessibility scans, 194 internal-link targets, 85 images and all 535 redirects passed; no reported JavaScript errors, overflow, orphans, heading issues or accessibility violations.

Evidence: [local URL checks](evidence/domain-migration/local/validation.json), [host simulation](evidence/domain-migration/local-host-audit.json), [domain settings before](evidence/domain-migration/domains-before.json).

## Deployment and live validation

Pending release and actual live testing. No live completion is claimed by the local test results above. HTTP→HTTPS normalization is also controlled by Vercel; any unavoidable additional HTTP WWW hop will be reported from actual responses rather than claimed removed.

Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**. After release, the owner should connect the non-WWW property and submit `https://buyawsaccountsai.com/sitemap.xml`; no credentials are requested. Search rankings, indexing and field Core Web Vitals are not established by implementation tests.
