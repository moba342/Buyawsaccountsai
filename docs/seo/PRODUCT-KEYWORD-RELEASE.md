# Product keyword SEO implementation — 2026-11-27

Scope: 14 existing category pages and 68 existing variation pages. Source of truth: existing catalog, prices, primary keywords and publication controls. No URLs, product records, commercial eligibility, payment integrations or visual design tokens were changed.

## Implemented

- Complete assigned buying keywords in titles, descriptions, H1, existing keyword-based URLs, new opening paragraphs, descriptions, contextual links and social metadata.
- Six assigned secondary keywords per catalog page distributed across introductory copy, specification headings, pricing, comparison content and purchase FAQs. Provider-specific guidance and distinct existing variation descriptions retained.
- One page-specific compatibility meta-keywords tag from primary and secondary data in generated HTML and React navigation. This supersedes older instructions that removed this tag. It is not treated as a Google ranking factor.
- Build-generated 82-row audit, CSV mapping and JSON validation, including preferred primary-cluster URLs for the homepage, marketplace, platform directory, catalog and guides. No new landing pages or routes.
- Existing canonical, sitemap, breadcrumb and structured-data systems reused. Pending listings continue without Offer, inventory or rating claims.

## Local actual results

- Unit tests: 58 passed, 0 failed. No separate lint or type-check commands are configured in package.json.
- Production build and artifact SEO validation: passed; 96 prerendered pages, 94 sitemap entries and 69 social images.
- URL validation: 96 pages; 94 indexable HTTP 200 pages; all 535 original permanent redirects direct to canonical destinations and preserve query parameters.
- Browser keyword validation: 82/82 passed. All descriptions 140–160 characters; 81 titles 50–60 characters. One 75-character title preserves its existing full technical buying keyword instead of truncating it.
- Browser technical audit: no reported JavaScript errors, overflow, heading problems, orphan pages or accessibility violations in its tested routes and viewport matrix. Sitemap and robots passed.
- Commerce regression: 68 pending variations remain disabled, saved cart retained, checkout withheld, API rejects pending records; comparison, contact, guides and mobile menu passed; four accessibility scans had no violations. No transactions initiated.

Evidence: [baseline browser audit](evidence/product-keywords/before.json), [source browser audit](evidence/product-keywords/source.json), [technical browser checks](evidence/product-keywords/technical/technical-qa.json), [commercial regression](evidence/product-keywords/technical/publication-ui.json).

## Exceptions and limits

The 75-character title is the AWS 1920 vCPU / 10K RPM / high TPM / model-list variation, recorded explicitly in the audit. Approximate title length is an editorial target, not a guarantee about search result display.

All 82 catalog pages are technically indexable; this does not approve purchases or assert Google indexing. Exact duplicate metadata and primary-cluster conflicts are checked; shared buyer guidance and semantic ranking competition cannot be ruled out by a string-match test. No search volume, rankings, field Core Web Vitals or independent product verification is claimed.

Google Search Console: **PENDING - MANUAL SETUP BY WEBSITE OWNER**. Owner can submit `/sitemap.xml` after connecting the canonical HTTPS www property; credentials are not required for this implementation.

