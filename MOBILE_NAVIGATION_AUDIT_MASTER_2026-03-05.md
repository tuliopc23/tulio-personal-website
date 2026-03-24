# Mobile Navigation Audit Master Report

Date: 2026-03-05  
Project: `tulio-personal-website`  
Requested scope: full mobile navigation/responsiveness audit across all routes (no implementation)

## 1) Audit Scope

### Routes audited (UI)

- `/`
- `/about`
- `/projects`
- `/blog/`
- `/contact`
- `/now`
- `/blog/liquid-glass-local-ai-and-the-26-era/`
- `/blog/orbstack-vs-apple-containers-vs-docker-on-macos-how-they-really-differ-under-the-hood/`
- `/blog/neovim-lazyvim-vs-vscode-jetbrains-zed-helix-2025/`
- `/blog/the-lost-potencial-of-the-native-desktop-app/`
- `/blog/building-a-terminal-portfolio-web-app/`
- `/blog/toolchain-audit-notes/`

### Routes audited (template/static only)

- `/blog/category/[slug]` (template reviewed; no concrete category route available in live local content)

### Non-UI routes reviewed for completeness

- `/api/auto-publish`
- `/blog/feed.xml`
- `/blog/atom.xml`
- `/sitemap.xml`
- `/studio`

## 2) Audit Method

1. Static code audit of shared shell + route templates/components:

- `src/layouts/Base.astro`
- `src/styles/theme.css`
- `src/styles/github-activity-widget.css`
- `src/scripts/sidebar.ts`
- all page files under `src/pages/`

2. Parallel subagent audits (4 tracks):

- global shell/nav/drawer
- home/projects/carousels
- blog index/article/category
- supporting routes (`about`, `contact`, `now`)

3. Runtime Playwright sweep on this repo’s own dev server:

- target: `http://127.0.0.1:4321`
- viewports: `375x667`, `390x844`, `430x932`, `412x915`
- artifacts:
  - `/tmp/mobile-audit-local-report.json`
  - `/tmp/mobile-audit-local-shots/*`

## 3) Executive Summary

Current mobile UX is **not ready** for the requested world-class seamless target.

Primary blockers:

1. **Critical script-loading failure** on client modules (`/scripts/*.ts` and `/blog/scripts/*.ts` return 404), which breaks mobile interaction logic.
2. **Drawer/nav core failure**: menu button exists but drawer never opens in runtime checks (44/44 failures).
3. **Mobile nav lane compression**: top nav visible area on sidebar routes is only `42px` to `97px` wide while content width is ~`447-448px`.
4. **Home horizontal overflow** remains across all tested phone sizes (`+61px` to `+116px`).
5. **Touch ergonomics** below target in key controls (brand icon, theme toggle, breadcrumbs, article back links, footer links).

## 4) Prioritized Findings

### Critical

#### C1. Core client modules are loaded via route-relative TS paths and fail (404)

- Evidence:
  - Script imports in shell: `src/layouts/Base.astro:503-516`
  - Runtime failures (local):
    - `/scripts/motion.ts` (25)
    - `/scripts/scroll-indicators.ts` (25)
    - `/scripts/theme.ts` (25)
    - `/scripts/sidebar.ts` (25)
    - `/scripts/web-vitals.ts` (25)
    - `/blog/scripts/motion.ts` (24)
    - `/blog/scripts/scroll-indicators.ts` (24)
    - `/blog/scripts/theme.ts` (24)
    - `/blog/scripts/sidebar.ts` (24)
    - `/blog/scripts/web-vitals.ts` (24)
  - Direct checks: `/scripts/sidebar.ts` and `/blog/scripts/sidebar.ts` both 404.
- Impact:
  - Sidebar open/close logic does not execute.
  - Theme/motion/scroll indicator behavior degrades or fails.
  - Mobile nav reliability is broken across route groups.

#### C2. Mobile drawer open behavior fails everywhere it should work

- Evidence:
  - Drawer logic exists: `src/scripts/sidebar.ts:103-126`
  - Runtime drawer checks: `44 total`, `0 pass`, `44 fail`
  - Failed state after menu click on sidebar routes:
    - `sidebarOpen=false`
    - `bodyLocked=false`
    - `backdropOpen=false`
    - `ariaExpanded=false`
