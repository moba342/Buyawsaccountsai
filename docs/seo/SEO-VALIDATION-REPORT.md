# Catalog SEO validation report

Date: 2026-11-26. Local review branch; production unchanged.

| Check | Result | Evidence / limits |
| --- | --- | --- |
| Automated unit tests | PASS — 49/49 | Catalog/prices, publication gates, metadata, unique articles, payment receipts, input security and cart behavior. Approved commercial cases use synthetic test-only evidence. |
| Production build | PASS | React client and SSR/SSG complete; 96 documents and custom 404. |
| Generated SEO validation | PASS | 96 unique titles/descriptions, matching canonical/robots/schema, 12 sitemap URLs, 69 correctly sized social images; all 82 publication states match artifacts. |
| Full browser crawl | PASS | 96 raw + 96 hydrated routes, 268 responsive views, 194 internal links, 85 image checks and 49 redirects; no orphan routes, JS errors, horizontal overflow or reported heading defects. |
| Pending purchase safeguards | PASS | All 68 variant purchase actions disabled; saved selections preserved; blocked checkout hides payment instructions; real local API rejects pending items before RPC. |
| Responsive/accessibility | PASS automated checks | Eight widths: 320, 375, 390, 414, 768, 1024, 1440 and 1920; 30 axe scans across selected page types with no violations. Automated scans do not replace human assistive-technology review. |
| SPA and hydration | PASS | Metadata updates, sticky header, mobile navigation, comparison, guide/contact links and delayed chunk loading; no initial loading fallback flashes in the measured case. |
| Analytics without owner configuration | PASS | No tracker requests; no invented IDs or purchase events. |
| Lint / type check | NOT APPLICABLE | No lint or TypeScript configuration/commands exist; no false pass is reported. |
| External structured-data validators | MANUAL ACTION REQUIRED | Schema.org editor unavailable; Google code submission returned a login/retry error. See structured-data report and evidence. |
| Publication/human editorial review | PENDING | No actual authorization/stock/service-scope records provided. All 82 proposals require review; 56 propose services that cannot be inferred from SEO text. |
| Live release / Search Console | NOT PERFORMED | New production approval and owner access/configuration required. No live deindexing or sitemap submission performed. |

Browser evidence: `evidence/technical-qa.json`, `evidence/publication-ui.json`, and `evidence/accessibility-extra.json` (actual filename listed in the evidence directory). Candidate Lighthouse performance is 100 on measured home/product mobile and desktop runs. Product SEO is 69 solely because its required noindex hold fails the crawlability audit; homepage SEO is 100. Performance results and lab limitations are in `CORE-WEB-VITALS-REPORT.md`.

The historical positive purchase UI test reports not applicable when no offer is eligible; it is not counted as a passed live checkout. Receipt validation for approved test records is covered by Node fixtures. No money, customer message, real order or blockchain transaction was sent. Persistent order storage, TXID consumption and fulfillment remain outside the current architecture.

Release approval must explicitly account for the purchase hold and reduction from the previous production sitemap of 94 URLs to 12 supporting URLs. The earlier deployment approval does not approve this new change.
