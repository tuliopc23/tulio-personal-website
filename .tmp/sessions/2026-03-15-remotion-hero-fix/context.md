# Task Context: Remotion Hero Fix

Session ID: 2026-03-15-remotion-hero-fix
Created: 2026-03-15T00:00:00Z
Status: in_progress

## Current Request

Investigate and fix the homepage Remotion hero so it bleeds properly in light mode, blends seamlessly into the site background in both themes, and plays once before holding on the fully rendered Macintosh + hello end state instead of resetting to an empty frame.

## Context Files (Standards to Follow)

- /Users/tuliopinheirocunha/.config/opencode/context/core/standards/code-quality.md
- /Users/tuliopinheirocunha/.config/opencode/context/ui/web/ui-styling-standards.md
- /Users/tuliopinheirocunha/.config/opencode/context/ui/web/animation-basics.md
- /Users/tuliopinheirocunha/.config/opencode/context/core/workflows/component-planning.md

## Reference Files (Source Material to Look At)

- /Users/tuliopinheirocunha/Developer/tulio-personal-website/src/components/HeroPlayer.tsx
- /Users/tuliopinheirocunha/Developer/tulio-personal-website/src/components/remotion/HeroComposition.tsx
- /Users/tuliopinheirocunha/Developer/tulio-personal-website/src/pages/index.astro
- /Users/tuliopinheirocunha/Developer/tulio-personal-website/src/styles/system/surfaces.css
- /Users/tuliopinheirocunha/Developer/tulio-personal-website/src/styles/system/layout.css
- /Users/tuliopinheirocunha/Developer/tulio-personal-website/src/styles/system/base.css
- /Users/tuliopinheirocunha/Developer/tulio-personal-website/src/styles/system/routes.css
- /Users/tuliopinheirocunha/Developer/tulio-personal-website/src/scripts/motion.ts
- /Users/tuliopinheirocunha/Developer/tulio-personal-website/package.json

## External Docs Fetched

- Remotion Player docs: use `moveToBeginningWhenEnded={false}` when `loop={false}` to avoid rewinding to frame 0.
- Remotion Player docs: use `PlayerRef` with `ended`, `seekTo()`, and `pause()` as a safeguard for holding the final frame.
- Remotion Player docs: full-bleed cover behavior must be implemented with CSS around the Player; there is no built-in cover prop.
- Source file: `/Users/tuliopinheirocunha/Developer/tulio-personal-website/.tmp/external-context/remotion/player-astro-react-hero.md`

## Components

- Remotion player lifecycle and final-frame hold behavior
- Hero full-bleed layout and responsive sizing
- Seamless theme-aware blending between hero and page background
- Initial render fallback behavior for autoplay/hydration reliability

## Constraints

- Preserve existing homepage visual language.
- Keep the hero animation single-play and non-looping.
- End state must remain visible until refresh.
- Support both dark and light themes without visible seams.
- Favor CSS/layout fixes for cover behavior rather than distorting the composition.

## Exit Criteria

- [ ] Light mode hero visually reaches the edges without boxed side gutters.
- [ ] Hero blends into the surrounding page background with no obvious rupture in dark or light mode.
- [ ] Hero animation plays once and remains on the fully rendered final frame.
- [ ] Initial load no longer frequently shows a persistent empty frame.
