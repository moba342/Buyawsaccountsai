# Core Web Vitals and performance report

## Measured lab results

Date: 2026-11-26. Lighthouse 13.6.0, Chrome on this Mac, sequential single runs, compressed production-like preview servers. Baseline is a clean archive of `a5ed490` on port 4174; candidate is this branch on port 4173. Mobile uses Lighthouse default simulated throttling; desktop uses its desktop preset. No real user, production edge, Search Console or CrUX measurement is implied.

| Build / page | Device | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| before / home | mobile | 100 | 100 | 100 | 100 | 1.06s | 0 | 12ms |
| before / product | mobile | 100 | 100 | 100 | 100 | 1.05s | 0 | 0ms |
| after / home | mobile | 100 | 100 | 100 | 100 | 1.05s | 0 | 14.5ms |
| after / product | mobile | 100 | 100 | 100 | 69 | 1.05s | 0 | 0ms |
| after / home | desktop | 100 | 100 | 100 | 100 | 0.43s | 0 | 0ms |
| after / product | desktop | 100 | 100 | 100 | 69 | 0.28s | 0 | 0ms |

All measured candidate performance scores meet the 90+ lab target. The candidate product's SEO score of **69 is deliberate**: its only failing SEO audit is `is-crawlable`, because the brief requires pending offers to remain **noindex**. Removing that safeguard merely to raise a score would contradict the publication requirements. The homepage scores 100 across all four categories. No claim that performance improved causally is supported by these single runs; baseline also scores 100.

Measured candidate mobile LCP is approximately 1.05s on these local runs, CLS 0, and TBT at most 14.5ms. These are lab observations, not a field Core Web Vitals pass. INP cannot be established by this Lighthouse navigation run. Real field targets remain LCP <=2.5s, CLS <=0.1, INP <=200ms at the 75th percentile; owner-approved deployment and enough genuine traffic/CrUX data are required to assess them.

## Preserved performance architecture

No new runtime package, framework migration, heavy animation or render-blocking third-party tracker was added. Existing route splitting, server rendering, initial-route preload, local font/media optimization, explicit image dimensions, reduced-motion behavior and consent-gated analytics remain. Added reference data is static and generated through the existing pipeline. Do not assert “120 FPS” or zero frame drops on all devices; refresh rate, GPU, browser and workload vary.

Full local Lighthouse JSON is retained in ignored `.qa-seo/catalog-*.json`; compact reproducible metrics and versions are committed in `evidence/lighthouse.json`. Repeat under production conditions after an approved release; do not compare a local compressed preview to an unrelated earlier uncompressed/live run as an optimization gain.
