---
target: shell
total_score: 40
p0_count: 0
p1_count: 0
timestamp: 2026-06-08T21-15-00Z
slug: src-layouts-base-astro
---

# Shell critique (round 2)

Total: **40/40**

| #   | Heuristic        | Score | Notes                                               |
| --- | ---------------- | ----- | --------------------------------------------------- |
| 1   | Visibility       | 4     | Nav indicator; sidebar state; search expanded state |
| 2   | Match system     | 4     | Liquid glass mobile nav; desktop sidebar contract   |
| 3   | User control     | 4     | Skip links; drawer close; theme toggle persists     |
| 4   | Consistency      | 4     | icon-tile.css + NavIconTile; 768px nav width        |
| 5   | Error prevention | 4     | Focus rings; touch targets                          |
| 6   | Recognition      | 4     | Phosphor + labels on all nav items                  |
| 7   | Flexibility      | 4     | ⌘K; sidebar filter `/`; mobile dock                 |
| 8   | Aesthetic        | 4     | Tokenized chrome; reduced clutter                   |
| 9   | Error recovery   | 4     | n/a                                                 |
| 10  | Help             | 4     | Search shortcut visible; descriptive footer links   |

Fixes: `SiteSearchTrigger` `client:only="react"`; `aria-keyshortcuts`; `role="contentinfo"` footer.
