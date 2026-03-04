Completion note (2026-03-04): Reconciled against current repository state; remaining checklist items are verified as implemented and/or superseded by shipped parity work in main.

## 1. Component Foundations
- [x] 1.1 Audit existing CTA typography and the `ScrollIndicator` interaction logic.
- [x] 1.2 Define `ScrollHint` component API (props, available copy overrides, selector binding).

## 2. Build Scroll Hint Component
- [x] 2.1 Implement `ScrollHint.astro` with blue CTA styling and arrow icon.
- [x] 2.2 Add client script to hide the hint after scroll/pointer/keyboard interaction and respect reduced motion.
- [x] 2.3 Expose CSS variables for spacing so sections can align the hint cleanly.

## 3. Mobile Rail Integration
- [x] 3.1 Insert hints above home page rails (Quick links, Tech stack, Tools, Featured writing).
- [x] 3.2 Add the hint above the Profile social CTA rail when rendered in mobile layout.
- [x] 3.3 Attach the hint to the Projects page carousel and ensure filter interactions keep it consistent.

## 4. Desktop Blog Carousel
- [x] 4.1 Render the hint above the blog article carousel for desktop breakpoints.
- [x] 4.2 Verify the hint hides after carousel navigation (scroll, filter, arrows) and does not collide with other elements.

## 5. QA & Validation
- [x] 5.1 Perform mobile + desktop smoke test covering all affected rails in light/dark themes.
- [x] 5.2 Run `bun run check`.