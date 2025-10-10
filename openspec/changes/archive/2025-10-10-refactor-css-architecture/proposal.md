# Refactor CSS Architecture for Maintainability

## Why

The current CSS architecture has maintainability issues:
- **Monolithic theme.css** (5,150 lines) makes finding and updating styles difficult
- **750+ hardcoded rgba() colors** create duplication and inconsistency risk
- **202 theme-specific rules** scattered throughout make theme changes error-prone
- **Scoped vs global confusion** (ProfileCard bug required moving styles to global)
- **No clear organization** for where styles should live

This makes updates slow and error-prone, especially for theme parity fixes.

## What Changes

**CRITICAL: Zero visual changes. All colors, shadows, and effects stay pixel-perfect identical.**

### 1. Split theme.css into modules
```
src/styles/
├── theme.css (imports only)
├── tokens/
│   ├── colors.css (color variables)
│   ├── shadows.css (elevation system)
│   ├── spacing.css (existing)
│   └── typography.css (existing)
├── base/
│   ├── reset.css
│   └── layout.css
├── components/
│   ├── cards.css
│   ├── navigation.css
│   ├── hero.css
│   └── article.css
└── themes/
    ├── dark.css (all [data-theme="dark"] rules)
    └── light.css (all [data-theme="light"] rules)
```

### 2. Extract color tokens (preserve exact values)
```css
/* colors.css */
--color-dark-bg: rgba(29, 29, 32, 1);
--color-dark-border: rgba(255, 255, 255, 0.106);
--color-light-bg: rgba(248, 248, 251, 0.96);
/* ...750+ more, exact same values */
```

### 3. Consolidate shadow system (preserve 4-layer effects)
```css
/* shadows.css */
--shadow-card: 
  0 1px 2px rgba(0, 0, 0, 0.06),
  0 2px 4px rgba(0, 0, 0, 0.04),
  0 4px 8px rgba(0, 0, 0, 0.03),
  0 8px 16px rgba(0, 0, 0, 0.02);
/* Exact current values */
```

### 4. Document style guidelines
- When to use scoped component styles
- When to use global theme.css
- How to handle theme-specific overrides

## Impact

- Affected specs: `styling-system` (new capability)
- Affected code: `src/styles/theme.css` → split into modules
- Visual: **ZERO changes** - pixel-perfect preservation
- Maintainability: Easier to find, update, and maintain styles
- Theme parity: Easier to spot and fix inconsistencies
- Future: Easier to add new themes or components
