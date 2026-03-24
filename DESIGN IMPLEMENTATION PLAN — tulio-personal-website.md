# Design Implementation Plan — tulio-personal-website

Date: 2026-03-04  
Status: Claude-ready execution plan (audited + expanded)

## Why this update exists

This plan has been upgraded from a broad refactor outline into an execution-safe implementation plan with:

- verified current issues in code,
- measurable baselines,
- mandatory UI direction inputs from `ui-ux-pro-max` + `frontend-design`,
- concrete sequencing and rollback points for Claude Code.

## Mandatory Design Direction (apply across all phases)

Source inputs:

- `ui-ux-pro-max` design-system query (`personal portfolio terminal-first editorial premium storytelling`)
- `frontend-design` quality rules (bold, intentional, non-generic, production-grade)

Direction to implement:

1. Keep the current Apple/docs + liquid-glass identity as the base system (do not replace with a template look).
2. Preserve SF Pro + SF Mono foundation already used in the repo (no random font pivots to generic stacks).
3. Use motion intentionally: 1-2 key animated moments per view, not “animate everything”.
4. Enforce keyboard-visible focus states and `prefers-reduced-motion` parity in all interaction paths.
5. Keep neutral/background-led palette with disciplined blue accent hierarchy and strong contrast.

## Audit Snapshot (current codebase evidence)

1. `src/styles/theme.css` is still `7198` lines.
2. `src/components/portable-text/Divider.astro` has a live variable bug:
   - `_style` is declared, but template uses `style`.
3. `prefers-reduced-motion` handling for project filtering is still commented out in `theme.css` (projects grid block).
4. Token duplication remains high (active styles only):
   - `--motion-ease-out`: 4+ definitions
   - `--motion-duration-sm`: 4+ definitions
   - `--glass-blur-base`: 5+ definitions
   - `--glass-saturation-base`: 5+ definitions
   - `--shadow-card`: 6+ definitions
   - `--bg`, `--blue`, `--surface`: duplicated between `theme.css` and token files
5. Design-system override docs are inconsistent with real page intent (generic page archetypes like “Search Results/Settings” for real site pages), so implementation guidance is currently noisy.
6. Existing plan uses `npm run build`; this repo’s package manager contract is `bun` (`bun run build`, `bun run check`, etc.).

## Non-Negotiable Engineering Rules

1. No big-bang rewrite: every phase must be shippable independently.
2. One token owner file per token family.
3. Any temporary compatibility alias must be explicitly marked and removed in a later phase.
4. Every phase ends with:
   - build check,
   - quick visual parity pass (Home, Blog Index, Blog Article, Projects),
   - a11y smoke check (focus + reduced motion + contrast spot-check).
5. Do not include `theme.css.backup` in quality grep metrics.

## Token Ownership Contract (final target)

1. `src/styles/tokens/colors.css`
   - Owns: `--bg*`, `--surface*`, `--text*`, semantic colors, accent/link colors.
2. `src/styles/tokens/shadows.css`
   - Owns: `--shadow-*`, `--focus-ring`.
3. `src/styles/tokens/spacing.css`
   - Owns: spacing scale, radius scale, size tokens, z-index tokens.
4. `src/styles/tokens/typography.css`
   - Owns: font families, size scale, line heights, tracking.
5. `src/styles/tokens/materials.css`
   - Owns: glass/material opacity, blur utilities, saturation utilities, overlay materials.
6. `src/styles/tokens/motion.css`
   - Owns: durations, easings, spring tokens, reduced-motion variable overrides.
7. `src/styles/tokens/animations.css`
   - Owns: keyframes and animation utility classes only (no duplicated duration/easing token definitions).

## Execution Plan

### Phase 0 — Safety + Baseline Capture (30-45 min)

Goal: establish measurable baseline and safe rollback points.

Actions:

1. Create a baseline branch/commit before edits.
2. Capture baseline metrics:
   - `wc -l src/styles/theme.css`
   - token duplication counts (see Verification Commands section).
