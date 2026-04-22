# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Learned User Preferences

- Prefer that the agent run commands in this workspace (Wrangler, tests, git) instead of only describing what to run.
- When you ask to run checks and ship, expect a commit-and-push workflow after a clean pass.
- When you say “commit all”, exclude known scratch paths (for example `.tmp/`) unless you explicitly include them.
- Prefer commands compatible with fish shell syntax; avoid bashisms that may hang.

## Learned Workspace Facts

- Production deploy is Cloudflare Workers with static assets (`wrangler.jsonc`); Astro build-time env and Worker runtime secrets are configured separately.
- The Cloudflare MCP in Cursor does not write Worker secrets or Workers Builds env; use `pnpm run cf:secrets:push` or `pnpm run cf:api:sync` as documented below.
- Use `pnpm run test:unit` and related scripts for Vitest.
- `pnpm dev` uses `scripts/with-system-certs.mjs` for certificate handling.
- Local agent skill caches under paths listed in `.gitignore` (for example `.agents/skills/`) are not versioned.
- TypeScript is on **6.x** (`package.json`). Earlier guidance to stay on 5.9.x is outdated — some Astro packages still declare `peer typescript` as `^5`, but the pnpm `peerDependencyRules.allowedVersions` override handles this.
- This Astro site is multi-page (no `<ViewTransitions />` / client router). Don’t rely on `astro:page-load` for first-load client initialization; keep a `DOMContentLoaded`/`document.readyState` fallback.

## Commands

