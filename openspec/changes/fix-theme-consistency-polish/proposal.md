# Proposal: Fix Theme Consistency & Polish

## Why

After comprehensive audit of the codebase following the HIG compliance enhancements, several minor inconsistencies were discovered that affect visual polish and maintainability:

1. **Color Method Inconsistency**: Mix of legacy `rgba()` and modern `color-mix()` approaches creates maintenance burden
2. **Incomplete Dark Mode Coverage**: Some elements lack theme-specific styling (subtitle, lede text, navigation hovers)
3. **Typography Token Gaps**: Direct pixel values used instead of design tokens in some places
4. **Active State Styling Gaps**: Icon tiles and navigation lack complete dark mode active states

These issues don't break functionality but create subtle inconsistencies in polish between light and dark modes, and make future maintenance harder.

## What Changes

### 1. **Standardize Color Methods** 🎨

- Replace all interactive element `rgba()` with `color-mix(in oklch, ...)` for consistency
- Target: sidebar links, active states, hover backgrounds
- Maintain existing visual appearance while using modern API
- Total: ~15 color value migrations

### 2. **Complete Dark Mode Coverage** 🌓

- Add `.hero__subtitle` dark mode variant
- Add `.blogHero__lede` dark mode variant
- Add `.topbar__navLink:hover` theme-specific styling
- Add dark mode `.sidebar__link[aria-current="page"] .icon-tile` styling
- Ensure all text elements have proper contrast in both themes

### 3. **Typography Token Standardization** 📝

- Replace `blogHero__title` direct clamp with `--fs-*` token
- Ensure all font-size declarations use tokens or have clear rationale for direct values
- Add missing tokens if needed (e.g., `--fs-display` for extra-large text)

### 4. **Polish Active States** ✨

- Complete icon-tile active state for dark mode sidebar
- Ensure navigation active indicators work in both themes
- Add subtle hover feedback to topbar links per theme

## Impact

**Affected Specs:**

- visual-design (delta updates for consistency requirements)

**Affected Code:**

- `src/styles/theme.css` - ~20-30 line changes across multiple selectors

**User-Facing Changes:**

- Slightly improved visual consistency in dark mode
- Better contrast on subtitle/lede text in both themes
- More polished navigation hover states

**Technical Debt:**

- **Reduces** debt by standardizing on `color-mix()` API
- **Reduces** complexity by using design tokens consistently
- **Improves** maintainability for future theme adjustments

**Performance Considerations:**

- Zero performance impact (same rendering path)
- Slightly better browser optimization with `color-mix()` vs `rgba()`

**Migration Notes:**

- All changes are visual refinements
- No breaking changes to component APIs
- No functional behavior changes

**Timeline Estimate:**

- Implementation: 1-2 hours
- Testing: 30 minutes
- **Total: 1.5-2.5 hours**

**Success Criteria:**

- All interactive elements use `color-mix()` consistently
- All text elements have theme-specific styling where needed
- All font-sizes use design tokens (with documented exceptions)
- Visual regression tests pass in both light and dark modes
