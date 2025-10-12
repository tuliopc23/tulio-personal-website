# Update Liquid Theme Toggle & Slider Evaluation

**Status:** draft
**Date:** 2025-10-12
**Author:** Codex (AI assistant)

## Overview
Two high-fidelity UI demos were provided:
1. A liquid glass toggle (drag + tap) that aligns with the Apple-inspired aesthetic.
2. A liquid glass slider with iOS-style thumb polish.

We want to replace the current light/dark toggle with the liquid version while retaining the existing theme-switching behaviour, accessibility, and performance guarantees. We also need to evaluate where the slider could add real value to the site without introducing superficial UI.

## Proposed Changes

### Toggle Replacement Scope
- Build an Astro/TSX component that ports the liquid toggle visuals into our design system (no external CDN scripts once shipped).
- Integrate with the existing theme persistence logic (`src/scripts/theme.ts`) and ensure keyboard + pointer interactions remain accessible.
- Align colors, shadows, and motion with current design tokens, avoiding hard-coded values.
- Ensure the toggle respects reduced motion preferences and does not degrade performance on low-end devices.

### Slider Exploration Scope
- Audit site sections (Projects, Profile, Now page, etc.) for interactions that could benefit from a glass slider (e.g., timeline scrubber, skill emphasis level, brightness control for demos).
- Prototype or document a recommended use case (or explicitly justify if the slider should remain unused for now).
- If a use case is identified, capture requirements for future implementation (not part of this change).

## Implementation Plan

1. **Component Audit & Extraction**
   - Analyse the provided toggle/slider source to list dependencies (GSAP, Draggable, filters) and determine what can be re-implemented or replaced.
   - Identify which parts can be done with native CSS/JS vs. third-party libraries.

2. **Toggle Integration Design**
   - Sketch how the liquid toggle maps to our current HTML structure and CSS tokens.
   - Define accessibility behaviours (ARIA states, keyboard, drag).
   - Document fallbacks for reduced motion / no-pointer environments.

3. **Theme Script Updates**
   - Update `src/scripts/theme.ts` (or new module) to handle drag gestures while keeping persistence logic intact.
   - Ensure TypeScript types reflect new interactions and remain strict-mode compliant.

4. **Slider Evaluation**
   - Review site pages to find meaningful slider use cases.
   - Produce a short recommendation memo (include if/where to integrate, or rationale for deferring).

5. **Spec & Docs Updates**
   - Update relevant specs (`styling-system`, `client-scripts`) to codify the new toggle behaviour and slider evaluation deliverables.
   - Update project docs if the toggle API or design tokens change.

6. **Verification**
   - Run `bun run check` and targeted manual tests (keyboard, touch, reduced motion).
   - Provide before/after comparison notes to confirm the toggle still switches themes correctly.

## Risks & Considerations
- **Performance:** The demo toggle uses GSAP/Draggable; we need a lean implementation or evaluated fallback.
- **Accessibility:** Complex motion must honour reduced-motion preferences and remain keyboard friendly.
- **Scope creep:** Slider may not have a compelling use case; ensure evaluation results in a clear decision, not half-shipped UI.

## Testing Strategy
- Type checks (`bun run typecheck`).
- UI interaction tests on desktop + mobile (click, drag, keyboard).
- Manual verification against reduced motion and high contrast settings.

## Documentation Updates
- Update design/token documentation if new CSS variables are introduced.
- Document slider evaluation outcomes (even if deferred).