Google documents [meta-keywords behavior](https://developers.google.com/search/docs/crawling-indexing/special-tags), [title links](https://developers.google.com/search/docs/appearance/title-link) and [description snippets](https://developers.google.com/search/docs/appearance/snippet). Browser laboratory performance measurements do not establish field INP or Google indexing.

## Production

Deployment and live validation results will be appended after the release completes. Existing hosting limitation remains: HTTP apex requests first receive Vercel's same-host HTTPS upgrade, followed by canonical-host normalization. HTTPS legacy redirects remain direct; no DNS or hosting rules were modified in this keyword release.

## Live deployment and validation

Production commit: `dd812b117c39ffa27ca55ab0235b64ab94260b17`. Vercel deployment: `dpl_EV2xwbV6meSMn1THJ64NipZ8xxow`, Ready, production; canonical www and apex aliases attached. [Deployment evidence](evidence/product-keywords/deployment.json).

- [Live catalog DOM/SSR audit](evidence/product-keywords/live.json): **82/82 passed**, no browser JavaScript errors. All primary placements, all six secondary targets per record, canonical/robots/social consistency, metadata hydration and contextual incoming buying-keyword links passed. The same one 75-character title exception remains disclosed.
- [Live URL validation](evidence/product-keywords/live-technical/validation.json): **96 pages**, **94 indexable HTTP 200**, **535 direct permanent redirects**, **535 query-preservation checks**, 96 schema checks; no errors.
- [Live commerce regression](evidence/product-keywords/live-technical/publication-ui.json): all 68 held variation pages retain disabled purchase actions; saved cart and API rejection retained. Four accessibility scans reported no violations, no JavaScript errors. No real payment was sent.
- Cross-host sample: `https://buyawsaccountsai.com/aws-accounts/?source=keyword-audit` → canonical `/buy-aws-accounts/?source=keyword-audit`, **one hop**, final 200. HTTP apex root → canonical HTTPS www, **two hops**, final 200, the documented Vercel upgrade limitation. Existing hosting policy and 535 mappings remain unchanged.

### Measured before/after

| Check | Before live release | After live release |
| --- | ---: | ---: |
| Titles missing complete primary keyword | 10 | 0 |
| Descriptions missing complete primary keyword | 82 | 0 |
| Titles outside 50–60 target | 67 | 1 disclosed exception |
| Descriptions outside 140–160 target | 11 | 0 |
| Missing requested compatibility keyword tag | 82 | 0 |

[Measured comparison](evidence/product-keywords/before-after.json). These are implementation checks, not ranking or indexing scores.

## Live laboratory performance

Lighthouse 12.8.2, mobile and desktop presets on the canonical live homepage and AWS 8 vCPU variation. One run per page/device; laboratory measurements vary and do not establish field INP, CrUX status or a sustained frame-rate guarantee.

| Page / preset | Performance | Accessibility | Best practices | Lighthouse SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home-mobile | 97 | 100 | 100 | 100 | 2.29s | 0.000 | 26ms |
| product-mobile | 98 | 100 | 100 | 100 | 2.15s | 0.000 | 0ms |
| home-desktop | 100 | 100 | 100 | 100 | 0.52s | 0.000 | 0ms |
| product-desktop | 100 | 100 | 100 | 100 | 0.49s | 0.000 | 0ms |

[Measured metrics and failing audit diagnostics](evidence/product-keywords/lighthouse.json). Lighthouse SEO is a limited technical checklist, not a ranking prediction. Field Core Web Vitals remain unmeasured until real-user data is available.

## Release checklist and remaining issues

- [x] Review all 14 category and 68 variation source records and actual initial/hydrated HTML.
- [x] Test unique buying metadata, visible placements, secondary terms and preferred primary-cluster URLs.
- [x] Pass unit tests, production build, generated artifacts and URL validation.
- [x] Deploy through the existing GitHub main → Vercel production workflow; verify Ready deployment and canonical aliases.
- [x] Verify all 82 actual live catalog records, all 535 canonical-domain legacy redirects, query preservation and live schema/canonical/robots metadata.
- [x] Confirm live cart/checkout commercial safeguards and unchanged catalog/payment data.
- [x] Measure live homepage and representative product mobile/desktop laboratory performance.
- [ ] Owner connects Google Search Console and submits the existing sitemap: **PENDING - MANUAL SETUP BY WEBSITE OWNER**.

Known remaining limits: one full-keyword title exceeds the approximate 60-character target; Vercel's existing HTTP apex upgrade adds a documented extra hop; field Core Web Vitals, real indexing, rankings and semantic cannibalization cannot be established by these implementation tests. No catalog page has been deliberately excluded from technical indexability by this change, and no held commercial offer has been activated.

Final [live browser technical audit](evidence/product-keywords/live-technical/technical-qa.json): **96 raw pages, 96 hydrated pages, 268 responsive views, 14 accessibility scans, 194 internal-link targets, 85 images, 535 redirects and 94 sitemap URLs** checked. No JavaScript errors, horizontal overflow, accessibility violations, orphan pages or heading-hierarchy issues were reported in the tested matrix. Robots and absence of unconfigured analytics requests passed. Responsive widths tested: 320, 375, 390, 414, 768, 1024, 1440 and 1920 pixels, with additional catalog coverage defined in the audit script.

[File-contract evidence](evidence/product-keywords/preserved-contracts.json) verifies that catalog data, payment configuration, commercial gates, Vercel redirect configuration and the original redirect policy are byte-for-byte unchanged from `c1ea091`. [Command results](evidence/product-keywords/automated-tests.json) record the actual local build/test checks. Production source remains `dd812b1`; this documentation-only evidence update is saved separately so the tested deployment is not replaced unnecessarily.
