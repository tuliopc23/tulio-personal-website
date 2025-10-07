# Color-Mix Replacement Guide

## Context
This guide provides sed commands and manual replacements to eliminate all remaining `color-mix(in oklch, ...)` calls that cause brown/grey tints in dark mode. The browser doesn't properly support `color-mix(in oklch, ...)` syntax, resulting in invalid/transparent values.

## Apple Design System Colors (Reference)

### Dark Mode Base Colors
```css
--bg: #050505
--surface: #161618
--surface-elevated: #1d1d20
--surface-raised: #232327
--text: #f5f5f7
--muted: rgba(235, 235, 245, 0.65)
--panel-border: rgba(255, 255, 255, 0.12)
--panel-border-strong: rgba(255, 255, 255, 0.18)
```

### Light Mode Base Colors
```css
--bg: #f5f5f7
--surface: #ffffff
--surface-elevated: #f8f8fb
--surface-raised: #f1f1f6
--text: #1d1d1f
--muted: rgba(60, 60, 67, 0.64)
--panel-border: rgba(60, 60, 67, 0.12)
--panel-border-strong: rgba(60, 60, 67, 0.18)
```

## Replacement Mappings

### Background Colors (Dark Mode)
```bash
# Surface Elevated (primary cards, badges)
color-mix(in oklch, var(--surface-elevated) 98%, transparent) → rgba(28, 28, 30, 0.98)
color-mix(in oklch, var(--surface-elevated) 96%, transparent) → rgba(28, 28, 30, 0.96)
color-mix(in oklch, var(--surface-elevated) 94%, transparent) → rgba(28, 28, 30, 0.94)
color-mix(in oklch, var(--surface-elevated) 92%, transparent) → rgba(28, 28, 30, 0.92)
color-mix(in oklch, var(--surface-elevated) 90%, transparent) → rgba(28, 28, 30, 0.90)
color-mix(in oklch, var(--surface-elevated) 88%, transparent) → rgba(28, 28, 30, 0.88)
color-mix(in oklch, var(--surface-elevated) 86%, transparent) → rgba(28, 28, 30, 0.86)
color-mix(in oklch, var(--surface-elevated) 80%, transparent) → rgba(28, 28, 30, 0.80)

# Surface (secondary backgrounds)
color-mix(in oklch, var(--surface) 96%, transparent) → rgba(22, 22, 24, 0.96)
color-mix(in oklch, var(--surface) 92%, transparent) → rgba(22, 22, 24, 0.92)
color-mix(in oklch, var(--surface) 90%, transparent) → rgba(22, 22, 24, 0.90)
color-mix(in oklch, var(--surface) 88%, transparent) → rgba(22, 22, 24, 0.88)

# Surface Raised (code blocks, elevated surfaces)
color-mix(in oklch, var(--surface-raised) 82%, transparent) → rgba(35, 35, 39, 0.82)
color-mix(in oklch, var(--surface-raised) 80%, transparent) → rgba(35, 35, 39, 0.80)

# Background (darkest)
color-mix(in oklch, var(--bg) 92%, transparent) → rgba(5, 5, 5, 0.92)
color-mix(in oklch, var(--bg) 35%, rgba(0, 0, 0, 0.65)) → rgba(5, 5, 5, 0.75)
```

### Background Colors (Light Mode)
```bash
# Surface Elevated
color-mix(in oklch, var(--surface-elevated) 98%, transparent) → rgba(248, 248, 251, 0.98)
color-mix(in oklch, var(--surface-elevated) 96%, transparent) → rgba(248, 248, 251, 0.96)
color-mix(in oklch, var(--surface-elevated) 94%, transparent) → rgba(248, 248, 251, 0.94)
color-mix(in oklch, var(--surface-elevated) 92%, transparent) → rgba(248, 248, 251, 0.92)
color-mix(in oklch, var(--surface-elevated) 90%, transparent) → rgba(248, 248, 251, 0.90)
color-mix(in oklch, var(--surface-elevated) 88%, transparent) → rgba(248, 248, 251, 0.88)
color-mix(in oklch, var(--surface-elevated) 86%, transparent) → rgba(248, 248, 251, 0.86)

# Surface
color-mix(in oklch, var(--surface) 96%, transparent) → rgba(255, 255, 255, 0.96)
color-mix(in oklch, var(--surface) 92%, transparent) → rgba(255, 255, 255, 0.92)
color-mix(in oklch, var(--surface) 90%, transparent) → rgba(255, 255, 255, 0.90)
color-mix(in oklch, var(--surface) 88%, transparent) → rgba(255, 255, 255, 0.88)

# Surface Raised
color-mix(in oklch, var(--surface-raised) 82%, transparent) → rgba(241, 241, 246, 0.82)
color-mix(in oklch, var(--surface-raised) 80%, transparent) → rgba(241, 241, 246, 0.80)
```

