# Product metadata and technical SEO validation

Date: 2026-11-27 (Asia/Dhaka). Canonical origin: **https://buyawsaccountsai.com**. Scope: **14 categories + 68 variations = 82 catalog records**, plus all existing main pages. The website retains 96 canonical pages, of which 94 are technically indexable; cart and checkout remain noindex. Catalog coverage is distinct from indexable-page count.

## Findings and implemented fixes

The baseline was measured on the actual live website before this release. All 82 catalog pages already had a meta-keywords tag, but all 82 omitted the assigned long-tail terms. This audit does not claim the tag was missing merely because an extension previously reported it. Fifteen titles used the generic “Pricing, Limits & Account Details” suffix; stripping the product-name prefix left only 30 distinct description bodies across the 82 records.

- `catalog-metadata-copy.js` now contains product-specific editorial metadata for every stable catalog ID. The central `catalog-seo.js` generator uses those entries, failing explicitly if a record is missing rather than filling it with a generic suffix.
- All 82 description bodies are distinct and address the actual type of record: trial terms, quotas, billing, credits, sending/network limits or seller-listed AI labels. Product-specific descriptions replace generic length-filling templates. Existing individual product articles and specifications remain.
- Product openings use the relevant record's buying focus, with existing primary and secondary buying terms. The unique existing editorial description remains in the article; no keyword-density quota or repeated keyword list is added to the body.
- One dynamic meta-keywords tag is generated from assigned primary, secondary and long-tail terms in both initial server-generated HTML and client navigation. Empty values are filtered and duplicate assigned terms removed. This is third-party compatibility only, **not a Google ranking factor**.
- The exact assigned keywords, 82 optimized paths, permanent redirect mappings, non-WWW canonical domain, prices, stable IDs, product publication status, payment configuration and visual design are preserved. No held offer is activated.

## Metadata quality and coverage

All 82 titles and descriptions are unique. 81 titles are 50–60 characters and all 82 descriptions are 140–160. The one 75-character title preserves the existing full technical keyword for the AWS 1920 vCPU / 10K RPM / high TPM / model-list variation; it is recorded explicitly rather than silently truncated. Character ranges are editorial targets, not promises about Google snippet display.

The CSV includes product/variation, primary/secondary/long-tail terms, actual SEO title and description with character counts, actual meta-keywords content, H1, primary and secondary placement results, duplicate metadata, canonical/indexability and validation status. The JSON additionally covers actual generated metadata for all 96 canonical pages, with schema types and source-consistency checks. Matching live DOM evidence is merged only when it agrees with the current title, description and canonical.

## Structured data and publication scope

Actual graph nodes remain tied to visible content and centralized SEO data. Organization, WebSite, BreadcrumbList, CollectionPage, ItemList and Product are checked where applicable. ProductGroup and Service are not added merely to fill a checklist: the existing catalog has standalone variant records, and no documented service offer is introduced. No Offer, inventory or rating claim is emitted for the 68 commercially held records. Eligible Offer URL behavior remains covered by approved synthetic unit fixtures, without activating real purchases.

## Local actual results

- `npm test`: **60 passed, 0 failed**.
- Production client/SSR/SSG build and artifact validation: passed; 96 generated pages, 94 sitemap entries, 69 social images, custom 404. All 129 deployable text artifacts are free of old first-party WWW references.
- Initial HTML metadata for all 96 pages matches the centralized data. Catalog title/description/keyword placements and duplicate checks pass in generated HTML.
- Client bundle: 425.91 kB uncompressed / 124.93 kB gzip from the production build. No new runtime dependency was added.
- No separate lint or type-check commands are configured in package.json.

Browser, deployment and live acceptance results will be appended only after their actual completion. Evidence for this release is isolated under `evidence/product-metadata/`; previous measured WWW/domain-release records are archival.

## Limits and remaining owner work

Exact primary-keyword cluster ownership is checked across the homepage, marketplace, platform directory, category pages, variations and guides. Shared topic relevance is not itself a cannibalization diagnosis. Search-volume, real rankings, semantic search competition, indexing and field Core Web Vitals require independent performance data; none is fabricated here.

Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**. Connect the non-WWW property and submit `https://buyawsaccountsai.com/sitemap.xml` when ready. No credentials are requested and this pending integration is not a technical SEO failure.

The existing Vercel HTTP upgrade can precede host/path normalization, producing two hops for HTTP WWW and HTTP legacy requests. HTTPS WWW and legacy requests are normalized directly; the current release preserves that routing policy. This platform limitation is rechecked against live responses, not claimed fixed by metadata changes.