Use **pnpm** (see `packageManager` in `package.json`). The [Vite+](https://viteplus.dev/) CLI (`vp`) can wrap the same workflows (`vp install`, `vp run <script>`, `vp build`, …).

```bash
# Development
pnpm dev               # Start Astro dev server
pnpm build             # Production build
pnpm preview           # Preview production build

# Code quality (Vite+ wrappers)
pnpm quality           # `format:check` + `lint` (expands TS globs; see `scripts/lint-all.mjs`)
pnpm lint              # Lint with Oxlint (via vp lint)
pnpm lint:fix          # Auto-fix lint issues
pnpm format            # Format all files (vp fmt)
pnpm check             # `quality` + astro:check + unit/DOM/CMS Vitest + production build

# TypeScript
pnpm typecheck         # tsc --noEmit

# Tests
pnpm test:unit         # Unit, DOM, and CMS integrity (includes `tests/cms/**`)
pnpm test:cms          # CMS integrity only (`tests/cms/**`)
pnpm test:smoke        # Build then run smoke tests (tests/layout-smoke.test.ts)
```

### CircleCI

Optional second CI: `.circleci/config.yml` runs install, `pnpm run quality` (format + lint via `scripts/lint-all.mjs`), `astro:check`, `typecheck`, Vitest with JUnit (`store_test_results` for Insights), and `pnpm run build`. **Deploy stays on Cloudflare Workers Builds.** Validate config locally: `circleci config validate .circleci/config.yml`.

## Architecture

**Astro + Keystatic (Git-backed MDX/YAML) + `@astrojs/cloudflare` + Solid.js**

- **Astro** routes under `src/pages/`; marketing and blog listings are largely **prerendered**.
- **Keystatic** (`keystatic.config.ts`) edits Markdown/MDX and YAML singletons committed to this repo (`src/content/**`). Production admin UI lives at **`/keystatic`** when GitHub storage env vars are configured (see [GitHub mode](https://keystatic.com/docs/github-mode)).
- **Solid.js** powers interactive widgets (for example live GitHub activity).

### Content Data Flow

```
Editors → Keystatic (/keystatic) or git push → YAML/MDX in repo → `pnpm build` → Cloudflare Workers (SSR for admin + APIs; static HTML + assets from prerender)
```

Runtime loaders live under `src/lib/content/` (`posts.ts`, `projects.ts`, `page-content.ts`, `editorial.ts`). URLs for images/helpers use `src/lib/image-url.ts`.

### Routing

- `/` — Home
- `/blog` — Blog listing with tag filtering
- `/blog/[slug]` — Posts (MDX bodies)
- `/blog/category/[slug]` — Category archive
- `/projects`, `/about`, `/contact` — Static pages
- `/keystatic` — Content admin (SSR)
- `/blog/feed.xml`, `/blog/atom.xml`, `/rss.xml` — RSS/Atom feeds

### Dynamic APIs (Workers)

Moved from the legacy standalone Worker into Astro endpoints: `/api/github.json`, `/api/newsletter/subscribe`, `/newsletter/confirm`, `/api/newsletter/post-published`. Secrets and KV bindings are configured in `wrangler.jsonc` and Worker dashboard.

### Styling

CSS design system lives in `src/styles/`. Uses CSS custom properties (tokens) — **do not use inline Tailwind for design system values**, use the token variables.

### Environment Variables

See `.env.example` for required vars. Highlights:

- Keystatic GitHub mode: `KEYSTATIC_*`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
- GitHub REST token(s) for `/api/github.json`
- Newsletter: `RESEND_*`, `NEWSLETTER_WEBHOOK_SECRET`

## Cursor Cloud specific instructions

### Runtime requirements

- **pnpm 9** is the package manager (declared in `packageManager`). Enable Corepack so the pinned version is used: `corepack enable` (Node 16.13+). If enable fails with **permission denied** unlinking `/usr/local/bin/pnpm`, a root-owned shim is in the way: run `sudo corepack enable`, or `sudo rm /usr/local/bin/pnpm` then `corepack enable` again.
- **Node.js 24** is required (`.nvmrc`). Install via nvm: `nvm install 24 && nvm alias default 24`.
- Optional: install the global [Vite+](https://viteplus.dev/guide/#install-vp) CLI (`vp`) for a unified `vp install` / `vp run` / `vp build` workflow on top of the same `package.json` scripts.

### Environment setup

- Copy `.env.example` to `.env`. Keystatic local mode works without GitHub OAuth secrets (`KEYSTATIC_SECRET` unset).

### Cloudflare Workers (Git-connected deploy)

Production uses **Workers + static assets** (`wrangler.jsonc`), not Cloudflare Pages. Two separate places need the same logical tokens:

1. **Build environment** — Variables available when Cloudflare runs `pnpm install` / `pnpm run build` so Astro can embed Sanity and GitHub data (e.g. `/now`). Set `PUBLIC_SANITY_*`, `SANITY_API_READ_TOKEN`, `GITHUB_TOKEN`, `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`, `SANITY_ALLOW_BUILD_FALLBACK` in the Workers project’s **build** / environment settings.
2. **Worker runtime secrets** — `GITHUB_TOKEN` (or `GITHUB_PERSONAL_ACCESS_TOKEN`) and `SANITY_API_READ_TOKEN` for `GET /api/github.json` (homepage live widget). Set under **Variables and Secrets** for the Worker, or use `pnpm exec wrangler secret put <NAME>`.

After updating either, trigger a new deployment. Verify with `pnpm run verify:prod-github-api`.

To push **Worker secrets** and **Workers Builds** environment variables from `.env` using the Cloudflare REST API (no Wrangler), set `CLOUDFLARE_API_TOKEN` (permissions: Workers Scripts Write, Workers CI Write) and run `pnpm run cf:api:sync` (optional: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_TRIGGER_UUID`). Use `pnpm run cf:api:sync -- --dry-run` first (secret values are redacted in the log). Run `pnpm run cf:api:sync -- --help` for flags. See [`scripts/cloudflare-api-sync.mjs`](scripts/cloudflare-api-sync.mjs).

## context-mode routing

When `context-mode` MCP tools are available in Codex, OpenCode, Cursor, Gemini, Kiro, Amp, or Droid, use them for large-output analysis and indexed retrieval.

- Keep this repo's documented `pnpm`/`vp` workflow and deployment constraints first.
- Prefer `ctx_batch_execute`, `ctx_search`, `ctx_execute`, and `ctx_execute_file` when shell/file/web output would otherwise flood the conversation.
- Keep native editor tools for file writes. Do not use `context-mode` execution tools to write files.

**Workers Builds (Git) — commands in repo:** Wrangler’s `wrangler.jsonc` does **not** configure Workers Builds CI (Cloudflare ignores Wrangler “custom build” for Git builds). The canonical **build** and **deploy** commands for the connected trigger live in **`workers-builds.json`** at the repo root. Apply them to your Cloudflare trigger with:

`pnpm run cf:api:sync -- --sync-trigger-commands`  
(or `pnpm run cf:api:sync -- --trigger-commands-only` to update only those fields).

Dependency install on Workers Builds is automatic when a lockfile is present (see [build image](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)); pin the toolchain with **`packageManager`** in `package.json` and optional build vars such as `PNPM_VERSION`. If you need a custom install step in the dashboard, match the pnpm version from `package.json`.

**Wrangler (alternative for Worker secrets only):** `pnpm run cf:secrets:push` — [`scripts/wrangler-push-worker-secrets.mjs`](scripts/wrangler-push-worker-secrets.mjs).

### Cloudflare MCP (Cursor) and env

The Cloudflare MCP plugins in Cursor are authenticated, but their **registered tools do not write** Worker script secrets or Workers Builds build environment variables. Typical tools are read/list (workers, builds, logs), `search_cloudflare_documentation`, and product-specific CRUD (D1, KV, R2, Hyperdrive). `workers_builds_set_active_worker` only sets which Worker ID the MCP uses for **subsequent MCP calls**, not Cloudflare account configuration.

| Kind                                                                                                      | Use for env/secrets?                                                                                                        |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Worker runtime secrets (`GITHUB_TOKEN`, `SANITY_API_READ_TOKEN` for [`worker/index.ts`](worker/index.ts)) | **Wrangler:** `pnpm run cf:secrets:push` — or **REST:** `pnpm run cf:api:sync`                                              |
| Workers Builds (Git) env + trigger build/deploy commands                                                  | **REST:** `pnpm run cf:api:sync` — add `--sync-trigger-commands` to push `workers-builds.json` — or Cloudflare Dashboard    |
| `search_cloudflare_documentation`                                                                         | Look up official API paths and request bodies; then call Wrangler or run `cf:api:sync` / `curl` with `CLOUDFLARE_API_TOKEN` |

If your Cursor UI shows different MCP tools than above, treat **Cursor Settings → Tools & MCPs** as the source of truth.

### Running tests

- Use `pnpm run test:unit` (Vitest) for unit/DOM tests.
- `pnpm run test:astro` runs Astro integration tests (container API).
- `pnpm run test:e2e` requires Playwright browsers (`pnpm exec playwright install` first).

### Dev server

- `pnpm dev` starts Astro on port **4321**. The `dev` script wraps the command through `scripts/with-system-certs.mjs` for Node certificate handling.

### Gotchas

- `pnpm lint` runs `vp lint` which forwards options to **Oxlint**.
