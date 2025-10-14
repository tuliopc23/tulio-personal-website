# Add Scroll CTA Hints For Horizontal Rails

**Status:** draft  
**Date:** 2025-10-13  
**Author:** Codex (AI assistant)

## Overview

Mobile users rely on subtle cues to realise that the horizontal rails across the site are scrollable. Today we lean on the on-rail PageIndicator dots and the bottom-right `ScrollIndicator`, but sections like Quick links, Tech stack, Tools, Projects, and the Profile CTA rail feel visually merged with the surrounding content—there is no dedicated invitation pointing left toward additional cards. The blog listing carousel on desktop likewise relies solely on the page dots and can be overlooked.

We need a consistent, Apple-style CTA hint that sits above each horizontal rail on mobile (and the blog carousel on desktop) to nudge users to “Scroll left”. The hint should reuse the blue CTA styling already present throughout the site, wire into the existing scroll instrumentation so it hides after interaction, and remain light-touch so it doesn’t overpower the layout.

## Proposed Changes

### Scroll Hint Component
- Introduce a reusable `ScrollHint` component that renders a blue CTA-style label (text + arrow icon) and accepts the target scroll container selector.
- Hook the hint into the same interaction tracking as `ScrollIndicator` so it fades out after the user scrolls or taps the carousel arrows; respect `prefers-reduced-motion`.
- Provide props for tone (default “Scroll left →”), optional analytics hook, and theme-aware colours sourced from existing token palette.

### Mobile Integration
- Prepend the hint above every mobile card rail: Home quick links, Tech stack, Tools, Featured writing, Profile social CTA rail, and Projects listing.
- Ensure spacing and responsive rules keep the hint outside any glass-morphism wrappers (so the hint remains separate from the card surface as requested).
- Update `PageIndicator` spacing if necessary to prevent overlap with the new hint.

### Desktop Coverage
- Add the hint above the blog article carousel for desktop and large tablets (the only horizontal scroll surface we keep on desktop).
- Keep the hint hidden on wide layouts for other rails that already present full grids without horizontal scrolling.

### Accessibility & Behaviour
- Tie the hint’s visibility to keyboard focus and scroll events so keyboard users also dismiss it when navigating.
- Use descriptive copy and ARIA labelling so screen readers announce the hint once and then move into the rail items.
- Ensure the hint is non-interactive text (not a link) to avoid confusing navigation semantics.

## Implementation Plan

1. **Component & Token Audit**
   - Review existing CTA typography, colours, and the `ScrollIndicator` logic to share animation tokens/session storage flags.
   - Define component props and animation behaviour for the new hint.
2. **Build `ScrollHint`**
   - Implement the Astro component with minimal markup, providing a client-side script to observe scroll + pointer events and hide the hint.
   - Export theme-aware styles aligned with existing CTA link styling.
3. **Wire into Mobile Rails**
   - Add the hint above each mobile `cardRail`/carousel (home quick links, tech stack, tools, featured writing, profile socials, projects grid).
   - Adjust spacing tokens where required so hints do not collide with card surfaces.
4. **Desktop Blog Carousel**
   - Render the hint above the blog article carousel on desktop breakpoints (keep mobile behaviour consistent with other rails).
   - Confirm the layout remains balanced in both light and dark themes.
5. **QA & Regression Pass**
   - Verify hints appear only where intended, disappear after interaction, and respect reduced-motion.
   - Run `bun run check` and perform manual checks on iOS Safari/Chrome mobile sims plus desktop browsers.

## Risks & Considerations

- **Visual Noise:** Too many hints could clutter the interface; we must ensure the component is subtle and disappears after first interaction.
- **Session Storage Conflicts:** Reusing the existing session flag requires care to avoid accidentally suppressing hints on other rails after dismissing one.
- **Breakpoints:** Some rails may transition between horizontal and grid layouts around tablet breakpoints; the hint should appear only while the rail scrolls horizontally.
- **Copy Length:** Translated or alternative copy might wrap; we should keep the message short and allow wrapping without pushing the layout.

## Testing Strategy

- `bun run check`
- Manual walkthrough on iPhone-sized viewport (Safari & Chrome) for every card rail.
- Desktop Chrome/Safari test for the blog carousel to ensure the hint only appears on larger screens and hides after interaction.
