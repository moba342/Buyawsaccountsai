# Indexability and canonical report

Status: **PASS — policy implemented; PENDING VERIFICATION — catalog publication**.

The 14 category and 68 variation URLs remain 200 reference pages at their existing canonical paths. They contain useful original reference information, preserved seller-supplied specifications/prices, and an explicit unavailable/pending status. They are not published commercial offers. All 82 are `noindex, follow` and excluded from the generated sitemap until evidence and explicit editorial indexing review are complete.

The 12 indexable URLs are the homepage, Marketplace, Cloud Platforms, Compare Products, Buying Guides, Help Center, Seller Profile, Contact Sales, three real guide articles, and the first-party seller declaration. Cart and checkout remain noindex; APIs and errors never enter sitemap. Robots allows public rendering and leaves noindex pages crawlable; it disallows the API and is not an access-control mechanism.

## Canonical strategy

- Self-canonical references preserve existing valuable URLs and permit later review without inventing alternate routes or redirecting distinct specifications to unrelated pages.
- An approved offer can be purchased without being indexed if the distinct-content/indexing review is incomplete. No variation automatically receives indexing just because it exists in the catalog.
- An approved, useful variation may retain an independent canonical only after explicit distinct-value approval. Thin or redundant variations remain noindex; no artificial ProductGroup identifier or category consolidation is invented.
- Tracking parameters canonicalize to clean paths. Filters and sorting do not generate separate indexable pages. Unknown paths have genuine noindex 404s, without a canonical.
- The homepage's preferred cluster is broad cross-cloud discovery. The reviewed AWS category owns the proposed `buy AWS accounts` cluster; variants own their distinct scope/specification clusters. The CSV records each proposed target and its actual current indexing status.

No genuine product modification dates were supplied; sitemap does not invent `lastmod`, `priority` or `changefreq`. Indexability lists regenerate from the same runtime SEO/policy on build. Source additions/removals or real review changes are therefore reflected automatically after an approved rebuild/release.

## Release impact requiring review

The prior live release has 94 sitemap URLs. This branch intentionally generates **12**, holding all 82 unverified catalog references. It does not promise a ranking gain and is not silently deployed. No live deindexing or Search Console request is made. Real indexing, field CWV and backlink effects require Search Console access and owner review. Protect any hosted preview from public crawling; current validation uses loopback only.
