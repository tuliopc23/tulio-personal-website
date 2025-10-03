## 1. Design & Spec

- [x] 1.1 Audit current hover/focus states across hero cards, nav, icon tiles, buttons, and sidebar to document baseline.
- [x] 1.2 Define motion tokens: scale factors, elevation deltas, durations (~100–180ms), and easing curves for each interaction layer.
- [x] 1.3 Update the `visual-style` spec delta to encode new motion requirements and reduced-motion fallbacks.

## 2. Implementation

- [x] 2.1 Update shared tokens in `src/styles/theme.css` (`--shadow`, `--motion-*`) to support new elevation states.
- [x] 2.2 Enhance cards (`Card.astro`, `ProjectCard.astro`, `ArticleCard.astro`) with the new hover/focus interactions and shadow/spring transitions.
- [x] 2.3 Refresh icon tiles (`CategoryList`, `ProfileCard` chips, sidebar icons) to magnify and glow subtly on hover/focus.
- [x] 2.4 Tighten topbar navigation underline animation and breadcrumbs hero reveal.
- [x] 2.5 Ensure `prefers-reduced-motion` short-circuits transforms, leaving static elevation changes.
- [x] 2.6 QA across desktop/compact viewports in light/dark themes; record screen capture for sign-off.
- [x] 2.7 Run `bun run check` before completion.

## 3. Approval

- [x] 3.1 Review with Tulio to confirm motion aligns with Apple standards and doesn’t feel “too busy”.