## Completed local browser acceptance

- [Catalog DOM/SSR audit](evidence/product-metadata/source.json): **82/82 passed**, full primary placements, six secondary targets per record, ten assigned keyword terms per catalog tag, metadata uniqueness and canonical/social consistency. A real category→product client navigation preserved the browser marker and updated the single keyword tag, title and canonical.
- [Technical browser audit](evidence/product-metadata/local/technical-qa.json): **96 raw pages, 96 hydrated pages, 268 responsive views, 14 accessibility scans, 194 internal-link targets, 85 images, 535 redirects**, sitemap/robots; no reported errors, overflow, heading issues, orphan pages or accessibility violations.
- [Additional accessibility/SPA checks](evidence/product-metadata/local/accessibility-extra.json): **12 scans**, no violations, sticky header passed, no initial hydration loading fallback.
- [Commercial regression](evidence/product-metadata/local/publication-ui.json): **68 pending variations** retain disabled purchase actions; saved stable IDs, blocked checkout, API rejection, comparison, contact/guides and mobile menu passed. Four accessibility scans had no violations. No real payment was initiated.

The 30 total local accessibility scans are automated coverage of the tested views, not a claim of comprehensive manual assistive-technology testing.

## Production release and live metadata acceptance

Production source: `22b877a01221f50a903fe530a6dd65d56055b2f5`, Vercel deployment `dpl_FJNG7t7jXKsoDkMuyp1J1SeWmjFp`, Ready. The preferred host remains HTTPS non-WWW. [Deployment record](evidence/product-metadata/deployment.json).

- [Actual live catalog DOM/SSR audit](evidence/product-metadata/live.json): **82/82 passed**, including initial HTML, hydrated metadata, complete assigned keyword tags, primary placements, six secondary targets per record, contextual internal links, image ALT attributes, canonical/robots/social consistency, duplicate metadata and real client-side navigation. No JavaScript errors.
- [Live URL validation](evidence/product-metadata/live-technical/validation.json): **96 pages, 94 indexable HTTP 200 pages, 535 direct permanent redirects, 535 query-preservation checks and 96 schema checks** passed; served sitemap matches the build, all 94 entries are unique and robots declares the correct non-WWW sitemap.
- [Live commerce checks](evidence/product-metadata/live-technical/publication-ui.json): all 68 held variants remain unavailable to purchase; saved stable IDs, checkout hold, pending-item API rejection, comparison, contact/guides and mobile menu passed. Four accessibility scans reported no violations; no order or payment initiated.
- [Live additional accessibility and SPA checks](evidence/product-metadata/live-technical/accessibility-extra.json): 12 scans without violations; SPA metadata, sticky header and no initial loading flash passed.

### Measured before/after

| Check | Before release | After release |
| --- | ---: | ---: |
| Catalog pages with a keyword tag | 82 | 82 |
| Tags missing assigned long-tail terms | 82 | 0 |
| Titles using the flagged generic suffix | 15 | 0 |
| Distinct description bodies after the buying-name prefix | 30 | 82 |
| Titles in 50–60 character range | 81 | 81 |
| Descriptions in 140–160 character range | 82 | 82 |

[Measured comparison](evidence/product-metadata/before-after.json). These figures measure implementation coverage, not Google rankings or indexing outcomes.

### Hosting issue found during acceptance

The first live cross-host check failed because WWW was no longer attached to the project. Vercel returned a temporary 307 to the apex legacy path, adding a second path-normalization hop. The assignment was restored with Redirect unset, leaving the existing application-level 308 rules in control. An immediate post-change retry still encountered the old response during propagation; subsequent acceptance is rerun after the permanent response is observed.

[Domain assignment before remediation](evidence/product-metadata/domains-before-remediation.json) and [restoration response](evidence/product-metadata/domain-restored.json) record the actual change. No DNS changes were made. The cause of the domain detachment is not established; future production acceptance should continue checking that both verified domains remain assigned. Final results below reflect the post-restoration state, not the failed initial attempt.

[Preserved-file contracts](evidence/product-metadata/preserved-contracts.json) verify catalog records, specification data, stable path helpers, payment configuration, publication controls, hosting rules and the application layout are unchanged from `1019e42`. The metadata and editorial-copy changes do not activate offers or alter database records.

### Post-restoration host acceptance

