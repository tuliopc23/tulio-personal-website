# Bentolink Motion System Parity

**Status:** draft  
**Date:** 2026-03-03  
**Author:** Codex (AI assistant)

## Overview
Bentolink’s high-fidelity feel comes from a comprehensive motion contract applied to nearly every interactive surface. The target repo has partial motion primitives but lacks fully consistent hover elevation, selective parallax coverage, and unified timing/easing behavior.

## Proposed Changes
### Files/Components Affected
- `src/styles/theme.css` - canonical `hover-elevate` utility and per-component overrides.
- `src/styles/motion.css` - reveal behavior and reduced-motion compliance.
- `src/scripts/motion.ts` - lifecycle-safe parallax/reveal orchestration.
- `src/components/ProfileCard.astro` - profile/social/contact motion parity.
- `src/components/IconTile.astro` - tile micro-lift and parent-coupled responses.
- `src/components/Card.astro`, `src/components/DockLink.astro`, `src/components/ArticleCard.astro`, `src/components/ProjectCard.astro` - shared interaction contract.
- `src/components/FeatureWritingWidget.astro` - premium card interaction parity.

## Implementation Plan
1. **Canonical Motion Contract**
   - Standardize rest/hover/focus/active transform and shadow variables.
2. **Tiered Interaction Model**
   - Enable pointer parallax only on selected premium cards.
   - Keep chips/tight controls on hover-elevate-only path.
3. **Script Normalization**
   - Ensure reveal transitions and parallax listeners are lifecycle-safe across Astro navigation.
4. **Accessibility + Performance**
   - Strict reduced-motion behavior, focus-visible parity, and frame-budget safe interactions.
5. **Verification**
   - Validate motion consistency across `/`, `/blog/`, `/blog/[slug]/`, `/projects/`, `/about/`, `/now/`.

## Risks & Considerations
- Motion over-application can reduce readability and hurt performance.
- Nested transforms can create exaggerated movement if not bounded.
- Safari behavior may diverge for complex hover/parallax combinations.

## Testing Strategy
- `bun run lint`
- `bun run typecheck`
- `bun run build`
- Manual interaction QA (mouse, keyboard, reduced-motion mode).
