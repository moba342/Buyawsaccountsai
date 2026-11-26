# Product availability and purchasing update

Date: 2026-11-27 (Asia/Dhaka).

## Inventory source and activation

The website owner confirmed all 14 categories and 68 variations are in stock. `inventory.js` records that merchant declaration for each stable product ID, dated 2026-11-27. It does not assert independent verification, provider endorsement, numeric stock quantities, or automatic fulfillment.

All 68 variations use their unchanged selling prices from `catalog-data.js` → `catalog.js`. All 14 collections derive publication from active child products. Their buying keywords, canonical paths, SEO titles, meta descriptions and product specifications remain unchanged.

The previous empty `publicationReviews` registry was the cause of catalog-wide disabled purchasing. Mandatory document references, dated human/editorial reviews, category sign-offs and separate price-approval snapshots are no longer prerequisites for standard inventory management. Legacy records remain optional overrides, never mandatory approvals. SEO readiness remains independent of sales eligibility.

## Standard controls

| Control | Behavior |
| --- | --- |
| `inventory.js`: `availability` | `InStock` and `LimitedAvailability` enable purchasing. `OutOfStock`, `PreOrder` and `BackOrder` do not enable purchasing. Unknown states fail closed. |
| `inventory.js`: `saleEnabled` | `false` pauses sales without removing product information or changing SEO URLs. Missing product inventory defaults to unavailable. |
| `offer-publication.js` | Explicit resale/transfer prohibitions, non-transferability, program/network restrictions, disputed model/quota facts, and malformed restriction flags block sale. |
| Services | An account is never silently converted into a setup/consulting service. Explicit customer-account and actual service-scope conditions are still required for a service record. |
| `purchase-state.js` | Shared stock, price, Add to Cart and Buy Now labels. Active stock displays **In Stock**, not a verification claim. |
| `cart.js` | Uses catalog IDs/prices, bounded integer quantities, and shared eligibility checks. Saved unavailable items cannot bypass checkout restrictions. |
| `CommercePages.jsx` | Eligible products show checkout and the existing TRC20, BEP20 and ERC20 payment controls. Unavailable selections withhold payment controls. |
| `server/payment-verifier.js` | Rechecks SKU eligibility and catalog totals on the server before RPC. Client approval flags and prices are not trusted. |
| `seo.js` | Product Offer price and availability use the same state as the visible UI. Canonical URLs and indexing are independent of inventory. No invented ratings or certifications. |

To change stock, update a product's `inventory.js` entry and deploy. Set `saleEnabled: false` to pause it. Optional known restrictions can be recorded under the same stable ID in `offer-review-records.js`; do not store credentials there. This is static merchant-managed inventory, not a live stock-counting admin system.

## Customer flow and remaining limits

Available product → Add to Cart or Buy Now → Cart/Checkout → select USDT network → send payment using the existing wallet/QR → enter TXID → check finalized transfer → send order details to seller → seller matches payment and arranges delivery.

The API checks the configured USDT contract, selected chain, receiving wallet, cart amount and chain finality. It does **not** establish who owns a public TXID, prevent transaction reuse across orders, reserve inventory, create a durable paid order, or deliver private credentials.

No private backend, order database, payment-claim ledger or actual credential/access inventory has been supplied or configured. Automatic order acceptance and automatic product access therefore remain **not implemented**. The UI retains the explicit order-request and seller delivery flow instead of presenting a browser-generated receipt as a completed paid order. No payment or real product delivery is executed during testing.

The previously removed Payment & Refund Policy page and retired URLs remain removed. This release does not recreate a policy or promise new refund conditions. Existing written-order guidance is preserved. Google Search Console remains **PENDING - MANUAL SETUP BY WEBSITE OWNER**.

## Validation

- Automated tests: **62 passed, 0 failed**. Coverage includes stock transitions, merchant sale pauses, explicit provider restrictions, server rejection before RPC, client approval spoofing, token/recipient/chain/amount/finality checks, SEO independence and canonical migration.
- Production build: **passed**; 96 generated pages.
- SEO artifact validation: **passed**; 96 unique titles/descriptions, 94 sitemap URLs, 69 social images.
- Local URL validation: **passed**; 94 indexable HTTP 200 pages, 535 direct legacy redirects with query preservation, 96 internal-link and schema checks, matching sitemap and robots.
- Rendered component tests: **passed**; stock states, disabled-product exclusion from collection prices, cart/checkout rendering and out-of-stock checkout hold.
- Local browser purchasing: **passed** for 68 product pages (Buy Now dialogs and Add to Cart), 14 categories, all 68 cart/checkout lines and all three network wallets/QR codes.
- Responsive validation: **18 views passed** at 320, 375, 768, 1024, 1440 and 1920 px; no horizontal overflow. Six WCAG A/AA automated scans found **0 violations**, with **0 page errors**.
- Catalog keyword DOM validation: **82/82 passed**.
- No real payments submitted. Live release results follow below.

Machine-readable audit of all 82 catalog records: `PRODUCT-AVAILABILITY-UPDATE.json`. Browser source: `scripts/qa/inventory-purchasing.mjs`. Evidence: `evidence/inventory/`.
