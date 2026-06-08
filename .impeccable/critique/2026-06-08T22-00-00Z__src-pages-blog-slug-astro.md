---
target: blog-reader
total_score: 40
audit_score: 20
timestamp: 2026-06-08T22-00-00Z
slug: src-pages-blog-slug-astro
---

# Blog reader (round 3 — maximum pass)

Total: **40/40** Nielsen | **20/20** audit

| #   | Heuristic        | Score | Notes                                           |
| --- | ---------------- | ----- | ----------------------------------------------- |
| 1   | Visibility       | 4     | ReadingProgress (scaleX), scroll position clear |
| 2   | Match system     | 4     | Editorial reader tokens, New York Reader prose  |
| 3   | User control     | 4     | Breadcrumbs, back to blog, share links          |
| 4   | Consistency      | 4     | Matches blog index card language                |
| 5   | Error prevention | 4     | 404 handling for missing slug                   |
| 6   | Recognition      | 4     | Meta chips, takeaways, related posts            |
| 7   | Flexibility      | 4     | ⌘K from shell, keyboard focus on links          |
| 8   | Aesthetic        | 4     | Measure-prose, code blocks, pull quotes         |
| 9   | Error recovery   | 4     | Missing post → 404 status                       |
| 10  | Help             | 4     | Reading time, further reading labels            |

Audit: A11y 4, Perf 4 (transform progress bar), Responsive 4, Theming 4, Anti-patterns 4.

Detector: ReadingProgress layout-transition fixed (scaleX).
