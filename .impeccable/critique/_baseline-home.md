# Critique: Homepage (baseline)

## Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                      |
| --------- | ------------------------------- | --------- | -------------------------------------------------------------- |
| 1         | Visibility of System Status     | 3         | Scroll cue delayed/low contrast; section quick-nav state clear |
| 2         | Match System / Real World       | 4         | Native macOS metaphor fits developer audience                  |
| 3         | User Control and Freedom        | 3         | Theme toggle present; hero is full-viewport commitment         |
| 4         | Consistency and Standards       | 3         | Mixed legacy breakpoints; module vs global icon styles         |
| 5         | Error Prevention                | 3         | n/a for marketing surface                                      |
| 6         | Recognition Rather Than Recall  | 3         | Profile card anchors identity; tools grid dense                |
| 7         | Flexibility and Efficiency      | 3         | Search + section nav for power users                           |
| 8         | Aesthetic and Minimalist Design | 3         | Strong materials; section rhythm slightly tight                |
| 9         | Error Recovery                  | 3         | n/a                                                            |
| 10        | Help and Documentation          | 2         | No inline orientation beyond eyebrows                          |
| **Total** |                                 | **30/40** | **Solid premium base; rhythm and token drift limit score**     |

## Anti-Patterns Verdict

**LLM assessment:** Does not read as generic AI portfolio. Apple HIG fidelity is intentional. Risk: uppercase eyebrows on multiple sections (acceptable as deliberate system, not every-section SaaS kicker).

**Deterministic scan:** Clean on `detect.mjs` for index.astro markup.

## Priority Issues

**[P1] Section rhythm:** Home sections use tight gaps; hero-to-profile bridge feels abrupt.
**[P1] Caption hierarchy:** Stage captions use tertiary color; readability on dark surfaces.
**[P2] Token drift:** Legacy 720/820px breakpoints in cards and content CSS.
**[P2] Orphan CSS:** `.now__*` rules without route.

## Suggested commands

`/impeccable layout`, `/impeccable typeset`, `/impeccable polish src/pages/index.astro`
