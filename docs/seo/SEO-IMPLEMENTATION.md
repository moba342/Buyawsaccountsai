# Catalog SEO implementation

Date: 2026-11-26. Base: `a5ed490`; development branch: `seo/catalog-review-2026-11-26`. Production is unchanged for this new brief.

## Reconciliation — PASS

`product-seo-records.js` preserves all 82 supplied metadata proposals: 14 categories and 68 variations, each mapped one-to-one to an existing canonical ID. Original prices, credit face values, vCPU counts, model labels, network references and URLs remain in `catalog-data.js`/`catalog.js`; no new product or route is invented. Fifty-six proposed records describe services rather than the current account catalog. Their proposed wording is retained, not silently advertised as a genuine service.

`PRODUCT-SEO-CATALOG.json` and `PRODUCT-KEYWORD-MAPPING.csv` are generated snapshots, not a second SEO system. They include the original buying targets plus effective metadata, route, verification, publication and indexability decisions. Every proposed primary keyword has buying intent and seven supplied secondary keywords; long-tail planning targets are included without invented volumes/difficulty. Homepage intent is cross-cloud discovery; the AWS category owns the proposed broad AWS buying cluster.

## One publication policy — PASS

`offer-review-records.js` intentionally contains no approved records. `offer-publication.js` evaluates documented scope, exact price/currency, specification snapshots, real availability, supported regions, applicable quotas/models/program/network permissions, evidence references, named/date-stamped human review and editorial approval. Absent/false/malformed/stale-to-the-catalog facts cannot approve a record. Known nontransferable account/credit arrangements cannot publish as account offers.

A genuine service must be explicitly annotated as `offeringType: 'service'` in the real catalog, have a documented service name/scope and customer authorization, operate in a customer-owned account, involve no account transfer or promotional-credit inclusion/resale, and have actual permitted program/service scope. An account is never converted into a service by SEO wording alone. An otherwise legitimate account offer can use truthful account metadata while an incompatible service proposal remains held. Human approval of a metadata proposal is separate from approval of the actual offering.

Indexing also requires explicit distinct-content and indexing approval; a catalog entry is not automatically an indexable landing page. Approved out-of-stock records may remain published/indexable with honest availability, but cannot initiate checkout. No facts are inferred from a seller declaration, a keyword list, or the owner's reply “purchase/indexing.”

## Runtime integration — PASS

The same policy is consumed by SEO/JSON-LD, catalog cards, product panels, comparison actions, order dialogs, cart mutation, checkout, analytics commerce events, and the server payment entry point. Pending references cannot be newly added to cart. Existing saved selections/prices survive, can be compared, adjusted or removed, but checkout withholds wallet instructions, TXID forms and order preparation for ineligible selections. The server independently rejects pending items before RPC access; a client's `approved`/review fields cannot bypass it. Existing receipt/token/finality/amount validation is preserved for approved offers.

No database, authentication, wallet address, QR encoding or price source is changed. Real inventory/order management is not added. Prior transfers must be handled directly with the seller; there is no persistent order ledger that can safely associate a historical payment with an unpublished record.

## Page content, trust and design — PASS implementation / PENDING HUMAN REVIEW

All 68 variants receive original, individually written reference introductions addressing their actual differences: quota versus resource reservation, token/request limits, model identifiers, credit-program conditions, billing responsibility, server/Droplet/IP capacity and region-specific sending/network permission. The article structure provides configuration comparisons, specifications, requirements, billing, publication conditions, deployment/delivery questions, related references and contextual guide/help/compare links. No delivery service, quota, model access or resource availability is invented.

The fictional testimonial carousel is replaced with clearly labeled planning scenarios using the existing card/motion design. Fictional people, stock customer portraits and illustrative star ratings are no longer rendered as testimonials. The seller documentation-provider label is now explicitly seller-provided rather than “Verified”; genuine seller/contact information remains. Main branding, logos, typography, palette, header/footer, card architecture, prices and route structure stay intact. New status surfaces reuse the existing Midnight Sapphire tokens. Human approval of copy and real service claims remains required.

## SEO and structured data — PASS

The existing `seo.js` remains the only metadata/schema source for SSG and SPA navigation. Approved, matching metadata proposals can activate their exact supplied buying titles/descriptions/H1/keywords. Pending pages use neutral, unique reference metadata, self-referencing canonicals and noindex. Manual SEO overrides cannot bypass a pending publication hold.

Pending variants do not emit Product, Service or Offer markup. Pending categories do not advertise commercial ItemLists. Approved actual products use Product; documented actual services use Service; actual reviewed prices/availability drive Offer. No fabricated SKU, rating, review, partnership, stock, verification, return-policy or shipping claims are added. CollectionPage, WebPage, Organization, WebSite, BreadcrumbList and genuine guide Article data remain factual. Social images clearly label pending records and omit a purchase-price promotion while unavailable.

The generated sitemap includes only currently indexable canonical pages. With no approved catalog evidence, there are **12** indexable buyer-resource/support URLs; all 82 category/variant reference URLs remain useful 200 pages but noindex and absent from sitemap. This deliberate eligibility hold is not a ranking-improvement claim. No production deindexing is performed without a new release approval.

## Preserved technical foundation

React 19 / Vite 6 SSG and initial-route preloading, 96 complete HTML documents, three guide articles, real custom 404s, 49 permanent mappings, local optimized fonts/images, safe JSON-LD, mobile layouts, restricted API input/origin validation, and optional consent-gated analytics are reused. No dependency/framework migration or duplicate metadata generator is introduced. Report generation runs from the existing postbuild pipeline and reads the same data/policy.

## Files and owner workflow

New runtime sources: `product-seo-records.js`, `catalog-editorial-data.js`, `offer-review-records.js`, `offer-publication.js`, `CatalogPublicationNotice.jsx`. Existing SEO, content/cards, seller declaration, cart/commerce, server verifier, media generator and QA are updated. `scripts/generate-catalog-seo.mjs` creates data reports; `tests/publication.test.js` and synthetic test-only fixtures cover the policy. Exact file inventory is in `evidence/changed-files.txt`.

See the verification report for required owner records and the deployment checklist for approval. Completing a source review is not a third-party verification service; no independent certification or organic ranking is claimed.