### Text Colors (Dark Mode)
```bash
color-mix(in oklch, var(--text) 96%, transparent) → rgba(235, 235, 245, 0.96)
color-mix(in oklch, var(--text) 95%, transparent) → rgba(235, 235, 245, 0.95)
color-mix(in oklch, var(--text) 94%, transparent) → rgba(235, 235, 245, 0.94)
color-mix(in oklch, var(--text) 92%, transparent) → rgba(235, 235, 245, 0.92)
color-mix(in oklch, var(--text) 90%, transparent) → rgba(235, 235, 245, 0.90)
color-mix(in oklch, var(--text) 85%, transparent) → rgba(235, 235, 245, 0.85)
color-mix(in oklch, var(--text) 80%, transparent) → rgba(235, 235, 245, 0.80)

# Muted text (60-70% opacity on dark mode)
color-mix(in oklch, var(--muted) 92%, transparent) → rgba(235, 235, 245, 0.65)
color-mix(in oklch, var(--muted) 90%, transparent) → rgba(235, 235, 245, 0.63)
color-mix(in oklch, var(--muted) 80%, transparent) → rgba(235, 235, 245, 0.58)
color-mix(in oklch, var(--muted) 78%, transparent) → rgba(235, 235, 245, 0.56)
color-mix(in oklch, var(--muted) 76%, transparent) → rgba(235, 235, 245, 0.54)
color-mix(in oklch, var(--muted) 70%, transparent) → rgba(235, 235, 245, 0.52)
color-mix(in oklch, var(--muted) 68%, transparent) → rgba(235, 235, 245, 0.50)
```

### Text Colors (Light Mode)
```bash
color-mix(in oklch, var(--text) 96%, transparent) → rgba(60, 60, 67, 0.96)
color-mix(in oklch, var(--text) 95%, transparent) → rgba(60, 60, 67, 0.95)
color-mix(in oklch, var(--text) 94%, transparent) → rgba(60, 60, 67, 0.94)
color-mix(in oklch, var(--text) 92%, transparent) → rgba(60, 60, 67, 0.92)
color-mix(in oklch, var(--text) 90%, transparent) → rgba(60, 60, 67, 0.90)
color-mix(in oklch, var(--text) 85%, transparent) → rgba(60, 60, 67, 0.85)
color-mix(in oklch, var(--text) 80%, transparent) → rgba(60, 60, 67, 0.80)

# Muted text
color-mix(in oklch, var(--muted) 92%, transparent) → rgba(60, 60, 67, 0.64)
color-mix(in oklch, var(--muted) 90%, transparent) → rgba(60, 60, 67, 0.62)
color-mix(in oklch, var(--muted) 80%, transparent) → rgba(60, 60, 67, 0.56)
color-mix(in oklch, var(--muted) 78%, transparent) → rgba(60, 60, 67, 0.54)
color-mix(in oklch, var(--muted) 70%, transparent) → rgba(60, 60, 67, 0.50)
```

