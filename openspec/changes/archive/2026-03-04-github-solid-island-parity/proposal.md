# GitHub Solid Island Parity

**Status:** draft  
**Date:** 2026-03-03  
**Author:** Codex (AI assistant)

## Overview

Bentolink’s GitHub section is a rich interactive island (carousel, commit surfaces, hints, keyboard behavior, progress indicators). The target repo currently uses a simpler Astro widget and lacks Solid integration. This change ports the GitHub experience to a Solid island while preserving current architecture and token system.

## Proposed Changes

### Files/Components Affected

- `astro.config.mjs` - add Solid integration.
- `package.json` - add Solid dependencies.
- `src/components/GitHubActivity.tsx` (new) - Solid island component.
- `src/styles/github-activity-widget.css` (new/adapted) - widget-specific styling depth.
- `src/components/GitHubActivityWidget.astro` - wrapper or compatibility bridge.
- `src/pages/index.astro` - home GitHub section wiring.
- `src/pages/now.astro` - now page GitHub section wiring.

## Implementation Plan

1. **Enable Island Runtime**
   - Configure `@astrojs/solid-js` and required dependencies.
2. **Port Interactive Widget**
   - Introduce Solid component with carousel, commits, keyboard navigation, and refresh behavior.
3. **Style and Token Alignment**
   - Port/adapt `github-activity-widget.css` to target token names and depth tiers.
4. **Integrate in Home + Now**
   - Replace current widget embeddings on both pages.
5. **Resilience and Accessibility**
   - Handle token/no-token API scenarios and maintain focus/reduced-motion behavior.

## Risks & Considerations

- Dependency and integration changes may affect build/hydration if not isolated.
- GitHub API rate limiting can degrade UX without robust fallback handling.
- Migrating richer interactions without token alignment may create visual mismatch.

## Testing Strategy

- `bun run lint`
- `bun run typecheck`
- `bun run build`
- Manual QA: `/` and `/now` interactive behavior, keyboard nav, empty/error states.
