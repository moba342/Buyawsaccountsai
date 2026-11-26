# Buyawsaccountsai

# Cloudlane — Cloud Account Storefront

Responsive React storefront with a Midnight Sapphire Navy theme with soft white surfaces and a midnight footer, 68 product variants across 14 providers, and original provider logo assets stored locally.

## Links

- Website: https://cloudlane-market-mobarak.giftedcondor8.chatgpt.site
- Products: https://cloudlane-market-mobarak.giftedcondor8.chatgpt.site/#products
- Providers: https://cloudlane-market-mobarak.giftedcondor8.chatgpt.site/#providers
- Compare: https://cloudlane-market-mobarak.giftedcondor8.chatgpt.site/#compare
- Guides: https://cloudlane-market-mobarak.giftedcondor8.chatgpt.site/#guides
- FAQ: https://cloudlane-market-mobarak.giftedcondor8.chatgpt.site/#faq
- Contact: https://cloudlane-market-mobarak.giftedcondor8.chatgpt.site/#contact
- Telegram: https://t.me/dexterw4tts
- Support email: dexter-watts@buyawsaccountsai.com

The current Sites publication is private and may require the owner's sign-in.

## Run locally

Install Node.js 22 LTS or a compatible current LTS version, then run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Production build

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host such as Vercel, Netlify, Cloudflare Pages, or another static server. Use `npm ci` as the install command and `npm run build` as the build command. Hash-based routes preserve direct links without requiring server rewrites. The site expects deployment at the domain root.

The `.openai/hosting.json` file records the existing Sites project identity and `dist` output directory. It contains no credentials and is not required by other static hosts. GitHub source updates alone do not update the existing Sites publication.

## Features

- Product catalog with provider filters and search.
- Twelve provider pages and 68 individual product variant pages.
- Custom themed dropdowns with keyboard controls and live variant prices.
- Side-by-side comparison of up to three variants.
- Buying guides and expandable FAQs.
- Contact cards with Telegram, email, and Google Maps links.
- Smooth button feedback and an infinitely scrolling provider logo strip.
- Responsive mobile, tablet, and desktop layouts; reduced-motion support.
- Buy Now opens the package selector, with Add to cart and Checkout actions.

## Project files

| File | Purpose |
| --- | --- |
| `HomePage.jsx` | Redesigned homepage, provider directory, searchable catalog, and buying process |
| `homepage.css` | Homepage illustration, responsive layouts, typography, and animations |
| `src.jsx` | App, navigation, catalog, comparison, guides, FAQ, and order dialogs |
| `catalog.js` | All provider definitions, variants, reference prices, and product features |
| `DetailPages.jsx` | Provider and individual product detail pages |
| `ContactPage.jsx` | Contact information and contact links |
| `VariantSelect.jsx` | Custom themed variant dropdown |
| `ProviderLogo.jsx` | Logo asset mapping and reusable logo component |
| `ProviderStrip.jsx` | Continuously scrolling provider logo strip |
| `style.css` | Base styles, responsive layouts, and motion |
| `theme.css` | Midnight Sapphire design tokens and surface styles; preserves layout and typography |
| `public/logos/` | Locally hosted provider logos |
| `index.html` | HTML entry point and metadata |
| `package-lock.json` | Reproducible dependency versions |

Update `catalog.js` to edit prices, product names, providers, and features. Related provider counts, minimum prices, and variant routes are derived from that data. Update contact information in `ContactPage.jsx` and `src.jsx`.

## Current purchase flow

This storefront has a server-side blockchain transaction checker, with no custodial payment processor, automated account fulfillment, backend order storage, or email delivery service. The cart persists package IDs and quantities in local storage. Checkout prepares a copyable order request with USDT TRC20, BEP20, or ERC20 instructions; customers send the request to the seller on Telegram and confirm final pricing, availability, provider eligibility, delivery, and terms. TXIDs are checked against finalized on-chain receipts. A confirmed transfer is not an automatic order allocation: the seller matches the TXID to the buyer and arranges delivery. Public RPC defaults require no credentials; optional server-only RPC settings are documented below.

## Content and asset references

- Product variants and listed USD prices: https://buyawscredit.vercel.app/
- Provider page layout reference: https://buyawscredit.vercel.app/aws-accounts
- Contact layout reference: https://awscreditsbuy.com/contact-us/
- Vector logos: https://github.com/devicons/devicon and https://github.com/gilbarbara/logos
- Some provider icons were retrieved from the provider websites through Google's favicon service and are served locally from `public/logos/`.
- Typography: Google Fonts (Plus Jakarta Sans for headings; Inter for body text).
- Interface icons: Lucide React.

