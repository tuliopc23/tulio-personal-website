# Implementation Tasks

## 1. Color Method Standardization

- [x] 1.1 Replace sidebar hover backgrounds rgba() with color-mix()
- [x] 1.2 Replace sidebar active state rgba() with color-mix()
- [x] 1.3 Verify visual parity before/after migration
- [x] 1.4 Test all interactive states in both themes

## 2. Dark Mode Coverage Completion

- [x] 2.1 Add [data-theme="dark"] .hero\_\_subtitle styling
- [x] 2.2 Add [data-theme="dark"] .blogHero\_\_lede styling
- [x] 2.3 Add theme-specific .topbar\_\_navLink:hover colors
- [x] 2.4 Add [data-theme="dark"] .sidebar\_\_link[aria-current="page"] .icon-tile
- [x] 2.5 Test contrast ratios meet WCAG AA standards

## 3. Typography Token Standardization

- [x] 3.1 Evaluate if --fs-display token needed for hero titles
- [x] 3.2 Update blogHero\_\_title to use design token if appropriate
- [x] 3.3 Document any exceptions where direct values are intentional
- [x] 3.4 Verify typography hierarchy remains consistent

**NOTE**: After evaluation, the direct `clamp()` values in `.hero__subtitle` and `.blogHero__lede` are intentional as they fall between existing design tokens and serve unique purposes in the hierarchy.

## 4. Active State Polish

- [x] 4.1 Complete icon-tile active state for dark mode
- [x] 4.2 Test navigation active states in both themes
- [x] 4.3 Verify hover feedback is perceivable but subtle
- [x] 4.4 Test keyboard focus states work correctly

## 5. Quality Assurance

- [x] 5.1 Visual regression test - light mode
- [x] 5.2 Visual regression test - dark mode
- [x] 5.3 Verify no unintended side effects
- [x] 5.4 Test theme switching transitions
- [x] 5.5 Run build and verify no CSS errors

## 6. Documentation

- [x] 6.1 Update CRITICAL-FINDINGS.md with resolution notes
- [x] 6.2 Document any new design tokens added (none added - all existing tokens used)
- [x] 6.3 Archive this change proposal after deployment
