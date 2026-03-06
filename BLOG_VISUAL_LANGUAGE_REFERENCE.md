# Blog Page Visual Language Reference

## Overview
The blog page should align with the home page's visual language, which uses Apple HIG design principles with Tahoe 26 color system, layered shadows, glass morphism, and premium motion surfaces.

---

## Key Reference Files

### Core Styles
- **`src/styles/theme.css`** - Master stylesheet with all component styles
- **`src/styles/tokens/colors.css`** - Apple HIG color system (dark/light modes)
- **`src/styles/tokens/shadows.css`** - 4-layer shadow system for depth
- **`src/styles/tokens/materials.css`** - Glass morphism and material properties
- **`src/styles/tokens/spacing.css`** - Responsive spacing tokens
- **`src/styles/tokens/animations.css`** - Keyframe animations and motion utilities

### Components
- **`src/components/ArticleCard.astro`** - Blog card component (featured & standard)
- **`src/components/ProfileCard.astro`** - Profile card (reference for elevation patterns)
- **`src/pages/index.astro`** - Home page (bento grid layout reference)
- **`src/pages/blog/index.astro`** - Blog index page

---

## Visual Language Elements

### Gradients
**Hero Halo (Blog Featured Cards)**
- Dark: `radial-gradient(circle at 20% 20%, rgba(88, 86, 214, 0.5), transparent 65%), radial-gradient(circle at 80% 80%, rgba(77, 166, 255, 0.42), transparent 70%)`
- Light: Same but with `rgba(0, 113, 227, 0.42)` for second gradient
- Blur: 50-56px, opacity 0.62-0.75

**Card Halo (Featured Articles)**
- Radial gradient at 25%/25% and 75%/75% with blue/indigo accents
- Blur: 42-50px, opacity 0.52-0.72

### Cards & Surfaces
**Article Cards**
- Border radius: `clamp(20px, 1.8vw, 26px)`
- Standard: `min-height: 198px`, featured: `min-height: 300px`
- Dark bg: `rgba(29, 29, 32, 0.95)`, border: `rgba(255, 255, 255, 0.106)`
- Light bg: `rgba(248, 248, 251, 0.95)`, border: `rgba(60, 60, 67, 0.106)`
- Featured: 3px left border (blue accent)

**Spacing**
- Card padding: `clamp(14px, 1.8vw, 20px)`
- Gap between cards: `clamp(var(--space-sm), 2.4vw, var(--space-lg))`
- Grid basis: `clamp(292px, 28vw, 344px)`

### Shadows (4-Layer System)
**Card Shadow**: `0 2px 4px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.12), 0 20px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`

**Card Hover**: `0 4px 8px rgba(0,0,0,0.1), 0 12px 24px rgba(0,0,0,0.16), 0 28px 56px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)`

**Featured Hover (Dark)**: Inset blue accent + 4-layer shadow + blue glow `0 0 60px rgba(10, 132, 255, 0.25)`

### Motion & Interaction
**Hover Elevation**
- Standard: `-4px` translate, `1.01` scale
- Premium: `-6px` translate, `1.014` scale
- Duration: `var(--motion-duration-fast)` (200ms)
- Easing: `var(--motion-ease-out)` (cubic-bezier)

**Classes**
- `.hover-elevate` - Base elevation behavior
- `.motion-surface-standard` - Standard cards
- `.motion-surface-premium` - Featured cards
- `.motion-chip` - Interactive elements

### Typography
**Article Card Title**
- Size: `clamp(19px, 0.8vw + 16px, 24px)`
- Weight: 800 (extrabold)
- Featured: `clamp(21px, 1.2vw + 18px, 27px)`
- Letter spacing: `-0.025em`

**Summary Text**
- Size: `var(--fs--1)` (14px base)
- Weight: 500
- Line clamp: 4 lines
- Dark: `rgba(235, 235, 245, 0.72)`, Light: `rgba(60, 60, 67, 0.72)`

### Colors
**Primary Blue**: `#0a84ff` (dark), `#0071e3` (light)
**Accent Borders**: 3px left border on featured cards
**Text Hierarchy**: Strong/muted opacity levels per theme

---

## Implementation Notes
1. Use CSS custom properties from tokens for consistency
2. Apply `.hover-elevate` + `.motion-surface-standard/premium` classes
3. Featured cards need `.articleCard--featured` with blue accent styling
4. Maintain 4-layer shadow system for depth
5. Use radial gradients for halo effects on featured content
6. Responsive spacing with `clamp()` for fluid scaling

