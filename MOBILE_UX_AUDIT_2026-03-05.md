# Mobile UX Audit (All Routes)

Date: 2026-03-05  
Repo: `tulio-personal-website`  
Scope: Full mobile navigation + responsive layout audit (no implementation)

## Audit Goal
Deliver a world-class, seamless mobile experience with:
- no clipped/cut layouts
- no navigation quirks
- strong thumb ergonomics
- clear carousel behavior for content that exceeds viewport width
- polished, reliable bottom-sheet style navigation behavior

## Method
1. Static audit of route files and shared layout/styles:
- `src/layouts/Base.astro`
- `src/styles/theme.css`
- `src/scripts/sidebar.ts`
- `src/pages/*` and key components used on those pages
2. Runtime audit with Playwright on live dev server (`http://localhost:4321`) at:
- `375x667` (iPhone SE)
- `390x844` (iPhone 13/14)
- `430x932` (large phone)
3. Interaction checks:
- top navigation behavior
- sidebar menu open/close
- horizontal scrollers/carousels
- touch target sizing scan
- overflow/clipping detection

Artifacts generated during runtime pass:
- `/tmp/mobile-audit/report.json`
- `/tmp/mobile-audit/*.png`

## Route Coverage
Audited routes:
- `/`
- `/about`
- `/projects`
- `/blog`
- `/blog/`
- `/contact`
- `/now`

Dynamic routes status:
- Blog dynamic article/category routes were discovered from `/blog` links at runtime; no additional concrete slug route was surfaced from current content in this pass.

## Executive Summary
- Layout clipping/overflow is mostly controlled across audited routes (no global horizontal document overflow detected in runtime pass).
- Mobile navigation reliability is currently blocked by a critical script loading issue.
- Current nav pattern is top-anchored + button-triggered drawer; it does not yet meet the requested “seamless bottom gesture-optimized nav” target.
- Multiple interactive controls still miss 44x44 touch ergonomics.
- Secondary routes (`/about`, `/now`, `/contact`) are structurally responsive, but rely on shared nav behavior that is currently degraded.

---

## Findings (Prioritized)

### Critical

#### C1. Shared mobile behavior scripts fail to load on nested routes (404), breaking key navigation interactions
- Impact:
  - Sidebar toggle behavior does not activate on mobile as intended.
  - Theme/sidebar/motion/scroll-indicator/web-vitals modules do not load from nested routes.
  - Global navigation polish/regression risk across almost all pages.
- Evidence:
  - Script imports are inline relative paths in `Base.astro` and resolve to `../scripts/*.ts` from route URL context.
  - Runtime capture showed 404s for:
    - `/scripts/motion.ts`
    - `/scripts/scroll-indicators.ts`
    - `/scripts/theme.ts`
    - `/scripts/sidebar.ts`
- Code references:
  - `src/layouts/Base.astro:503`
  - `src/layouts/Base.astro:505`
  - `src/layouts/Base.astro:506`
  - `src/layouts/Base.astro:508`
  - `src/layouts/Base.astro:510`
  - `src/layouts/Base.astro:511`
  - `src/layouts/Base.astro:513`
  - `src/layouts/Base.astro:515`
- Recommendation:
  - Migrate these imports to route-safe resolution (bundle-verified pathing) and add a regression check that fails if any core UI module returns non-200 in dev/build preview.

#### C2. Mobile sidebar drawer does not open in runtime interaction test (menu click no state transition)
- Impact:
  - On mobile routes with sidebar enabled (`/about`, `/projects`, `/blog`, `/contact`, `/now`), primary nav drawer is not usable in runtime test.
- Evidence:
  - After clicking `.topbar__menu`, state remained unchanged:
    - `aria-expanded: false`
    - `.sidebar` remained without `.is-open`
    - `body` did not gain locked/open state classes
- Code references (intended behavior exists but is not executing due C1):
  - `src/scripts/sidebar.ts:68`
  - `src/scripts/sidebar.ts:103`
  - `src/scripts/sidebar.ts:116`
  - `src/scripts/sidebar.ts:121`
- Recommendation:
  - Fix C1 first, then validate drawer open/close transitions as a blocking mobile nav gate.

### High

#### H1. Navigation architecture does not match target mobile UX (bottom gesture-first nav)
- Impact:
  - Current nav remains top sticky horizontal chips + optional drawer button.
  - Does not match requested seamless bottom-origin gesture navigation model.
- Code references:
  - `src/styles/theme.css:710` (top sticky topbar)
  - `src/layouts/Base.astro:257` (topbar nav structure)
  - `src/styles/theme.css:1592` (bottom-sheet visual style present for sidebar, but open interaction is button-driven)
- Recommendation:
  - Introduce explicit mobile nav mode contract (bottom bar + bottom sheet + gesture handlers + state model), not incremental patching of topbar-only logic.

#### H2. No touch gesture handling for drawer (swipe up/down drag) despite bottom-sheet visual treatment
- Impact:
  - UX feels modal/button-only, not gesture-native.
  - Misses requested gesture-optimized behavior.
