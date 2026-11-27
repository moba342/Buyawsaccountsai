# Homepage SEO title correction and technical validation

Date: 2026-11-27 (Asia/Dhaka).

## Finding and correction

The homepage was not missing its title tag. Production served `Buy Cloud Products & Compare Plans | BuyAWSAccountsAI`, which differed from the owner's requested AWS buying title. The development HTML fallback also used only the brand name.

The homepage now uses:

- **SEO title:** Buy AWS Accounts & Cloud Credits | BuyAWSAccountsAI
- **Description:** Buy AWS accounts and explore cloud credits, Bedrock API access, and cloud account options. Compare available plans and pricing for your cloud requirements.
- **Visible H1:** Buy AWS accounts & cloud credits.
- **Canonical:** https://buyawsaccountsai.com/
- **Robots:** index, follow

The homepage targets the combined AWS accounts/cloud credits phrase; the existing AWS category retains its more specific collection purpose and optimized URL. No product/category keywords, slugs, prices or inventory records were changed. Exact normalized primary-keyword assignments remain unique; this is not a guarantee about Google's interpretation of competing search intent.

`site-config.js` supplies the initial prerendered metadata and hydrated client metadata, including Open Graph, Twitter and WebPage JSON-LD. `index.html` now has the requested title as its fallback, too. The home hero copy and product CTA align with the current in-stock catalog. Titles are browser/search metadata; H1 is visible page content.

## Local validation

- **63 automated tests passed**, zero failed.
- Production build passed: **96 generated pages**.
- SEO artifact audit passed: **96 unique titles and descriptions**, **94 sitemap entries**, **69 social images**, valid custom 404.
- All **14 categories and 68 variations** retained their existing metadata and commercial state.
- URL audit passed: **94 indexable HTTP 200 pages**, **535 direct legacy redirects with query preservation**, **96 internal-link and schema checks**, matching served sitemap and robots.
- Homepage metadata passed with JavaScript disabled and with hydration enabled; exactly one title, description and H1.
- Marketplace navigation and browser Back restored the homepage title/social metadata without reloading the document.
- Responsive checks passed at **320, 375, 768, 1024 and 1440px**. No horizontal overflow or page errors. The homepage WCAG A/AA automated scan returned **zero violations**.

Evidence: `evidence/home-title/local/homepage.json`, `evidence/home-title/urls/validation.json`. Reusable browser audit: `scripts/qa/homepage-seo.mjs`.

## Scope and limits

Existing products, eligibility, checkout, wallets, contact links, design and optimized URL paths are preserved. Cart/checkout remain noindex; API paths remain disallowed in robots.txt. Removed policy routes remain removed.

Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**. No access, token or analytics credentials requested. Google controls search-result titles, crawling timing, rankings and indexing; site validation does not establish that Google has updated its results. No SEO score or indexing outcome is claimed.

## Production results

Source commit `242b537` was deployed and promoted to the apex production domain through the existing GitHub/Vercel workflow (`dpl_4NVtMfE9UkZtuL4nZ9jrxA5sBwdA`, READY). The live homepage browser test passed with JavaScript disabled and enabled, matching title/description/social tags, a working SPA round trip, five responsive widths, zero page errors and zero automated accessibility violations.

The live site-wide URL audit passed: 96 pages checked, 94 indexable HTTP 200 pages, all 535 direct redirects with preserved query strings, 96 internal-link/schema checks, matching sitemap and valid robots.txt. Actual evidence: `evidence/home-title/live/homepage.json` and `evidence/home-title/live-urls/validation.json`.
