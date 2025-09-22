# Repository Guidelines

## Project Structure & Module Organization
Keep Astro source under `src/`. Route files belong in `src/pages`, reusable views in `src/components`, and shared shells in `src/layouts`. Client-side helpers sit in `src/scripts`, design tokens and global overrides in `src/styles`, and long-form or MDX entries in `src/content`. Static assets ship from `public/`, while build and integration tweaks happen in `astro.config.mjs`. Use `dist/` only for generated output; never commit edits there.

## Build, Test, and Development Commands
Run `bun install` to sync dependencies. Start local development with `bun run dev` for hot-reloading Astro pages. Produce a production bundle with `bun run build`, then validate it via `bun run preview` before sharing changes. If dependencies shift, clear stale artifacts by deleting `dist/` and relaunching `bun run dev`.

## Coding Style & Naming Conventions
Follow two-space indentation and keep trailing commas where JavaScript allows. Markup attributes should use double quotes, and JSX/TSX mirrors Astro defaults. Name components with PascalCase such as `EnhancedProfileCard.astro`, keep routes lowercase with hyphens (`src/pages/blog/index.astro`), and co-locate component-specific styles beside the component. Shared tokens stay in `src/styles/theme.css`. Respect the existing Prettier and ESLint configs by running `bun run format` or `bun run lint` if introduced in future scripts.

## Testing Guidelines
Automated tests are not yet configured. Treat `bun run build` as the regression gate and manually spot-check key pages through `bun run preview`. When changing navigation, themes, or client scripts, confirm behavior in current desktop and mobile browsers and record noteworthy manual steps in the pull request.

## Commit & Pull Request Guidelines
Write commit subjects in imperative present tense, e.g., `Refine card spacing`, and group related changes together. Pull requests should outline the intent, reference linked issues, and include screenshots or recordings for visual adjustments. Confirm `bun run build` before opening a PR and flag any follow-up tasks or content gaps to streamline review.