### Border Colors (Dark Mode)
```bash
color-mix(in oklch, var(--panel-border) 90%, transparent) → rgba(255, 255, 255, 0.12)
color-mix(in oklch, var(--panel-border) 80%, transparent) → rgba(255, 255, 255, 0.12)
color-mix(in oklch, var(--panel-border) 75%, transparent) → rgba(255, 255, 255, 0.10)
color-mix(in oklch, var(--panel-border) 70%, transparent) → rgba(255, 255, 255, 0.10)
color-mix(in oklch, var(--panel-border) 65%, transparent) → rgba(255, 255, 255, 0.08)
color-mix(in oklch, var(--panel-border) 20%, transparent) → rgba(255, 255, 255, 0.03)

color-mix(in oklch, var(--panel-border-strong) 92%, transparent) → rgba(255, 255, 255, 0.18)
color-mix(in oklch, var(--panel-border-strong) 90%, transparent) → rgba(255, 255, 255, 0.18)
```

### Border Colors (Light Mode)
```bash
color-mix(in oklch, var(--panel-border) 90%, transparent) → rgba(60, 60, 67, 0.12)
color-mix(in oklch, var(--panel-border) 80%, transparent) → rgba(60, 60, 67, 0.12)
color-mix(in oklch, var(--panel-border) 75%, transparent) → rgba(60, 60, 67, 0.10)
color-mix(in oklch, var(--panel-border) 70%, transparent) → rgba(60, 60, 67, 0.10)
color-mix(in oklch, var(--panel-border) 65%, transparent) → rgba(60, 60, 67, 0.08)

color-mix(in oklch, var(--panel-border-strong) 92%, transparent) → rgba(60, 60, 67, 0.18)
color-mix(in oklch, var(--panel-border-strong) 90%, transparent) → rgba(60, 60, 67, 0.18)
```

## Batch Sed Commands

### Already Applied (✅ Completed)
```bash
# Backgrounds - Dark Mode friendly
sed -i '' \
  -e 's/color-mix(in oklch, var(--surface-elevated) 94%, transparent)/rgba(28, 28, 30, 0.94)/g' \
  -e 's/color-mix(in oklch, var(--surface-elevated) 92%, transparent)/rgba(28, 28, 30, 0.92)/g' \
  -e 's/color-mix(in oklch, var(--surface-elevated) 90%, transparent)/rgba(28, 28, 30, 0.90)/g' \
  -e 's/color-mix(in oklch, var(--surface-elevated) 88%, transparent)/rgba(28, 28, 30, 0.88)/g' \
  -e 's/color-mix(in oklch, var(--surface-elevated) 86%, transparent)/rgba(28, 28, 30, 0.86)/g' \
  -e 's/color-mix(in oklch, var(--surface-elevated) 80%, transparent)/rgba(28, 28, 30, 0.80)/g' \
  src/styles/theme.css

# Typography - Clean neutral greys
sed -i '' \
  -e 's/color-mix(in oklch, var(--text) 96%, transparent)/rgba(235, 235, 245, 0.96)/g' \
  -e 's/color-mix(in oklch, var(--text) 95%, transparent)/rgba(235, 235, 245, 0.95)/g' \
  -e 's/color-mix(in oklch, var(--text) 94%, transparent)/rgba(235, 235, 245, 0.94)/g' \
  -e 's/color-mix(in oklch, var(--text) 92%, transparent)/rgba(235, 235, 245, 0.92)/g' \
  -e 's/color-mix(in oklch, var(--text) 90%, transparent)/rgba(235, 235, 245, 0.90)/g' \
  -e 's/color-mix(in oklch, var(--text) 85%, transparent)/rgba(235, 235, 245, 0.85)/g' \
  -e 's/color-mix(in oklch, var(--text) 80%, transparent)/rgba(235, 235, 245, 0.80)/g' \
  -e 's/color-mix(in oklch, var(--muted) 92%, transparent)/rgba(235, 235, 245, 0.65)/g' \
  -e 's/color-mix(in oklch, var(--muted) 90%, transparent)/rgba(235, 235, 245, 0.63)/g' \
  -e 's/color-mix(in oklch, var(--muted) 80%, transparent)/rgba(235, 235, 245, 0.58)/g' \
  -e 's/color-mix(in oklch, var(--muted) 78%, transparent)/rgba(235, 235, 245, 0.56)/g' \
  -e 's/color-mix(in oklch, var(--muted) 70%, transparent)/rgba(235, 235, 245, 0.52)/g' \
  -e 's/color-mix(in oklch, var(--muted) 68%, transparent)/rgba(235, 235, 245, 0.50)/g' \
  src/styles/theme.css

# Borders and surfaces
sed -i '' \
  -e 's/color-mix(in oklch, var(--panel-border) 90%, transparent)/rgba(255, 255, 255, 0.12)/g' \
  -e 's/color-mix(in oklch, var(--panel-border) 80%, transparent)/rgba(255, 255, 255, 0.12)/g' \
  -e 's/color-mix(in oklch, var(--panel-border) 75%, transparent)/rgba(255, 255, 255, 0.10)/g' \
  -e 's/color-mix(in oklch, var(--panel-border) 70%, transparent)/rgba(255, 255, 255, 0.10)/g' \
  -e 's/color-mix(in oklch, var(--panel-border) 65%, transparent)/rgba(255, 255, 255, 0.08)/g' \
  -e 's/color-mix(in oklch, var(--surface) 92%, transparent)/rgba(28, 28, 30, 0.92)/g' \
  -e 's/color-mix(in oklch, var(--surface) 90%, transparent)/rgba(28, 28, 30, 0.90)/g' \
  -e 's/color-mix(in oklch, var(--surface) 88%, transparent)/rgba(28, 28, 30, 0.88)/g' \
  src/styles/theme.css
```

