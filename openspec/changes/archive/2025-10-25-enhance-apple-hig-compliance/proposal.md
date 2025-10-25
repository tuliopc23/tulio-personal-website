# Enhance Apple HIG Design System Compliance

## Why

The current design system has a strong foundation with proper tokens, fluid typography, 4-layer shadows, and glass materials. However, after comparing against the reference Bentolink Bio project (which is fully Apple HIG compliant), there are specific refinements that will elevate the visual polish to match native macOS/iOS quality:

1. **Color hierarchy** needs more granular surface and text tokens for better depth perception
2. **Shadow system** lacks prominent inset highlights and some colored variants
3. **Glass materials** could benefit from more granular blur/saturation steps
4. **Icon tiles** need 95% opacity vibrant colors and enhanced depth
5. **Interactive states** need radial gradient overlays and more refined hover patterns

This is a **polish-focused enhancement** - the foundation is already excellent, we're adding the final 15% that makes interfaces feel truly native.

## What Changes

### Design Token Additions (Non-Breaking)

- **Color System**:
  - Add granular surface tokens: `--surface-card`, `--surface-card-hover`, `--surface-card-active`
  - Add 4-step text hierarchy: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-quaternary`
  - Add radial gradient tokens for atmospheric depth: `--bg-radial-primary`, `--bg-radial-secondary`, `--bg-radial-tertiary`
  - Add accent system expansions: `--accent-soft`, `--accent-tint`, `--accent-tint-strong`, `--accent-border`, `--accent-glow`, `--accent-hover`, `--accent-active`
  - Add border variants: `--panel-border-glow`, `--surface-card-border`, `--surface-card-border-strong`

- **Typography**:
  - Add refined line-height variants: `--lh-profile-name: 1.16`, `--lh-tight: 1.24`, `--lh-snug: 1.34`, `--lh-relaxed: 1.68`
  - Add component-specific sizes: `--fs-profile-name`, `--fs-profile-title`, `--fs-profile-bio`
  - Add letter-spacing refinements: `--ls-profile-name: -0.028em`, `--ls-profile-title: -0.018em`

- **Shadow System**:
  - Add icon tile shadows: `--shadow-symbol-dark` and `--shadow-symbol-light` with prominent inset highlights
  - Add `--shadow-card-highlight` variant
  - Add colored shadow tokens: `--shadow-blue`, `--shadow-green`, `--shadow-indigo`, `--shadow-teal`, `--shadow-orange`

- **Glass Materials**:
  - Add 6-level blur/saturation system: ultra-thin (18px), thin (28px), base (34px), thick (60px), ultra-thick (80px)
  - Add glass noise texture overlay: `--glass-noise-opacity: 0.03`

- **Motion**:
  - Add duration variants: `--motion-duration-slower: 700ms`, `--motion-duration-slowest: 1000ms`
  - Add scale variants: `--motion-scale-pressed: 0.92`

### Component Refinements

- **Icon Tiles**:
  - Enhance with 95% opacity vibrant colors in dark mode (e.g., `rgba(10, 132, 255, 0.95)`)
  - Add prominent inset highlights via `::before` pseudo-element
  - Add inner border ring via `::after` pseudo-element
  - Enhance hover state with stronger border and glow

- **Card Components**:
  - Add radial gradient overlay pattern with `::before` for accent tinting
  - Add focus ring with `::after` for keyboard navigation
  - Refine hover elevation with customizable CSS properties

- **Profile Card**:
  - Add photo ring glow effect
  - Enhance radial background glow positioning
  - Refine contact chip borders with blue tint

### Files Affected

- `src/styles/tokens/colors.css` - Add granular color tokens
- `src/styles/tokens/shadows.css` - Enhance shadow system
- `src/styles/theme.css` - Add typography/motion/glass tokens
- `src/components/IconTile.astro` - Add pseudo-element overlays
- `src/components/Card.astro` - Add gradient overlay and focus ring
- `src/components/ProfileCard.astro` - Add photo ring glow

## Impact

**Positive:**
- Elevated visual polish matching native macOS/iOS quality
- Better depth perception through enhanced shadows and gradients
- Improved accessibility with enhanced focus states
- More vibrant, saturated colors for icon tiles
- Better glass material fidelity with noise texture

**Neutral:**
- All changes are additive - no breaking changes to existing tokens
- Existing components continue to work with new enhancements layered on top
- ~100-150 lines of new CSS across token files
- Minimal performance impact (CSS-only, no JavaScript)

**Considerations:**
- Theme toggle behavior preserved (all new tokens have light/dark variants)
- Reduced motion preferences respected for all new animations
- Mobile optimization maintained (responsive values preserved)
- Backward compatible - old token names still work

## Migration Path

No migration required - this is a pure enhancement. All changes are:
1. Additive token additions (existing tokens untouched)
2. Component refinements via CSS (no prop changes)
3. Progressive enhancement (older browsers gracefully degrade)

Developers can adopt new tokens incrementally or continue using existing ones.

## Validation Checklist

- [ ] All new tokens documented in `src/styles/tokens/`
- [ ] Light and dark mode variants for all color tokens
- [ ] Reduced motion fallbacks for all animations
- [ ] Mobile responsive values for all fluid tokens
- [ ] Focus states meet WCAG AA contrast requirements
- [ ] Safari `-webkit-` prefixes for backdrop-filter
- [ ] Touch targets maintain 44px minimum (Apple HIG)
- [ ] TypeScript types updated if needed
