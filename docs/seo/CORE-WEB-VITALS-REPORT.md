# Independent SEO performance and Core Web Vitals report

Date: 2026-11-27. Lighthouse 13.6.0 with the same Chrome and compressed local production-like server. Baseline: clean `ec7a7bc` archive at port 4174; candidate: this source branch at port 4173. Sequential single runs with default mobile simulation or desktop preset; no concurrent browser QA during these measurements.

| Build / page | Device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| before / home | mobile | 100 | 100 | 100 | 100 | 1.06s | 0ms | 0 |
| before / product | mobile | 100 | 100 | 100 | 69 | 1.05s | 4.5ms | 0 |
| after / home | mobile | 100 | 100 | 100 | 100 | 1.06s | 15ms | 0 |
| after / product | mobile | 100 | 100 | 100 | 100 | 1.05s | 0ms | 0 |
| after / home | desktop | 100 | 100 | 100 | 100 | 0.28s | 0ms | 0 |
| after / product | desktop | 100 | 100 | 100 | 100 | 0.28s | 0ms | 0 |

Total generated JavaScript across route chunks (not a single-page transfer): baseline 556627 raw / 152127 gzip bytes; candidate 477349 raw / 142857 gzip bytes.

The archived service-keyword proposals were removed from runtime commercial imports. No runtime package was added. Chunking, initial-route preload, responsive assets, local fonts, stable dimensions and reduced-motion behavior remain.

The baseline product's SEO score reflects its old noindex hold; candidate SEO indexability is independent of commerce. These single local measurements do not establish real-user field performance, a causal speed improvement, production edge behavior or Google indexing. No measured field INP is available; TBT is not INP. Real field assessment requires enough genuine traffic/CrUX data after a separate release. No fixed 120-FPS or zero-frame-drop promise is made.

Compact evidence: `evidence/independent-seo/lighthouse.json`. Full local JSON remains in ignored `.qa-seo/independent-*.json`. Earlier production lab reports remain historical and are not presented as measurements of this source-only change.
