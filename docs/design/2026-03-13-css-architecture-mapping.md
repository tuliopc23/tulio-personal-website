# CSS Architecture Mapping

Date: 2026-03-13
Repo: `tulio-personal-website`
Scope: Audit current styling surfaces and map them into:

- global design-system CSS
- component CSS Modules
- high-drift areas to split before refactoring

## Executive Summary

This project should not add Tailwind for the next refactor phase.

The current system already behaves like a partial design system:

- global tokens and theme variables live in `src/styles/theme.css` plus `src/styles/tokens/*`
- shared semantic classes already exist for cards, page widgets, page heroes, layout, hover states, motion, and article/project surfaces
- most styling debt comes from oversized component-local `<style>` blocks that recreate shared surface behavior instead of consuming shared primitives

The right direction is a split model:

- keep tokens, theming, motion, typography, and shared semantic primitives in global CSS
- move component-owned styling to CSS Modules
- shrink broad page and component style blocks by extracting shared primitives first

## Audit Snapshot

- `src/styles/theme.css`: 7,116 lines
- `src/styles/github-activity-widget.css`: 497 lines
- other global CSS files under `src/styles/`: 1,434 lines
- Astro `<style>` blocks: 28 blocks, about 3,208 lines total
- class-bearing Astro markup instances: about 414
- custom properties in theme and token files: about 934

## Current CSS Layers

### 1. Global foundation

Authoritative source of truth for:

- color tokens
- spacing tokens
- typography tokens
- shadow tokens
- materials and glass tokens
- motion tokens and animation primitives
- responsive breakpoints
- global theme switching

Files:

- `src/styles/theme.css`
- `src/styles/tokens/colors.css`
- `src/styles/tokens/shadows.css`
- `src/styles/tokens/spacing.css`
- `src/styles/tokens/typography.css`
- `src/styles/tokens/materials.css`
- `src/styles/tokens/animations.css`
- `src/styles/tokens/motion.css`
- `src/styles/tokens/breakpoints.css`
- `src/styles/fonts.css`
- `src/styles/motion.css`

These stay global.

### 2. Global semantic design-system layer

These are reusable authored patterns and should remain globally shared, though they should be reorganized into smaller files over time:

- layout shell
- page widget shell
- page hero shell
- card shell
- article and project surface patterns
- hover and motion utilities
- focus treatments
- theme-aware interactive states

Current evidence in `src/styles/theme.css`:

- base and utilities around lines 434-756
- topbar around lines 757-1633
- layout and sidebar around lines 1634-2354
- cards and shared content surfaces around lines 2568-3731
- page heroes and blog/project shared page surfaces around lines 4726-5319
- article cards and blog shared surfaces around lines 5787-6194
- page widget shell around lines 7022-7111

These also stay global, but should be split into design-system files.

### 3. Component-owned local styling

These are valid candidates for CSS Modules because they belong to one component and do not need to leak:

- decorative internals
- component-specific layouts
- component-only pseudo-elements
- component-only responsive adjustments
- local icon/media alignment
- one-off scroll affordances tied to a single component

## Mapping

## Keep Global

These should remain in global CSS because they are cross-surface contracts.

### Tokens and theme contracts

- `src/styles/tokens/*`
- token aliases in `src/styles/theme.css`
- root theme variables and `data-theme` handling
- global focus ring, motion timing, elevations, and surface materials

Reason:
These values define the visual system. Moving them into CSS Modules would fragment the contract and make cross-page edits slower.

### Shared layout primitives

- `.layout`, `.layout--noSidebar`, `.content`
- `.container`
- `.pageBento`
- `.pageWidget`
- `.pageWidget__header`
- `.pageWidget__eyebrow`
- `.pageWidget__title`
- `.pageWidget__caption`
- `.pageHero*`
- `.cardGrid`
- `.cardRail`

Reason:
These already act as page composition primitives reused across multiple routes.

### Shared surface primitives

- `.card`, `.card__inner`, `.card__content`, `.card-title`, `.card-body`, `.card__cta`
- `.articleCard*`
- `.projectCard*`
- `.badge*`
- `.hover-elevate`
- `.motion-surface-premium`
- `.motion-surface-standard`
- `.motion-chip`
- `.motion-link-inline`
- `.motion-cta-pill`

Reason:
These are the main reusable surface APIs. Refactoring should make more components consume them rather than duplicate them.

### App shell and navigation

- `.topbar*`
- `.sidebar*`
- `.themeToggle*`
- `.liquidToggle*`
- `.icon-tile*`

Reason:
These are shell-level affordances that must stay globally consistent.

### Typography and content defaults

- base typography rhythm
- `p`, selection, reduced motion, high contrast, and global accessibility treatments
- article-content primitives that are intentionally shared

Reason:
These are not component concerns.

## Move To CSS Modules

These are good CSS Module candidates because their styles are owned by one component and do not define cross-site contracts.

### First-wave module candidates

#### `src/components/ProfileCard.astro`

Current local CSS: about 418 lines.

Move to:

- `src/components/ProfileCard.module.css`

