# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Learned User Preferences

- Prefer that the agent run commands in this workspace (Wrangler, tests, git) instead of only describing what to run.
- When you ask to run checks and ship, expect a commit-and-push workflow after a clean pass.
- When you say “commit all”, exclude known scratch paths (for example `.tmp/`) unless you explicitly include them.

## Learned Workspace Facts

- Production deploy is Cloudflare Workers with static assets (`wrangler.jsonc`); Astro build-time env and Worker runtime secrets are configured separately.
- The Cloudflare MCP in Cursor does not write Worker secrets or Workers Builds env; use `bun run cf:secrets:push` or `bun run cf:api:sync` as documented below.
- Use `bun run test:unit` and related scripts; bare `bun test` is not the project test runner.
- `bun dev` and some Sanity scripts use `scripts/with-system-certs.mjs` for certificate handling.
- Local agent skill caches under paths listed in `.gitignore` (for example `.agents/skills/`) are not versioned.

## Commands

```bash
# Development
bun dev               # Start Astro dev server
bun build             # Production build
bun preview           # Preview production build

# Code quality (use Biome, not ESLint/Prettier)
bun lint              # Lint with Biome
bun lint:fix          # Auto-fix lint issues
bun format            # Format all files
bun check             # Full check: lint + typecheck + build

# TypeScript
bun typecheck         # tsc --noEmit

# Sanity CMS
bun sanity:typegen    # Regenerate types after schema changes
bun sanity:webhook    # Setup Cloudflare deploy webhook

# Tests
bun test:smoke        # Build then run smoke tests (tests/layout-smoke.test.ts)
```

## Architecture

**Astro 5 + Sanity CMS + Solid.js**

- **Astro** handles routing (file-based, `src/pages/`) and static generation. The site builds to static HTML — Sanity content is fetched at build time via GROQ queries.
- **Sanity** (project `61249gtj`, dataset `production`) is the source of truth for all content. Studio is embedded at `/studio`. Sanity webhooks trigger Cloudflare Pages rebuilds on publish.
- **Solid.js** is used only for interactive client-side components (e.g., `GitHubActivityWidget.tsx`). Everything else is Astro components.

### Content Data Flow

```
Sanity Studio → Publish → Webhook → Cloudflare Pages rebuild
                                    → Astro queries via GROQ
                                    → Static HTML deployed
```

GROQ queries live in `src/sanity/lib/` — `posts.ts`, `projects.ts`, `page-content.ts`. The client is configured in `client.ts`. Image URLs are generated via `image.ts` using `@sanity/image-url`.

### Sanity Schema

Schema types live in `src/sanity/schemaTypes/`. Key types:
- **post** — Blog posts with Portable Text body, categories, tags, hero image, SEO, and workflow status (`draft` → `in-review` → `published`)
- **project** — Portfolio projects
- **Singletons** — `blogPage`, `aboutPage`, `nowPage`, `projectsPage` (fetched via `page-content.ts`)

Custom document actions (`src/sanity/actions/`) handle the editorial workflow: submit for review, approve and publish, crosspost to Dev.to/Hashnode, and unpublish.

After any schema change, run `bun sanity:typegen` to regenerate TypeScript types.

### Routing

- `/` — Home
- `/blog` — Blog listing with tag filtering
- `/blog/[slug]` — Individual post (dynamic)
- `/blog/category/[slug]` — Category archive
- `/projects`, `/about`, `/now`, `/contact` — Static pages
- `/studio` — Embedded Sanity Studio
- `/blog/feed.xml`, `/blog/atom.xml` — RSS/Atom feeds

### Styling

CSS design system lives in `src/styles/`. Uses CSS custom properties (tokens) — **do not use inline Tailwind for design system values**, use the token variables. Biome is the single linter/formatter — do not add ESLint or Prettier config.

### Environment Variables

See `.env.example` for all required vars. Key ones:
- `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`
- `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`
- Cross-posting tokens: `DEVTO_API_KEY`, `HASHNODE_TOKEN`, etc.

## Cursor Cloud specific instructions

### Runtime requirements

- **Bun 1.3.x** is the package manager and task runner. Install via `curl -fsSL https://bun.sh/install | bash -s "bun-v1.3.10"` and ensure `~/.bun/bin` is on `PATH`.
- **Node.js 24** is required (`.nvmrc`). Install via nvm: `nvm install 24 && nvm alias default 24`.

