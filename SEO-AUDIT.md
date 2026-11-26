# Initial technical SEO audit

Date: 2026-11-26 (Asia/Dhaka). Baseline commit: `89d09ac`. Production: https://www.buyawsaccountsai.com/.

## Architecture and scope
- React 19 / Vite 6 client-rendered application; custom History API routing and Vercel static rewrites. No Next.js migration is needed.
- 93 generated metadata documents: homepage + 92 application routes (68 product variants, 14 provider collections, 10 general/commerce pages). Cart and checkout are noindex. Three buying guides currently open in a modal, without independent article URLs.
- `catalog-data.js` is the seller-supplied source of products/prices. The catalog advertises reference prices and asks buyers to confirm availability. There is no authoritative stock feed or confirmed-offer record.
- USDT transfer verification is a serverless API, with server-derived catalog amounts and fail-closed tests. Customer contact details remain in the tab until manually copied. No authentication/database or order-fulfillment system is present.
- Existing SEO is centralized in `seo.js` and generates static heads, canonical metadata, a 91-URL sitemap, robots.txt and basic Organization/WebSite/WebPage JSON-LD. Important body content is not prerendered.

## Initial findings

| Priority | Finding | Evidence and planned action |
| --- | --- | --- |
| Critical | Important public content depends on JavaScript | Raw production homepage has no H1 or product text. Add Vite/React build-time rendering and hydration for public routes. |
| High | Metadata/H1 do not match the new brief; obsolete meta keywords exist | Replace with exact requested page-level titles/descriptions/H1; remove keyword tags. |
| High | Guide content requires opening a modal | Publish the three existing, distinct guide articles at canonical article URLs; preserve their actual content. |
| High | Hero/profile and logo image payloads are oversized | Original portrait ~1.9 MB; header artwork ~680–856 KB. Generate responsive WebP variants and prioritize only actual above-fold images. |
| High / manual | Privacy, Terms and Refund policy routes/content are absent | Do not invent legal policies. Document the owner-supplied policy information needed. Existing product copy asks buyers to confirm terms. |
| High / manual | Product availability and binding offers are not known | Generate factual Product records; do not invent InStock, SKUs, GTINs, reviews or merchant offers. Document missing data for rich-result eligibility. |
| Medium | Breadcrumb structured data is absent and visible trails are incomplete | Generate canonical, matching visible trails and BreadcrumbList data. |
| Medium | Social images are a generic wide logo | Generate branded 1200×630 fallback and product-specific artwork from the actual catalog. |
| Medium | Secondary page code is bundled into initial app code | Introduce route-level lazy loading while retaining prerendered public content. |
| Medium | Generic client fallback renders a marketplace for missing paths | Production HTTP status already returns genuine 404. Add a useful prerendered 404 and correct client error state. |
| Medium / manual | Retired Alibaba/Atlantic entries redirect to broad collections | Preserve existing backlinks pending owner/Search Console evidence; record this review requirement rather than guessing a 410 or unrelated replacement. |
| Low / manual | Search Console verification and analytics IDs are not configured in inspected public configuration | Add opt-in environment support and documented setup; do not fabricate tokens or claim submission. |
| Low | No explicit availability field, manual SEO override model or analytics consent integration | Add optional fields/hooks without changing existing seller-supplied catalog values or enabling unconfigured trackers. |

## Baseline HTTP observations (actual production requests)
- Preferred HTTPS/www homepage: 200; HSTS present.
- HTTP www → HTTPS www: 308.
- HTTPS apex → HTTPS www: 308.
- `/does-not-exist/` and `/product/does-not-exist/`: genuine HTTP 404.
- `/MARKETPLACE/`: HTTP 404, not an indexable duplicate.
- Existing seven legacy page redirects and canonical route structure are already deployed. Preserve them.
- Raw homepage includes obsolete `meta keywords`; important body content is empty before JavaScript.

## Implementation plan
1. Update centralized SEO/structured data, route metadata, breadcrumbs, guide URLs, Search Console settings and exact requested H1s.
2. Add build-time React/Vite rendering, truthful product/collection schemas, social assets, responsive images, custom 404 and route splitting.
3. Add consent-gated analytics support for genuine available events; preserve payment verification and avoid purchase events without a verified order system.
4. Validate raw/rendered HTML, links/statuses, metadata/schema/XML, all required viewport widths, accessibility, cart/checkout and Lighthouse. Produce the five requested reports and a production approval checklist.

Production deployment is on hold per the attached brief. Work occurs on `seo/technical-audit-2026-11-26`; no production deployment or main-branch push is authorized for this brief.

## Measurement notes
Lighthouse baseline is collected before implementation under ignored `.qa-seo/`; compact evidence is retained in `seo-evidence/`. These are laboratory measurements; no CrUX/Search Console field data or indexing status is available. Add actual measured results to the validation report, without promising rankings or field thresholds.

## Final HTTP follow-up

A four-origin HEAD trace confirmed the preferred origin returns 200; HTTP www and HTTPS apex each redirect once. HTTP apex currently takes two hosting-managed 308 hops (HTTPS apex, then HTTPS www). This is a **Low Priority / MANUAL ACTION REQUIRED** hosting normalization review after release approval; it is not an application-route loop or indexable duplicate. All application links/canonicals use the preferred HTTPS/www URL directly. Evidence: `seo-evidence/production-baseline-http.json`.
