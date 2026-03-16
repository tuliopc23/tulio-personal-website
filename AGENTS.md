# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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
