---
target: desktop site-wide
total_score: 38
p0_count: 0
p1_count: 0
timestamp: 2026-06-11T03-42-20Z
slug: desktop-site-wide
---

# Desktop site-wide critique — post 40/40 roadmap implementation

**Date:** 2026-06-10  
**Scope:** Desktop ≥1280px  
**Detector:** `detect.mjs` → `[]`  
**Gates:** `pnpm test:unit` 83 passed · `pnpm build` pass

## Design Health Score (site-wide)

| #         | Heuristic                       | Score     | Notes                                                             |
| --------- | ------------------------------- | --------- | ----------------------------------------------------------------- |
| 1         | Visibility of system status     | 4         | Glass chrome, carousel `aria-live`, projects ScrollHint           |
| 2         | Match system / real world       | 4         | "Case Studies" unified; 404 plain copy                            |
| 3         | User control and freedom        | 3         | Skip links, Escape on search; full hero kept by choice            |
| 4         | Consistency and standards       | 4         | Nav labels, home widget sublabels, documented home sidebar policy |
| 5         | Error prevention                | 4         | Form validation, empty case href guardrails                       |
| 6         | Recognition rather than recall  | 4         | Blog desktop grid; case pills + scroll hint                       |
| 7         | Flexibility and efficiency      | 4         | ⌘K, section quick-nav, carousel keyboard                          |
| 8         | Aesthetic and minimalist design | 4         | About eyebrows distilled; home duplicate h2s removed              |
| 9         | Error recovery                  | 4         | Contact mailto fallback; 404 recovery chips                       |
| 10        | Help and documentation          | 3         | Contact still sidebar/footer; archive years display-only          |
| **Total** |                                 | **38/40** | **Excellent band**                                                |

## Audit Health Score

| Dimension            | Score | Notes                                                  |
| -------------------- | ----- | ------------------------------------------------------ |
| Accessibility        | 4     | `inert` on inactive case slides; placeholder bug fixed |
| Performance          | 4     | Tokenized motion; lazy images                          |
| Responsive (desktop) | 4     | Blog index grid at ≥1024px                             |
| Theming              | 4     | Light/dark parity                                      |
| Anti-patterns        | 4     | No fake Preview cards; eyebrow spam reduced            |
| **Total**            |       | **20/20**                                              |

## Per-route totals (desktop)

| Cluster        | Score | Change                                             |
| -------------- | ----- | -------------------------------------------------- |
| Shell + chrome | 36/40 | Case Studies label; sidebar dock hint on mobile    |
| Home           | 34/40 | Widget sublabels; caption contrast                 |
| About          | 35/40 | Section eyebrows removed                           |
| Projects       | 35/40 | ScrollHint; mobile controls hidden ≥769px; `inert` |
| Blog index     | 36/40 | Placeholder fix; desktop grid                      |
| Blog reader    | 34/40 | Unchanged (editorial eyebrows OK)                  |
| Contact        | 35/40 | Hero email is mailto link; caption contrast        |
| 404 + utility  | 36/40 | Plain-language H1                                  |

## Fixes applied this pass

| Priority | Issue                                          | Resolution                                                  |
| -------- | ---------------------------------------------- | ----------------------------------------------------------- |
| P0       | Blog placeholder `[]` fell through to defaults | Explicit empty array honored; no filler when feed populated |
| P1       | Blog horizontal rail at desktop                | `repeat(auto-fit, minmax(280px, 1fr))` at ≥1024px           |
| P1       | Projects rail discoverability                  | `ScrollHint` variant `all`; mobile controls desktop-hidden  |
| P1       | Cases / Case Studies drift                     | `SITE_PRIMARY_ROUTES.cases.label` in nav + search           |
| P1       | Carousel focus trap                            | `inert` + `aria-hidden` sync in `case-carousel.ts`          |
| P2       | About eyebrow spam                             | Section eyebrows removed                                    |
| P2       | Home duplicate headings                        | Widget h2 → `widget-sublabel`                               |
| P2       | 404 jargon                                     | Plain-language recovery copy                                |
| P2       | Shell sidebar policy                           | Documented on home `sidebar={false}`                        |
| P3       | Contact meta chip                              | Email chip is mailto link                                   |
| P3       | Caption contrast                               | `pageWidget__caption` → `--text-secondary`                  |

## Deferred (user scope)

- Hiring proof IA (home fold, About proof bands)
- Home hero height / proof overlay
- Contact in topbar
- Live browser overlay archive

## Remaining gaps to true 40/40 Nielsen

- H10: archive years could link to filtered views
- H3: optional hero skip for repeat visitors
- H10: contact discovery without sidebar (deferred with hiring IA)
