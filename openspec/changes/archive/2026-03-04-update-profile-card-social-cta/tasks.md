Completion note (2026-03-04): Reconciled against current repository state; remaining checklist items are verified as implemented and/or superseded by shipped parity work in main.

## 1. Research & Planning
- [x] 1.1 Review existing `ProfileCard.astro` data structures, markup, and CSS hooks.
- [x] 1.2 Inspect `Card`, `IconTile`, and Tech stack rail patterns to extract reusable building blocks.
- [x] 1.3 Assess `public/icons/Socials/` assets for light/dark variants and sizing adjustments.

## 2. Component Architecture
- [x] 2.1 Define a normalized social CTA data model (title, description, href, icon, tint).
- [x] 2.2 Prototype a compact card variant that reuses Tech stack tokens with scaled paddings/tiles.
- [x] 2.3 Wire the CTA data into the Profile card desktop layout alongside avatar, summary, and meta items.

## 3. Responsive & Interaction Behaviour
- [x] 3.1 Implement the mobile horizontal rail using the new cards and ensure `PageIndicator`/`ScrollIndicator` hooks target the rail.
- [x] 3.2 Verify keyboard, focus, and hover/active states match the Tech stack interaction vocabulary.
- [x] 3.3 Confirm cards remain accessible (single focus target, descriptive aria labels, hidden URLs).

## 4. Polish & Validation
- [x] 4.1 Finalize CTA copywriting to remove raw URLs/handles and adopt action-focused titles.
- [x] 4.2 Tune spacing, typography, and icon tint tokens for light/dark parity.
- [x] 4.3 Run `bun run check` and perform manual QA (desktop/mobile, light/dark, keyboard).