Provider trademarks belong to their respective owners. The storefront is independent and does not claim affiliation with those providers. Reference prices and product claims should be confirmed before taking payments.

`node_modules/` and generated `dist/` output are intentionally excluded from Git; `npm ci` and `npm run build` recreate them.

Color and surface reference: https://dotmirror.com/ (palette applied without copying content or changing the existing layouts).

## Typography system

`typography.css` defines the shared heading, body, card, navigation, CTA, form, pricing, counter, and footer styles. Breakpoints: mobile below 768px, tablet 768–1023px, desktop 1024px and above. Sizes use rem units to respect browser text preferences. Headings use Plus Jakarta Sans; body text uses Inter, both with sans-serif fallbacks.

`buttons.css` supplies the shared pill-shaped primary and secondary actions, gradient/grain treatment, hover/press states, filter pills, and keyboard focus rings.

## Vercel

Import this GitHub repository into Vercel. The root `vercel.json` selects Vite, installs with `npm ci`, builds with `npm run build`, and publishes `dist`. No environment variables are required. Clean routes, including `/cart/` and `/checkout/`, use the SPA rewrite rules in `vercel.json`. `.vercelignore` excludes local dependencies, Git history, and Sites-only metadata from CLI uploads.

## Responsive optimization

The shared mobile-first system is defined in `typography.css` and `responsive.css`, with locally served Plus Jakarta Sans and Inter variable WOFF2 fonts. See [the responsive implementation and validation report](docs/responsive-optimization.md) for tokens, viewport coverage, accessibility checks, and measurement limitations.

Provider cards are shared through `ProviderCard.jsx` and `provider-cards.css`, including original logos, variant counts, concise descriptions, starting prices, and accessible provider links.

## Midnight Sapphire design system

Colors, gradients, shadows and corner radii are centralized in `theme.css`; reusable button states are defined in `buttons.css`. See [the theme implementation report](docs/midnight-sapphire.md) and [browser validation results](docs/midnight-sapphire-validation.json).

## Cart and USDT checkout

- `/cart/`: remove packages, change quantities (1–99), and review catalog-derived totals. `cart.js` validates stored IDs and quantities; prices always come from `catalog.js`.
- `/checkout/`: choose USDT TRC20 (TRON), BEP20 (BNB Smart Chain), or ERC20 (Ethereum). Receiving addresses are maintained in `payments.js`. Check wallet details before changing this file.
- Buyer contact details remain in component memory, not local storage. Preparing an order creates a local draft only. The buyer explicitly copies and sends it on Telegram. No order is sent automatically. The TXID check sends only the transaction hash, network, and cart package IDs/quantities to the server, without contact details.
- Cart and checkout are marked `noindex, nofollow`. Direct links and refreshes work through the Vercel rewrites.
- Validation: production build; browser checks for cart persistence, totals, quantity limits, removal, empty and invalid storage states, draft preparation, network switching, exact wallet clipboard values, mobile/tablet/desktop layouts, and WCAG A/AA scans. No lint or type-check script is configured.

### Checkout QR codes

The selected USDT network displays a local SVG wallet QR code and a downloadable PNG. `npm run generate:payment-qr` generates both formats from the receiving addresses in `payments.js`; `npm run build` runs this automatically. QR codes contain the address only, without an amount or network identifier. The checkout labels the selected network explicitly. Both EVM networks intentionally encode the same owner-supplied address; TRC20 uses the separate TRON address.

## Automatic TXID verification

`POST /api/verify-payment` accepts `{ network, txid, items: [{ id, quantity }] }`. `server/payment-verifier.js` derives the expected numeric USDT amount from the catalog total, validates package IDs/quantities, and ignores client-supplied prices, recipients, or status. Checkout explains that an agreed quote differing from the listed total needs seller review.

- ERC20: Ethereum mainnet, allowlisted Tether contract, 6 decimals.
- BEP20: BNB Smart Chain mainnet, allowlisted Binance-Peg USDT contract, 18 decimals.
- TRC20: TRON mainnet, allowlisted Tether contract, 6 decimals.
- Checks require successful execution and genuine token Transfer logs, matching the configured receiving wallet and exact expected amount. Outgoing transfers are subtracted so self-transfers do not count. Ethereum/BSC require a canonical receipt block at or below the finalized head; TRON requires a successful solidified receipt.
- Unavailable RPCs, missing receipts, unknown status, pending finality, wrong tokens/recipients, and amount mismatches never produce a confirmed status.
- A confirmed result verifies an on-chain transfer, not buyer ownership, unique use of a TXID, stock reservation, an order record, or fulfillment. There is no persistent transaction-consumption database; the seller must match the transaction to the order before delivery. Browser status alone must not be used for automatic fulfillment.

