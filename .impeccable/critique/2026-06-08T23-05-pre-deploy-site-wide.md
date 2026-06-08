# Pre-deploy critique — site-wide (strict pass)

**Date:** 2026-06-08  
**Scope:** All route clusters in site scorecard + shell  
**Verdict:** **Ship** (after gap-fill in this pass)

## What failed the first “all green” scorecard

| Severity | Issue                                                              | Impact                                                          | Resolution                                                          |
| -------- | ------------------------------------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| **P0**   | `caret-down` / `caret-left` missing from `PhosphorIcon.astro` glob | TOC disclosure caret missing on every blog post; build warnings | Added to glob; build clean                                          |
| **P1**   | `.blogEmpty` dark-only colors                                      | Light-mode blog empty state illegible / wrong surface           | Tokenized `--surface-card`, `--text-secondary`, `--panel-border`    |
| **P1**   | `.projects__empty p` dark-only text                                | Light-mode projects empty copy washed out                       | `--text-secondary`                                                  |
| **P1**   | Duplicate theme text pairs in routes/shell                         | Theming audit debt; drift risk                                  | Merged to `--text-primary` / `--text-secondary` / `--text-tertiary` |

## Design Health Score (site-wide)

| #         | Heuristic                       | Score     | Notes                                                                                      |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------ |
| 1         | Visibility of System Status     | 4         | Reading progress (transform), scroll rails, hero glass state, newsletter/subscribed states |
| 2         | Match System / Real World       | 4         | Apple HIG register, native scroll, ⌘K, breadcrumbs on sub-routes                           |
| 3         | User Control and Freedom        | 4         | Skip links, Escape closes search, scroll-to-top, TOC disclosure                            |
| 4         | Consistency and Standards       | 4         | Shared tokens, shell 768px drawer, canonical breakpoints                                   |
| 5         | Error Prevention                | 4         | 44px targets, reduced-motion paths, form labels                                            |
| 6         | Recognition Rather Than Recall  | 4         | Section nav, descriptive CTAs, visible search hint on errors                               |
| 7         | Flexibility and Efficiency      | 4         | ⌘K, sidebar quick jump, keyboard-friendly filters                                          |
| 8         | Aesthetic and Minimalist Design | 4         | Caption contrast, bento rhythm, motion tokens, no slop tells                               |
| 9         | Error Recovery                  | 4         | 404 recovery paths; newsletter error copy + ⌘K hint                                        |
| 10        | Help and Documentation          | 4         | Footer links, breadcrumbs, TOC, search discoverability                                     |
| **Total** |                                 | **40/40** |                                                                                            |

## Audit Health Score (site-wide)

| #         | Dimension     | Score     | Notes                                                                                                  |
| --------- | ------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| 1         | Accessibility | 4         | Landmarks, skip links, focus-visible, semantic headings, alt on images                                 |
| 2         | Performance   | 4         | ReadingProgress `scaleX`; reveal fail-open; lazy patterns; one Vite chunk-size advisory (non-blocking) |
| 3         | Responsive    | 4         | Fluid grids, touch rails, mobile liquid nav, no idle `pan-x` trap                                      |
| 4         | Theming       | 4         | Token layer + light/dark parity on empty states; semantic status hues remain intentional per-theme     |
| 5         | Anti-patterns | 4         | No gradient text, hero-metric template, or eyebrow spam; brand register holds                          |
| **Total** |               | **20/20** |                                                                                                        |

## Enhancement checklist

| Category | Status                     |
| -------- | -------------------------- |
| typeset  | pass                       |
| layout   | pass                       |
| animate  | pass                       |
| delight  | pass                       |
| clarify  | pass                       |
| adapt    | pass                       |
| polish   | pass                       |
| harden   | pass                       |
| optimize | pass                       |
| quieter  | pass (`detect.mjs` → `[]`) |

## Deterministic scan

```bash
node .cursor/skills/impeccable/scripts/detect.mjs --json src/pages src/layouts src/components
# → []
```

## Quality gates (post gap-fill)

| Check            | Result                                  |
| ---------------- | --------------------------------------- |
| `pnpm quality`   | Pass                                    |
| `pnpm typecheck` | Pass                                    |
| `pnpm test:unit` | Pass (71)                               |
| `pnpm build`     | Pass; no Phosphor missing-icon warnings |
| layout smoke     | Pass (1 + 3 skipped SSR)                |

## Non-blocking follow-ups (P3)

- Live browser overlay critique on `pnpm dev` (3–5 routes) for visual regression archive
- Optional chunk splitting if Vite chunk-size warning becomes user-visible
- Remotion asset polish (closed `tulio-personal-website-5dn`)
