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
