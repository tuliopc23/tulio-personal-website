## Why

WWDC 2025 doubled down on a calmer, typographically led Apple aesthetic: flatter depth hierarchy, unwavering alignment between panes, and a fresh emphasis on fluent variable typography that adapts to context without feeling animated. This proposal refreshes the site’s polish to track those cues—tight rhythm, optical alignment, and pragmatic focus states—without altering the existing brand voice or radius tokens.

## What Changes

- Typography system
  - Adopt Apple’s 2025 fluid type pairings: tighter headline letter-spacing (h1 −0.02em, h2 −0.015em, h3 −0.012em) with line-heights of 1.05 / 1.12 / 1.2 respectively.
  - Enforce reading measure between 56–60ch across prose, MDX, and structured content blocks.
  - Enable `text-wrap: balance` on multi-line headings and `text-wrap: pretty` on body copy to mirror Safari 18 typographic defaults.
  - Turn on `font-kerning: normal` and `font-variant-ligatures: common-ligatures contextual` for body, prose, and UI labels.
  - Ensure caption/meta styles use `var(--font-mono)` only when communicating code; otherwise align with the sans system to match Apple’s latest interface typography guidance.
- Layout & alignment grid
  - Standardize `.container` / `.content` paddings so hero, article headers, cards, and sidebar share one optical left edge from mobile through desktop.
  - Harmonize vertical rhythm with a 4px baseline: section titles, list introductions, and code blocks use consistent top/bottom spacing multiples.
  - Confirm `--content-max` and gutters match Apple’s “Large Display” safe widths (max 1040px with 24px edge padding) while preserving 16px safe area on small breakpoints.
  - Align all icon tiles and badges to an 8px internal padding grid; keep glyph bounding boxes at 20–22px and baseline-aligned with nearby text.
- Interaction & states
  - Remove hover scale/translate from cards and buttons; rely solely on shadow, blur, and contrast changes in line with Apple’s static hover guidance for 2025.
  - Set underline animations in navigation to ≤140ms and use existing easing tokens; avoid overshoot or delay to mimic Apple’s immediate tab cues.
  - Maintain 44px minimum tap targets for navigation, menu toggles, and sidebar links.
  - Guarantee focus rings use the `--focus-ring` token at 3–4px and render outside clipping containers (add `outline-offset` or `position` guards as needed).
- Accessibility & motion hygiene
  - Honor `prefers-reduced-motion` by removing non-essential transitions and ensuring key states still present via color/weight changes.
  - Confirm high-contrast mode keeps gradients disabled, leverages the base text color for links, and respects Apple’s updated contrast ratios (≥4.5:1 for body, 3:1 for large text).
  - Validate dynamic type scaling up to 125% does not break layout; check typography tokens against macOS Sonoma+ Accessibility Inspector baselines.
- Prose, lists, and code
  - Normalize list indentation so `h2 + ul` and `h3 + ul` avoid double top margins and align to the same baseline as paragraphs.
  - Refine code block captions and inline code to maintain 1.4–1.5 line-height with subtle letter-spacing tightening (−0.005em) for legibility.
  - Ensure blockquotes, pull quotes, and callouts align to the reading measure and share balanced spacing top/bottom.
- Visual guardrails
  - Do not adjust `--radius*` tokens, blur strengths, or hero glow intensity; keep depth calm and material-light.
  - Preserve existing color tokens while verifying contrast parity between light/dark themes for all textual elements.

## Audit Checklist (Implementation QA)

- Containers: `.home__hero`, `.article__header`, `.article__body`, `.cardGrid`, `.sidebar` follow identical horizontal padding and snap to the same left edge on 768px, 1024px, and ≥1280px layouts.
- Typography: Heading elements (`h1`–`h3`) respect new tracking/line-height pairs; paragraphs adopt `text-wrap: pretty`; reading measure enforced via `max-width` or clamp values across `.prose`, `.articlePortable`, and MDX content.
- Links: `a` elements in prose and navigation use `text-underline-offset: 3.5px` and `text-decoration-thickness: 1.15px`; hover state keeps color static and only adjusts decoration opacity.
- Motion: Confirm no `transform`-based hover interactions remain on cards/buttons; navigation underline animation duration ≤140ms and respects `prefers-reduced-motion`.
- Focus: Test keyboard traversal to ensure focus rings are visible around controls inside glass panels, drawers, top bar, and sidebar.
- Iconography: Icons sit within 20–22px boxes with 8px padding; verify optical centering and baseline alignment with adjacent text at key breakpoints.
- Accessibility: Check `prefers-contrast: more` and `focus-visible` support; ensure caption/meta text stays ≥12px with adequate contrast.

## Impact

- Affected specs: `visual-style`
- Affected code: `src/styles/theme.css`, `src/styles/section.css`, supporting updates in `src/components/*`, `src/layouts/Base.astro`, and any MDX/portable text containers enforcing measure or alignment.
