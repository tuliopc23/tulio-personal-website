## 1. Specification & Design

- [ ] 1.1 Benchmark current layout on MBP 14" (full width + Stage Manager), 1920px desktop, and 2560px ultrawide; capture screenshots and key measurements.
- [ ] 1.2 Draft breakpoint tiers with target content widths, sidebar widths, and gutter sizes; align with typography measure goals (68–80ch).
- [ ] 1.3 Update `visual-style` spec delta to codify the new layout requirements and QA matrix.

## 2. Implementation

- [ ] 2.1 Update CSS tokens (`src/styles/theme.css`) to introduce tiered layout variables (`--content-max`, gutters, sidebar widths) using `@media` or container queries.
- [ ] 2.2 Adjust layout components (`Base.astro`, sidebar, hero, card grids) to consume the new tokens and maintain alignment.
- [ ] 2.3 Validate typography measure clamps for prose, hero copy, and cards across tiers; ensure no overflow on narrow tablets.
- [ ] 2.4 Run responsive QA (MBP 14", 1280px, 1440px, 1920px, 2560px, 780px Stage Manager) in light/dark themes and with reduced motion.
- [ ] 2.5 Update documentation / comments if layout utilities change; attach before/after captures to PR.
- [ ] 2.6 Run `bun run check` before handoff.

## 3. Approval

- [ ] 3.1 Review with stakeholders (Tulio) to confirm the MBP 14" baseline feels native and larger displays remain balanced.
