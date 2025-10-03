## Why

We’ve hit the layout/motion target but the surface can push further toward Apple’s post-WWDC 2025 Tahoe aesthetic. The goal is to deepen the Liquid Glass illusions (layered translucency, light glints, gentle hero staging) without reworking the carousel or desktop nav structure.

## What Changes

- Layered glass depth: add inner glass panes/slivers on hero, cards, and sidebar that subtly adjust blur/tint on hover/focus.
- Ambient light glints: introduce near-invisible gradients that move slightly on interaction, hinting at polished glass.
- Hero entry choreography: stage hero headline/eyebrow/lede with brief, subtle reveal animations that honor `prefers-reduced-motion`.

## Impact

- Affected specs: `visual-style`
- Affected files: `src/styles/theme.css`, hero/card/sidebar components, minimal script tweaks for pointer-based glints.
