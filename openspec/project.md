# Project Context

## Purpose

Deliver a polished, Apple Developer Documentation-inspired personal site for Tulio Cunha that curates work history, long-form writing, talks, and real-time status pages while remaining fast, accessible, and effortless to maintain.

## Core Value Propositions

- Reinforce Tulio's professional brand with an Apple-quality visual language.
- Surface portfolio artifacts, blog entries, and speaking history with minimal navigation friction.
- Provide an extensible content system so new sections (e.g., Now/Uses pages) can ship without re-architecting.

## Tech Stack

- **Framework**: Astro 5.x for island-based static site generation with hybrid SSR hooks when needed.
- **Runtime & Tooling**: Bun 1.2.x (package manager, task runner) with TypeScript 5.9.
- **Content Pipeline**: MDX for local long-form content plus Sanity v4 hosted Studio for structured data and visual editing overlays.
- **UI Layer**: Astro components with optional React islands (`@astrojs/react`) for interactive surfaces; styled via component-scoped CSS and tokens in `src/styles/theme.css`.
- **Quality Gates**: ESLint 9 + `@typescript-eslint`, Prettier 3 + `prettier-plugin-astro`, and TypeScript `--noEmit` checks enforced through `bun run check`.

## Tooling & Commands

- `bun run dev` → local dev server at http://localhost:4321 with live reload.
- `bun run build` → production static build into `dist/`.
- `bun run preview` → serve the built output for manual QA.
- `bun run lint`, `bun run format:check`, `bun run typecheck` → individual quality checks.
- `bun run check` → aggregated lint → format verification → types → build pipeline.

## Project Conventions

### Code Style

Two-space indentation, Prettier-driven formatting (`bun run format`) as the single source of truth, ESLint for Astro + TypeScript consistency, and double quotes in markup attributes. Co-locate component-specific styles in the `.astro` file when practical; fall back to shared design tokens (`src/styles/theme.css`) for colors, typography, spacing, and radii.

### Component & Page Architecture

Route pages live under `src/pages`, backed by shared layouts in `src/layouts` and reusable UI in `src/components`. Client utilities and interactive helpers stay in `src/scripts`, while long-form articles and content models reside in `src/content` (MDX) and Sanity datasets.

### Content & CMS Workflow

Sanity Studio is embedded at `/studio` during development and deployable via `bunx sanity@latest deploy`. Configure:

- `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN` (private datasets or Visual Editing)
- `PUBLIC_SANITY_STUDIO_URL` for hosted Studio deep links
- Optional `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` to toggle stega overlays

Portable Text blocks render through `astro-portabletext`, and structured content (projects, posts, now/uses) is modeled in Sanity and hydrated at build time.

### Theming, Motion, and Accessibility

Maintain parity between light and dark appearances, leverage prefers-reduced-motion to gate heavier animations, and uphold WCAG AA color contrast. Prefer subtle transition durations (120ms–200ms) and physics that echo Apple Human Interface Guidelines (ease-out, cubic-bezier).

### Testing Strategy

No automated test suite yet—treat a clean `bun run check` as the regression baseline. After UX-impacting changes, run `bun run preview` and spot-check primary flows across desktop (≥1280px) and mobile (≤414px) widths.

### Git Workflow

Work on short-lived feature branches off `main`, write imperative commit subjects ("Refine hero spacing"), and open PRs only after quality gates pass. Summaries should include manual testing notes and screenshots for visual tweaks.

## Domain Context

This site acts as Tulio Cunha's developer brand hub, combining portfolio highlights, blog posts, talks, and status pages (e.g., "Now", "Uses"). The layout mirrors Apple developer documentation: a translucent nav, left rail index, and content cards with system typography.

## Important Constraints

- Preserve fast static builds with zero server-side dependencies at runtime.
- Ensure responsive behavior from small phones through widescreen monitors.
- Keep lighthouse scores high by optimizing images, fonts, and interaction costs.
- Honor accessibility best practices (focus rings, reduced motion, semantic landmarks).

## External Dependencies & Integrations

- Astro core, `@astrojs/mdx`, `@astrojs/react`
- Sanity v4 (`@sanity/astro`, `@sanity/client`, `@sanity/code-input`, Portable Text tooling)
- Iconify icon sets for logomarks
- React 19 + styled-components for selective interactive islands

## Deployment Notes

The project outputs a static bundle and can ship to Netlify, Vercel, Cloudflare Pages, or any static host. Ensure environment variables for Sanity are configured in the deployment platform. Run `bun run check` before publishing to catch lint, format, type, and build regressions.

## Collaboration & Spec Process

Use OpenSpec to propose capability-level changes before implementation. Each proposal should track affected capabilities, tasks, and validation status (`openspec validate <change> --strict`).
