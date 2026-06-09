# Site-wide mobile shell critique (post-fix)

**Date:** 2026-06-09  
**Target:** Mobile shell cluster + 5 routes  
**Score:** 36/40 (mobile shell cluster)

## Design Health Score

| #         | Heuristic                       | Score     | Key issue                                                      |
| --------- | ------------------------------- | --------- | -------------------------------------------------------------- |
| 1         | Visibility of System Status     | 4         | Search/drawer scrims strengthened; dock hides when drawer open |
| 2         | Match System / Real World       | 4         | macOS dock + bottom sheet pattern                              |
| 3         | User Control and Freedom        | 4         | Drawer footer restored; drag dismiss + backdrop                |
| 4         | Consistency and Standards       | 4         | Single glass system on dock; solid drawer sheet                |
| 5         | Error Prevention                | 4         | 44px targets, scroll lock                                      |
| 6         | Recognition Rather Than Recall  | 3         | Dock-only opener (intentional)                                 |
| 7         | Flexibility and Efficiency      | 4         | ⌘K search                                                      |
| 8         | Aesthetic and Minimalist Design | 4         | No double-blur; materials earn depth                           |
| 9         | Error Recovery                  | 3         | Contact mailto still deferred                                  |
| 10        | Help and Documentation          | 4         | Footer links in drawer again                                   |
| **Total** |                                 | **36/40** |                                                                |

## Priority issues addressed

- **[P0] Double glass stacking** — dock uses `.liquid-glass.liquid-glass--chrome` only
- **[P0] Conflicting sidebar visibility** — removed dead `display:none` on sidebar/backdrop in shell.css
- **[P1] Opaque drawer with blur cost** — mobile drawer uses solid `--surface-card`
- **[P1] Hidden drawer footer** — restored on mobile
- **[P1] Weak search scrim** — `--search-backdrop-scrim` token
- **[P2] Tablet padding band** — 769–1024px content padding unified

## Deferred

- Contact mailto feedback (clarify)
- Eyebrow density (distill — requires user approval per AGENTS.md)
