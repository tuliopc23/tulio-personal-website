# Design System Discovery — Tulio Personal Website

Generated for the Impeccable Design Elevation Pass. Normative tokens live in `src/styles/tokens/`; this note captures language, inventory, and elevation strategy.

## Design language summary

Apple HIG–aligned personal developer site: dark-first Tahoe palette, SF Pro typography, layered surfaces with 4–7 shadow stacks, liquid-glass mobile chrome, Remotion hero on home. Voice is precise, native, grounded (see `PRODUCT.md`). Not a SaaS template; materials and depth communicate engineering craft.

## Typography stack and hierarchy

| Role         | Token / stack                           | Usage                    |
| ------------ | --------------------------------------- | ------------------------ |
| UI / display | `--font-sans` (SF Pro, system-ui)       | Headings, nav, cards, UI |
| Long-form    | `--font-reader-serif` (New York Reader) | Blog prose, pull quotes  |
| Code         | `--font-mono` (SF Mono)                 | Code blocks, labels      |

Scale: fluid `clamp()` steps from `--fs-caption` through `--fs-large-title`. Profile-specific: `--fs-profile-name`, `--fs-profile-title`, `--fs-profile-bio`. Line heights: `--lh-hero` (1.08), `--lh-heading` (1.2), `--lh` / `--lh-base` (1.65).

## Color palette and semantic usage

Dark default: `--bg` / `--bg-base` `#050505`, elevated surfaces `--surface` → `--surface-raised`, text `--text-primary` → `--text-quaternary`. Semantic: `--color-primary` (blue), success/warning/error. System accents: `--blue`, `--green`, `--orange`, etc. for icon tints.

Light mode: `[data-theme="light"]` overrides in `colors.css`, `materials.css`, `shadows.css`, plus per-route blocks in `shell.css`, `surfaces.css`, `routes.css`.

## Background / surface model

- Base: near-black with radial atmosphere gradients (`--bg-radial-*`)
- Cards: `--surface-card` with hairline borders (`--surface-card-border`)
- Glass: `liquid-glass.css` — blur/saturation tiers in `materials.css`
- Grouped content: `--bg-grouped`, `--bg-elevated`

## Border / radius / shadow model

Radius: `--radius-sm` (12px) through `--radius-3xl` (56px); cards typically `--radius-md` (20px).

Shadows: 4-layer elevation `--shadow-0` … `--shadow-4`; card family `--shadow-card`, `--shadow-card-hover`; structural `--shadow-topbar`, `--shadow-sidebar`. Focus: focus-ring tokens in `shadows.css`.

## Layout / grid / container model

- Shell: sidebar + content grid in `layout.css` / `shell.css`
- Content max: `--content-max` via `tokens.css`
- Section rhythm: `section.css`, home section IDs (`section-profile`, `section-tools`, etc.)
- Mobile shell cutoff: **1024px** (`--breakpoint-lg`) — liquid bottom nav, simplified topbar

## Component inventory

| Component                | Path                                  | Role               |
| ------------------------ | ------------------------------------- | ------------------ |
| Base layout              | `src/layouts/Base.astro`              | SEO, shell, footer |
| HeroPlayer               | `src/components/HeroPlayer.tsx`       | Remotion hero      |
| ProfileCard              | `src/components/ProfileCard.astro`    | Identity block     |
| IconTile / DockLink      | `IconTile.astro`, `DockLink.astro`    | Tools/stack tiles  |
| ArticleCard              | `src/components/ArticleCard.astro`    | Blog cards         |
| ProjectCard              | `src/components/ProjectCard.astro`    | Case studies       |
| MobileLiquidGlassNav     | `navigation/MobileLiquidGlassNav.tsx` | Mobile nav         |
| ThemeToggle / SiteSearch | `navigation/*.tsx`                    | Chrome             |
| MDX kit                  | `src/components/mdx/*`                | Editorial          |

## Motion / animation model

Orchestrator: `src/scripts/motion/index.ts`. Reveals, parallax, microinteractions, glass-state, reduced-motion bridge. Lenis smooth scroll with horizontal-rail routing. Tokens: `--motion-duration-*`, `--motion-ease-spring`, spring presets in `springs.ts`.

## Responsive model

Canonical breakpoints in `breakpoints.css`: 480 / 600 / 768 / 1024 / 1280 / 1680. Blog hero uses intentional **880px** two-column exception. Legacy literals still present: 720px, 820px, 1100px, 1180px (migration target).

## Accessibility / focus model

WCAG 2.1 AA target. `prefers-reduced-motion` honored in `reduced-motion.ts` and motion CSS. Focus rings from shadow tokens. Theme boot inline script prevents FOUC.

## Inconsistencies / missing tokens

1. `routes.css` monolith (~3.5k lines) mixes utilities and route styles — hardcoded rgba in places
2. Dual paths: global `.icon-tile` in `shell.css` vs `IconTile.module.css`
3. Page-local: `about.astro` embedded styles, `contact.module.css`
4. Orphan `.now__*` rules in `routes.css` (no `/now` route)
5. Hero/ProjectCard inline styles bypass tokens
6. HTML default `data-theme="light"` vs runtime preference script

## Preserve

- SF Pro / SF Mono / New York Reader stacks
- Dark Tahoe palette and semantic system colors
- Liquid-glass mobile nav ≤1024px
- macOS elevation shadow language
- Keystatic content structure; no fake Apple branding
- Multi-page Astro (DOMContentLoaded fallbacks)
- Remotion hero concept

## Elevate

- Hero first impression and scroll cue rhythm
- Home section spacing and typographic hierarchy
- Project/case-study card storytelling
- Token compliance (breakpoint migration, IconTile dedup)
- Light-mode parity on dense surfaces
- Focus/hover/active on cards, nav, CTAs
- Mobile hero and tap targets

## Do not change

- Core route structure and nav IA
- Keystatic/CMS data model
- Cloudflare Workers deploy model
- Blog index (no topic chip filter per AGENTS.md)
- Horizontal rail touch-action contract (pan-x pan-y idle)
