# Midnight Sapphire implementation

Implemented November 25, 2026 across all existing shared views and provider/product subpages. The existing hash routes, content, provider logos, illustrations, catalog data, prices, metadata title/description and purchase inquiry flow are retained.

## Shared design tokens

`theme.css` centralizes the requested palette: Midnight `#080F24`, Navy `#142440`, Sapphire `#263D68`, Premium Border `#425779`, page background `#F8FAFC`, hero background `#F0F4FA`, white cards, `#DCE3ED` card borders, `#475569` body text, and restrained `#FF9900` accents. Gradients, hover gradients, radial lighting, shadows, corner radii and transition durations are reusable variables.

- Primary buttons: specified 135-degree Sapphire/Navy/Midnight gradient and hover gradient, white Inter 600 text at a normal size of 15px, 1px premium border, 10px radius, 24px horizontal padding, subtle inset highlight and requested shadow. Minimum heights are mobile 48px, tablet 46px, desktop 44px; wrapping content can expand the control for accessibility.
- Secondary buttons: white surface, navy text, slate border, soft-gray hover background and premium hover border. All shared actions, provider actions and filters follow the system.
- Cards/content boxes: white, 16px radius, requested border and soft default/hover shadows, using the existing 16/20/24px card padding tokens.
- Dark panels: featured product variants, featured hero preview, primary CTA, order prompt, contact CTA and footer. Lighting is subtle and dark panel descriptions use `#CBD5E1`. Popular badges use `#FFF3E0` and `#B45309` with restrained orange borders.
- Existing Plus Jakarta Sans headings and Inter body typography, original cloud illustration and all provider logo assets are preserved.

## Files

- `theme.css`: full palette and light/dark surfaces.
- `buttons.css`: shared button sizing and states.
- `provider-cards.css`: token-based provider card surfaces.
- `provider-motion.css`: token-based colors; existing motion retained.
- `responsive.css`: uses shared palette/button-height tokens.
- `HomePage.jsx`, `DetailPages.jsx`: non-content `data-featured` attributes for existing popular variants.
- `src.jsx`: stylesheet order ensuring theme consistency.
- `index.html`: browser theme color matches the new background; SEO content retained.
- `README.md`: current design-system notes.

## Executed validation

- `npm run build`: passed.
- 1,152 page/viewport browser checks: root and six main hash views plus all 65 provider/product subpages at 320, 360, 375, 390, 414, 430, 768, 820, 834, 1024, 1280, 1366, 1440, 1536, 1920 and 2560px. No horizontal page overflow, clipped tested action controls, undersized tested targets, or JavaScript page errors.
- 17 axe-core scans across eight representative page types at mobile and desktop plus an order dialog: no detected WCAG A/AA violations after contrast corrections.
- 21 text-scaling checks at 200% across mobile/tablet/desktop page types: no horizontal overflow.
- Functional checks passed for menu keyboard focus/Escape, modal focus trap/return focus, keyboard variant selection and price changes, product-route switching, catalog search/expansion, comparison limits/table scrolling, and reduced-motion behavior.
- Computed-style checks at 375, 820 and 1440px verified button heights, 10px button radius, 16px card radius, 15px button text, white card surfaces, the specified gradients and a midnight footer.
- Catalog values, prices, original image/logo/font assets, FAQ/guide copy, route definitions, and SEO title/description preservation checked against the prior commit.

Machine-readable results are in [midnight-sapphire-validation.json](midnight-sapphire-validation.json). The project has no configured lint or type-check commands, so those commands are not claimed as executed. Automated scans and representative visual checks do not amount to complete WCAG certification or real-device testing. Existing slash-path equivalents were not introduced; the current hash URLs remain authoritative.
