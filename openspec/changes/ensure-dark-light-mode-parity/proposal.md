# Proposal: Ensure Complete Light/Dark Mode Feature Parity

**Status**: Draft  
**Created**: 2025-01-06  
**Author**: Droid (AI Assistant)

## Problem Statement

Dark mode currently lacks complete feature parity with light mode. Several styling features, hover states, color treatments, typography enhancements, and interactive accents present in light mode are missing or incorrectly implemented in dark mode.

Dark mode should be a complete, adapted version of light mode—not a different design. Every visual feature in light mode must have an equivalent dark mode implementation.

## Goals

1. **Complete Feature Parity**: Every CSS rule, animation, hover state, color treatment, and interactive element in light mode must have a dark mode equivalent
2. **Systematic Audit**: Diff all `[data-theme="light"]` rules against `[data-theme="dark"]` rules to identify gaps
3. **Proper Dark Mode Adaptation**: Ensure dark mode implementations use appropriate contrast, vibrancy, and Apple HIG compliance
4. **Zero Visual Regressions**: All features work consistently across both themes

## Current State Analysis

### Light Mode Selectors (24 total)

```
[data-theme="light"] {
  - Root theme variables (line 481)
  - .topbar (line 714)
  - .topbar__navMask::before (line 860)
  - .topbar__navMask::after (line 868)
  - .topbar__navLink:hover (line 947)
  - .topbar__navLink:hover::after (line 976)
  - .themeToggle__label::before (line 1048)
  - .sidebar__link:hover (line 1247)
  - .sidebar__link[aria-current="page"] (line 1263)
  - .sidebar__link[aria-current="page"] .icon-tile (line 1281)
  - .icon-tile::before (line 1358)
  - .hero__subtitle (line 1661)
  - .card__cta (line 1845)
  - .card:hover .card__cta (line 1849-1850)
  - .projectCard__cta (line 2261)
  - .projectCard:hover .projectCard__cta (line 2265-2266)
  - .blogHero__title (line 3204)
  - .blogHero__lede (line 3225)
  - .blogHero__halo (line 3275)
  - .articleCard__halo (line 3543)
  - .articleCard__cta (line 3694)
  - .articleCard:hover .articleCard__cta (line 3698-3699)
}
```

### Dark Mode Selectors (20 total)

```
[data-theme="dark"] {
  - .topbar__navLink:hover (line 943)
  - .topbar__navLink:hover::after (line 970)
  - .themeToggle__label::before (line 1043)
  - .sidebar__link:hover (line 1242)
  - .sidebar__link[aria-current="page"] (line 1257)
  - .sidebar__link[aria-current="page"] .icon-tile (line 1269)
  - .icon-tile::before (line 1343)
  - .hero__subtitle (line 1657)
  - .card__cta (line 1835)
  - .card:hover .card__cta (line 1839-1840)
  - .projectCard__cta (line 2251)
  - .projectCard:hover .projectCard__cta (line 2255-2256)
  - .symbol (line 2324)
  - .blogHero__title (line 3192)
  - .blogHero__lede (line 3221)
  - .articleCard__cta (line 3684)
  - .articleCard:hover .articleCard__cta (line 3688-3689)
}
```

### Identified Gaps (Missing in Dark Mode)

1. **`.topbar`** (line 714 light) - Missing dark mode variant
2. **`.topbar__navMask::before`** (line 860 light) - Missing dark mode gradient
3. **`.topbar__navMask::after`** (line 868 light) - Missing dark mode gradient
4. **`.blogHero__halo`** (line 3275 light) - Missing dark mode glow effect
5. **`.articleCard__halo`** (line 3543 light) - Missing dark mode halo effect

### Suspected Issues (Need Verification)

1. **Typography contrast**: Hero subtitle, blog lede may have insufficient contrast in dark mode
2. **CTA visibility**: Blue accents may not be rendering correctly despite CSS rules
3. **Hover states**: Some interactive elements may lack proper feedback in dark mode
4. **Glow/halo effects**: Decorative elements missing or incorrectly adapted

## Proposed Solution

### Phase 1: Complete CSS Audit (Systematic Diff)

- Extract all `[data-theme="light"]` rules
- Extract all `[data-theme="dark"]` rules
- Identify missing dark mode equivalents
- Document color adaptations needed for each

### Phase 2: Implement Missing Dark Mode Features

- Add all missing selectors with proper dark mode adaptations
- Ensure contrast ratios meet Apple HIG standards
- Verify blue accents use vibrant dark mode palette (`#0a84ff`)
- Adapt glow/halo effects for dark backgrounds

### Phase 3: Validate Existing Dark Mode Rules

- Verify all existing dark mode rules are actually applying
- Check specificity and `!important` usage
- Ensure no CSS conflicts or overrides

### Phase 4: Visual Regression Testing

- Test all interactive states (hover, focus, active) in both modes
- Verify typography contrast and readability
- Check all CTAs and accents are visible
- Validate glow/halo effects render correctly

## Success Criteria

1. ✅ Every `[data-theme="light"]` selector has a `[data-theme="dark"]` equivalent
2. ✅ All typography is readable in both themes (WCAG AA minimum)
3. ✅ All interactive elements have visible, consistent feedback in both themes
4. ✅ Blue accents render correctly on CTAs, links, and active states
5. ✅ Glow/halo decorative effects work in both themes
6. ✅ Build passes (tsc, lint, format)
7. ✅ Visual parity confirmed in browser testing

## Implementation Plan

See `tasks.md` for detailed breakdown.

## References

- `/src/styles/theme.css` - Main stylesheet
- `/openspec/changes/enhance-apple-hig-compliance/` - HIG compliance work
- Apple HIG - Dark Mode guidelines
