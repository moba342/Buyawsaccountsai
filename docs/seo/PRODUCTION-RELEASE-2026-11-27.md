> Historical deployed release. The subsequent [independent SEO source update](SEO-INDEPENDENCE-REPORT.md) separates SEO from commercial activation; it has not been deployed by this task.

# Approved catalog SEO production release

Date: 2026-11-27 (Asia/Dhaka). Owner approval: “Run the production deployment all seo”. This explicitly approved the reviewed release after the prior response disclosed that all 82 catalog references remain pending, purchasing is blocked and production had not changed.

Production: https://www.buyawsaccountsai.com/

- Application source: `ec7a7bc` (`Reconcile catalog SEO proposals and gate publication on evidence`).
- Main fast-forwarded from `a5ed490` and pushed to `moba342/Buyawsaccountsai`.
- Project: `mo-ba2/buyawsaccountsai`.
- Initial CLI deployment: `dpl_4pjrwynAnciFRAkFCkhbVtWNFGK3`, https://buyawsaccountsai-nvmm7l9bk-mo-ba2.vercel.app, READY.
- Subsequent Git main deployment of the same application source: `dpl_6coh1ndcCLbqAQs3cWYpUeAJ7AF6`, https://buyawsaccountsai-pexx3d5cc-mo-ba2.vercel.app, READY; production custom domains are assigned to it.
- Prior production version retained for rollback: https://buyawsaccountsai-m38uddis9-mo-ba2.vercel.app (`c93f234` application source). Rollback would restore the earlier purchase/indexing behavior as well as its UI, so requires a deliberate release decision.

## Release checks

Before deployment: 49/49 automated tests, production client/SSR/SSG build and `npm run validate:seo` passed. Output contains 96 documents, 96 unique titles/descriptions, a custom 404, 69 social images and a 12-URL sitemap. All 82 catalog states match generated robots/schema/sitemap artifacts. No lint or TypeScript command exists; neither is claimed as passed.

Live requests confirmed 200 homepage, marketplace, product, sitemap and robots; homepage/marketplace are indexable, pending AWS Free Trial is noindex, sitemap contains 12 URLs, and an unknown URL returns a genuine 404 with noindex.

Production purchase-safeguard browser checks passed: all 68 variant purchase actions disabled, saved cart preserved, pending checkout withholds payment instructions, and the live API rejects pending items even with client-supplied approval fields. Comparison, guide/contact links and mobile navigation passed. Cart/checkout were checked at eight widths; four axe scans had no violations or JavaScript errors. No funds, real order or seller message was sent. Evidence: `evidence/production/publication-ui.json`.

The full live technical crawl also passed: 96 raw HTML pages and 96 hydrated routes, 268 responsive views across eight widths, 194 internal links, 85 images, all 49 configured redirects, genuine custom 404s, robots and the 12-URL sitemap. There were no orphan pages, reported heading issues, horizontal overflow or JavaScript errors. Fourteen additional axe scans had no violations, for 18 automated production scans including cart/checkout. With analytics unconfigured, no tracker requests were observed. Evidence: `evidence/production/technical-qa.json` and representative mobile screenshots. Automated accessibility results do not replace manual assistive-technology review.

## Scope and remaining owner actions

The release implements the supplied SEO proposals, original reference content and evidence gates. It does **not** certify the seller, authorize resale, verify stock/model/credit eligibility or guarantee rankings. All 82 category/variant references remain pending and noindex; their URLs, actual specifications and prices are retained. Only 12 eligible supporting URLs are in the sitemap. Commercial Product/Service/Offer schema and purchases remain withheld for pending references.

Owner evidence and named human editorial approval are still required before any offer can become purchasable/indexable. Proposed consulting services are not created from SEO copy. Search Console verification, sitemap submission, actual indexing inspection, optional genuine analytics/privacy inputs and business policy content remain owner actions. No Google indexing or ranking outcome is claimed. External Schema.org/Google tool follow-up remains manual as described in the structured-data report.

Earlier review documents and local lab results are historical pre-release evidence; this record supersedes their “production unchanged / approval pending” status only. Source approval is not factual offer approval. Release documentation is kept on a separate documentation branch to avoid another unnecessary production source release.

## Production mobile Lighthouse

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home | 98 | 100 | 100 | 100 | 1.88s | 49ms | 0 |
| product | 100 | 100 | 100 | 69 | 1.09s | 0ms | 0 |

The pending product’s only failing SEO audit is `is-crawlable`, intentionally caused by its required noindex hold. This is not removed to inflate a score. These are single Lighthouse 13.6.0 production-network mobile lab runs, not field INP/CrUX percentiles or rankings. See `evidence/production/lighthouse.json`; complete raw JSON remains in ignored `.qa-seo/`.
