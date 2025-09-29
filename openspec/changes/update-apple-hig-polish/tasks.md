## 1. Research & Planning

- [x] 1.1 Capture Apple HIG references for motion, translucency, and typography; document gaps against current UI.
- [x] 1.2 Define motion tokens (durations, easing, distance) and glass surface variables to codify in `src/styles`.

## 2. Implementation

- [x] 2.1 Implement navigation/sidebar glass layering with scroll-reactive blur, border, and light accent adjustments.
- [x] 2.2 Add page transition and section reveal animations with prefers-reduced-motion fallbacks and tokenized easing.
- [x] 2.3 Tighten typography, spacing, iconography, and focus treatments to align with HIG baseline grid across breakpoints.
- [x] 2.4 Introduce reusable motion utilities (CSS + optional JS helpers) for cards, buttons, and list interactions.

## 3. Verification

- [x] 3.1 Validate light/dark themes, reduced motion, and responsive breakpoints manually; capture screenshots/video for review.
- [x] 3.2 Run `bun run check` and update docs/specs with the finalized tokens and behaviors. _(Resolved; `bun run check` now passes successfully.)_
