## 1. Research & Planning
- [ ] 1.1 Review existing `ProfileCard.astro` data structures, markup, and CSS hooks.
- [ ] 1.2 Inspect `Card`, `IconTile`, and Tech stack rail patterns to extract reusable building blocks.
- [ ] 1.3 Assess `public/icons/Socials/` assets for light/dark variants and sizing adjustments.

## 2. Component Architecture
- [ ] 2.1 Define a normalized social CTA data model (title, description, href, icon, tint).
- [ ] 2.2 Prototype a compact card variant that reuses Tech stack tokens with scaled paddings/tiles.
- [ ] 2.3 Wire the CTA data into the Profile card desktop layout alongside avatar, summary, and meta items.

## 3. Responsive & Interaction Behaviour
- [ ] 3.1 Implement the mobile horizontal rail using the new cards and ensure `PageIndicator`/`ScrollIndicator` hooks target the rail.
- [ ] 3.2 Verify keyboard, focus, and hover/active states match the Tech stack interaction vocabulary.
- [ ] 3.3 Confirm cards remain accessible (single focus target, descriptive aria labels, hidden URLs).

## 4. Polish & Validation
- [ ] 4.1 Finalize CTA copywriting to remove raw URLs/handles and adopt action-focused titles.
- [ ] 4.2 Tune spacing, typography, and icon tint tokens for light/dark parity.
- [ ] 4.3 Run `bun run check` and perform manual QA (desktop/mobile, light/dark, keyboard).