3. Capture baseline screenshots:
   - `/`
   - `/blog`
   - `/blog/[slug]` (any published post)
   - `/projects`
4. Record current check status:
   - `bun run build`
   - `bun run check:ci`

Exit criteria:

1. Baseline metrics and screenshots attached to PR/worklog.
2. Build/check status known before code changes.

---

### Phase 1 — Critical Functional Fixes (P0, 45-75 min)

Goal: remove active bugs before structural refactor.

Actions:

1. Fix `Divider.astro` variable usage:
   - Use `_style` consistently in class and conditional rendering.
2. Re-enable project-filter reduced-motion block in `theme.css`.
3. Add a short regression check:
   - Divider renders all variants.
   - Project filtering remains functional with and without reduced motion.

Exit criteria:

1. Divider no longer references undefined `style`.
2. Reduced-motion users get transition-free project filter behavior.
3. `bun run build` passes.

---

### Phase 2 — Design System Docs Alignment (P0/P1, 1-2 h)

Goal: make implementation docs trustworthy for Claude execution.

Actions:

1. Rewrite `design-system/tulio-personal-website/MASTER.md` to match real product:
   - Personal developer site
   - Apple/docs + liquid glass tone
   - neutral + blue accent constraints
   - motion/a11y constraints
2. Rewrite page overrides to match real pages and actual goals:
   - `pages/home.md`
   - `pages/projects.md`
   - `pages/blog-index.md`
   - `pages/blog-article.md`
   - `pages/about-uses-now.md`
3. Remove generic, mismatched archetypes (“Search Results”, “Settings/Profile”, irrelevant CTA scripts).
4. Add per-page “Do / Avoid / Verification” blocks to make Claude implementation deterministic.

Exit criteria:

1. Overrides reflect actual page semantics in this repo.
2. No contradictory design instructions between Master and page files.

---

### Phase 3 — Token Consolidation (P1, 4-6 h)

Goal: eliminate duplicated token definitions across `theme.css` and token files.

Actions:

1. Consolidate motion:
   - keep durations/easings in `tokens/motion.css`,
   - remove duplicate motion token declarations from `tokens/animations.css`,
   - keep only keyframes/utilities in `tokens/animations.css`,
   - remove theme-level redefinitions except explicit compatibility aliases.
2. Consolidate glass/material:
   - `--glass-blur-*` and `--glass-saturation-*` must live in `tokens/materials.css` + `tokens/motion.css` only where semantically appropriate.
3. Consolidate color:
   - remove root redeclarations in `theme.css` for tokens already owned by `tokens/colors.css`.
4. Consolidate shadows:
   - remove duplicate `--shadow-card*` declarations from `theme.css`.
5. Consolidate radius/typography:
   - remove duplicated radius/font/line-height declarations from `theme.css`.
6. Keep a temporary alias block in `theme.css` only for legacy selector compatibility, clearly marked `TODO remove`.

Exit criteria:

1. Each token family maps to one owner file.
2. Duplicate-definition grep thresholds (excluding backup files):
   - `--motion-ease-out`: max 1 per theme mode context
   - `--glass-blur-base`: max 1 per theme mode context
   - `--shadow-card`: max 1 per theme mode context
3. `bun run build` and visual parity pass are green.

---

### Phase 4 — Component Style Extraction (P1, 5-8 h)

Goal: reduce monolithic CSS while preserving rendering parity.

Actions:

1. Extract in this order (high impact first):
   - `ProjectCard`
   - Sidebar shell (`Base.astro` related blocks)
   - Topbar shell (`Base.astro` related blocks)
   - Blog/article styles
   - page-local blocks (`index`, `projects`, `about`, `now`, `blog/index`)
2. Prefer page/component-local style files or scoped Astro `<style>` blocks.
3. For global dependencies (`[data-theme]`, shared utility classes), keep minimal global layer in `theme.css`.
4. After each extraction chunk:
   - build,
   - screenshot compare,
   - verify no style leakage.