- Impact:
  - Primary mobile navigation path is non-functional on non-home pages.

#### C3. Breakpoint token cascade is ordered to let broader queries override phone tokens

- Evidence:
  - Mobile token block: `src/styles/theme.css:259-277` (`max-width: 768px`)
  - Broader block later: `src/styles/theme.css:279-285` (`max-width: 1280px`) overriding `--content-max` and `--container-padding`
- Impact:
  - Inconsistent phone spacing/layout and contribution to overflow conditions.

### High

#### H1. Home route has persistent horizontal overflow

- Evidence:
  - Runtime overflow on `/`:
    - iPhone SE: `+116px`
    - iPhone 14: `+101px`
    - iPhone 14 Plus: `+61px`
    - Pixel 7: `+79px`
  - Overflow nodes include top nav structures (for example `ul.topbar__navList`).
- Impact:
  - Cut layout perception and lateral drift on first impression route.

#### H2. Topbar nav viewport is extremely narrow on sidebar pages

- Evidence:
  - On routes with menu/sidebar, `topbar__navMask` width is only `42px..97px` vs `447..448px` content width.
  - Related layout constraints:
    - `src/styles/theme.css:766-779` (`.topbar__inner`)
    - `src/styles/theme.css:781-787` (`.topbar__brandGroup` fixed behavior)
    - `src/styles/theme.css:891-909` (`.topbar__nav` + horizontal mask)
- Impact:
  - Global nav labels are clipped/hidden and hard to discover.

#### H3. Drawer is visually a bottom sheet but not gesture-operable

- Evidence:
  - Bottom-sheet styling: `src/styles/theme.css:1592-1617`
  - Drag-handle visual cue: `src/styles/theme.css:1718-1730`
  - No swipe/pan handling in script: `src/scripts/sidebar.ts:116-137` (click/backdrop/Escape only)
- Impact:
  - Mismatch between visual affordance and behavior; fails gesture-optimized target.

#### H4. Horizontal rail stacking creates gesture competition

- Evidence:
  - Top nav rail: `src/styles/theme.css:899-909`
  - Blog filters rail: `src/styles/theme.css:5196-5213`
  - Article cards rail: `src/styles/theme.css:5363-5378`, `6221-6237`
  - GitHub rail: `src/styles/github-activity-widget.css:58-70`
- Runtime summary:
  - `topbar__navMask` rail ratio up to `10.67x`
  - `articleGrid` rail ratio up to `8.26x`
- Impact:
  - Competing horizontal gestures reduce seamless vertical browsing.

### Medium

#### M1. Global touch lock can block desirable mobile pan behavior

- Evidence:
  - `body.is-locked { overflow: hidden; touch-action: none; }` in `src/styles/theme.css:449-453`
- Impact:
  - Risk of suppressing gesture propagation while drawer is open (especially on mobile browsers).

#### M2. Mobile drawer inner sizing conflicts with desktop sticky model

- Evidence:
  - Mobile drawer inner rules: `src/styles/theme.css:1624-1628`
  - Global sticky inner rules still apply: `src/styles/theme.css:1669-1675`
- Impact:
  - Potential scroll/clipping inconsistencies in long drawer content.

#### M3. Bottom safe-area is not explicitly accounted for in drawer footer/filter

- Evidence:
  - Drawer/filter region: `src/styles/theme.css:1593-1613`, `2119-2128`
  - No explicit `safe-area-inset-bottom` padding in drawer/filter section.
- Impact:
  - Lower controls can sit too close to home-indicator gesture area.

#### M4. Reduced-motion and high-contrast overrides are disabled (commented out)

- Evidence:
  - Disabled blocks: `src/styles/theme.css:6292-6368`
- Impact:
  - Accessibility behavior for motion/glass heavy transitions is weaker than expected.

#### M5. `"/"` shortcut focuses filter even when drawer is closed

- Evidence:
  - `src/scripts/sidebar.ts:133-135`
- Impact:
  - Focus can jump to hidden/offscreen control.

### Low

#### L1. Touch target misses across important controls

