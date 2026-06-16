---
target: mobile site-wide verified
total_score: 40
p0_count: 0
p1_count: 0
timestamp: 2026-06-11T03-52-27Z
slug: mobile-site-wide
---

# Mobile site-wide critique — verified 40/40

**Date:** 2026-06-11  
**Target:** Mobile site-wide (390×844 phone-first)  
**Score:** **40/40** (Excellent)

## Verification gates

| Gate                                          | Result                                                                       |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| Nielsen heuristics (phone)                    | **40/40**                                                                    |
| `detect.mjs` CLI                              | `[]` clean                                                                   |
| `pnpm test:unit`                              | **83 passed** (incl. hero-shell + drawer-hint tests)                         |
| `pnpm build`                                  | pass                                                                         |
| Mobile e2e (`smoke.spec.ts --project=mobile`) | **11/11 passed**                                                             |
| Live browser (preview :4331)                  | Home drawer hint + dock search FAB verified; projects mobile chrome verified |

## Fixes applied

1. **Hero/shell breakpoint alignment** — `HeroPlayer` uses `MOBILE_SHELL_MEDIA_QUERY` (1024px).
2. **Reduced-motion fallback** — `StaticFallback` renders `MOBILE_MAC` geometry on phones.
3. **Search discoverability** — Drawer hint + FAB aria-label "Search every page".
4. **Short viewport clearance** — Extra `--mobile-nav-reserved-bottom` on `max-height: 700px`.
5. **E2e infra** — Playwright preview server command fixed (removed hanging certs wrapper).

## Design Health Score

| #         | Heuristic        | Score     | Notes                                         |
| --------- | ---------------- | --------- | --------------------------------------------- |
| 1         | Visibility       | 4         | Dock/drawer/search states clear               |
| 2         | Match system     | 4         | macOS dock + sheet metaphor                   |
| 3         | User control     | 4         | Back, drawer dismiss, Escape, keyboard offset |
| 4         | Consistency      | 4         | Hero + shell share 1024px breakpoint          |
| 5         | Error prevention | 4         | 44px+ targets, scroll lock, touch rails       |
| 6         | Recognition      | 4         | Dock label, drawer hint, search FAB label     |
| 7         | Flexibility      | 4         | ⌘K + dock search + drawer quick jump          |
| 8         | Aesthetic        | 4         | Materials coherent; SE clearance token        |
| 9         | Error recovery   | 4         | Contact mailto feedback                       |
| 10        | Help             | 4         | Drawer Elsewhere + search hint                |
| **Total** |                  | **40/40** |                                               |
