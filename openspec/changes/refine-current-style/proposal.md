## Why

The current desktop styling captures the Apple-inspired tone but needs targeted polish to reach the HIG-level finish before we tackle responsive work. Refining tokens, elevation, typography, and interaction details will deliver the "perfection and excellence" baseline we want across the existing layouts.

## What Changes

- Tune light/dark surface tokens, borders, and shadow stacks to match Apple HIG panels without introducing gradients on the page chrome or tile backgrounds.
- Update typographic hierarchy, spacing, and button treatments so headings, body copy, and CTAs mirror Apple's rhythm and weight choices.
- Refresh icon/card treatments with subtle lighting accents (non-gradient fills), consistent radii, and enhanced hover/elevation behaviors.
- Document the refined design tokens and component expectations in specs for future responsive and feature work.

## Impact

- Affected specs: `visual-style`
- Affected code: `src/styles/theme.css`, `src/styles/section.css`, `src/components/*`, `src/layouts/Base.astro`
