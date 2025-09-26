## Why

The desktop baseline now matches the Apple-inspired palette, but the site still lacks the motion, glass layering, and editorial detailing that make Apple interfaces feel "finished." We need a focused pass to align animations, tactile feedback, and visual refinements with the Human Interface Guidelines so the experience feels truly premium.

## What Changes

- Introduce a motion system that mirrors HIG easing curves, durations, and reduced-motion fallbacks for page transitions, parallax reveals, and interactive components.
- Polish translucent navigation, sidebars, and cards with dynamic blur, light gradients, and border treatments that react to scroll position without overwhelming the flat content surfaces.
- Refine typography, spacing, and iconography micro-details (baseline grid alignment, focus rings, state icons) to ensure every surface feels intentional at both desktop and mobile breakpoints.
- Expand the visual-style spec with explicit requirements for motion tokens, elevation states, responsive glass panels, and QA checklists so future changes remain compliant.

## Impact

- Affected specs: `visual-style`
- Affected code: `src/layouts/Base.astro`, `src/components/*`, `src/styles/theme.css`, `src/styles/motion.css` (new), `src/scripts/*`, `public/` assets for gradients/lighting overlays