The WWW alias was explicitly bound to the current production deployment, then the host audit was repeated. The final live host evidence checks both legacy hosts, direct non-WWW pages, WWW canonical-path normalization, encoded query preservation, valid TLS and real 404 fallback behavior. [Final host audit](evidence/product-metadata/live-technical/live-host-audit.json) and [final domain settings](evidence/product-metadata/domains-after.json).

Observed root behavior: HTTP apex → one permanent hop; HTTPS apex → direct 200; HTTPS WWW → one permanent hop; HTTP WWW → two permanent hops due to Vercel's same-host HTTPS upgrade. HTTPS legacy paths redirect directly to their final keyword URLs. HTTP legacy paths can take an HTTPS-upgrade hop before path normalization. This known platform limit is retained and disclosed.

## Final live browser and schema coverage

[Final live technical crawl](evidence/product-metadata/live-technical/technical-qa.json): **96 initial HTML pages, 96 hydrated pages, 268 responsive views, 14 accessibility scans, 194 internal-link targets, 85 images, 535 redirects and 94 sitemap URLs** passed. No reported JavaScript errors, overflow, heading problems, orphans or accessibility violations. With the 12 extra and four commerce scans, this release has **30 live automated accessibility scans** without reported violations.

The actual generated graph includes Organization and WebSite on 96 pages, BreadcrumbList on 93, CollectionPage on 16, ItemList on 17, Product on 68 and Article on three. There are no invented ProductGroup, Service or held-record Offer nodes. Meta-keywords are present on **93 applicable pages**; cart, checkout and the non-commercial public-proof page have no assigned keyword set, so no empty tag is generated. All 82 catalog records contain their complete ten-term assigned sets.

The primary keyword-cluster ownership audit found no exact assigned-target conflicts. All 82 catalog records remain independently technically indexable, within the 94-page public sitemap. This preserves existing indexability and is not a claim that Google has indexed them.

[WWW alias assignment](evidence/product-metadata/www-alias.json) confirms the current production deployment is the redirect host's target; both hosts have verified assignments with blanket Redirect unset. The final cross-host crawl passed all **1,070 legacy checks, 96 WWW canonical-path redirects and 96 direct apex pages**, encoded query preservation, TLS and fallback 404 behavior.

## Actual live laboratory performance

Lighthouse 12.8.2, one run per page/device using the standard mobile/desktop presets, measured after the other browser checks completed. These are lab measurements, not CrUX, real-user INP or a frame-rate guarantee.

| Page / preset | Performance | Accessibility | Best practices | Lighthouse SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home-mobile | 97 | 100 | 100 | 100 | 2.44s | 0.000 | 0ms |
| product-mobile | 98 | 100 | 100 | 100 | 2.15s | 0.000 | 0ms |
| home-desktop | 100 | 100 | 100 | 100 | 0.51s | 0.000 | 0ms |
| product-desktop | 100 | 100 | 100 | 100 | 0.52s | 0.000 | 0ms |

[Actual performance metrics and audit diagnostics](evidence/product-metadata/lighthouse.json). Lighthouse SEO is a limited technical checklist and not a prediction of Google rankings. [Google meta-tag documentation](https://developers.google.com/search/docs/crawling-indexing/special-tags) explains that meta-keywords are ignored for ranking; the tag here fulfills the requested third-party compatibility use.

## Final release status and remaining limits

Implementation, production deployment and live validation are complete for the measured scope. All four requested reports are generated: PRODUCT-KEYWORD-AUDIT.md, PRODUCT-KEYWORD-MAPPING.csv, PRODUCT-METADATA-VALIDATION.json and this TECHNICAL-SEO-VALIDATION.md. The JSON contains both the full 82-record catalog audit and actual main-page metadata coverage, without pretending all 96 pages are commercial offers.

- One 75-character title is an explicit full-keyword exception to the approximate title-length target.
- Vercel's HTTP upgrade can create the disclosed extra hop for HTTP WWW or legacy URLs; HTTPS normalization passed the direct-redirect checks.
- WWW assignment was restored and explicitly bound to the current deployment; why it had become detached is not established. Future deployment checks should verify both domain assignments and alias targets.
- Field Core Web Vitals, actual Google indexing and search-performance-based cannibalization remain unmeasured. No first-page ranking guarantee is made.
- Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**; this is not a technical implementation failure.

Catalog, pricing, stable IDs, URL paths, website design, payment configuration and commercial publication state remain unchanged. Production source is `22b877a`; the final reports and actual measured evidence are saved as a separate documentation update so the validated production deployment is not unnecessarily replaced.