Optional server-only environment variables: `ETHEREUM_RPC_URL`, `BSC_RPC_URL`, `TRON_RPC_URL`, `TRONGRID_API_KEY`. URLs must be HTTPS mainnet endpoints. The defaults are PublicNode (Ethereum), the BNB Chain public mainnet endpoint (BSC), and TronGrid (TRON). Public provider availability/rate limits can temporarily prevent checks. Never prefix server credentials with `VITE_`.

Run `npm test` for receipt validation and endpoint input tests, and `npm run build` for production. `vite preview` serves the UI only; the API runs on Vercel or through `vercel dev`.

Protocol references: [Ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc/), [BNB Chain RPC implementation](https://github.com/bnb-chain/bsc/blob/master/rpc/json-rpc-api.md), [TRON confirmation semantics](https://developers.tron.network/docs/confirmation-semantics), [Tether supported contracts](https://tether.to/en/supported-protocols/).

## Product buying articles

`productArticles.js` contains original provider guidance and a distinct introduction for every catalog variant. `getProductArticle()` combines those details with package-type checks, the live catalog price, seller documentation guidance, and the current checkout process. Each individual product page renders the full article through `ProductBuyingArticle.jsx`.

The Products page and provider collections also include expandable reading sections with every relevant variant, its reference price, and a link to its full article. These sections use the shared Midnight Sapphire design tokens and internal seller/contact links. Copy describes account-specific verification questions without asserting unsupported third-party certification or cloud-provider authorization.

When adding a product, add its introduction to `variantIntroductions`; `npm test` checks article coverage, unique introductions/titles, reference prices, content length, and route coverage for the catalog. Shared URL helpers live in `catalogPaths.js`, re-exported from `DetailPages.jsx` for existing consumers.

## Scrolling and animation performance

`SmoothScrolling.jsx` adds Lenis wheel interpolation only for fine-pointer devices without reduced motion. Touch remains native. One on-demand RAF loop runs while scrolling, then sleeps; scrolling does not update React state per frame. Programmatic catalog/top navigation uses `scrollPageTo()`, and route changes stop old inertia. Modals and navigation menus suspend the desktop controller; nested lists, tables, form controls, keyboard navigation, and modifier-wheel gestures retain native behavior.

`useViewportMotion.js` pauses provider, review, and footer animations outside the viewport or in a hidden tab. `scroll-performance.css` releases animation layer hints while those rails are idle and honors reduced motion.

Validation covered desktop wheel easing, idle RAF shutdown, keyboard and nested scrolling, modal locks, catalog/top actions, animation visibility, live reduced-motion changes, and native touch. A local Chrome 1440×1000 scrolling sample recorded a 16.7 ms median and 16.8 ms p95 frame interval, with no frame gaps above 33 ms or long tasks during the 2.5-second sample. These are local measurements, not a universal FPS guarantee.

High-refresh displays: scrolling uses browser-provided RAF timestamps and time-based interpolation; there is no fixed 60 FPS timer. During active scrolling, cosmetic badge/horizon motion and hover elevation are suspended and resume at rest. Footer pointer lighting batches geometry reads and writes into one RAF and skips updates while the page is moving. Reaching 120 FPS still requires a compatible display, browser, and sufficient rendering capacity; it cannot be forced on 60 Hz hardware.


## Replacement catalog — November 26, 2026

`catalog-data.js` is the canonical seller-supplied list: 68 variants across 14 providers. It preserves all submitted prices, including Azure 5K Credits at $7,550 and both AWS 5K/10K Bedrock credit packages at $1,099. Model and quota names are seller-supplied listing labels, not verified official specifications. Category filtering separates the large AWS, Azure, and Google Cloud collections.

The browser cart key changed to `baa-cart-v2` to avoid carrying removed variants or old selections into checkout. Server-side TXID checks continue deriving amounts from the current catalog. Retired product/provider URLs redirect through `vercel.json`; current product routes, prices, article entries, provider counts, and feature cards derive from the replacement data. OVHcloud and UpCloud SVG marks come from the Simple Icons project, with the Heroku mark from its 15.0.0 archive; Amazon SES uses the existing AWS mark.

### Product storefront layout

Provider collections use category navigation, package search, and responsive two-column product cards. Product detail pages include a specification summary, variant selector, purchase panel, and related packages. Shared catalog cards support direct cart actions; existing buying articles remain available in the collection reading room. Styling is centralized in `catalog-pages.css` using the Midnight Sapphire theme.

### Website motion

`WebsiteMotion.jsx` adds one-shot viewport entrances and event-driven sapphire cursor lighting to shared storefront surfaces. Pointer updates share one requested animation frame, stop on scroll/blur/hidden tabs, and create no idle animation loop. Touch devices omit cursor lighting; reduced-motion preferences disable both effects. `website-motion.css` defines the surface lighting and restrained button interactions.

The motion treatment also sequences hero content and section headings, staggers collection cards, and adds bounded pointer parallax to the homepage illustration. A slow sapphire halo runs only while the hero is visible on fine-pointer devices, pausing during scroll and in hidden tabs. Reduced-motion mode disables these treatments.

Primary and secondary actions receive a one-shot hover sheen with decorative layers cleaned up after completion. Fine-pointer product/provider cards use a bounded 1.1-degree tilt that resets on scroll and is disabled immediately while controls have keyboard focus. Buying guides and FAQ rows share the one-time reveal system. No cursor replacement or moving click targets are used.

### Sticky navigation and scroll budget

The capsule header stays at the top with an opaque surface rather than live backdrop blur. A ResizeObserver measures header height only when it changes; native anchor scroll padding and Lenis navigation offsets leave room for the header. Collection sidebars use the same offset. Decorative carousels and hero motion pause during scrolling; pointer/keyboard/native touch behavior is preserved. Actual refresh rate remains dependent on browser and hardware.

### Header utility actions

The shared header includes icon-only Telegram and cart links, plus a Midnight Sapphire Check Pricing action to `/products/`. Cart quantity is reflected in the accessible label and count badge. Navigation collapses below 1280px; mobile actions use a second row with 44px touch targets. Sticky-header offsets resize automatically.

The pricing CTA uses the shared navy gradient, white text, border and shadow tokens. Hover adds a one-shot sheen, a small lift and arrow movement; pressing settles the button. Reduced-motion preferences disable movement.

### Product card refinements

Compute specifications use “Product variation limit” without changing seller-supplied values. Product cards use navy category chips and compare-product actions. Homepage provider cards use a three-column desktop grid, two columns on tablets and one on small screens, with grouped variation counts, prominent starting prices, and paired actions. Styles live in `card-refinement.css`.

### Cart and checkout presentation

`commerce-refinement.css` gives commerce pages an editorial purchase layout with white order summaries, a navy total, clear line items and structured form panels. `PaymentIcon.jsx` supplies local vector USDT/TRON/BNB/Ethereum marks for accepted networks; wallet addresses, QR payloads, transaction verification, contact privacy and manual seller matching remain unchanged. Cart controls, copy/download actions, and request preparation retain their existing behavior.

Product-card headers show the source catalog account category rather than an abbreviated provider label. Details use bold navy text. Visible cards receive a subtle compositor opacity price highlight and transform-only details sweep; lighting pauses while scrolling or hidden and is disabled for reduced motion. The duplicate visual price layer is hidden from assistive technology.

The current account-card layout uses an inset navy identity band with a separate logo tile, a compact price row above the specifications, normal-weight details and a distinct action footer. Collection grids align cards at the start to avoid stretched whitespace. Existing lighting, categories, catalog values and buying actions are retained.

### Product artwork

`ProductVisual.jsx` and `product-visual.css` integrate the standalone HTML artwork into all shared account cards and individual product heroes. Each illustration uses the current provider logo and options derived from actual catalog kinds. Native SVG/HTML stays sharp and requires no external image host; hover-only lighting and reduced-motion support retain the scroll budget. Prices, cart actions, specification text and checkout are unchanged.

Product artwork is now limited to the provider/product page hero. Shared catalog and related-product cards omit artwork and retain the compact purchase layout. The hero lockup and illustration labels show the relevant collection or exact product title; long visual titles clamp without changing their accessible names.

Provider collection heroes now show the category lockup and artwork in place of the introductory marketing block. The adjacent collection summary is vertically centered with a centered reference amount. Mobile stacks the panels; the collection navigation action remains in the summary. Individual-product introductions and specifications remain intact.

Collection titles occupy a shared row above the artwork and price overview. Desktop media/price panels stretch to a consistent minimum-height grid row, aligning both edges across providers; tablet/mobile stack naturally. No fixed viewport overlay or footer overlap is introduced.