Keep only truly shared hooks global.

Why:

- the component owns its inner layout
- the file currently duplicates surface behavior instead of composing a smaller shared primitive
- it is large enough to justify isolation

Refactor note:
Extract a shared `surface-panel` primitive first, then let `ProfileCard` own only its internal grid, image, contact list, and social card composition.

#### `src/components/PageIndicator.astro`

Current local CSS: about 245 lines.

Move to module.

Why:

- highly component-specific
- indicator dots, track behavior, and internal interaction styling do not need to be global

#### `src/components/IconTile.astro`

Current local CSS: about 161 lines.

Move most of it to module.

Keep global only if `icon-tile` remains the canonical shell navigation primitive.

Why:

- this component currently sits in an awkward middle ground between primitive and local implementation
- decide whether it is a design-system primitive or only an implementation detail

Recommendation:
Keep a small global primitive for tint tokens and interactive states if reused broadly; move media/layout details to a module.

#### `src/components/SectionQuickNav.astro`

Current local CSS: about 148 lines.

Move to module.

Why:

- specific to homepage navigation behavior
- styles are self-contained

#### `src/components/FeatureWritingWidget.astro`

Current local CSS: about 146 lines.

Move to module after extracting shared widget shell usage.

Why:

- the widget content layout is local
- it should consume page/widget primitives rather than define global variants

#### `src/components/ArticleCodeBlock.astro`

Current local CSS: about 145 lines.

Move to module.

Why:

- code block layout and visual affordances are component-specific
- keep only markdown-wide content tokens global

#### `src/components/CategoryList.astro`

Current local CSS: about 127 lines.

Move to module.

#### `src/components/PersonalIcon.astro`

Current local CSS: about 125 lines.

Move to module unless it is promoted into the canonical theme-toggle icon primitive.

#### `src/components/ScrollIndicator.astro`

Current local CSS: about 120 lines.

Move to module.

#### `src/components/DockLink.astro`

Current local CSS: about 115 lines.

Move to module after extracting shared surface and icon primitives.

#### `src/components/RecentPosts.astro`

Current local CSS: about 109 lines.

Move to module.

#### `src/components/Breadcrumbs.astro`

Current local CSS: about 98 lines.

Move to module.

#### Remaining safe module candidates

- `src/components/portable-text/Callout.astro`
- `src/components/CategoryBadges.astro`
- `src/components/ScrollHint.astro`
- `src/components/ScrollToTop.astro`
- `src/components/SkeletonCard.astro`
- `src/components/MarkdownContent.astro`
- `src/components/BrandLogo.astro`
- `src/components/portable-text/VideoEmbed.astro`
- `src/components/portable-text/Divider.astro`
- `src/components/ReadingProgress.astro`
- `src/components/PhosphorIcon.astro`

Reason:
These are tightly scoped and should not contribute to global selector growth.

## Extract To Shared Primitives Before Moving Files

These areas have too much duplication or too much semantic weight to be moved directly to modules.

### 1. Surface primitives

Create global primitives for:

- `surface-panel`
- `surface-card`
- `surface-card-interactive`
- `surface-glass`
- `surface-chip`
- `surface-pill-cta`

Evidence:

- `src/styles/theme.css` already defines shared card behavior
- `src/components/Card.astro` redefines much of the same contract locally
- `src/components/ProfileCard.astro` and `src/pages/index.astro` recreate panel behavior

Rule:
Do not move large surface-owning components to modules until they consume the same primitive layer.

### 2. Stage and section primitives

Create shared page composition primitives for:

- stage intro
- page section header
- section eyebrow
- section lead/caption
- widget shell
- responsive two-column widget rail

Evidence:

- homepage stage styles live as a page-global block in `src/pages/index.astro`
- blog and route pages use overlapping but differently named structures like `pageHero`, `pageWidget`, `blogStageIntro`, and page-specific grids

Rule:
Unify structure first, then decide which page wrappers stay page-local.

### 3. Interactive list and rail primitives

Create shared primitives for:

- horizontal scrollers
- card rails
- edge fades
- indicator dots and scroll hints

Evidence:

- behavior and styling are spread across theme CSS, `ScrollIndicator`, `ScrollHint`, `PageIndicator`, and page media queries

Rule:
One primitive layer should own rail spacing, snap behavior, fade edges, and hint affordances.

### 4. Rich content primitives

Create a shared article content layer for:

- prose defaults
- code blocks
- callouts
- dividers
- embedded video
- markdown content wrappers

Rule:
Keep typography/content rules global where they affect all rich text, but move component framing and controls to modules.

## High-Drift Areas

These are the parts most likely to create inconsistency if refactored casually.

### `src/styles/theme.css`

Problem:

- too many responsibilities in one file
- tokens, shell, utilities, cards, article surfaces, page surfaces, and responsive overrides are all mixed together

Risk:

- changes in one surface can leak into unrelated routes
- shared primitives are harder to identify and consume consistently

Action:

Split into:

