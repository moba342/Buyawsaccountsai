# Payment & Refund Policy page

URL: https://buyawsaccountsai.com/payment-refund-policy/

Added a responsive policy page using existing Midnight Sapphire tokens and typography. Linked from the global footer and every checkout state. Payment-network labels derive from the existing paymentMethods data; wallet addresses, transaction verification and commercial publication controls are unchanged.

No specific refund window, eligibility list, processing SLA or network-fee rule was supplied after clarification. The page therefore follows the store's existing written-order-terms approach: confirm conditions before payment, keep order/TXID records and contact support for a review. It does not promise automatic refunds or invent a time limit. Owner-supplied specific terms can later be added to refund-policy.js; incomplete specific terms are not rendered as a finished policy.

The route has initial server-generated HTML, a canonical non-WWW URL, metadata, breadcrumbs and sitemap inclusion. Site totals become 97 canonical pages / 95 indexable sitemap entries. All 535 original source→destination-path mappings retain their SHA-256 contract; two additional policy slash/index aliases bring path redirects to 537. WWW-only rules remain conditional on the noncanonical host.

Local checks:
- 60 unit tests passed; production build and SEO artifact validation passed.
- 97 pages, 95 indexable 200s, 537 direct redirects/query-preservation cases and 97 schema/internal destinations passed URL validation.
- Policy checked at 320, 375, 768, 1024 and 1440px: no overflow or JavaScript errors; two automated accessibility scans had no violations. Footer and checkout link navigation passed.
- Existing cart/checkout publication regression passed for all 68 held variants; four further accessibility scans had no violations. No payment or order was sent.

Evidence: docs/seo/evidence/payment-refund-policy/local/. Deployment/live checks are recorded below after actual completion.