- Runtime top offenders:
  - `a.breadcrumbs__link` (60 detections under 44px height)
  - `a.topbar__brandIcon` (48 detections; ~`32x32`)
  - `button.liquidToggle` (48 detections; ~`72x34`)
  - `a.article__backLink.motion-link-inline` (24 detections; ~25px height)
- Code refs:
  - Brand icon: `src/layouts/Base.astro:249-251`, `src/styles/theme.css:789-796`
  - Toggle dimensions: `src/styles/theme.css:1191-1194`, mobile override `1498-1501`
  - Breadcrumb link style: `src/components/Breadcrumbs.astro:82-89`
  - Footer links compact padding: `src/styles/theme.css:6551-6560`

#### L2. Contact CTA class mismatch likely reduces intended button styling

- Evidence:
  - Contact submit uses class `button`: `src/pages/contact.astro:81`
  - Shared button styles are under `.btn`: `src/styles/theme.css:6385-6455`
- Impact:
  - Inconsistent visual/tap affordance for primary contact action.

#### L3. GitHub repo title lacks truncation guard

- Evidence:
  - Title source: `src/components/GitHubActivity.tsx:288-295`
  - Title style has no truncation: `src/styles/github-activity-widget.css:133-143`
- Impact:
  - Long names can bloat internal card/track widths on mobile.

## 5) Route-by-Route Notes

- `/`
  - Global horizontal overflow on all tested phones.
  - Menu absent by design on home, so top nav chip lane must stand alone and currently overflows.

- `/about`, `/projects`, `/blog/`, `/contact`, `/now`, and sampled `/blog/*` slugs
  - Menu exists.
  - Drawer never opens due script load failure.
  - Top nav lane extremely compressed.

- `/blog/`
  - Multiple simultaneous horizontal rails (top nav + filters + article rail).

- `/blog/[slug]` sampled slugs
  - Same nav/drawer breakage as other sidebar routes.
  - Additional small touch targets in breadcrumb/back-link row.

## 6) Implementation Plan (Audit-Driven, No Code Changes Yet)

### Phase 0: Reliability blockers (must complete first)

1. Fix shell module loading strategy so first-party scripts do not 404 on any route depth.
2. Add automated assertion: zero 4xx for all first-party UI scripts on all page routes.
3. Re-verify drawer state transitions via E2E on all sidebar routes.

### Phase 1: Mobile navigation architecture

1. Define canonical phone nav model (bottom-first, thumb-first) and apply consistently across home + inner routes.
2. Remove current nav-lane compression by reallocating topbar space or moving primary route switching into dedicated bottom pattern.
3. Establish a clear hierarchy between top contextual actions and bottom primary navigation.

### Phase 2: Gesture-native drawer behavior

1. Implement drag-to-open/drag-to-close with threshold + velocity handling.
2. Keep backdrop, body lock, and scroll behavior compatible with vertical pan.
3. Add focus management contract: initial focus, trap while open, restore focus on close.

### Phase 3: Layout containment + rails

1. Eliminate home overflow in all phone breakpoints.
2. Standardize carousel/rail strategy so only one dominant horizontal gesture surface appears per section.
3. Add explicit overflow behavior for projects filter chips and long GitHub titles.

### Phase 4: Touch ergonomics + accessibility

1. Enforce minimum `44x44` interactive targets globally for mobile controls.
2. Restore reduced-motion/high-contrast-safe behavior for motion/glass-heavy components.
3. Add safe-area bottom padding for drawer/filter/footer controls where needed.

### Phase 5: Verification gates

1. Playwright matrix: all UI routes x 4 phone viewports.
2. Assertions:

- no global horizontal overflow (`documentElement.scrollWidth <= viewportWidth + 1`)
- drawer open/close passes (tap, backdrop, Escape, gesture)
- no first-party script 4xx
- touch targets >= 44x44 for primary nav/actions

3. Manual iOS Safari gesture sanity pass (back gesture vs horizontal rails).

## 7) Definition of Done for “World-Class Mobile”

- Zero client module 404s for core UI scripts.
- Drawer is reliable and gesture-native on all sidebar routes.
- No clipped/cut layouts on 375/390/412/430 widths.
- Primary mobile navigation is thumb-first and consistent across all pages.
- Horizontal rails are intentional, discoverable, and non-conflicting.
- Accessibility preferences (reduced motion/high contrast) are honored.
