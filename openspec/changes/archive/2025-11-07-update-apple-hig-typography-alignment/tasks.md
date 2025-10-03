## 1. Implementation

- [x] 1.1 Baseline audit: document current heading/body sizes, line-heights, container paddings, and icon treatments across home, projects, and blog views.
- [x] 1.2 Apply the 2025 Apple type refinements: update heading tracking/line-height pairs, enforce 56–60ch reading measure, enable `text-wrap: balance/pretty`, and turn on kerning + ligatures for prose/UI text.
- [x] 1.3 Align containers: normalize `.container`/`.content` padding so hero, article headers, cards, and sidebar share the same optical left edge from mobile through desktop.
- [x] 1.4 Rebuild vertical rhythm: ensure section titles, list introductions, and code blocks follow 4px spacing increments; remove double margins after headings.
- [x] 1.5 Icon and badge sweep: confirm icon tiles use 8px internal padding, glyphs stay within 20–22px boxes, and baselines align with adjacent text.
- [x] 1.6 Interaction pass: strip transform-based hover effects from cards/buttons, tighten nav underline animation to ≤140ms using existing ease tokens, and verify 44px minimum tap targets.
- [x] 1.7 Focus & accessibility: guarantee `--focus-ring` renders unobstructed (outline offsets/z-index as needed), honor `prefers-reduced-motion`, and validate link contrast plus high-contrast mode behavior.
- [x] 1.8 Prose & code polish: standardize list indentation, tune code block captions (mono only when communicating code, 1.4–1.5 line-height), and ensure blockquotes/pull quotes respect the reading measure.
- [x] 1.9 Visual guardrails: confirm `--radius*`, hero glow intensity, and color tokens remain unchanged; capture before/after notes.
- [x] 1.10 QA sweep: test light/dark themes, small-phone/desktop breakpoints, dynamic type up to 125%, reduced motion, and keyboard navigation; record screenshots of key templates.
- [x] 1.11 Run `bun run check` and attach artifacts to the PR.
