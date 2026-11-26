# Independent SEO validation report

Date: 2026-11-27. Source-only update; production unchanged.

| Check | Result | Evidence / limitation |
| --- | --- | --- |
| Unit tests | PASS — 51/51 | Catalog/prices, all 82 independent SEO records, uniqueness, commercial gate/payment receipts, safe schema and cart tests. |
| Production build | PASS | React client + build-time SSR/SSG; 96 complete documents and custom 404. |
| Generated SEO artifacts | PASS | 96 unique titles/descriptions, matching canonical/robots/schema, 94 sitemap URLs, all 82 catalog pages indexable, 69 social images. |
| Full browser crawl | PASS | 96 raw + 96 hydrated routes, 194 internal links, 85 image checks, 49 redirects, no orphan pages or reported heading defects. |
| Responsive layouts | PASS | 268 views across 320, 375, 390, 414, 768, 1024, 1440 and 1920px; no horizontal overflow or JS errors. |
| Automated accessibility | PASS | 30 selected-page axe scans (14 full crawl + 4 commerce + 12 extra), no violations. Manual assistive-technology testing is not implied. |
| SPA / hydration | PASS | Matching head metadata, sticky header, mobile navigation, compare/guide/contact links and delayed-chunk first render; zero initial loading fallbacks in measured case. |
| Commercial separation | PASS | All 68 purchase actions remain blocked with empty commercial records; saved cart retained; checkout does not show payment instructions; real local API rejects pending items before RPC. |
| Unconfigured analytics | PASS | No tracker requests, no invented IDs or purchase events. |
| Lint / TypeScript | NOT APPLICABLE | No lint/type-check scripts or configuration in this project. |
| Schema.org external tool | MANUAL ACTION REQUIRED | New anonymous homepage/product attempts could not open Code snippet editor. No external pass claimed. |
| Google Rich Results Test | MANUAL REVIEW | New code submission returned “Something went wrong. Log in and try again”; external evidence retains the actual response. Informational Product has no invented Offer/reviews and is not Google product-snippet eligible. |
| Search Console / field INP | PREPARED / NOT PERFORMED | Genuine owner configuration/access/traffic required; not an SEO development prerequisite. |
| Production deployment | NOT PERFORMED | This task changes source code and reports; current live release remains unchanged. |

Current evidence is in `evidence/independent-seo/`: `technical-qa.json`, `publication-ui.json`, `accessibility-extra.json`, `external-validators.json`, JSON-LD samples and mobile screenshots. Older `evidence/production/` and earlier local results remain historical.

Approved commerce test fixtures are explicitly synthetic; they do not prove actual stock or authorization. No funds, live orders, customer messages or new checkout activation were produced. Measured homepage/product mobile and desktop Lighthouse runs scored 100 for performance, accessibility, best practices and SEO. Local mobile LCP was approximately 1.05s, CLS 0; these are lab results, not field INP or indexing guarantees. The generated route chunks fell from 556,627 to 477,349 raw JavaScript bytes (not a single-page transfer). Full methodology is in `CORE-WEB-VITALS-REPORT.md`.
