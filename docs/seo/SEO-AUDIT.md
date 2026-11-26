# Catalog SEO audit

Date: 2026-11-26. Baseline source: `a5ed490`. This audit precedes implementation of the newly supplied 82-record catalog brief. The prior SEO release remains live and will not change until a separate release approval.

| Priority | Finding | Action |
| --- | --- | --- |
| CRITICAL | The new brief prohibits publishing unverified offers, but 68 existing references have active purchase actions and no documented authorization/availability records. | Add one fail-closed publication policy shared by SEO, cards, cart, checkout and payment API. Preserve data and URLs as clearly labeled reference records. |
| HIGH | Many supplied keywords rename account references as consulting/setup/integration services. Actual service delivery and price scope are undocumented. | Preserve every proposal; hold commercial metadata until real scope and editorial review match the catalog. Never silently invent a service. |
| HIGH | All 68 variations are currently indexable automatically. | Require an explicit, distinct-content indexing review. Pending categories/variants stay noindex and out of sitemap; maintain useful public buyer resources. |
| HIGH | Model/quota/port/credit labels are seller supplied, not verified. | Require specification/program/permission evidence; do not infer model availability or port bypass rights. |
| MEDIUM | Homepage and AWS category compete for the broad AWS buying cluster. | Reserve buy AWS accounts for the reviewed AWS category; homepage covers the cross-cloud catalog and buyer guidance. |
| MEDIUM | Existing introductions share kind-level templates; individual differences need more useful treatment. | Add original, variant-specific editorial explanations and requirements; retain exact technical references and prices. |
| MEDIUM | Pending products currently emit Product schema and appear in commercial ItemLists. | Withhold Product/Service/Offer and commercial list entries until eligible. Keep factual WebPage/CollectionPage/breadcrumb/entity/article data. |
| LOW | Required catalog/verification/indexing documentation is absent at docs/seo/. | Generate all 11 requested deliverables from the existing route, catalog, publication and SEO sources. |

Already working: React/Vite build-time rendering and hydration; exact canonical paths; genuine 404s; 49 permanent mappings; local fonts and optimized images; factual seller disclosures; safe JSON-LD; robots/noindex handling; receipt-validation tests and consent-gated optional analytics. Reuse these systems rather than introducing another SEO generator or framework.

All 82 supplied records reconcile one-to-one to 14 category URLs and 68 existing variant URLs. No inventory, price, quota or model values will be corrected silently. The owner's reply “purchase/indexing” identifies a scope, not supporting authorization or availability evidence. Verification remains pending in the absence of those records.

Human verification and editorial approval are required before commercial publication. Provider documentation is policy context, not evidence that this seller is authorized: [AWS credit terms](https://aws.amazon.com/awscredits/), [Azure trial eligibility](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/avoid-charges-free-account), [SES account quotas](https://docs.aws.amazon.com/ses/latest/dg/manage-sending-quotas.html). Do not assume all credits share the same terms or expand ambiguous model names into official model IDs.
