# Independent SEO audit

Date: 2026-11-27. Baseline source `ec7a7bc`; current branch `seo/independent-catalog-2026-11-27`.

| Finding | Source fix | Status |
| --- | --- | --- |
| Commercial documents controlled keywords and indexing | Active `catalog-seo.js`; remove commercial index/proposal fields | Fixed |
| Metadata proposals invented 56 setup/consulting services | Archive proposals; derive actual buying metadata from unchanged catalog | Fixed |
| Empty commerce reviews reduced sitemap from 94 to 12 | Sitemap reads technical robots directives only; 94 URLs including all 82 catalog records | Fixed |
| Pending records lacked factual product descriptions in schema | Product/CollectionPage/ItemList describe supplied facts; Offer remains separate | Fixed |
| Earlier documents instructed SEO holds | Current workflow documents replaced; historical release records explicitly superseded | Fixed |
| Availability/authorization not established | Existing commercial gate remains; not a technical SEO prerequisite | Separate commercial responsibility |
| Search Console owner settings not supplied | Existing real-token support, robots/sitemap preparation and owner steps retained | Prepared, not submitted |

No catalog IDs, prices, capacity/model labels, payment wallet/network data or route mapping were changed. No availability, third-party verification, partner, support or ranking facts were invented.
