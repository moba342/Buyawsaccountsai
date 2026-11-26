# Structured data report

## PASS — shared implementation and local tests

The existing `seo.js` is the single source for initial HTML and SPA metadata. Pending references have factual WebPage/CollectionPage, Organization, WebSite and matching BreadcrumbList data; genuine guide articles retain Article. Pending records do not emit Product, Service, Offer or commercial ItemList claims.

Only an approved actual product may emit Product and a genuine Offer; only an explicitly documented actual service may emit Service. Service name/scope come from reviewed records, not a keyword substitution. The preserved account-package purchase price is used separately from credit face value. Availability is drawn from the actual review, not assumed InStock. SKU is optional and never generated from route IDs. No aggregate ratings, fictional reviews, partnerships, independent verification, return-policy or shipping facts are invented.

Commercial collection ItemLists include only genuinely eligible, explicitly index-approved children. Empty pending collections do not create a product-shaped offer. Heterogeneous account, capacity, credit and model references are not forced into a fictitious ProductGroup. Approved non-indexed variants remain self-canonical rather than being canonicalized to an unrelated product.

Inline JSON-LD uses the tested safe serializer. Node tests exercise pending, approved account and actual service branches using synthetic test-only records. Those fixtures are not real authorizations, are not imported by storefront code, and are not production claims. The owner-facing review source remains empty.

## External validation

New-build attempts are recorded in `evidence/external-validator-results.json`. Schema.org’s anonymous Code snippet editor timed out; Google accepted the current product JSON-LD code but returned “Something went wrong. Log in and try again.” Both require manual follow-up; neither is an external validation pass. Do not reuse the earlier production release's validator pass as proof of this branch. Google Rich Results eligibility is separate from Schema.org vocabulary validity; digital accounts/services are not assumed eligible for merchant features. A tool login/error is reported as a manual action rather than a pass.

After owner evidence and release approval, validate representative actual live URLs in [Schema.org Validator](https://validator.schema.org/) and [Google Rich Results Test](https://search.google.com/test/rich-results). Test Product versus Service scope, visible price/availability, required Google properties and canonical image URLs. No rich result or indexing is guaranteed.
