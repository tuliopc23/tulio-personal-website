# Mobile Navigation + Responsive Audit (All Routes)

Date: 2026-03-05
Repo: `tulio-personal-website`
Scope: full site mobile UX audit only (no implementation)

## Audit Method

1. Static audit of layout, scripts, route templates, and shared styles:
- `src/layouts/Base.astro`
- `src/styles/theme.css`
- `src/styles/github-activity-widget.css`
- `src/pages/*` and `src/pages/blog/*`
- shared UI components (`ArticleCard`, `ArticleCodeBlock`, `PageIndicator`, `SectionQuickNav`, `DockLink`, `GitHubActivity`, `Breadcrumbs`, `LiquidThemeToggle`)

2. Runtime mobile validation with Playwright on local Astro dev server (`127.0.0.1:4321`):
- viewports: `375x667`, `390x844`, `412x915`, `360x740`
- routes: `/`, `/about`, `/projects`, `/blog/`, `/contact`, `/now`, plus discovered blog detail routes
- checks: global overflow, horizontal scrollers, touch target sizes, sidebar open/close behavior, nav DOM availability

3. Console/network verification during runtime: module script load health.

## Route Coverage

Covered routes:
- `/`
- `/about`
- `/projects`
- `/blog/`
- `/contact`
- `/now`
- `/blog/liquid-glass-local-ai-and-the-26-era/`
- `/blog/orbstack-vs-apple-containers-vs-docker-on-macos-how-they-really-differ-under-the-hood/`

Blog category route exists in code (`src/pages/blog/category/[slug].astro`) and was statically audited, but no category link was present in current runtime dataset.

## Prioritized Findings

### Critical

1. Client navigation/theme/motion modules are failing to load (404), breaking core mobile behavior.
- Evidence:
  - `src/layouts/Base.astro:503-516` imports `../scripts/*.ts` inside inline module scripts.
  - Runtime console captured 404s for:
    - `/scripts/motion.ts`
    - `/scripts/scroll-indicators.ts`
    - `/scripts/theme.ts`
    - `/scripts/sidebar.ts`
    - `/scripts/web-vitals.ts`
- Impact:
  - Mobile sidebar open/close logic in `src/scripts/sidebar.ts` does not execute.
  - Theme toggle runtime and scroll indicator behavior are degraded/non-functional.
  - Navigation reliability is not production-safe on mobile.
- Optimization direction:
  - Move these imports to Astro-managed module entry points so URLs are bundled/resolved correctly (avoid runtime relative path imports that resolve to `/scripts/*.ts`).

2. Mobile design tokens are overridden by broader breakpoints due media-query ordering, causing phone overflow.
- Evidence:
  - Mobile tokens defined at `src/styles/theme.css:259-277` (`max-width: 768px`).
  - Then overridden later by `src/styles/theme.css:279-285` (`max-width: 1280px`) which also matches phones and resets `--content-max`/`--container-padding`.
  - Runtime (iPhone SE) produced `documentElement.scrollWidth = 491` on `/` (viewport `375`).
- Impact:
  - Home page global horizontal overflow and clipped layout risk.
  - Inconsistent mobile spacing/rhythm across routes.
- Optimization direction:
  - Reorder breakpoint declarations or split token scopes so smallest breakpoints win on phones.

### High

3. Home route has measurable horizontal overflow from shell + section blocks.
- Evidence (runtime `/`, iPhone SE):
  - overflow +116px.
  - wide nodes include `.topbar__navList`, `.section-quick-nav__list`, `.widget-carousel`, `.tools-grid`.
- Static references:
  - `src/components/SectionQuickNav.astro:207-215` sets horizontal scrolling on list, but shell constraints are insufficient to prevent page-level spill.
  - Home grid/carousel styles: `src/pages/index.astro:258-415`.
- Impact:
  - “Cut layout” risk on mobile and non-seamless horizontal drift.
- Optimization direction:
  - Enforce hard containment on mobile shells and rails (prevent any parent-level width expansion).

4. Bottom-sheet navigation is not gesture-driven; current implementation is tap/backdrop/Escape only.
- Evidence:
  - Sidebar interactions in `src/scripts/sidebar.ts` only wire menu click, backdrop click, and Escape (`73-129`).
  - No drag/swipe listeners for sheet dismissal/expansion.
- Impact:
  - Misses requested “gesture navigation optimized” target.
  - Feels less native on touch devices.
