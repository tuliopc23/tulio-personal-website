# Project Context

## Purpose

Provide a polished, Apple Developer Docs-inspired personal website for Tulio Cunha that showcases work, long-form writing, and contact information while staying fast, accessible, and easy to maintain.

## Tech Stack

- Astro 4.x static site generation with MDX support
- TypeScript-first components and utilities
- Bun 1.2.x as runtime, package manager, and task runner
- Prettier 3.x and ESLint 9.x for formatting and linting

## Project Conventions

### Code Style

Two-space indentation, Prettier formatting (`bun run format`) as the source of truth, ESLint for Astro/TypeScript consistency, and double quotes in markup attributes. Co-locate component-specific styles, fall back to shared tokens in `src/styles/theme.css`.

### Architecture Patterns

Astro pages live under `src/pages`, backed by shared layouts in `src/layouts` and reusable UI in `src/components`. Client utilities sit in `src/scripts`; long-form content lives in `src/content` as MDX. Design tokens and global styles are centralized in `src/styles`.

### Testing Strategy

No automated test harness yet; rely on `bun run build` (or `bun run check`) before PRs and manually verify critical flows via `bun run preview` on desktop and mobile breakpoints after UX-impacting changes.

### Git Workflow

Develop on short-lived feature branches branched from `main`, use imperative commit messages, and open PRs only after running the build/check scripts and documenting noteworthy manual testing.

## Domain Context

The site acts as Tulio Cunha's developer brand hub, combining portfolio links, a blog, and status pages (e.g., "Now", "Uses") styled to evoke Apple's documentation aesthetic.

## Important Constraints

- Prioritize fast static builds and zero server-side runtime dependencies.
- Maintain dark/light theme parity and accessible color contrast.
- Keep the UX responsive across common desktop and mobile breakpoints.

## External Dependencies

- Astro core services (build/dev tooling) and the official `@astrojs/mdx` integration.
- No third-party APIs or services are currently required at runtime.
