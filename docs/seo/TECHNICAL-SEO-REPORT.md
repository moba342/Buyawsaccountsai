# Technical SEO report

The existing React 19/Vite 6 SSG pipeline renders 96 complete route documents plus a real custom 404. This is build-time server rendering and client hydration, not request-time SSR. Initial-route preloading, route chunks and one shared metadata/schema source remain; there is no duplicate SEO plugin or parallel sitemap generator.

Canonical URLs use HTTPS www and trailing slashes. Existing 49 permanent mappings, route names, native internal links, breadcrumbs, related product/category/guide links, real missing-route status, API security headers and payment endpoint remain. Sitemap now includes 94 public canonical URLs; all 82 catalog pages are technically indexable without commercial documents. Robots allows pages/assets and disallows API, leaving cart/checkout accessible for noindex processing.

`catalog-seo.js` is active metadata; `product-seo-records.js` is archived proposal history used only in report generation. Commercial logic no longer imports the archive, reducing unnecessary client payload. Image dimensions/alt, original 69 social images, Open Graph/Twitter tags, local optimized fonts and media generation remain. Social artwork uses listed price, not a verified-stock claim.

Search Console token support is retained in `.env.example` and the build. Use a genuine owner token or DNS verification, publish the approved version and submit `/sitemap.xml`, then inspect actual URLs. No token, property verification, indexing or analytics ID is fabricated. Optional analytics remains consent/privacy gated.

See [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) for why initial renderable content and consistent canonicals/robots matter. Technical preparation is complete without needing commercial verification.
