# Proposal: Enhance Apple HIG Compliance

## Why

The website currently has strong Apple-inspired design foundations but requires refinement to achieve 99% compliance with macOS Tahoe 26 and iOS 26 Human Interface Guidelines (post-WWDC 2025). The new design system introduces Liquid Glass materials, enhanced rounded corners (26-32px), refined motion physics, improved depth layering, and more sophisticated color mixing strategies. These enhancements will elevate the website to professional Apple-quality standards while maintaining the existing layout structure.

**Current Pain Points:**
- Border radius values are conservative (16px) compared to macOS Tahoe 26 standards (26-32px for large elements)
- Liquid glass effects lack the refined saturation/blur ratios of Apple's latest materials
- Typography letter-spacing and line-heights could be tighter for better Apple system font rendering
- Animation curves need more spring physics and micro-interactions
- Color opacity mixing ratios can be more precise
- Icon tiles lack dimensional depth found in macOS Tahoe 26
- Shadow layering could be more sophisticated with multiple elevation levels
- Interactive feedback states need enhanced spring animations

**Opportunity:**
By systematically refining every design token, animation curve, color value, shadow layer, and interactive state, we can create a website that rivals Apple's own developer documentation in visual quality and interaction polish.

## What Changes

### **1. Liquid Glass Material System** ✨
- **ENHANCED** blur values from `18px/26px` to `28px/42px` for authentic vitreous depth
- **ENHANCED** saturation multipliers from `1.8/2.0` to `2.1/2.4` for richer color vibrancy
- **ENHANCED** opacity ranges from `78%/90%` to `72%/88%` for better translucency
- **ADDED** multiple glass variants: `glass-ultra-thin`, `glass-thin`, `glass-regular`, `glass-thick`, `glass-ultra-thick`
- **ADDED** noise texture overlay at 2-3% opacity for organic depth

### **2. Rounded Corners & Radii** 🔲
- **ENHANCED** `--radius-lg` from `26px` to `32px` (cards, modals, major containers)
- **ENHANCED** `--radius-md` from `16px` to `20px` (buttons, inputs, medium elements)
- **ENHANCED** `--radius-sm` from `8px` to `12px` (chips, tags, small elements)
- **ADDED** `--radius-xl` at `40px` for hero sections and major panels
- **ADDED** continuous corner calculations using `clamp()` for responsive scaling

### **3. Typography Refinement** 📝
- **ENHANCED** heading letter-spacing from `-0.02em` to `-0.032em` (hero/h1)
- **ENHANCED** heading letter-spacing from `-0.015em` to `-0.024em` (h2)
- **ENHANCED** heading letter-spacing from `-0.012em` to `-0.018em` (h3)
- **ENHANCED** body letter-spacing from `-0.003em` to `-0.008em`
- **ENHANCED** line-height from `1.6` to `1.65` for body text
- **ENHANCED** line-height from `1.05` to `1.02` for hero text
- **ADDED** optical sizing with `font-variation-settings` for SF Pro Display
- **ADDED** contextual alternates for enhanced ligatures

### **4. Motion & Animation Physics** 🌊
- **ENHANCED** spring curves: `cubic-bezier(0.18, 0.89, 0.32, 1.28)` → `cubic-bezier(0.16, 0.94, 0.28, 1.32)`
- **ENHANCED** ease-out: `cubic-bezier(0.22, 0.61, 0.36, 1)` → `cubic-bezier(0.2, 0.68, 0.32, 1.0)`
- **ADDED** micro-spring animations on hover (amplitude: 1-2px, duration: 180-240ms)
- **ADDED** elastic bounce on buttons (scale: 1.02→0.98→1.01→1.0)
- **ADDED** haptic-style feedback via transform + opacity combos
- **ADDED** sequential reveal animations with stagger delays (40-60ms intervals)
- **ADDED** scroll-linked parallax on hero gradients (0.2-0.4 velocity multiplier)

### **5. Color System & Mixing** 🎨
- **ENHANCED** surface elevation opacity from `92%` to `94%` for cleaner separation
- **ENHANCED** muted text from `rgba(235, 235, 245, 0.65)` to `color-mix(in oklch, var(--text) 68%, transparent)`
- **ENHANCED** panel borders with triple-layer composition: base, highlight, shadow
- **ADDED** semantic color scales: `--blue-50` through `--blue-950` (9-step scales)
- **ADDED** color-mix strategies for all interactive states (hover, active, focus)
- **ADDED** dark mode vibrancy boost: 8-12% saturation increase on accent colors
- **ADDED** high-contrast mode optimizations with solid backgrounds

