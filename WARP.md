# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Common commands (Bun)
- Install dependencies: bun install
- Start dev server: bun run dev
- Build production site: bun run build
- Preview built output: bun run preview
- Lint: bun run lint
- Lint (auto-fix): bun run lint:fix
- Format: bun run format
- Format (check only): bun run format:check
- Type check: bun run typecheck
- Full check pipeline: bun run check
- Tests: no test runner is configured in this repo (no test script defined). Running a single test is not applicable until tests are added.

High-level architecture and structure
- Framework and integrations
  - Astro project with MDX integration (@astrojs/mdx). Vite CSS dev sourcemaps enabled via Astro config.
  - Tooling: ESLint (flat config), Prettier (with prettier-plugin-astro), TypeScript (tsconfig extends astro/tsconfigs/strict). Package manager is Bun.
- Page shell and layout
  - src/layouts/Base.astro defines the HTML shell, links global CSS tokens (src/styles/theme.css), and loads two enhancement scripts as ES modules: src/scripts/theme.js (theme toggle) and src/scripts/sidebar.js (sidebar filtering and mobile drawer behavior). It renders a header/topbar, an optional left sidebar, a main content slot, and a footer.
- Routing (MPA)
  - Static pages in src/pages/: index.astro, about.astro, projects.astro, uses.astro, now.astro.
  - Blog index at src/pages/blog/index.astro reads MDX posts and sorts them by date.
  - Dynamic blog route at src/pages/blog/[slug].astro uses content collections to generate static paths and render the chosen post.
- Content model (Astro Content Collections)
  - src/content/config.ts defines a collection named blog with a zod schema: title (string), summary (≤200 chars), date (coerced Date), and optional tags (string array).
  - Content files live in src/content/blog/*.mdx.
- Components and UI
  - Reusable UI in src/components/ includes Card.astro, PostCard.astro, IconTile.astro, SFIcon.astro.
  - Post lists use PostCard.astro; homepage and projects use Card.astro; IconTile/SFIcon provide symbol tiles.
- Styling and theming
  - Global design tokens and major layout styles in src/styles/theme.css (dark/light themes, system-color-inspired palette, type scale, sidebar/topbar patterns).
- Static assets and build output
  - /public contains icons and images (copied as-is to the final build). Production output is emitted to /dist (do not edit by hand).

Important repo-specific notes (from existing docs)
- Quick start (README.md): bun install, then bun run dev. You can also run bun run build and bun run preview to validate a production build locally.
- Replace content (README.md): update public/avatar.svg (or image), src/pages/index.astro (landing), src/pages/blog/ (posts & index), src/components/ (UI), and src/styles/theme.css (design tokens).
- Repo guidance (AGENTS.md):
  - Keep source under src/. Routes in src/pages, reusable views in src/components, shared shells in src/layouts. Scripts under src/scripts, styles under src/styles, long-form/MDX in src/content. Assets under public/. Do not modify dist/.
  - Tests are not configured; treat bun run build plus bun run preview as the regression gate for changes.

Evidence (file:line excerpts)
- package.json — scripts and packageManager
  6–15: "scripts": { dev/build/preview/lint/lint:fix/format/format:check/typecheck/check }
  32: "packageManager": "bun@1.2.22"
- astro.config.mjs — MDX integration and Vite CSS sourcemaps
  5–10: export default defineConfig({ site: "https://example.com", integrations: [mdx()], vite: { css: { devSourcemap: true } } })
- src/content/config.ts — content collection schema
  3–11: defineCollection({ type: "content", schema: z.object({ title: z.string(), summary: z.string().max(200), date: z.coerce.date(), tags: z.array(z.string()).optional() }) })
- src/pages/blog/index.astro — load and sort posts
  5–8: const posts = await Astro.glob("../../content/blog/*.mdx"); const sorted = posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
- src/pages/blog/[slug].astro — static paths and render
  5–12: export async function getStaticPaths() { const posts = await getCollection("blog"); return posts.map(({ slug }) => ({ params: { slug } })); } const { slug } = Astro.params; const post = (await getCollection("blog")).find((p) => p.slug === slug);
- src/layouts/Base.astro — imports and scripts
  2–5: import themeCssHref from "../styles/theme.css?url"; import themeScriptSrc from "../scripts/theme.js?url"; import sidebarScriptSrc from "../scripts/sidebar.js?url";
  151–153: <script src={themeScriptSrc} type="module"></script> <script src={sidebarScriptSrc} type="module"></script>
- src/styles/theme.css — design tokens header
  1–8: :root { --sidebar-width: 260px; --content-max: 1100px; --radius: 14px; --radius-sm: 10px; --topbar-h: 56px; }
- AGENTS.md — testing note
  12–13: "Automated tests are not yet configured. Treat `bun run build` as the regression gate and manually spot-check … via `bun run preview`."
- README.md — quick start and replace content
  14–19: bun install; bun run dev; also build/preview
  23–27: replace avatar, index.astro, blog/, components/, styles/theme.css

Scope notes for Warp
- Don’t restate generic best practices; focus on repo-specific commands and structure.
- Don’t enumerate the entire file tree; the above overview is sufficient for navigation.
- Don’t invent test or deployment commands that aren’t present in package.json.