- Evidence:
  - `sidebar.ts` handles click + Escape + backdrop click only; no touch/pointer drag gesture state machine.
- Code references:
  - `src/scripts/sidebar.ts:116`
  - `src/scripts/sidebar.ts:128`
  - `src/scripts/sidebar.ts:91`
- Recommendation:
  - Add drag threshold, velocity close/open, and overscroll-safe gesture interactions for mobile drawer.

#### H3. Mobile safe-area handling is incomplete in bottom drawer internals
- Impact:
  - Risk of bottom controls/filter region conflicting with home indicator and thumb reach.
- Evidence:
  - Drawer has `max-height: 75vh` and sticky filter at bottom, but no explicit bottom safe-area padding in filter region.
- Code references:
  - `src/styles/theme.css:1601`
  - `src/styles/theme.css:2119`
  - `src/styles/theme.css:2125`
- Recommendation:
  - Add safe-area aware bottom spacing in drawer footer/filter and validate on notched devices.

### Medium

#### M1. Touch target violations remain in key controls (below 44px)
- Impact:
  - Reduced tap reliability and accessibility on mobile.
- Runtime evidence examples (`390x844`):
  - Theme toggle measured ~`72x34`
  - Brand home icon measured ~`32x32`
  - Footer links measured ~`37px` height
  - Contact submit button measured ~`21px` height (unstyled button class path)
- Code references:
  - `src/styles/theme.css:1191` (base `liquidToggle` 40px height)
  - `src/styles/theme.css:1498` (mobile `liquidToggle` 34px height)
  - `src/layouts/Base.astro:249` (brand icon with `BrandLogo size={32}`)
  - `src/styles/theme.css:6551` (footer links with small vertical padding)
  - `src/pages/contact.astro:81` (submit button uses `button` class without explicit size contract)
- Recommendation:
  - Enforce a shared interactive target token/utility for all tappable UI on mobile.

#### M2. Projects filter toolbar is not explicitly mobile-scrollable/wrapping-safe
- Impact:
  - With larger category sets from CMS, filter chips can become cramped or clipped.
- Evidence:
  - `.projects__filters` is inline-flex with pill styling; no dedicated small-screen overflow strategy.
- Code references:
  - `src/styles/theme.css:4672`
  - `src/styles/theme.css:4712`
- Recommendation:
  - Add mobile overflow-x behavior (or wrap strategy) with visible affordance/hints.

#### M3. Reduced-motion accessibility behavior is partially disabled in stylesheet comments
- Impact:
  - Motion-heavy glass/elevation interactions may not degrade cleanly for reduced-motion users.
- Code references:
  - `src/styles/theme.css:6318`
  - `src/styles/theme.css:6356`
- Recommendation:
  - Revisit and restore a verified reduced-motion/high-contrast path where required.

#### M4. Contact mobile flow uses `mailto:` only (no inline success/fallback flow)
- Impact:
  - Device-dependent behavior; context switches out of app/site; potential drop-off.
- Code references:
  - `src/pages/contact.astro:93`
  - `src/pages/contact.astro:108`
- Recommendation:
  - Keep mailto as fallback, but plan a robust in-site submit path and mobile confirmation UX.

### Low

#### L1. Breadcrumb layouts have no explicit overflow strategy for long labels/titles
- Impact:
  - Can clip or compress on narrow widths, especially on deep blog/article paths.
- Code references:
  - `src/components/Breadcrumbs.astro:61`
  - `src/components/Breadcrumbs.astro:71`
- Recommendation:
  - Add overflow behavior (horizontal scroll, truncation, or wrap policy) for long breadcrumb stacks.

---

## What Is Already Working Well
- No systemic page-level horizontal overflow detected in runtime pass (`overflowPx = 0` in audited routes).
- Horizontal content regions are intentional and discoverable in several places:
  - top nav mask (`.topbar__navMask`)
  - blog filters (`.blogFilters`)
  - article rails (`.articleGrid`)
  - github activity track (`.github-repo-carousel__track`)
- Secondary routes (`/about`, `/now`, `/contact`) collapse major content grids to single-column at mobile breakpoints.

## Implementation Planning Readiness (for next step)
When implementation starts, prioritize in this strict order:
1. Fix critical script path loading (C1) and verify no 404 for core UI modules.
2. Restore/validate drawer open-close behavior (C2) with automated mobile interaction checks.
3. Define and implement bottom-nav + gesture interaction architecture (H1/H2).
4. Apply shared touch-target hardening pass (M1) across topbar/footer/contact CTA controls.
5. Finish safe-area and filter rail/mobile chip resilience (H3/M2/L1).
6. Re-run full route + viewport audit and compare against this report.

## Acceptance Criteria for "World-Class Mobile" Closure
- Zero core UI script 404s across all routes.
- Drawer opens/closes reliably via tap, backdrop, ESC, and touch gestures.
- All primary interactive controls meet >=44x44 target.
- No clipped layouts at 375, 390, 430 widths across all public routes.
- Horizontal carousels include clear affordance and smooth touch behavior without nav conflicts.
- Bottom mobile navigation pattern is coherent, consistent, and thumb-first.

