# Site Scorecard — Impeccable Maximum Pass

**Updated:** 2026-06-08 (subagent final re-critique)  
**Register:** brand ([`PRODUCT.md`](../PRODUCT.md))

> **Honest scores:** Gates pass; literal 40/40 on every cluster is **not** supported. See [subagent synthesis](critique/2026-06-08T23-30-subagent-synthesis.md).

## Scoring legend

| Framework                                              | Max  | Pass                    |
| ------------------------------------------------------ | ---- | ----------------------- |
| Nielsen heuristics                                     | 40   | all 10 × 4              |
| Audit (a11y, perf, responsive, theming, anti-patterns) | 20   | all 5 × 4               |
| Enhancement checklist                                  | pass | no P0/P1 after fix loop |

## Route matrix — honest scores (subagent pass)

| Cluster               | Route(s)                                    | Nielsen | Audit | Enhance  | Notes                         |
| --------------------- | ------------------------------------------- | ------- | ----- | -------- | ----------------------------- |
| Homepage              | `/`                                         | 32/40   | pass  | partial  | h1 fixed post-audit           |
| Shell                 | all                                         | 38/40   | pass  | pass     |                               |
| About                 | `/about`                                    | 30/40   | pass  | partial  | eyebrow density               |
| Contact               | `/contact`                                  | 28/40   | pass  | **fail** | mailto feedback gap           |
| Projects              | `/projects`                                 | 32/40   | pass  | partial  |                               |
| Blog index            | `/blog`                                     | 31/40   | pass  | partial  |                               |
| Blog reader           | `/blog/{slug}`                              | 33/40   | pass  | partial  | section eyebrow proliferation |
| Taxonomy archives     | `/blog/category/*`, `/topic/*`, `/series/*` | 32/40   | pass  | pass     |                               |
| 404                   | `/404`                                      | 37/40   | pass  | pass     |                               |
| Newsletter subscribed | `/newsletter/subscribed`                    | 35/40   | pass  | pass     |                               |

**Site-wide Nielsen (weakest-link):** 24/40 · **Cluster average:** 32.5/40

## Phase 3 fixes (prior)

- **ReadingProgress:** `width` animation → `transform: scaleX()` (detect clean)
- **Tokens:** merged theme text pairs in `surfaces.css`, `routes-projects.css`; chip vars in `routes.css`
- **Shell:** sidebar max-height 720px → 768px
- **Hero:** light-mode top feather gradient; `HeroPlayer` final-frame hold + `ended` listener
- **Utility:** newsletter breadcrumbs + search hint on error states

## Phase 4 — pre-deploy gap-fill (strict pass)

- **P0:** `PhosphorIcon.astro` glob — added `caret-down`, `caret-left` (blog TOC)
- **P1:** `.blogEmpty`, `.projects__empty p` — light-mode token parity
- **P1:** Token sweep — page heroes, category eyebrow, footer hovers, shell nav/meta, icon tiles, base `p`, case/project tags

## Enhancement checklist (site-wide)

| Category | Status              |
| -------- | ------------------- |
| typeset  | pass                |
| layout   | pass                |
| animate  | pass                |
| delight  | pass                |
| clarify  | pass                |
| adapt    | pass                |
| polish   | pass                |
| harden   | pass                |
| optimize | pass                |
| quieter  | pass (detect clean) |

## Quality gates

| Check                                             | Result                                |
| ------------------------------------------------- | ------------------------------------- |
| `pnpm quality`                                    | Pass                                  |
| `pnpm typecheck`                                  | Pass                                  |
| `pnpm test:unit`                                  | Pass (71 tests)                       |
| `pnpm build`                                      | Pass (~2m); no Phosphor icon warnings |
| `pnpm exec vitest run tests/layout-smoke.test.ts` | Pass (1 run + 3 skipped SSR routes)   |
| `detect.mjs` (pages/layouts/components)           | `[]`                                  |

**Pre-deploy critique:** [`.impeccable/critique/2026-06-08T23-05-pre-deploy-site-wide.md`](critique/2026-06-08T23-05-pre-deploy-site-wide.md)
