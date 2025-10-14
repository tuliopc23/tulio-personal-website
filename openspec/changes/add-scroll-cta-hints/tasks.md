## 1. Component Foundations
- [ ] 1.1 Audit existing CTA typography and the `ScrollIndicator` interaction logic.
- [ ] 1.2 Define `ScrollHint` component API (props, available copy overrides, selector binding).

## 2. Build Scroll Hint Component
- [ ] 2.1 Implement `ScrollHint.astro` with blue CTA styling and arrow icon.
- [ ] 2.2 Add client script to hide the hint after scroll/pointer/keyboard interaction and respect reduced motion.
- [ ] 2.3 Expose CSS variables for spacing so sections can align the hint cleanly.

## 3. Mobile Rail Integration
- [ ] 3.1 Insert hints above home page rails (Quick links, Tech stack, Tools, Featured writing).
- [ ] 3.2 Add the hint above the Profile social CTA rail when rendered in mobile layout.
- [ ] 3.3 Attach the hint to the Projects page carousel and ensure filter interactions keep it consistent.

## 4. Desktop Blog Carousel
- [ ] 4.1 Render the hint above the blog article carousel for desktop breakpoints.
- [ ] 4.2 Verify the hint hides after carousel navigation (scroll, filter, arrows) and does not collide with other elements.

## 5. QA & Validation
- [ ] 5.1 Perform mobile + desktop smoke test covering all affected rails in light/dark themes.
- [ ] 5.2 Run `bun run check`.
