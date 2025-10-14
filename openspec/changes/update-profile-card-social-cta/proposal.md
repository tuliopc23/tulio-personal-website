# Profile Card & Social CTA Overhaul

**Status:** draft  
**Date:** 2025-10-13  
**Author:** Codex (AI assistant)

## Overview

The current Profile card relies on compact “chip” links that expose raw URLs/handles, uppercase labels, and iconography that predates the new Tools section. This creates a visual break compared to the rest of the homepage rail system—especially the Tech stack and Tools grids that now define our primary card anatomy, icon tiles, and scroll instrumentation.

We need to redesign the Profile card and its social links so they feel like siblings of those sections: larger icon tiles, heading styles that match the rest of the page, CTA copy instead of URL strings, and hover/focus treatments that read as miniature cards. All social CTAs should become fully clickable cards (no inline URLs), reusing the Tech stack card architecture at a reduced scale while wiring in refreshed assets from `public/icons/Socials/`.

## Proposed Changes

### Layout & Composition
- Replace the existing chip list with a grid/rail of compact cards that reuse the `Card`/`cardRail` patterns from Tech stack (same corner radius, layered shadow, reveal hooks) scaled down to fit inside the Profile card and mobile rail.
- Introduce a desktop layout that keeps the Profile card hero (avatar, summary) on the left and a two-column CTA grid on the right; mobile continues to expose a horizontal rail with `PageIndicator` support.
- Align Profile card typography (including the main heading) with the section heading styles already used elsewhere, removing the uppercase eyebrow treatment on social items.

### Iconography & Assets
- Swap the old glyphs for the new assets stored in `public/icons/Socials/`, ensuring both light/dark variants are resolved through the existing IconTile pipeline (with fallbacks for single-tone SVGs or WEBP).
- Increase the icon tile size relative to the current chips (targeting 48–56px tiles) while maintaining proportional padding so the cards still read lighter than full Tech stack tiles.
- Normalize icon tint tokens so the social CTA cards blend with the Tech stack/Tools palette while keeping each network’s identity.

### Copy & Interactions
- Remove raw URLs and handle strings from the UI; each card should display an action-focused title (e.g., “Follow my GitHub”) and a one-line CTA description aligned with existing card blurb tone.
- Make each social card a single interactive target that opens in a new tab, keeping URLs hidden but accessible via standard link semantics and ARIA labelling.
- Update the Profile summary blurb if needed so the new CTA grid does not feel redundant—a single sentence context plus the CTAs encourages exploration.

### Accessibility & Behaviour
- Preserve keyboard discoverability with visible focus states that match Tech stack cards and ensure that `PageIndicator` / `ScrollIndicator` pairings target the new rail.
- Respect existing reduced-motion preferences by reusing the same animation tokens instead of adding bespoke transitions.
- Ensure icon asset swaps maintain contrast in both themes and provide fallback text for screen readers via `aria-label`/`sr-only` content.

## Implementation Plan

1. **Audit Current Profile Card**
   - Document the present layout, reveal sequencing, chip styles, and data structures (`_contacts`, `_meta`).
   - Note dependencies on `BrandIcon`, `SFIcon`, and CSS variables so the new card component can reuse or replace them cleanly.
2. **Design CTA Card Structure**
   - Define a social CTA data model (title, description copy, href, icon slug, tint) that mirrors the Tech stack data arrays.
   - Prototype the card markup using existing `Card` and `IconTile` primitives, scaling paddings/tiles for the reduced footprint.
   - Map each social entry to the correct asset in `public/icons/Socials/` (including light/dark variants).
3. **Implement Desktop & Mobile Layouts**
   - Update `ProfileCard.astro` to render the new CTA grid alongside the profile details, ensuring the layout flows within current container constraints.
   - Replace the mobile chip rail with the new cards, wiring in `PageIndicator`/`ScrollIndicator` hooks and ensuring touch targets meet 44×44px minimums.
4. **Polish Copy & Accessibility**
   - Craft CTA titles/descriptions that follow the homepage tone, keeping blurbs to ~12 words.
   - Validate focus order, hover/active styles, aria labels, and behavior under reduced motion.
5. **Verification**
   - Run `bun run check`.
   - Manual QA in both color themes across desktop/mobile breakpoints, validating icon rendering and scroll behaviour.
   - Confirm no regressions in Lighthouse accessibility checks (focus order, link purpose).

## Risks & Considerations

- **Icon asset fidelity:** Some provided icons may require trimming or adding transparent padding to sit neatly in the icon tile; poor alignment could break the polished feel.
- **Layout compression:** The Profile card already packs dense information; ensuring the CTA grid doesn’t crowd the avatar/summary may require spacing refinements or responsive tweaks.
- **Copy voice alignment:** CTA phrasing must stay on-brand and succinct; overlong descriptions will introduce undesirable wrapping, especially on mobile.

## Testing Strategy

- `bun run check`
- Manual desktop/mobile visual QA (Safari and Chrome) in light & dark modes
- Keyboard navigation walkthrough and screen reader spot checks for link purpose clarity
