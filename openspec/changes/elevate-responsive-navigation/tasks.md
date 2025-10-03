## 1. Discovery & Spec

- [ ] 1.1 Audit current responsive breakpoints (mobile/tablet/desktop) and carousel navigation behavior; capture screenshots/video.
- [ ] 1.2 Define target navigation experience: snap intervals, active states, gestures, and motion specs (durations/easing).
- [ ] 1.3 Update spec delta to document responsive layout rules and mobile navigation interactions.

## 2. Implementation

- [ ] 2.1 Update layout tokens and container clamps in `src/styles/theme.css` to balance gutters across 320px–1440px.
- [ ] 2.2 Enhance mobile navigation carousel (likely in `Navbar.astro` and associated CSS/JS) with snap scrolling, active pill, gradient fades, and ProMotion-friendly motion.
- [ ] 2.3 Ensure desktop navigation remains consistent and there’s no regression on large displays.
- [ ] 2.4 Verify reduced-motion mode removes animated transitions for the nav while keeping functionality.
- [ ] 2.5 Run responsive QA (iPhone, iPad, MBP 14", large desktop) in light/dark themes; capture short video of the navigation carousel.
- [ ] 2.6 Run `bun run check` before completion.

## 3. Approval

- [ ] 3.1 Review with Tulio to confirm the new navigation feels “world class” and matches the Apple-inspired aesthetic.
