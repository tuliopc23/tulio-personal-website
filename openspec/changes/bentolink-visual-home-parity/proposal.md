# Bentolink Visual Home Parity

**Status:** draft  
**Date:** 2026-03-03  
**Author:** Codex (AI assistant)

## Overview
The current homepage is structurally close to Bentolink but still diverges in material depth, tile treatment, CTA language, icon consistency, and obsolete route cleanup (`/uses`). This change aligns the shared visual primitives so the site reads as one coherent, high-fidelity system.

## Proposed Changes
### Files/Components Affected
- `src/pages/index.astro` - align homepage section composition and card hierarchy to Bentolink parity.
- `src/components/ProfileCard.astro` - contact/social tile treatment, spacing cadence, and 6-social target.
- `src/components/IconTile.astro` - icon tile depth and parent-hover coupling.
- `src/components/DockLink.astro` and `src/components/Card.astro` - ensure shared card surface behavior.
- `src/components/FeatureWritingWidget.astro` - chip-based CTA language parity.
- `src/layouts/Base.astro` - global nav consistency and `/uses` removal wiring.
- `src/pages/sitemap.xml.ts` and `src/styles/theme.css` - remove `uses` route/style residues.

## Implementation Plan
1. **Align Home Primitives**
   - Normalize profile shell, widget shell, and icon tile depth behaviors to Bentolink visual grammar.
2. **Complete Profile/Social Port**
   - Ensure contact chips are glass-tinted and social grid supports six cards (GitHub + Mastodon included).
3. **Writing CTA Parity**
   - Upgrade article cards to metadata-chip + icon CTA pattern.
4. **Remove Uses Surface**
   - Delete route references from nav/sitemap/styles and verify zero stale links.
5. **Verification**
   - Run lint/typecheck/build and manual parity check for `/` in light/dark and mobile/desktop.

## Risks & Considerations
- Over-aggressive style merge from Bentolink may regress the current refined architecture.
- Icon asset mismatches can break tile balance across themes.
- Mastodon handle needs canonical URL to avoid shipping a broken CTA.

## Testing Strategy
- `bun run lint`
- `bun run typecheck`
- `bun run build`
- Manual visual QA: `/` (desktop/mobile, light/dark), and confirm no `/uses` links remain.
