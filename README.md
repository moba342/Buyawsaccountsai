# Buyawsaccountsai

# Cloudlane — Cloud Account Storefront

Responsive React storefront with a cobalt blue, white, and soft-gray theme with a dark footer, 53 product variants across 12 providers, and original provider logo assets stored locally.

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
- Twelve provider pages and 53 individual product variant pages.
- Custom themed dropdowns with keyboard controls and live variant prices.
- Side-by-side comparison of up to three variants.
- Buying guides and expandable FAQs.
- Contact cards with Telegram, email, and Google Maps links.
- Smooth button feedback and an infinitely scrolling provider logo strip.
- Responsive mobile, tablet, and desktop layouts; reduced-motion support.
- Buy Now opens an inquiry dialog with copyable order information and a Telegram link.

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
| `theme.css` | DotMirror-inspired palette and surface overrides; preserves layout and typography |
| `public/logos/` | Locally hosted provider logos |
| `index.html` | HTML entry point and metadata |
| `package-lock.json` | Reproducible dependency versions |

Update `catalog.js` to edit prices, product names, providers, and features. Related provider counts, minimum prices, and variant routes are derived from that data. Update contact information in `ContactPage.jsx` and `src.jsx`.

## Current purchase flow

This is a frontend storefront. It has no payment processor, automated account fulfillment, backend order storage, or email delivery service. Buy Now prepares an inquiry; customers confirm final pricing, availability, provider eligibility, delivery, and terms with the seller on Telegram or by email. No secrets or API keys are required for the existing site.

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