### Environment setup

- Copy `.env.example` to `.env`. The defaults (`PUBLIC_SANITY_PROJECT_ID=61249gtj`, `PUBLIC_SANITY_DATASET=production`) are sufficient.
- Set `SANITY_ALLOW_BUILD_FALLBACK=true` in `.env` to build without Sanity API tokens (offline/CI mode). Without this, `bun build` will fail if the Sanity API is unreachable or tokens are missing.

### Cloudflare Workers (Git-connected deploy)

Production uses **Workers + static assets** (`wrangler.jsonc`), not Cloudflare Pages. Two separate places need the same logical tokens:

1. **Build environment** — Variables available when Cloudflare runs `bun install` / `bun run build` so Astro can embed Sanity and GitHub data (e.g. `/now`). Set `PUBLIC_SANITY_*`, `SANITY_API_READ_TOKEN`, `GITHUB_TOKEN`, `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`, `SANITY_ALLOW_BUILD_FALLBACK` in the Workers project’s **build** / environment settings.
2. **Worker runtime secrets** — `GITHUB_TOKEN` (or `GITHUB_PERSONAL_ACCESS_TOKEN`) and `SANITY_API_READ_TOKEN` for `GET /api/github.json` (homepage live widget). Set under **Variables and Secrets** for the Worker, or use `bunx wrangler secret put <NAME>`.

After updating either, trigger a new deployment. Verify with `bun run verify:prod-github-api`.

To push **Worker secrets** and **Workers Builds** environment variables from `.env` using the Cloudflare REST API (no Wrangler), set `CLOUDFLARE_API_TOKEN` (permissions: Workers Scripts Write, Workers CI Write) and run `bun run cf:api:sync` (optional: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_TRIGGER_UUID`). Use `bun run cf:api:sync -- --dry-run` first (secret values are redacted in the log). Run `bun run cf:api:sync -- --help` for flags. See [`scripts/cloudflare-api-sync.mjs`](scripts/cloudflare-api-sync.mjs).

**Wrangler (alternative for Worker secrets only):** `bun run cf:secrets:push` — [`scripts/wrangler-push-worker-secrets.mjs`](scripts/wrangler-push-worker-secrets.mjs).

### Cloudflare MCP (Cursor) and env

The Cloudflare MCP plugins in Cursor are authenticated, but their **registered tools do not write** Worker script secrets or Workers Builds build environment variables. Typical tools are read/list (workers, builds, logs), `search_cloudflare_documentation`, and product-specific CRUD (D1, KV, R2, Hyperdrive). `workers_builds_set_active_worker` only sets which Worker ID the MCP uses for **subsequent MCP calls**, not Cloudflare account configuration.

| Kind | Use for env/secrets? |
|------|----------------------|
| Worker runtime secrets (`GITHUB_TOKEN`, `SANITY_API_READ_TOKEN` for [`worker/index.ts`](worker/index.ts)) | **Wrangler:** `bun run cf:secrets:push` — or **REST:** `bun run cf:api:sync` |
| Workers Builds (Git) env for `bun build` | **REST:** `bun run cf:api:sync` — or Cloudflare Dashboard |
| `search_cloudflare_documentation` | Look up official API paths and request bodies; then call Wrangler or run `cf:api:sync` / `curl` with `CLOUDFLARE_API_TOKEN` |

If your Cursor UI shows different MCP tools than above, treat **Cursor Settings → Tools & MCPs** as the source of truth.

### Running tests

- Use `bun run test:unit` (Vitest) for unit/DOM tests — **not** bare `bun test` (which invokes Bun's built-in runner and will fail).
- `bun run test:astro` runs Astro integration tests (container API).
- `bun run test:e2e` requires Playwright browsers (`bunx playwright install` first).

### Dev server

- `bun dev` starts Astro on port **4321**. The `dev` script wraps the command through `scripts/with-system-certs.mjs` for Node certificate handling.

### Gotchas

- The `bun lint` warning about `WARP.md` being a broken symlink is benign — ignore it.
- Biome is the sole linter/formatter. Do not add ESLint or Prettier configs.
