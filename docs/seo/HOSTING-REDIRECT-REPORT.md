# Hosting redirect fix — actual production results

Date: 2026-11-27 (Asia/Dhaka). Baseline: production `7ea14d0`. Preferred canonical origin: https://www.buyawsaccountsai.com/.

**Supported HTTPS cross-host fix: DEPLOYED AND LIVE-VERIFIED.**

**Requested one-hop HTTP apex root: NOT RESOLVED — current Vercel TLS upgrade still requires two hops.** This remaining platform behavior is not hidden or marked successful.

## Root cause

Vercel's project-domain configuration redirected all apex requests to the same path on www before the application could resolve a legacy URL. The 535 application redirects also used relative destinations. Thus an HTTPS apex legacy URL took two redirects, and HTTP apex legacy URLs took three.

## Implemented fix and actual deployment

- Preserved every one of the **535 original source/destination-path/permanent mappings**. A normalized baseline SHA-256 contract is enforced by tests.
- Changed those destinations to absolute final `https://www.buyawsaccountsai.com/...` URLs, so they work directly on either HTTPS host.
- Added 96 apex-only canonical-page redirects and two apex-only fallbacks (slash and non-slash), for **633 rules total**. All are permanent 308s; www does not match the host-only rules.
- Deployed these rules first, validated www, then cleared only the apex domain's project-level redirect target. The domain stayed attached to the same production project and verified, with valid TLS. No DNS records were changed.
- Live testing found Vercel required a separate slash-ending fallback for unknown apex paths; that correction was deployed and the full audit rerun successfully. Unknown paths now canonicalize to www and then return an intentional noindex 404.
- Deployment protection was preserved. A temporary protected-preview test credential was revoked after preview validation; no temporary bypass remains.

Final application source: `c1ea091f532b18dee68bf2fa261dee583db5ed49`. Vercel deployment: `dpl_FUjNRwNgCuVb1JNerSgrqQdJL4FX`, **READY**, production target, https://buyawsaccountsai-qdrm56o7y-mo-ba2.vercel.app. Main is synced to this source. Earlier `dc3fb49` was the initial host fix; `c1ea091` adds the verified trailing-slash fallback.

## Actual before/after hop counts

Counts are fresh server redirects, excluding the final response. Query strings are omitted from the table for readability; preservation was tested explicitly.

| Starting URL | Before | After | Result |
| --- | ---: | ---: | --- |
| http://buyawsaccountsai.com/ | 2 | 2 | Platform TLS limit remains |
| https://buyawsaccountsai.com/ | 1 | 1 | Preserved; verified final 200 |
| http://www.buyawsaccountsai.com/ | 1 | 1 | Preserved; verified final 200 |
| https://www.buyawsaccountsai.com/ | 0 | 0 | Preserved; verified final 200 |
| http://buyawsaccountsai.com/aws-accounts/ | 3 | 2 | Improved; verified final 200 |
| https://buyawsaccountsai.com/aws-accounts/ | 2 | 1 | Improved; verified final 200 |
| https://buyawsaccountsai.com/product/aws-8-vcpu/ | 2 | 1 | Improved; verified final 200 |
| https://buyawsaccountsai.com/buy-aws-accounts/ | 1 | 1 | Preserved; verified final 200 |

Example now verified live:

`https://buyawsaccountsai.com/product/aws-8-vcpu/` → **308** `https://www.buyawsaccountsai.com/buy-aws-8-vcpu/` → **200**.

HTTP apex legacy URLs improve from three redirects to two: Vercel's mandatory same-host HTTPS upgrade, then a direct final canonical redirect. HTTPS apex legacy URLs improve from two to one. HTTP www root already takes one hop; canonical HTTPS www pages take zero.

## Actual tests and validation

- **57/57 automated tests passed**, plus production build and SEO artifact validation. Vercel's production build completed READY. No lint/type-check configuration exists; no false pass is claimed.
- All **535 preserved mappings** tested on both real HTTPS hosts: **1070 successful direct redirects** to final canonical 200s.
- All **96 apex canonical pages** redirect once to www; all **96 www canonical pages** return direct 200.
- **1166 redirect cases** explicitly preserved the encoded query string, plus both fallback cases. All 20 full HTTP/HTTPS traces also preserved their original query strings. No loop or unexpected extra HTTPS application hop was found.
- Fallback checks: apex favicon redirects to www and returns 200; unknown slash-ending apex path redirects to www and returns a genuine 404.
- Live metadata/URL validation: **96 pages**, **94 indexable direct 200s**, **535 original mappings**, **96 distinct canonical internal destinations**, **96 matching canonical/OG/JSON-LD graphs**, no errors.
- Live product checks passed for **68 variants**: pending purchases remain disabled, saved carts/quantities retained, checkout held appropriately, API rejects pending items, comparison/contact/guide/mobile navigation working. Four live commerce axe scans had no violations. No real payment/order was created.
- Protected preview passed all 535 legacy mappings and six canonical-page checks before production. Preview was still protected without its temporary credential; that credential has been revoked.

