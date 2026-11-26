# Final SEO production deployment checklist

Date: 2026-11-27. Deployment is authorized by the user's final SEO instructions; no further approval or Google Search Console credentials are required.

## Completed release preparation

- [x] Audit migration `7600b60`, including the later notice removal `b64982c`.
- [x] Preserve 14 categories, 68 variants, stable catalog/cart/API IDs, prices, design, payment networks/addresses and commercial status.
- [x] Clean dependency install, all 55 tests, production build and generated SEO validation.
- [x] Validate 96 canonical pages, 94 indexable 200s, all 535 direct 308s, query preservation, canonical/OG/schema/internal links, sitemap/robots and real 404s.
- [x] Check eight widths, 30 automated accessibility scans, SPA/hydration, saved cart and unchanged purchase/payment safeguards.
- [x] Revoke the temporary preview automation bypass; preserve deployment protection.
- [x] Prepare the existing Vercel project `mo-ba2/buyawsaccountsai` and retain previous production deployment for rollback.

## Production execution and acceptance

- Promote the tested source commit through existing Git/Vercel production release; record source commit, deployment ID, READY state and preferred domain alias.
- Verify **on HTTPS www production**, not the protected preview: all new canonical paths return 200; all old paths redirect directly; query parameters survive; real canonical/robots/JSON-LD/OG agree with source.
- Recheck 94 sitemap URLs, robots, unique head tags, links, native navigation and 404s. Confirm no blanket live noindex/header is inherited from preview hosting.
- Check actual mobile/desktop layouts and all 68 blocked purchase actions, saved cart, checkout hold and server rejection; do not create a paid order or transfer funds for testing.
- Record actual live lab performance separately from field Core Web Vitals. Do not claim fixed FPS, real-user INP, rankings or indexing.
- Record actual live results and remaining issues in `FINAL-SEO-IMPLEMENTATION-REPORT.md`. Checklist items above are acceptance requirements; the final report records their measured outcome rather than assuming success.

## Rollback

Previous application deployment: `dpl_6coh1ndcCLbqAQs3cWYpUeAJ7AF6`, https://buyawsaccountsai-pexx3d5cc-mo-ba2.vercel.app (`ec7a7bc`). If migration blocks real routes or creates loops, restore the previous production deployment using Vercel rollback, investigate the failed evidence, then validate before another promotion. A rollback also restores its old 12-URL sitemap and indexing/purchase behavior. Keep all permanent legacy redirects on a successful release; do not remove them after the first crawl.

## Owner-managed follow-up — not a release failure

Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**. After owner setup, submit https://www.buyawsaccountsai.com/sitemap.xml, inspect representative new/old URLs and monitor coverage/backlink migration. No property verification, sitemap submission or Google indexing is claimed here. Analytics is optional and remains unconfigured until genuine owner settings and consent/privacy requirements are supplied in the owner's own workflow.

Factual Product identity markup does not fabricate a purchasable Offer/review. Google merchant/product-rich-result eligibility and external tool login follow-up remain separate from successful technical SEO. Commercial activation remains unchanged.
