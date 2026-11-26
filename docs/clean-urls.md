> The subsequent [keyword URL mapping](seo/SEO-URL-MAPPING.md) controls catalog public paths. Utility paths described below are retained.

# Clean page URLs

Main navigation uses `/marketplace/`, `/cloud-platforms/`, `/compare-products/`, `/buying-guides/`, `/help-center/`, and `/contact-sales/`. The root `/` remains the homepage. Provider pages use paths such as `/aws-accounts/`; individual variants use paths such as `/product/aws-free-trial/`.

Internal navigation uses browser history without reloading the application. Old route hashes are converted to the matching clean path on load or hash navigation. In-page anchors remain supported. Canonical URLs follow the current page. Vercel rewrites serve the React app for direct visits and refreshes; trailing slashes are normalized by the host.

Validation: production build; 71 direct page routes; refresh and history navigation; legacy hash migration; canonical links; existing keyboard/order/search/comparison interactions; 200% text scaling; accessibility scans.