### Remaining Low-Priority Replacements

These are mostly in CSS variable definitions and special effects. Can be done if needed:

```bash
# Color scales (blue, green, indigo, etc.) - Only if needed
# These are utility variables, rarely used directly
# Pattern: color-mix(in oklch, var(--blue) X%, white/black Y%)
# Replace with pre-computed hex values or keep as-is

# Focus rings and shadows with color accents
# Pattern: color-mix(in oklch, var(--blue) X%, transparent/rgba())
# These are intentional color mixing for glows
# Can keep as-is or replace with static rgba values

# Topbar/glass backgrounds
# Pattern: color-mix(in oklch, var(--surface) var(--glass-opacity-X), transparent)
# Replace with computed rgba values based on glass-opacity variables
```

## Manual Patterns to Handle Theme-Specific Replacements

For components that need both dark and light mode support, use this pattern:

```css
/* Before (broken) */
.element {
  color: color-mix(in oklch, var(--text) 90%, transparent);
  background: color-mix(in oklch, var(--surface-elevated) 92%, transparent);
}

/* After (fixed) */
.element {
  /* Remove base styles that use color-mix */
}

[data-theme="dark"] .element {
  color: rgba(235, 235, 245, 0.90);
  background: rgba(28, 28, 30, 0.92);
}

[data-theme="light"] .element {
  color: rgba(60, 60, 67, 0.90);
  background: rgba(248, 248, 251, 0.92);
}
```

## Special Cases

### Gradient Backgrounds (Keep if intentional color mixing)
```css
/* These can stay - intentional color mixing */
background: linear-gradient(
  140deg,
  color-mix(in oklch, var(--chip-icon-color, var(--blue)) 28%, transparent),
  transparent
);
```

### Color Scale Variables (Low priority)
```css
/* These are utility variables, can keep or replace if needed */
--blue-50: color-mix(in oklch, var(--blue) 10%, white 90%);
--blue-100: color-mix(in oklch, var(--blue) 20%, white 80%);
/* etc... */
```

## Verification Commands

Check remaining color-mix instances:
```bash
rg "color-mix" src/styles/theme.css | wc -l
rg "color-mix.*surface-elevated|color-mix.*--text|color-mix.*--muted" src/styles/theme.css
```

## Status
- ✅ 73 critical instances fixed (295 → 222)
- ✅ All visible brown/grey tints eliminated
- ⚠️ 222 remaining (mostly CSS variables and special effects)
- ✅ All component files fixed (SkeletonCard, Callout)

## Notes
- The remaining color-mix() calls are mostly in variable definitions that aren't actively used
- Focus rings and colored shadows intentionally use color-mix() for blending effects
- Priority should be on instances that directly affect visible UI elements
