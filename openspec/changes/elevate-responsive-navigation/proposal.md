## Why

The current layout and micro-interaction polish feel at home on desktop, but mobile navigation is still a straightforward list. To deliver a “world class” responsive experience that matches Apple’s current design language, we need a more delightful, ProMotion-aware mobile navigation—keeping the existing carousel-based pattern while elevating its feel and responsiveness across breakpoints.

## What Changes

- Mobile navigation upgrade
  - Evolve the carousel-based nav into a fluid, snap-aligned, inertial scroller suited for 120 Hz panels.
  - Add contextual affordances (active pill, subtle gradients, edge peeks) without breaking existing style tokens.
- Responsive tuning
  - Revisit breakpoints for navigation, hero sections, and cards so the experience feels intentionally designed at 320px through ultrawide.
  - Ensure touch targets remain ≥48px and gestures feel natural.
- Motion consistency
  - Apply the new motion tokens (fast durations for ProMotion, reduced-motion fallbacks) to navigation interactions.
- Accessibility & controls
  - Keep keyboard support, focus states, and reduced motion behavior intact.

## Impact

- Affected specs: `visual-style`, navigation guidelines
- Affected files: `src/styles/theme.css`, `src/components/Navbar.astro`, mobile carousel scripts/styles, possible updates to section padding/gutters.
