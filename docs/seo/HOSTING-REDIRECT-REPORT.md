# Hosting redirect audit and fix

Date: 2026-11-27 (Asia/Dhaka). Baseline production source: `7ea14d0`. Canonical origin: https://www.buyawsaccountsai.com/.

## Root cause and supported fix

The site is hosted on Vercel. The apex domain was configured at the project-domain layer to redirect every request to `www.buyawsaccountsai.com` with 308. That domain redirect ran before application routing could map an old product URL. The existing 535 application mappings also used relative destinations. Consequently HTTPS apex legacy URLs took two hops and HTTP apex legacy URLs took three.

The implemented source fix preserves every original source/path/permanent mapping (a SHA-256 baseline contract is tested), while changing each destination to its absolute final HTTPS www URL. Ninety-six apex-host rules cover canonical pages directly, and one apex-only fallback covers other paths/assets. Total: 535 preserved mappings + 97 host-only rules = 632 rules. The fallback is last, applies only to the apex host, and cannot loop on www. Public page paths, SEO metadata, data, prices, payment logic and commercial eligibility are unchanged.

The domain-level apex redirect must be cleared **only after** these rules are deployed. The apex remains attached to the same production project with its verified domain and valid certificate; DNS is not changed. Hosting/API access is available, so a manual login/configuration request is not required.

## Mandatory platform limit — not claimed resolved

Vercel performs an unconditional HTTP-to-HTTPS upgrade on the requested hostname before application rules. A literal HTTP apex root therefore still needs two hops: HTTP apex -> HTTPS apex -> HTTPS www. HTTP legacy paths also need that mandatory upgrade before their single canonical redirect. Disabling HTTPS/HSTS or adding another application rule cannot remove this platform first hop.

Sources: [Vercel Encryption and TLS](https://vercel.com/docs/cdn-security/encryption), [Vercel staff explanation of HTTP/www redirect order](https://community.vercel.com/t/redirects-from-http-www-to-non-www-on-https/8374/2), [Vercel project-domain update API](https://vercel.com/docs/rest-api/projects/update-a-project-domain).

The requested one-hop HTTP-apex root is **not marked resolved**. Strict one-hop HTTP apex would require Vercel-supported edge behavior outside normal project rules or an additional fronting redirect layer; no DNS/proxy migration is introduced for this task. The independently fixable HTTPS cross-host legacy chain is validated separately.

## Pre-release checks

- All 57 automated tests passed, including preservation of all 535 baseline mappings and the host-conditional rules.
- Production build/SEO artifact validation passed: 96 pages, 94 sitemap URLs, 69 social images, unique titles/descriptions and unchanged indexing/commercial separation.
- Local real HTTP Host-header simulation checks all 535 mappings on both apex and www, all 96 apex canonical redirects and all 96 www final pages. Query parameters are preserved.
- Protected Vercel preview validated all 535 legacy redirects and six canonical-page responses. Unauthenticated access stayed protected. The temporary preview test credential was revoked and original deployment protection verified unchanged.
- No application catalog, price, payment, cart, commercial approval, style or database record is changed.

## Deployment and actual live validation

PREPARED — production deployment, domain setting change and measured after-fix hop counts will be recorded here only after actual verification. Local/preview checks are not substituted for live results.

Evidence: `evidence/hosting-redirects/domains-before.json`, `before-live.json`, `preview.json`, `preview-cleanup.json`, `local-host-audit.json`, and local URL/commerce reports. Baseline, after-domain configuration, TLS certificates and full live host matrix will be retained in this folder.

## Release sequence and rollback

1. Deploy the tested rules through existing GitHub main/Vercel production workflow. Leave the old domain redirect active during this build.
2. Verify the new production deployment is READY and its www canonical/legacy routes work.
3. Update only the apex project's domain redirect target to null (keep the domain attached/verified, production environment unchanged). No DNS records are edited.
4. Verify all 535 mappings on both real HTTPS hosts, all 96 canonical-page host cases, query strings, SSL certificates, sitemap/canonicals, 404 and retained product/checkout behavior. Record actual HTTP traces and remaining platform limits.
5. If canonical routing fails, restore the apex domain redirect to `www.buyawsaccountsai.com` with status 308 and retain the previous production deployment for rollback. Restore the domain redirect before rolling back to code without host rules, avoiding an apex duplicate-content window.

For a manual rollback if API access is unavailable: Vercel dashboard -> project `buyawsaccountsai` -> Settings -> Domains -> `buyawsaccountsai.com` -> Edit -> redirect to `www.buyawsaccountsai.com` -> permanent 308 -> Save. Do not edit A/CNAME/DNS records. No Search Console access or verification credentials are required.

Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**; unrelated to the routing fix.
