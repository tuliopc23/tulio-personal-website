## Why

The site recently widened to 1150px, but the layout still assumes a single desktop breakpoint. On hardware like the MacBook Pro 14" (default 1512×982 CSS pixels) and larger Retina displays, containers feel slightly compressed, while ultrawide desktop monitors and stage-manager half-widths expose spacing gaps. We need an adaptive layout strategy that tunes widths, gutters, and column behavior so the experience feels native on MacBook Pro 14" baseline while scaling gracefully up and down.

## What Changes

- Establish responsive layout scales
  - Define explicit desktop tiers: compact (≤1280px), standard (1280–1680px, includes MBP 14"), and expanded (≥1680px).
  - Adjust `--content-max`, sidebar width, and gutter clamps per tier so the main column reads ~72ch on MBP 14" and stretches to ~80ch on larger displays without breaking.
- Refine sidebar & content relationship
  - Allow sidebar width to shrink on compact desktop but lock to a stable width on standard/expanded tiers to prevent jitter.
  - Ensure sidebar + content total width maintains ≥24px outer gutter even on full-width MBP 14" Safari.
- Typography & spacing tuning
  - Keep body copy measure in the 68–72ch range, using `clamp()` to scale within each tier.
  - Harmonize vertical rhythm by scaling section gaps with viewport (`clamp(28px, 3.5vw, 44px)` style) so content breathes on large displays.
- Navigation & hero polish
  - Re-align hero / quick links / cards to the new grid so headings and cards sit on the same optical edge across tiers.
  - Ensure topbar and breadcrumbs stay within container bounds and respond to wider gutters.
- Responsive QA matrix
  - Validate on MacBook Pro 14" (full width), Stage Manager half-width (~780px), 1920px desktop, and 2560px ultrawide.
  - Confirm light/dark parity and reduced-motion behavior remain intact after layout adjustments.

## Impact

- Affected specs: `visual-style`
- Affected files: `src/styles/theme.css`, `src/layouts/Base.astro`, sidebar/hero/card components relying on container utilities.
- Requires updates to QA checklist and documentation to reflect the new breakpoints.