- `styles/system/tokens.css`
- `styles/system/base.css`
- `styles/system/motion.css`
- `styles/system/layout.css`
- `styles/system/surfaces.css`
- `styles/system/content.css`
- `styles/system/shell.css`
- `styles/system/routes.css`

The exact filenames can vary, but the responsibility split should not.

### `src/pages/index.astro`

Problem:

- contains a 227-line global page style block
- defines stage and widget composition patterns that feel reusable beyond one route

Risk:

- homepage becomes the hidden owner of patterns other pages want to reuse

Action:

- extract `stage-intro` and `widget-box` behavior into shared primitives
- leave route-specific placement and sequencing local

### `src/components/ProfileCard.astro`

Problem:

- very large local style surface
- mixes panel primitive concerns with component layout concerns

Risk:

- future cards and profile-like surfaces will drift because the primitive is embedded here

Action:

- extract shared panel and contact chip primitives first
- then move the remainder to a module

### `src/components/Card.astro`

Problem:

- duplicates card behavior already present globally

Risk:

- card changes require editing both global and local layers

Action:

- choose one owner for the card primitive
- recommended owner: global design-system CSS
- keep component-local module only for markup-specific deltas if needed

### `src/components/IconTile.astro`

Problem:

- shared concept but heavy component-local styling

Risk:

- hard to tell whether it is a primitive or a leaf component

Action:

- define it explicitly as one of:
  - a global primitive with local implementation details, or
  - a module-owned component that only consumes global tint tokens

Do not keep it in the current ambiguous state.

## Recommended Refactor Order

### Phase 1: Stabilize the global design-system layer

- split `src/styles/theme.css` by responsibility
- keep behavior unchanged
- keep selectors unchanged where possible
- add comments documenting which selectors are design-system primitives

### Phase 2: Normalize primitives

- establish shared primitives for surfaces, section headers, rails, and content blocks
- remove duplicate implementations from component-local styles

### Phase 3: Move isolated components to CSS Modules

Start with:

- `SectionQuickNav`
- `PageIndicator`
- `ScrollIndicator`
- `ScrollHint`
- `Breadcrumbs`
- `CategoryBadges`
- `BrandLogo`
- `ReadingProgress`

Then move medium-complexity widgets:

- `FeatureWritingWidget`
- `RecentPosts`
- `CategoryList`
- `DockLink`
- `ArticleCodeBlock`

Then move large owner components after primitive extraction:

- `ProfileCard`
- `IconTile`

### Phase 4: Remove page-local global ownership where possible

- reduce `src/pages/index.astro` global style block
- reduce route-level style ownership in pages that should compose shared patterns instead

## File-by-File Mapping

### Keep global for now

- `src/styles/theme.css`
- `src/styles/tokens/*`
- `src/styles/motion.css`
- `src/styles/fonts.css`
- `src/styles/section.css`
- `src/styles/icons.css`
- `src/styles/github-activity-widget.css`

Note:
`github-activity-widget.css` can stay global initially because it is already isolated by a distinct namespace. It can become a module later if the TSX component is refactored around CSS Modules.

### Convert to CSS Modules in refactor

- `src/components/ProfileCard.astro`
- `src/components/PageIndicator.astro`
- `src/components/IconTile.astro`
- `src/components/SectionQuickNav.astro`
- `src/components/FeatureWritingWidget.astro`
- `src/components/ArticleCodeBlock.astro`
- `src/components/CategoryList.astro`
- `src/components/PersonalIcon.astro`
- `src/components/ScrollIndicator.astro`
- `src/components/DockLink.astro`
- `src/components/RecentPosts.astro`
- `src/components/Breadcrumbs.astro`
- `src/components/portable-text/Callout.astro`
- `src/components/CategoryBadges.astro`
- `src/components/ScrollHint.astro`
- `src/components/ScrollToTop.astro`
- `src/components/SkeletonCard.astro`
- `src/components/MarkdownContent.astro`
- `src/components/BrandLogo.astro`
- `src/components/portable-text/VideoEmbed.astro`
- `src/components/portable-text/Divider.astro`
- `src/components/ReadingProgress.astro`
- `src/components/PhosphorIcon.astro`

### Leave page-level for now, but reduce over time

- `src/pages/index.astro`
- `src/pages/contact.astro`

Reason:
Pages should compose primitives, but route-specific orchestration can remain local if kept small.

## Refactoring Rules

- Do not move tokens into modules.
- Do not move cross-route shell classes into modules.
- Do not let components redefine shared surface primitives once the primitive exists.
- Prefer one semantic primitive over repeated page-specific variants.
- Treat CSS Modules as ownership boundaries, not as a replacement for the design system.
- If a class name appears conceptually reusable across routes, it belongs in the design-system layer.
- If a style only exists to support one component’s internal DOM, it belongs in a module.

## Immediate Next Step

The safest next move is not code migration yet.

The next move should be:

1. split `src/styles/theme.css` into smaller global system files without changing selectors
2. mark which selectors are primitives versus route-specific
3. extract the first primitive set:
   - shared surfaces
   - section headers
   - rails and indicators
4. only then begin CSS Module conversion, starting with the smallest isolated components
