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

Production commit: `1019e424d1cfc61c95a44e57fe95871f5a8e769f`. Vercel production deployment `dpl_5gdoch1pJmJVoXP5knDSKtCUeJTT` is Ready, with apex and WWW aliases attached. The canonical apex responds directly. [Deployment evidence](evidence/domain-migration/deployment.json).

- [Live URL validation](evidence/domain-migration/live/validation.json): all 96 pages HTTP 200, 94 indexable; all 535 permanent legacy redirects reach direct final 200s and preserve queries. All 96 schemas/canonicals/Open Graph and distinct internal destinations passed. The served 94-URL sitemap matches the build and robots declaration. No reported errors.
- [Complete live host and TLS audit](evidence/domain-migration/live-host-audit.json): **1,070 legacy host/path combinations**, **96 WWW canonical-path redirects**, **96 direct apex pages**, **1,166 query-preservation cases**, fallback 200/404 handling and valid TLS certificates for both hosts passed. HTTPS legacy WWW paths go straight to their final non-WWW keyword URL. No loops were observed; canonical apex pages have no redirect.

| Incoming root URL | Permanent hops | Final status |
| --- | ---: | ---: |
| `http://buyawsaccountsai.com/` | 1 | 200 |
| `https://buyawsaccountsai.com/` | 0 | 200 |
| `https://www.buyawsaccountsai.com/` | 1 | 200 |
| `http://www.buyawsaccountsai.com/` | 2 | 200 |

**Remaining hosting limitation:** Vercel upgrades HTTP to HTTPS on the same host before evaluating application rules. HTTP WWW then needs host normalization; HTTP legacy URLs on either host then need path normalization. For example, HTTP apex `/product/aws-8-vcpu/` and HTTP WWW `/product/aws-8-vcpu/` each take two permanent hops to HTTPS apex `/buy-aws-8-vcpu/`, preserving the encoded query. The same legacy URLs requested over HTTPS take one hop. This measured extra HTTP hop is not claimed eliminated. All hops are permanent 308 responses and preserve the tested path/query. No DNS change fixes this application-ordering constraint. If strict one-hop HTTP WWW becomes mandatory, it requires an upstream edge capable of redirecting the request to the final HTTPS apex before Vercel, with valid handling of both hosts; no unrequested proxy or DNS migration was made.

Hosting configuration retained: Vercel project `mo-ba2/buyawsaccountsai` → Settings → Domains: `buyawsaccountsai.com` assigned to Production with Redirect unset; `www.buyawsaccountsai.com` also assigned with Redirect unset. Keep the generated WWW-only `vercel.json` redirects. Do not add a blanket domain redirect that would make legacy WWW URLs take an extra HTTPS hop. Both domains are already verified, so the owner has no manual DNS or hosting step to perform.

[Data/path preservation and actual command checks](evidence/domain-migration/implementation-checks.json) prove catalog, prices, payment configuration, publication controls and optimized path helpers are unchanged from the previous production source.

Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**. After release, the owner should connect the non-WWW property and submit `https://buyawsaccountsai.com/sitemap.xml`; no credentials are requested. Search rankings, indexing and field Core Web Vitals are not established by implementation tests.

[Live commerce regression](evidence/domain-migration/live/publication-ui.json): 68 pending product pages keep their purchase actions disabled; saved cart, blocked checkout and pending-item API rejection passed. Comparison, contact/guides and mobile menu passed, with four accessibility scans and no reported violations or JavaScript errors. No payment or order was initiated.

Saved-cart test scope: existing stable product IDs remain readable on the destination origin. Browser localStorage is origin-scoped; these tests do not claim automatic transfer of an old WWW browser-local cart to the apex origin. No server-side product records, payment configuration or publication status were altered.

## Final live browser acceptance

[Live browser technical audit](evidence/domain-migration/live/technical-qa.json): **96 initial HTML pages, 96 hydrated pages, 268 responsive views at mobile/tablet/desktop widths, 14 automated accessibility scans, 194 internal-link targets, 85 images and all 535 canonical-domain redirects passed**. No reported JavaScript errors, overflow, heading issues, orphan pages or accessibility violations. The 94-entry sitemap, robots configuration and absence of unconfigured analytics requests passed.

[Deployable reference scan](evidence/domain-migration/public-reference-scan.json): all 129 text artifacts have zero old first-party WWW references. Legacy incoming host rules and archived measured evidence are intentional exceptions outside deployable page content. Both [final Vercel domain assignments](evidence/domain-migration/domains-after.json) remain verified, with no blanket redirect configured. No owner DNS action is required.

Release completed with the explicitly documented Vercel HTTP-upgrade hop limitation. Production source remains `1019e42`; final measured evidence and this report are stored in a separate documentation commit to avoid replacing the verified deployment unnecessarily.
