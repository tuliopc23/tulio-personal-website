---
target: blog-archives
total_score: 40
audit_score: 20
timestamp: 2026-06-08T22-00-01Z
slug: src-pages-blog-category-slug-astro
---

# Blog taxonomy archives (category / topic / series)

Total: **40/40** Nielsen | **20/20** audit

Shared template: `category/[slug].astro`, `topic/[slug].astro`, `series/[slug].astro`.

| Dimension     | Score | Notes                                                 |
| ------------- | ----- | ----------------------------------------------------- |
| Nielsen total | 40/40 | Breadcrumbs, filtered list, PageIndicator, ScrollHint |
| Audit total   | 20/20 | ArticleCard tokens, responsive grid, empty state copy |
| typeset       | pass  | Hero + list hierarchy matches `/blog`                 |
| layout        | pass  | pageBento rhythm, card grid auto-fill                 |
| adapt         | pass  | Rail touch-action via shared scroll contracts         |
