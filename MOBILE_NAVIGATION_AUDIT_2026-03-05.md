# Mobile Navigation & Responsive Audit

Date: 2026-03-05  
Project: `tulio-personal-website`  
Scope requested: all pages/routes, mobile navigation quality, carousel/mobile layout integrity, bottom navigation behavior

## 1) Audit Scope

### Routes audited
- `/`
- `/about`
- `/projects`
- `/blog/`
- `/blog/[slug]` (sampled live route: `/blog/liquid-glass-local-ai-and-the-26-era/`)
- `/contact`
- `/now`
- `/blog/category/[slug]` template (static audit; no live category route discovered in current content)

### Files audited
- `src/layouts/Base.astro`
- `src/scripts/sidebar.ts`
- `src/pages/index.astro`
- `src/pages/projects.astro`
- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`
- `src/pages/blog/category/[slug].astro`
- `src/pages/about.astro`
- `src/pages/now.astro`
- `src/pages/contact.astro`
- `src/components/ProfileCard.astro`
- `src/components/FeatureWritingWidget.astro`
- `src/components/ProjectCard.astro`
- `src/components/SectionQuickNav.astro`
- `src/styles/theme.css`
- `src/styles/github-activity-widget.css`

### Runtime method
- Mobile viewport checks (375x667, 393x852, 430x932)
- Automated DOM overflow/protrusion scan (`/tmp/direct-mobile-audit.json`)
- Menu/drawer interaction verification on sidebar routes
- Network response scan for client script loading failures

---

## 2) Executive Summary

Current mobile experience is **not release-grade** for the requested “world-class seamless mobile navigation” target.

Primary blockers:
1. **Critical client-script loading failure**: core interactive modules (`sidebar`, `theme`, `motion`, scroll indicators, vitals) are requested as `/scripts/*.ts` and return 404.
2. **Mobile drawer is effectively broken**: menu button renders but does not open bottom sheet navigation due missing runtime script execution.
3. **Top navigation is heavily constrained** on sidebar pages (actual visible nav width ~42–97 px), forcing clipped/partially visible labels and poor touch discoverability.
4. **Home route horizontal overflow persists** (61–116 px depending viewport), with protrusions from nav/profile structures.
5. **Horizontal rails are abundant** (top nav, blog filters, article rail, GitHub rail), but because core scripts fail, affordances/assistive behavior degrade and interaction feels brittle.

---

## 3) Prioritized Findings

## Critical

### C1. Core mobile interaction scripts fail to load (404)
- Severity: **Critical**
- Evidence:
  - `src/layouts/Base.astro:503-516` imports module paths as `../scripts/*.ts` inside inline module tags.
  - Runtime network failures on `/about`: 
    - `/scripts/motion.ts` 404
    - `/scripts/scroll-indicators.ts` 404
    - `/scripts/theme.ts` 404
    - `/scripts/sidebar.ts` 404
    - `/scripts/web-vitals.ts` 404
- Impact:
  - Sidebar open/close logic not attached
  - Theme script unavailable
  - Scroll indicators and motion behaviors unavailable
  - Mobile navigation and responsiveness feel broken/inconsistent
- Optimization direction:
  - Convert these imports to Astro-bundled script inclusion strategy (so browser receives built assets, not raw TS path requests).
  - Add smoke assertion in CI/dev to fail if any first-party script request is 404.

## High

### H1. Mobile menu button does not open bottom drawer
- Severity: **High**
- Evidence:
  - Menu present on sidebar pages (`hasMenu=true`), but after click: `isOpen=false`, `aria-expanded=false`, `body[data-sidebar-state]` unset, no backdrop created.
  - Drawer state remains closed across `/about`, `/projects`, `/blog/`, `/contact`, `/now`, and sampled `/blog/[slug]`.
  - Related logic exists in `src/scripts/sidebar.ts`, but script load failure in C1 prevents execution.
- Impact:
  - Bottom sheet navigation is non-functional.
  - Primary mobile nav path on sidebar pages is broken.
- Optimization direction:
  - Fix C1 first.
  - Add E2E assertion: tap `.topbar__menu` must set `aria-expanded=true`, sidebar `.is-open`, and backdrop visible.

### H2. Topbar nav viewport budget is too small on mobile sidebar pages
- Severity: **High**
- Evidence:
  - Runtime `topbar__navMask` measured widths:
    - iPhone SE: `42/447` (clientWidth/scrollWidth)
    - iPhone 14: `60/447`
    - iPhone 14 Plus: `97/447`
  - Related layout constraints:
    - `src/styles/theme.css:766-779` (`.topbar__inner` flex row)
    - `src/styles/theme.css:781-787` (`.topbar__brandGroup` fixed flex behavior)
    - `src/styles/theme.css:891-899` (`.topbar__nav` flex region)
- Impact:
  - Global nav labels are effectively clipped into a tiny horizontal viewport.
  - Discoverability and tap confidence are reduced, especially one-handed use.
- Optimization direction:
  - Reallocate mobile header real estate (or move primary route nav to a dedicated bottom pattern on phones).
  - Ensure minimum usable nav lane width target (for example >= 55–65% of viewport width) when horizontal chips remain.

### H3. Home route has global horizontal overflow and visible protrusions
- Severity: **High**
- Evidence:
  - Runtime overflow on `/`:
    - iPhone SE: `overflowPx=116`
    - iPhone 14: `overflowPx=98`
    - iPhone 14 Plus: `overflowPx=61`
  - Protruding elements include `topbar__navList`/`topbar__navItem`/`topbar__navLink`, plus home profile structures in scan output.
  - Home uses `sidebar={false}` (`src/pages/index.astro:158`), so no drawer/menu fallback exists there.
- Impact:
  - Horizontal drift/cut layout perception on first impression route.
  - Navigation model inconsistency between home and inner routes.
- Optimization direction:
  - Eliminate root overflow on `/` at mobile breakpoints.
  - Align home route nav affordance with inner-route mobile model.

### H4. Horizontal-first navigation rails are over-concentrated without robust fallback
- Severity: **High**
- Evidence:
  - Horizontal scroll rails active on mobile:
    - Top nav mask: `src/styles/theme.css:899-907`
    - Blog filters: `src/styles/theme.css:5196-5213`, mobile variants `6120-6130`, `6248-6255`, `6269-6278`
    - Article rail: `src/styles/theme.css:5363-5377`, mobile `6221-6239`
    - GitHub carousel track: `src/styles/github-activity-widget.css:58-70`
- Impact:
  - Multiple horizontal gestures compete with vertical page scroll.
  - When scripts fail (C1), indicator/help behavior degrades and rails feel "cut".
- Optimization direction:
  - Reduce simultaneous horizontal rails per viewport section.
  - Add explicit mobile affordance hierarchy (peek cards, sticky actions, deterministic controls).

## Medium

### M1. Drawer UX is bottom-sheet styled but not gesture-operable
- Severity: **Medium**
- Evidence:
  - Bottom-sheet style exists (`src/styles/theme.css:1593-1617`) with drag handle (`1718-1731`), but no drag/swipe gesture handling in `src/scripts/sidebar.ts`.
- Impact:
  - Visual cue implies swipe behavior that does not exist.
  - Missed expectation for “gesture navigation optimized” interaction.
- Optimization direction:
  - Implement real swipe-to-close/open thresholds and velocity handling after C1/H1 are resolved.

### M2. Projects filter bar has no explicit overflow strategy in base definition
- Severity: **Medium**
- Evidence:
  - `src/styles/theme.css:4672-4680` (`.projects__filters`) is inline-flex, no `overflow-x` safeguard.
  - Runtime route had no filter chips in current data, so this remains a **content-dependent risk**.
- Impact:
  - With more categories/chip lengths, chips can clip on narrow devices.
- Optimization direction:
  - Mirror resilient overflow strategy already used by `.blogFilters`.

### M3. Accessibility resilience is partially disabled in CSS
- Severity: **Medium**
- Evidence:
  - Reduced-motion and high-contrast blocks are commented out: `src/styles/theme.css:6317-6370`.
- Impact:
  - Mobile users with motion/contrast preferences may get non-adaptive behavior.
- Optimization direction:
  - Reintroduce preference-aware fallbacks for heavy glass/backdrop and motion surfaces.

## Low

### L1. Home/inner route navigation model inconsistency
- Severity: **Low** (becomes high when paired with C1/H1)
- Evidence:
  - Home explicitly disables sidebar (`src/pages/index.astro:158`), inner pages use sidebar true.
- Impact:
  - Different nav mental model between landing and inner pages.
- Optimization direction:
  - Unify mobile primary-nav strategy across all routes.

---

## 4) Route-by-Route Snapshot

- `/`:
  - Horizontal overflow confirmed on all tested mobile viewports.
  - Menu absent (by design), nav chips protrude.
- `/about`:
  - No root overflow.
  - Menu visible but drawer cannot open (blocked by script load failure).
- `/projects`:
  - No root overflow.
  - Nav protrusion present; menu does not open drawer.
  - Filter responsiveness is partially unverified due content absence in local data.
- `/blog/`:
  - No root overflow.
  - Strong horizontal rails (`topbar`, `blogFilters`, `articleGrid`); nav protrusion present.
  - Menu does not open drawer.
- `/blog/[slug]` sample:
  - No root overflow.
  - Nav protrusion still present; menu does not open drawer.
- `/blog/category/[slug]`:
  - Template reviewed statically; relies on same `articleGrid` rail system and shared topbar constraints.
- `/contact`:
  - No root overflow.
  - Nav protrusion present; menu does not open drawer.
- `/now`:
  - No root overflow in current content shape.
  - Menu does not open drawer.

---

## 5) Planning-Ready Implementation Order (No code changes yet)

1. **Stabilize script loading (C1)**
- Fix module delivery so `theme/sidebar/motion/scroll-indicators` execute on all routes.
- Add regression guard for 4xx script requests.

2. **Restore mobile drawer core behavior (H1)**
- Ensure menu toggles drawer/backdrop/body lock state correctly.
- Verify on all sidebar routes.

3. **Re-architecture mobile primary nav space (H2 + H3 + L1)**
- Reduce topbar nav compression and eliminate home overflow.
- Unify home and inner-route mobile nav behavior.

4. **Rationalize horizontal rail strategy (H4)**
- Prioritize one dominant horizontal rail per viewport section.
- Preserve discoverability with deterministic controls.

5. **Gesture optimization and accessibility hardening (M1 + M3)**
- Add true swipe interactions for drawer.
- Re-enable reduced-motion/high-contrast protections.

6. **Content-dependent stress pass (M2)**
- Validate projects filters with max category count and long labels.

---

## 6) Exit Criteria for “World-Class Mobile” (for implementation phase)

- Zero root horizontal overflow on all primary routes at 375/393/430 widths.
- Drawer opens/closes reliably via button, backdrop tap, Escape, and touch gesture.
- No top-nav lane narrower than target usable width on phone layouts.
- Horizontal rails have explicit affordance and do not feel clipped.
- Reduced-motion and high-contrast preferences honored.
- All route transitions/navigation paths are one-handed friendly and consistent.