- Optimization direction:
  - Add vertical pan gesture handling for sheet dismiss/reveal and velocity thresholds.

5. Multiple primary interactive controls miss 44x44 minimum touch ergonomics.
- Evidence:
  - Brand icon link has no minimum touch box (`src/styles/theme.css:789-796`, runtime ~`32x32`).
  - Theme toggle reduced on mobile to `72x34` (`src/styles/theme.css:1498-1500`).
  - Breadcrumb links have no minimum tap size (`src/components/Breadcrumbs.astro:82-89`, runtime height ~`24.75`).
  - Footer links are compact (`src/styles/theme.css:6551-6560`, runtime ~`36.75` high).
  - GitHub progress bar segments are extremely small (`src/styles/github-activity-widget.css:322-337`, runtime ~`2-3px` high).
- Impact:
  - Miss taps and degraded one-hand usability on phones.
- Optimization direction:
  - Normalize all interactive controls to >=44x44 hit targets while preserving visual density.

6. GitHub carousel can balloon internal widths dramatically on mobile due unbounded title text.
- Evidence:
  - Runtime `/now` (iPhone SE) saw `.github-repo-carousel__track` width ~`5636px`, scrollWidth ~`67722`.
  - `.github-repo-card__title` has no truncation/wrapping constraints (`src/styles/github-activity-widget.css:133-143`).
  - Title source comes from raw repo name (`src/components/GitHubActivity.tsx:288-295`).
- Impact:
  - Major horizontal instability inside one of the most visible mobile widgets.
- Optimization direction:
  - Clamp/truncate title lines and enforce max inline width inside cards.

### Medium

7. Projects filter bar is not mobile-resilient for longer category sets.
- Evidence:
  - `src/styles/theme.css:4672-4680` uses `inline-flex` pills without mobile overflow strategy.
  - Buttons are fixed uppercase pills (`4712-4724`) and can exceed available width as categories grow/localize.
- Impact:
  - Potential clipping or wrapped, broken toolbar behavior on phones.
- Optimization direction:
  - Convert to horizontal scroll rail or wrapped grid with explicit mobile behavior.

8. Blog system is generally rail-ready, but article-level navigation affordances remain compact.
- Evidence:
  - Positive: blog rails and filters already use horizontal scroll patterns (`src/styles/theme.css:5196-5213`, `5363-5378`, `6221-6237`), code blocks support horizontal overflow (`src/components/ArticleCodeBlock.astro:156-166`).
  - Gap: article back/share/breadcrumb links remain small-height tap targets on phones (`src/pages/blog/[slug].astro:205-207`, `289-305`, plus breadcrumbs styles above).
- Impact:
  - Core reading flow works, but micro-navigation comfort is below target quality.
- Optimization direction:
  - Raise article meta/nav link hit areas and spacing on <=768px.

## Blog-Specific Summary (Requested Focus)

- List/grid adaptation:
  - Architecture is good: horizontal card rail strategy in place (`articleGrid`, `articleCarousel`) with scroll hints and indicators.
  - Risk remains from system-level JS failure (Critical #1), because scroll affordance scripts and state indicators are not reliably loaded.

- Category chips / filter chips:
  - `blogFilters` is already horizontally scrollable and touch-oriented.
  - Tap ergonomics are mostly acceptable for filter chips, but adjacent nav controls (breadcrumbs/article links) are undersized.

- Pagination/nav:
  - `PageIndicator` exists, but companion GitHub-style micro-segments elsewhere are too small; consistency in indicator hit-areas is not yet world-class.

- Article readability:
  - Typography and width constraints are strong (`articlePortable` / reading measure).
  - Code blocks handle overflow appropriately.

- Embedded media / scrolling:
  - Code and image blocks are responsive.
  - Global script-load issue still blocks expected motion/interaction polish and reliable sidebar behavior.

## Planning Inputs (For Next Step)

Implementation planning should prioritize this order:
1. Fix runtime script loading and breakpoint token cascade (foundation blockers).
2. Normalize touch ergonomics + primary navigation controls.
3. Resolve home overflow and stabilize mobile rails (tools/stack/GitHub).
4. Add gesture-native bottom-sheet interactions.
5. Polish route-specific details (blog/article/link ergonomics, projects filter resilience).

This ordering maximizes risk reduction first, then UX delight and polish.
