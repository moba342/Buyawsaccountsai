# Product verification report

Status: **PENDING VERIFICATION**. All 82 supplied references reconcile, but none has supplied publication evidence. There are 14 category references, 68 variations, and 56 metadata proposals describing services that are not documented in the actual catalog. The owner's “purchase/indexing” response supplies no authorization, inventory, model or service facts.

## What is required before approval

For each exact stable product ID, obtain real, current records covering the actual offering:

- Provider authorization and permitted commercial scope; account offers also require transfer/resale eligibility and an affirmative finding that the arrangement is not nontransferable/restricted.
- Applicable trial/credit program terms and eligibility; do not treat credit face value as the purchase price.
- Genuine availability, the exact purchase price/currency and what that price buys; delivery/support arrangements and actual business policies.
- The specification snapshot: source name/kind, vCPU, credit reference, RPM/TPM, model labels, capacity, daily quota, regions, IPs and port permissions as applicable. Any catalog change invalidates an older snapshot/price review.
- Actual supported regions and quota/model/network evidence. Do not translate ambiguous labels such as F5.2, VT Gemini, High TPM T5 or “port limit” into official entitlements.
- A named human reviewer and genuine review date; approved actual-offer copy. Distinct-content/indexing approval is separate from purchase approval, and the supplied metadata proposal needs its own matching-scope approval.

`offer-review-records.js` is the public review-summary source. Store only redacted public references, never credentials, contracts containing secrets, customer information, private API keys, wallet private keys or unredacted account-console captures. The actual proof review occurs outside this public source; a string/reference or a checked flag is not independent evidence by itself.

## Review fields

A reviewed account offer needs `status`, `reviewedBy`, `reviewedAt`, `resaleAuthorized`, `transferEligible`, `nonTransferable`, `programPermitted`, `confirmed`, `price`, `priceCurrency`, `priceScopeVerified`, actual `availability`, `supportedRegions`, `verifiedSpecifications`, relevant `quotasVerified`/`modelsVerified`, `publicDescription`, `deliveryTerms`, `supportTerms`, applicable `evidence` references, and `editorialReview` findings. The exact shape is implemented in `offer-publication.js`; no pre-approved example is installed in production data.

Supported evidence categories are provider-authorization, transfer-eligibility (for actual account transfer), specifications, availability, billing, program-terms, network-permission, service-scope and customer-authorization as applicable. `editorialReview.actualOfferApproved` approves the actual catalog scope; `proposalApproved` and `metadataMatchesOffering` separately allow the supplied SEO proposal. `distinctContentApproved` and `indexApproved` allow indexing, not automatic publication of every variation.

A service additionally needs the explicit catalog service type, genuine `serviceName`, `serviceScope`, `serviceProvided`, `customerOwnedAccount`, `noAccountTransfer`, `creditsIncluded: false`, `serviceScopePermitted`, and customer/service evidence. This enables legitimate customer-owned setup/consulting without pretending that nontransferable accounts or promotional credits are being sold. A service proposal alone cannot activate this branch.

## Policy context — not seller authorization

[AWS promotional-credit terms](https://aws.amazon.com/awscredits/) restrict sale/transfer of promotional credit, with defined program/organization conditions. This does not establish which program applies to these seller references, and is not evidence of any exception for this seller. [Google Cloud's free-trial terms](https://cloud.google.com/terms/free-trial) apply eligibility and usage limitations to its trial. [Microsoft's Azure account information](https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account/) distinguishes eligible free-account benefits from pay-as-you-go billing. [SES documentation](https://docs.aws.amazon.com/ses/latest/dg/manage-sending-quotas.html) scopes sending quotas to the actual account/region. No program, quota or transfer right is inferred from these public pages.

For the other providers, obtain the actual applicable agreement, account permissions and promotion/network terms. Do not label an arrangement prohibited or authorized merely from its name. No account-specific private console or provider authorization record was available to verify.

## Reconciliation exceptions requiring human clarification

- AWS promotional-credit/program references and all trial labels: actual applicable program, ownership and transfer conditions.
- AWS Bedrock F5.2 / 4.6 / 4.7 / 4.8 / Opus 5 / Fable 5 and Azure GPT 6 Astra / High TPM T5 labels: exact service/model/region/quota records; no official model IDs have been invented.
- Google “VT Gemini AI · F5.2 and F5.2” versus proposed “Vertex AI … F5.2”: retain the original source labels; determine actual service/model scope before accepting the proposed wording.
- Hetzner “Port Limit · 50 Servers”: clarify what the label measures; do not turn it into TCP-port permissions or guaranteed server capacity.
- Port-25/IP references: provider-approved use and allocation evidence, never restriction bypass or message-delivery guarantees.
- Azure $5K reference price $7,550 and AWS $5K/$10K Bedrock references both $1,099 remain exactly as supplied. Earlier price confirmation is preserved; it is not current stock/authorization proof.
- Account-to-consulting metadata changes: confirm genuine service delivery and the price's scope; do not make a new service simply to fit keywords.

All record-level proposed/effective values and blockers are in `PRODUCT-SEO-CATALOG.json`. Full publication and indexing changes require owner review and a separate production-release approval; no new release is made by this task.