Target:

1. Bring `theme.css` from ~7198 lines toward `<= 2500` without regressions.

Exit criteria:

1. No major visual drift against Phase 0 baseline screenshots.
2. `theme.css` line count materially reduced with ownership clarified.

---

### Phase 5 — Visual & Interaction Elevation Pass (P1/P2, 2-4 h)

Goal: polish to high-quality, intentional frontend standard after refactor safety.

Actions:

1. Enforce consistent focus ring behavior from a single token source.
2. Normalize hover behavior:
   - subtle lift/contrast, no layout-shifting transforms.
3. Enforce motion budget:
   - max 1-2 primary animated moments per view.
4. Ensure reduced-motion fallbacks on all animated core surfaces.
5. Apply Astro image performance rules where relevant:
   - prefer `astro:assets` (`<Image />` / `<Picture />`) for local images,
   - preload critical above-the-fold assets.

Exit criteria:

1. Interaction quality is consistent across Home, Projects, Blog.
2. Reduced-motion and keyboard navigation behavior is consistent.

---

### Phase 6 — Accessibility + Final QA Hardening (P2, 2-3 h)

Goal: ship-ready confidence checks.

Actions:

1. Contrast verification for secondary/tertiary text on both themes.
2. Keyboard traversal pass:
   - topbar, quick nav, cards, filters, blog links, footer.
3. Reduced-motion pass:
   - page transitions,
   - hover/transforms,
   - project filtering.
4. Final command gates.

Exit criteria:

1. No obvious contrast/focus/reduced-motion regressions.
2. All mandatory checks pass.

## Verification Commands (standardized)

Use `bun` commands only.

```bash
# Core gates
bun run lint
bun run typecheck
bun run build
bun run check:ci

# CSS size baseline/target
wc -l src/styles/theme.css

# Token duplication checks (exclude backup artifacts)
rg -n --fixed-strings -e '--motion-ease-out:' src/styles --glob '!**/theme.css.backup'
rg -n --fixed-strings -e '--motion-duration-sm:' src/styles --glob '!**/theme.css.backup'
rg -n --fixed-strings -e '--glass-blur-base:' src/styles --glob '!**/theme.css.backup'
rg -n --fixed-strings -e '--glass-saturation-base:' src/styles --glob '!**/theme.css.backup'
rg -n --fixed-strings -e '--shadow-card:' src/styles --glob '!**/theme.css.backup'
rg -n --fixed-strings -e '--bg:' src/styles --glob '!**/theme.css.backup'
rg -n --fixed-strings -e '--blue:' src/styles --glob '!**/theme.css.backup'
```

## Risk Register

1. Risk: token cleanup breaks hidden dependencies in monolithic selectors.
   - Mitigation: compatibility alias block + incremental extraction order + per-phase screenshots.
2. Risk: visual drift during component extraction.
   - Mitigation: extract one block at a time with immediate diff checks.
3. Risk: motion regressions for accessibility.
   - Mitigation: enforce reduced-motion checks in every phase, not only final phase.
4. Risk: doc/code divergence after refactor.
   - Mitigation: Phase 2 doc alignment before heavy implementation.

## Claude Handoff Checklist

Deliver this list with the implementation PR:

1. Baseline vs final screenshot set (same routes, same viewport sizes).
2. Before/after `theme.css` line count.
3. Before/after duplicate-token grep outputs.
4. Confirmation that `Divider.astro` and reduced-motion project filter bug were fixed first.
5. Command output summary for:
   - `bun run lint`
   - `bun run typecheck`
   - `bun run build`
   - `bun run check:ci`

## Definition of Done

1. P0 bugs fixed and verified.
2. Token ownership contract enforced with minimal duplication.
3. `theme.css` substantially decomposed and easier to maintain.
4. Visual language remains intentional, distinctive, and consistent with the site’s established Apple/docs identity.
5. Accessibility behaviors (focus, reduced-motion, contrast) are consistently safe across core pages.