## SSL and indexability

Both actual TLS handshakes used strict certificate verification and the correct SNI hostname:

| Host | TLS authorization | Certificate valid until |
| --- | --- | --- |
| buyawsaccountsai.com | PASS | Feb 22 21:12:14 2027 GMT |
| www.buyawsaccountsai.com | PASS | Feb 22 21:12:09 2027 GMT |

No SSL certificate issue was observed. Eligible apex page URLs are redirects, so they do not create a second indexable set. Preferred www pages retain their correct canonicals, metadata, structured data and 94-URL sitemap. Cart/checkout stay noindex; unknown pages return real noindex 404s. No indexing by Google or ranking outcome is claimed.

All 14 categories, 68 variants, assigned keyword paths, existing catalog/prices, payment/checkout logic, commercial publication state and design are preserved. Sixteen application/data/style/lock files were compared byte-for-byte against baseline `7ea14d0`; they are unchanged. No application database writes were performed. Commercial offers/purchases remain held exactly as before; no availability or authorization claims were invented.

## Remaining HTTP limitation — explicitly not resolved

On this Vercel deployment, HTTP is upgraded to HTTPS on the **same hostname before project/application redirects run**. Therefore:

`http://buyawsaccountsai.com/` → 308 `https://buyawsaccountsai.com/` → 308 `https://www.buyawsaccountsai.com/` → 200.

The requested one-hop HTTP apex root remains **two hops**, verified in the final live trace. There is no demonstrated project-level redirect rule that can run ahead of this platform TLS upgrade. HTTPS/HSTS were not disabled, and no speculative DNS/proxy change was made to disguise the limit.

Sources: [Vercel Encryption and TLS](https://vercel.com/docs/cdn-security/encryption) and [Vercel staff explanation of the redirect order](https://community.vercel.com/t/redirects-from-http-www-to-non-www-on-https/8374/2). The separately fixable HTTPS legacy chain is now eliminated.

If strict single-hop HTTP apex is mandatory, provide Vercel support with the recorded trace and ask whether a supported account/CDN-layer setting can combine TLS and host normalization before application routing. Otherwise it requires a fronting redirect service/architecture change, which was not introduced here. This is a platform limitation, not missing manual account access. No Google Search Console credentials are required.

## Hosting configuration, manual recovery and rollback

Authenticated Vercel API access was available, so no manual access was required. Only the apex domain's `redirect` target was cleared through the [project-domain API](https://vercel.com/docs/rest-api/projects/update-a-project-domain); domain verification, attachment, DNS and unrelated deployment aliases were preserved. The before/after domain snapshots are retained.

To inspect manually: Vercel dashboard → project `buyawsaccountsai` → Settings → Domains → `buyawsaccountsai.com` → Edit. The apex should connect to the production project/environment rather than use a blanket redirect. Confirm www is also on production. **Do not edit A/CNAME/DNS records for this fix.** Keep the host rules deployed before clearing the blanket domain redirect.

For rollback to code without these host rules, first restore the apex domain redirect to `www.buyawsaccountsai.com` with permanent 308, then roll back the production deployment. The previous application deployment is `dpl_7GW9kvg1JQeAXTKurqQBzHVFojLE` (source `7ea14d0`). This order prevents apex pages from becoming duplicate indexable content. A rollback restores the old extra legacy hop as well.

## Evidence and handoff

`evidence/hosting-redirects/` contains `domains-before.json`, `domains-after.json`, `before-live.json`, `live-host-audit.json` (full hop traces and TLS results), `deployment.json`, `preview.json`, `preview-cleanup.json`, local host simulation, and live URL/commerce evidence. Re-run `npm test`, `npm run build`, `npm run validate:seo`, then `node scripts/qa/hosting-redirects.mjs` for actual public-host validation. Local simulation uses `HOST_AUDIT_MODE=local` with the production-like preview.

Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**. No verification credentials were requested. This status is unrelated to the hosting fix and is not a technical SEO failure.
