# Repository Guidelines

## Project Structure & Module Organization
Keep all Astro source in `src/`: route pages in `src/pages`, layouts in `src/layouts`, shared UI in `src/components`, client helpers under `src/scripts`, long-form content in `src/content`, and design tokens in `src/styles/theme.css`. Static assets live in `public/`; build artifacts land in `dist/` and should stay untouched. Specifications sit in `openspec/specs/`, while in-progress proposals live under `openspec/changes/`.

## Build, Test, and Development Commands
Run `bun install` after cloning to sync dependencies. Use `bun run dev` for the hot-reload server at `http://localhost:4321`, `bun run build` to emit a production bundle into `dist/`, and `bun run preview` for manual QA against the latest build. Quality gates run via `bun run check`, which chains linting, formatting verification, type checks, and a build; run individual tools with `bun run lint`, `bun run format:check`, or `bun run typecheck` when iterating.

## Coding Style & Naming Conventions
Favor two-space indentation, trailing commas where syntax allows, and double quotes in Astro or HTML attributes. Components follow PascalCase filenames such as `ProfileCard.astro`; route files stay kebab-case (`src/pages/contact.astro`). Keep component-scoped styles in the `.astro` file or an adjacent stylesheet and rely on tokens defined in `src/styles/theme.css`. Format before committing with `bun run format`, and fix lint complaints using `bun run lint:fix`.

## Testing Guidelines
There is no dedicated automated suite yet; treat a clean `bun run build` as the baseline regression check. After changing navigation, theming, or client interactions, open `bun run preview` and verify key flows on desktop and mobile widths. Add focused unit or integration tests if you introduce complex logic or new frameworks so future contributors inherit coverage.

## Commit & Pull Request Guidelines
Write commit subjects in imperative mood (e.g., "Refine hero spacing") and keep related edits grouped. Ensure `bun run check` passes before publishing a branch. Pull requests should describe intent, cite any linked issues, summarize manual verification steps, and include screenshots or recordings for visual updates. Call out follow-up tasks or known limitations so reviewers can respond appropriately.

## Security & Configuration Tips
Never commit secrets; load runtime values through environment variables or `.env.local`, which remains ignored by Git. When updating Astro, Bun, or related dependencies, review release notes and rerun `bun run check` to catch compatibility issues early. Document any required environment variables in `README.md` so new contributors can provision local setups quickly.