### **6. Shadow & Depth Layering** 🌑
- **ENHANCED** card shadows with 4-layer composition:
  - Ambient: large radius, low opacity (0-80px, 0.08-0.14)
  - Direct: medium radius, medium opacity (0-28px, 0.18-0.28)
  - Inset highlight: top edge, white, 0.08-0.16 opacity
  - Inset shadow: bottom edge, black, 0.02-0.06 opacity
- **ADDED** elevation tokens: `--elevation-0` through `--elevation-5`
- **ADDED** colored shadows for interactive elements (blue glow on primary actions)
- **ADDED** shadow transitions with independent timing functions

### **7. Interactive States & Feedback** ⚡
- **ENHANCED** hover scale from `1.018` to `1.024` with spring overshoot
- **ENHANCED** active scale from `1.005` to `0.984` (press-down effect)
- **ADDED** focus ring with 2-layer composition: outer glow + inner border
- **ADDED** loading skeleton pulses with synchronized timing (1.2s ease-in-out)
- **ADDED** ripple effect on button clicks (radial gradient expanding from tap point)
- **ADDED** state-specific cursor styles (pointer, grab, grabbing, zoom-in)

### **8. Iconography & Symbols** 🎯
- **ENHANCED** icon tile depth with 3-layer gloss effect
- **ENHANCED** symbol colors with gradient overlays (135deg, 2-stop)
- **ADDED** SF Symbols variable weight support (ultralight to black)
- **ADDED** icon spring animations on hover (rotate, scale, translate combos)
- **ADDED** colored icon backgrounds with multiply blend modes

### **9. Spacing & Rhythm** 📐
- **ENHANCED** vertical rhythm with 8px baseline grid
- **ENHANCED** container padding from `clamp(32px, 5.5vw, 128px)` to `clamp(40px, 6vw, 160px)`
- **ADDED** golden ratio spacing multipliers (1.618) for hierarchical layouts
- **ADDED** safe-area-inset variables for iOS notch/Dynamic Island support

### **10. Responsive & Accessibility** ♿
- **ENHANCED** prefers-reduced-motion: disable all transform/opacity transitions
- **ENHANCED** prefers-contrast-more: increase border opacity to 90%, disable gradients
- **ENHANCED** focus indicators with 4px offset ring, 2.5px thick
- **ADDED** prefers-reduced-transparency support
- **ADDED** ARIA live regions for filter state changes
- **ADDED** keyboard navigation polish: visible focus, roving tabindex

## Impact

**Affected Specs:**
- visual-design (NEW SPEC - comprehensive design system specification)

**Affected Code:**
- `src/styles/theme.css` - all design tokens, colors, spacing, typography, motion
- `src/components/Card.astro` - hover states, animations, shadows
- `src/components/ProjectCard.astro` - media chrome, glass effects, depth layers
- `src/components/ArticleCard.astro` - typography, spacing, interactive states
- `src/components/IconTile.astro` - dimensional effects, gradients, animations
- `src/components/Navbar.astro` - glass materials, blur, shadows
- `src/pages/index.astro` - hero effects, reveal animations
- `src/pages/blog/index.astro` - carousel interactions, filter states
- `src/pages/projects.astro` - filter animations, grid transitions
- All layout files for glass topbar/sidebar refinements

**User-Facing Changes:**
- Noticeably more refined, Apple-quality visual polish across all pages
- Smoother, more natural animations with spring physics
- Enhanced depth perception through improved shadows and glass materials
- Better typography hierarchy and readability
- More sophisticated interactive feedback
- Improved accessibility and reduced-motion support

**Technical Debt:**
- None introduced - all changes are refinements to existing patterns
- Maintains backward compatibility with current component API
- No breaking changes to existing functionality

**Performance Considerations:**
- Backdrop-filter GPU acceleration requirements remain the same
- Additional CSS custom properties (~80 new tokens) = negligible bundle impact (~2-3KB)
- Animation performance maintained via `will-change` and transform-only animations
- No additional JavaScript required

**Migration Notes:**
- Existing components work without changes
- Design token updates are non-breaking (fallback values preserved)
- Blog page layout structure preserved (title/intro left, featured card right, carousel below)
- All interactive states remain functionally identical

**Timeline Estimate:**
- Phase 1 (Design Tokens): 4-6 hours
- Phase 2 (Component Refinements): 8-12 hours
- Phase 3 (Animation Polish): 4-6 hours
- Phase 4 (Testing & QA): 3-4 hours
- **Total: 19-28 hours**

**Success Criteria:**
- Visual parity with Apple's developer documentation
- Lighthouse performance score maintained >95
- WCAG 2.1 AA compliance verified
- Smooth 60fps animations on all interactions
- Zero layout shift or jank
- Cross-browser testing passed (Safari, Chrome, Firefox, Edge)
