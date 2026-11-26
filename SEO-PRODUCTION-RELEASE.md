> Historical release/audit record. Current SEO requirements are defined in [the independent SEO implementation report](docs/seo/SEO-INDEPENDENCE-REPORT.md). Any earlier requirement to verify commercial documents before SEO development, metadata, crawlability or sitemap inclusion is superseded. Commercial purchase safeguards remain separate.

# Approved production release

Date: 2026-11-26 (Asia/Dhaka). Owner approval: “approval the production”. This authorization lifted the SEO brief's production hold before any release action was taken.

Production: https://www.buyawsaccountsai.com/

- Deployed application source: `c93f2341eb461f90ad88e5115f1054bd3217f884`.
- Main was fast-forwarded to that commit and pushed to `moba342/Buyawsaccountsai`.
- Vercel project: `mo-ba2/buyawsaccountsai`.
- Deployment: `dpl_5qk7YZz5nmVZk87x2EukKfoX15j1`, status READY, production target.
- Deployment URL: https://buyawsaccountsai-m38uddis9-mo-ba2.vercel.app
- Canonical production alias: https://www.buyawsaccountsai.com/
- Previous deployment retained for rollback: https://buyawsaccountsai-dcs1keqev-mo-ba2.vercel.app

## Live HTTP and artifact checks — PASS

Anonymous requests to the canonical production domain verified all 96 application pages return 200 with the expected title, description, canonical, robots directive, one H1, full prerendered content and matching JSON-LD. No authentication bypass was used for these public-domain checks.

- Sitemap: 94 unique canonical public URLs; every path belongs to the validated live 200 route set.
- Robots: public content allowed, API disallowed, cart/checkout crawlable with noindex.
- All 49 preserved application redirects: permanent 308, correct target and preserved query.
- All 69 unique social image URLs: 200 and PNG content type.
- Arbitrary, product, guide and uppercase missing URLs: genuine 404 with the new custom body, noindex and no canonical.
- Headers: nosniff, referrer policy, same-origin framing, limited permissions, CSP and HSTS present.
- Actual production HTML compression: Brotli (`Content-Encoding: br`).
- Hashed JavaScript caching: one-year immutable cache policy.
- Payment API: an invalid network/hash/item request returns 400 and never “confirmed”. No real transaction was queried and no funds were sent.

Evidence: `seo-evidence/production-release.json`. The application, catalog, original prices, owner wallets and receipt-verification source were not changed during release.

## Live browser purchase flow — PASS

Production browser checks passed for saved-cart reload, quantity changes, removal/clear, product add-to-cart, Buy Now → dialog → checkout, the correct $30 total for two $15 variants, all three USDT network wallets/QRs, clipboard, contact-field/request preparation, three-item comparison, mobile menu, guide navigation and real contact-link destinations. No page errors were recorded.

The first automation attempt clicked before product hydration/cart restoration had settled. The browser harness now waits for real handler attachment and saved-cart persistence/restoration before cross-document navigation; a focused live checkout reproduction and the complete rerun passed. No runtime application changes were required after `c93f234`.

Payment UI coverage used controlled responses for pending/not-found/failed/unmatched/amount-mismatch/unavailable/invalid/confirmed states plus rejection of a wrong-network or failing-HTTP “confirmed” result. These are regression fixtures, not proof of actual paid orders. No funds or messages were sent.

## Live mobile Lighthouse — PASS

Actual post-release Lighthouse 13.6.0 runs against the public preferred domain:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage | 100 | 100 | 100 | 100 | 1.39 s | 0 ms | 0.000 |
| AWS Free Trial product | 98 | 100 | 100 | 100 | 1.29 s | 16 ms | 0.000 |

These are individual production-network laboratory runs, not real-user INP/CrUX percentile results or indexing guarantees. Raw reports are retained locally in ignored `.qa-seo/`; compact measurements are in `seo-evidence/production-lighthouse.json`.

## Remaining owner configuration

Search Console token/property verification, sitemap submission and indexing inspection still require owner access; no indexing or ranking is claimed. Optional analytics stays subject to genuine IDs, published privacy information and consent. Real legal policy content and confirmed merchant stock/final-offer data remain owner inputs. Schema.org code samples passed before release; Google's rich-results tool requested login and needs the owner-authenticated follow-up. The existing HTTP apex two-hop hosting redirect remains a low-priority domain/edge review; all application links and canonicals use HTTPS www directly.

Earlier audit/implementation reports preserve their original findings and lab measurements; this document records the subsequent approved release. There was no automatic fulfillment, genuine purchase event, seller-message transmission or customer order created by validation.
