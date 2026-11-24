# Responsive typography and UI optimization

Completed November 25, 2026. Production source: this repository. Machine-readable browser results: [responsive-validation.json](responsive-validation.json).

## Scope and preservation

Optimized the existing homepage/catalog, providers, comparisons, guides, FAQ, contact page, twelve provider subpages, and 53 product variant subpages. Preserved existing hash URLs, product data/prices, copy, brand/background colors, original logos and illustrations, metadata title/description, seller links, and purchase inquiry behavior. No new routes, pages, checkout backend, forms, testimonials, or APIs were introduced. The requested slash-path page names correspond to the existing hash views; route definitions were deliberately retained.

## Modified files

- `typography.css`: consolidated font faces and responsive type tokens; smaller, consistent heading, card, price, FAQ, form, table, and footer scales.
- `responsive.css`: centralized container, spacing, grid, radius, touch target, navigation, table, safe-area, modal, reading-width, and text scaling rules. Existing brand styles remain in their original stylesheets.
- `public/fonts/`: self-hosted Latin variable WOFF2 fonts and SIL Open Font License files.
- `index.html`: two critical font preloads; removed external Google Fonts stylesheets/preconnects; added safe-area viewport support. SEO title and description preserved.
ay
- `Modal.jsx`: reusable focus trap, initial/return focus, Escape support, inert background, and scroll locking.
- `src.jsx`: shared stylesheet and modal integration, skip link, navigation state semantics, menu keyboard focus, main landmarks, scrollable comparison region, reduced-motion scrolling.
- `HomePage.jsx`, `DetailPages.jsx`, `ContactPage.jsx`: focusable main landmarks; provider table region; reduced-motion catalog scrolling.
- `ProviderLogo.jsx`: lazy-loading for local logos with intrinsic dimensions retained.
- `README.md`: implementation and validation notes.

## Typography

Headings use Plus Jakarta Sans; body/navigation/buttons/forms use Inter; fallback is sans-serif. Both fonts are local variable WOFF2 files with `font-display: swap`; total font payload is 75,704 bytes (about 74 KiB). Heading weights, line heights, letter spacing, card text, FAQ text, table text, labels, footer text and badges follow the supplied scale. Fluid `clamp()` heading tokens use rem units. Hero H1 targets 34px mobile, 44px at tablet entry, and 56px desktop; small mobile can use 32px and wider tablets interpolate modestly. Section headings target 28/32/40px. Body text remains 16px; inputs remain 16px to avoid iOS zoom. Prices are 32/38/44px; counters 32/40/48px.

## Spacing and layouts

| Token | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Container padding | 16px | 24px | 32px |
| Section padding | 40px | 56px | 80px |
| Hero padding | 48px | 64px | 96px |
| Card padding / gap | 16px | 20px | 24px |
| Card radius | 12px | 14px | 16px |
| CTA minimum height | 48px | 44px | 44px |
| Input minimum height | 48px | 48px | 48px |

Content is capped at 1280px, including on 1920px and 2560px displays. Product/guide grids use one, two, and three columns. Provider grids adapt from one or two columns on mobile to two on tablet and four on desktop. Existing counters are retained rather than inventing additional statistics. Tables scroll inside focusable regions and comparison row labels remain sticky. Safe-area insets, readable paragraph widths, balanced headings, pretty paragraph wrapping, and equal-height card layouts are applied.

## Validation actually executed

- Production build: `npm run build` — passed.
- All 16 requested widths: 320, 360, 375, 390, 414, 430, 768, 820, 834, 1024, 1280, 1366, 1440, 1536, 1920, 2560px.
- 1,152 browser page/viewport checks covering root, six shared hash views, and all 65 provider/product subpages. No horizontal page overflow, clipped actionable controls, undersized tested controls, or JavaScript page errors in the final pass.
- 17 axe-core scans across eight representative page types at mobile and desktop, plus the order dialog: no WCAG A/AA violations detected by the configured rules.
- Twenty-one 200% text-size checks across mobile/tablet/desktop and representative page types: no horizontal page overflow.
- Interactive checks: hamburger focus/Escape; dialog Tab/Shift+Tab trapping, focus restoration and Escape; nested variant dropdown keyboard selection and price updates; direct variant route changes; search; all-53 expansion; three-item comparison limit; keyboard table scrolling; reduced-motion static provider strip.
- Visual inspection of homepage captures at small mobile and desktop; additional captures at tablet. Small-mobile header geometry checked in the browser.
- Protected content checks: catalog/prices, original logos, theme/background styles, FAQ/guide copy, SEO title/description, and route definitions unchanged.

## Performance and accessibility

A local, cold-cache mobile lab sample at 390×844 with 4× CPU slowdown, 40ms latency, and 1.6Mbps download recorded LCP around 1.2 seconds and CLS 0. Both fonts loaded with two same-origin font requests and no Google Fonts network requests. These are local lab values, not production field metrics or a guarantee of Core Web Vitals. INP needs representative real-user measurement and has not been certified. No runtime dependency was added.

Low-contrast helper/table text uses the existing darker body-text color on tinted surfaces. Focus rings are visible, menus and modals support keyboard use, comparison regions are keyboard scrollable, controls meet the tested target sizes, and text scaling and reduced-motion settings are supported.

## Limits

The repository has no configured lint, TypeScript/type-check, or unit-test commands; none are claimed as executed. Browser automation and axe cover selected conditions and do not constitute complete WCAG certification. Screen-reader/device-specific manual testing and production field Core Web Vitals remain outside this validation. Contact is the existing direct-contact page, with no new form or validation workflow added. Local fonts cover current Latin-script content; other scripts use the configured sans-serif fallback.
