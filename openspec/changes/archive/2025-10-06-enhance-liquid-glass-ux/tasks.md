## 1. Design & Spec

- [ ] 1.1 Audit hero, cards, and sidebar for glass layer opportunities; capture references from macOS Tahoe.
- [ ] 1.2 Define light glint behaviors and hero reveal timing respecting ProMotion and reduced motion.
- [ ] 1.3 Update visual-style delta documenting layered glass, glints, and hero staging.

## 2. Implementation

- [ ] 2.1 Introduce layered glass CSS tokens/effects in `src/styles/theme.css` (extra blur layer, tint adjustments, glint overlays).
- [ ] 2.2 Apply new glass layers to hero section, cards, and sidebar while keeping existing structure intact.
- [ ] 2.3 Add pointer/scroll-based glint script (or CSS) with fallbacks for reduced motion.
- [ ] 2.4 Implement hero entry choreography (eyebrow → title → lede) with quick, accessible timing.
- [ ] 2.5 QA across desktop/tablet/mobile in both themes; verify reduced-motion behavior.
- [ ] 2.6 Run `bun run check` before completion.

## 3. Approval

- [ ] 3.1 Review with Tulio to confirm the Liquid Glass enhancements feel aligned with Apple’s macOS Tahoe direction.
