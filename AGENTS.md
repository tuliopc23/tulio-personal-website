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
- `pnpm dev` and some Sanity scripts use `scripts/with-system-certs.mjs` for certificate handling.
- Local agent skill caches under paths listed in `.gitignore` (for example `.agents/skills/`) are not versioned.
- TypeScript stays on **5.9.x** (`package.json`): `@typescript-eslint/*` and several Astro/Sanity packages still declare peer `typescript` as `^5` or below 6. Revisit when those packages support TypeScript 6.

## Commands

Use **pnpm** (see `packageManager` in `package.json`). The [Vite+](https://viteplus.dev/) CLI (`vp`) can wrap the same workflows (`vp install`, `vp run <script>`, `vp build`, …).

```bash
# Development
pnpm dev               # Start Astro dev server
pnpm build             # Production build
pnpm preview           # Preview production build

# Code quality (Vite+ wrappers)
pnpm lint              # Lint with Oxlint (via vp lint)
pnpm lint:fix          # Auto-fix lint issues
pnpm format            # Format all files (vp fmt)
pnpm check             # Full check: lint + typecheck + build

# TypeScript
pnpm typecheck         # tsc --noEmit

# Sanity CMS
pnpm sanity:typegen    # Regenerate types after schema changes
pnpm sanity:webhook    # Deploy the Blueprint-managed Sanity -> GitHub -> Cloudflare rebuild webhook

# Tests
pnpm test:smoke        # Build then run smoke tests (tests/layout-smoke.test.ts)
```

### CircleCI

Optional second CI: `.circleci/config.yml` runs install, `vp check`, `astro:check`, `typecheck`, Vitest with JUnit (`store_test_results` for Insights), and `pnpm run build`. **Deploy stays on Cloudflare Workers Builds and GitHub Actions** (`sanity-rebuild`) — this pipeline does not call Wrangler. Set `SANITY_API_READ_TOKEN` (and optional GitHub/Sentry vars) in the CircleCI project; on `main`, `SANITY_ALLOW_BUILD_FALLBACK` defaults to false. Validate config locally: `circleci config validate .circleci/config.yml`.

## Architecture

**Astro 5 + Sanity CMS + Solid.js**

- **Astro** handles routing (file-based, `src/pages/`) and static generation. The site builds to static HTML — Sanity content is fetched at build time via GROQ queries.
- **Sanity** (project `61249gtj`, dataset `production`) is the source of truth for all content. Studio is embedded at `/studio` only in local development; production links to the hosted Studio. Published content is reflected on the site after a rebuild/deploy.
- **Solid.js** is used only for interactive client-side components (e.g., `GitHubActivityWidget.tsx`). Everything else is Astro components.

### Content Data Flow

```
Sanity Studio → Publish → Webhook → GitHub repository_dispatch
                                    → GitHub Actions rebuild + wrangler deploy
                                    → Astro queries via GROQ at build time
                                    → Static HTML deployed by the Worker
```

GROQ queries live in `src/sanity/lib/` — `posts.ts`, `projects.ts`, `page-content.ts`. The client is configured in `client.ts`. Image URLs are generated via `image.ts` using `@sanity/image-url`.

### Sanity Schema

Schema types live in `src/sanity/schemaTypes/`. Key types:

- **post** — Blog posts with Portable Text body, categories, tags, hero image, SEO, and workflow status (`draft` → `in-review` → `published`)
- **project** — Portfolio projects
- **Singletons** — `blogPage`, `aboutPage`, `nowPage`, `projectsPage` (fetched via `page-content.ts`)

Custom document actions (`src/sanity/actions/`) handle the editorial workflow: submit for review, approve and publish, crosspost to Dev.to/Hashnode, and unpublish.

After any schema change, run `pnpm sanity:typegen` to regenerate TypeScript types.

### Routing

- `/` — Home
- `/blog` — Blog listing with tag filtering
- `/blog/[slug]` — Individual post (dynamic)
- `/blog/category/[slug]` — Category archive
- `/projects`, `/about`, `/now`, `/contact` — Static pages
- `/studio` — Embedded Sanity Studio
- `/blog/feed.xml`, `/blog/atom.xml` — RSS/Atom feeds

### Styling

CSS design system lives in `src/styles/`. Uses CSS custom properties (tokens) — **do not use inline Tailwind for design system values**, use the token variables.

### Environment Variables

See `.env.example` for all required vars. Key ones:

- `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`
- `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`
- Cross-posting tokens: `DEVTO_API_KEY`, `HASHNODE_TOKEN`, etc.

## Cursor Cloud specific instructions

### Runtime requirements

- **pnpm 9** is the package manager (declared in `packageManager`). Enable Corepack so the pinned version is used: `corepack enable` (Node 16.13+). If enable fails with **permission denied** unlinking `/usr/local/bin/pnpm`, a root-owned shim is in the way: run `sudo corepack enable`, or `sudo rm /usr/local/bin/pnpm` then `corepack enable` again.
- **Node.js 24** is required (`.nvmrc`). Install via nvm: `nvm install 24 && nvm alias default 24`.
- Optional: install the global [Vite+](https://viteplus.dev/guide/#install-vp) CLI (`vp`) for a unified `vp install` / `vp run` / `vp build` workflow on top of the same `package.json` scripts.

### Environment setup

- Copy `.env.example` to `.env`. The defaults (`PUBLIC_SANITY_PROJECT_ID=61249gtj`, `PUBLIC_SANITY_DATASET=production`) are sufficient.
- Set `SANITY_ALLOW_BUILD_FALLBACK=true` in `.env` to build without Sanity API tokens (offline/CI mode). Without this, `pnpm run build` will fail if the Sanity API is unreachable or tokens are missing.

### Cloudflare Workers (Git-connected deploy)

Production uses **Workers + static assets** (`wrangler.jsonc`), not Cloudflare Pages. Two separate places need the same logical tokens:

1. **Build environment** — Variables available when Cloudflare runs `pnpm install` / `pnpm run build` so Astro can embed Sanity and GitHub data (e.g. `/now`). Set `PUBLIC_SANITY_*`, `SANITY_API_READ_TOKEN`, `GITHUB_TOKEN`, `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`, `SANITY_ALLOW_BUILD_FALLBACK` in the Workers project’s **build** / environment settings.
2. **Worker runtime secrets** — `GITHUB_TOKEN` (or `GITHUB_PERSONAL_ACCESS_TOKEN`) and `SANITY_API_READ_TOKEN` for `GET /api/github.json` (homepage live widget). Set under **Variables and Secrets** for the Worker, or use `pnpm exec wrangler secret put <NAME>`.

After updating either, trigger a new deployment. Verify with `pnpm run verify:prod-github-api`.

To push **Worker secrets** and **Workers Builds** environment variables from `.env` using the Cloudflare REST API (no Wrangler), set `CLOUDFLARE_API_TOKEN` (permissions: Workers Scripts Write, Workers CI Write) and run `pnpm run cf:api:sync` (optional: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_TRIGGER_UUID`). Use `pnpm run cf:api:sync -- --dry-run` first (secret values are redacted in the log). Run `pnpm run cf:api:sync -- --help` for flags. See [`scripts/cloudflare-api-sync.mjs`](scripts/cloudflare-api-sync.mjs).

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
