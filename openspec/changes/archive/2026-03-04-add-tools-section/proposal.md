# Add Tools Section Mirroring Tech Stack

**Status:** draft
**Date:** 2025-10-13
**Author:** Codex (AI assistant)

## Overview

The homepage currently spotlights a “Tech stack” grid that defines spacing, card anatomy, mobile carousel affordances, and the scroll/page indicator pattern used across the site. We need to introduce a “Tools” section immediately after Tech stack that reuses those exact building blocks—same card component, grid, tokens, icon tile, layered shadows, and scroll instrumentation—while presenting a curated set of developer tools (Ghostty, Neovim, Xcode, Containerization, Kaleidoscope, Code Edit). The section must inherit all hover/focus treatments, work across light/dark modes, expose the same mobile navigation affordances, and advertise an in-page anchor for navigation.

## Proposed Changes

### Layout & Composition
- Insert a new `<section id="tools">` block after the Tech stack markup in `src/pages/index.astro`, using the existing `Card`, `cardGrid`, and `cardRail` structure verbatim (no new classes or measurements).
- Instantiate `PageIndicator` and `ScrollIndicator` for the Tools rail with matching `aria-label` patterns to preserve the current mobile carousel UX.
- Share reveal sequencing (`data-reveal` hooks) and spacing tokens so animations and vertical rhythm remain synchronized with the Tech stack section.

### Data & Content
- Create a six-item data source mirroring the Tech stack array that supplies title, blurb, tint, and icon slug for Ghostty, Neovim, Xcode, Containerization, Kaleidoscope, and Code Edit in that order (with room to append additional tools later).
- Normalise custom tool icons so they resolve through the existing `IconTile` pipeline: prefer Iconify keys where available, otherwise place `public/icons/{slug}.svg` assets (with light/dark variants if provided) and let the card tile render the fallback monogram when assets are missing.
- Ensure copy tone and length align with Tech stack blurbs (single sentences, ~10–12 words) and reuse the same tint palette used elsewhere to avoid bespoke styling.

### Accessibility & Behaviour
- Mirror Tech stack accessibility: section heading levels, `aria-label`s for page indicators, focus handling, and single focus target per card.
- Honour reduced motion by reusing the same animation attributes; no new motion curves are introduced.
- Add the `#tools` anchor to the site’s in-page navigation map if required for sidebar linking.

## Implementation Plan

1. **Audit Tech stack implementation**
   - Capture exact DOM structure, classes, data attributes, reveal ordering, and indicator hooks (`data-tech-stack-rail`, `PageIndicator`, `ScrollIndicator` usage).
   - Document card spacing, icon tile metrics, and tint mapping to guide data entry.
2. **Define Tools content & assets**
   - Produce a `tools` data array (inline or extracted) containing six ordered entries with copy, tint, and icon slugs.
   - Normalise tool icons into `public/icons/{slug}.svg`, mapping light/dark variants when provided; configure fallbacks for any missing assets.
3. **Compose Tools section**
   - Duplicate the Tech stack section structure with updated IDs/labels and wire in the new data array.
   - Instantiate `PageIndicator`/`ScrollIndicator` with new `data-tools-rail` hooks mirroring Tech stack behaviour.
   - Expose the `id="tools"` anchor and, if needed, register it with the sidebar navigation data.
4. **Verification**
   - Run `bun run check`.
   - Manually test desktop grid (two rows of three on wide viewports) and mobile carousel (scroll hints, indicator, snap behaviour) in both themes.
   - Verify keyboard/focus order and screen reader announcements match the Tech stack precedent.

## Risks & Considerations
- **Icon asset quality:** Tool icons may need manual cleanup to remove white borders or align to the macOS tile radius; mismatched assets could break visual parity.
- **Copy fit:** Slightly longer tool descriptions could wrap differently and nudge heights; ensure copy stays within Tech stack bounds.
- **Navigation updates:** If the sidebar or top nav assumes a fixed section list, adding `#tools` may require data updates to avoid broken links.
- **Content alignment:** The brief references a future eighth tool and mentions Transmit in the desired order—confirm whether Transmit is part of this initial six-card release.

## Testing Strategy
- `bun run check`
- Manual QA in Safari/Chrome mobile simulators for carousel behaviour and indicator sync.
- Keyboard navigation and screen reader spot checks to confirm label parity and single-focus cards.
