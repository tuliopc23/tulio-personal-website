# Enhance Shadow Depth & Animation System

## Why

The website has a solid foundation with card shadows and basic hover states, but there's significant opportunity to elevate the perceived quality through:

1. **Insufficient depth hierarchy** - Tech stack/tools cards and their icons lack the dimensional depth seen in polished Apple interfaces
2. **Flat hover states** - Most interactive elements have simple scale transforms without the elevation characteristics of native macOS/iOS
3. **Missing microinteractions** - Several Apple HIG-compliant interaction patterns are absent (spring animations, momentum, parallax)
4. **Icon depth inconsistency** - Icon tiles in cards don't have the same refined depth as sidebar icons

**Current state:**
- Cards use basic 4-layer shadows without elevation transitions
- Hover states mostly use `scale(1.024)` without Y-axis translation
- Icon tiles in cards lack the inset highlights and dimensional effects
- No spring-based physics animations
- Missing anticipatory micro-movements on hover
- No parallax or depth-of-field effects

**Inspiration sources:**
- macOS Ventura/Sonoma window shadows with elevation
- iOS 17 card stack elevations
- Apple.com product card interactions
- SF Symbols icon depth in system apps
- Notification Center card animations

This enhancement will make the site feel more native and polished while maintaining performance.

## What Changes

### Phase 1: Shadow Depth Enhancement

**A. Card Shadow System Overhaul**
- Replace flat 4-layer shadows with elevation-based system
- Add 3 elevation levels: `resting`, `raised`, `floating`
- Each level has distinct shadow characteristics:
  - **Resting** (current): Subtle, close to surface
  - **Raised** (hover): Medium lift, 4-8px translate-y
  - **Floating** (active/dragging): High lift, softer edges
- Implement colored ambient occlusion for depth perception
- Add contact shadows (tight dark shadow beneath cards)

**B. Tech Stack & Tools Card Enhancements**
- Increase base shadow depth for cards in `.cardGrid` and `.cardRail`
- Add layered shadow composition (4 → 6 layers)
- Implement micro-glow that matches icon tint color
- Add subtle gradient overlay for material depth
- Enhance icon tile depth within cards:
  - Add inset highlights (like sidebar icons)
  - Implement split-tone borders
  - Add micro-texture overlay
  - Create color-specific glows on hover

**C. Icon Tile Enhancement (Cards)**
- Apply same depth treatment as sidebar icons
- Add micro-gradient overlay (3D lighting effect)
- Implement hover glow that matches card tint
- Add subtle rotation on hover (0 → 2deg)
- Create pressed state with depth compression

### Phase 2: Hover Elevation System

**A. Universal Elevation Pattern**
- Implement `translateY()` on all interactive cards
- Hover state: `scale(1.024) translateY(-4px)`
- Add smooth shadow transition matching elevation
- Implement spring-based easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Add subtle rotation for organic feel (`rotate(0 → -0.5deg)`)

**B. Element-Specific Elevations**
Apply hover elevations to:
- **Cards** (tech stack, tools, blog, projects): -4px lift
- **Article cards**: -3px lift with forward lean
- **Icon tiles** (sidebar): -2px lift with scale
- **Buttons/CTAs**: -2px lift with glow
- **Profile card chips**: -3px lift with shadow spread
- **Category badges**: -1px lift with border glow

**C. Elevation States**
Three distinct states for every interactive element:
- **Rest**: Base shadow, no transform
- **Hover**: Elevated shadow, translateY + scale + rotate
- **Active/Pressed**: Compressed shadow, scale(0.98) translateY(1px)

### Phase 3: Apple-Compliant Microinteractions

**A. Spring Physics Animations**
- Replace linear/ease transitions with spring curves
- Implement momentum-based scrolling feedback
- Add overshoot on hover (scale 1.0 → 1.06 → 1.024)
- Create settling animations (not instant stops)

**B. Anticipatory Movements**
- **Magnetic hover**: Elements slightly lean toward cursor (within 20px radius)
- **Parallax icons**: Icon tiles shift -2px Y on card hover
- **Stacked depth**: Background elements move slower than foreground (parallax)
- **Peek animations**: Cards in rail peek +12px on next card hover

**C. Gesture-Based Interactions**
- **Pull-to-dismiss**: Cards can be pulled down to compress (mobile)
- **Momentum scrolling**: Card rails have iOS-style momentum
- **Rubber-band edges**: Scroll resistance at rail boundaries
- **Spring-back**: Dragged cards spring back to position

**D. Focus & State Transitions**
- **Focus ring elevation**: Ring appears to be "above" element (z-depth illusion)
- **Icon swap animations**: Cross-fade with scale (theme toggle, etc.)
- **Loading states**: Shimmer with wave motion (not linear)
- **Error states**: Shake animation with spring physics

**E. Scroll-Based Microinteractions**
- **Scroll reveal stagger**: Elements reveal with varying delays (already exists, enhance)
- **Scroll-linked parallax**: Hero elements move at 0.5x scroll speed
- **Sticky header blur**: Topbar blur increases with scroll depth
- **Edge fade indicators**: Dynamic opacity based on scroll position

### Phase 4: Advanced Visual Polish (Optional)

**A. Material Effects**
- Frosted glass shadows (colored blur beneath cards)
- Ambient occlusion (darker edges where cards "rest" on surface)
- Specular highlights (light reflection on icon tile edges)
- Surface texture (micro-noise overlay at 1-2% opacity)

**B. Color & Lighting**
- Colored shadows matching card tint (subtle)
- Directional lighting simulation (top-left light source)
- Edge glow on hover (matching accent color)
- Luminosity shifts (icons appear brighter on hover)

**C. Depth of Field**
- Blur background cards when one is hovered
- Focus state creates depth separation
- Modal-like attention drawing to active element

## Files Affected

### Phase 1 (Shadows)
- `src/styles/tokens/shadows.css` - Add elevation levels, contact shadows, ambient occlusion
- `src/styles/theme.css` - Enhance card shadows, icon tile depth
- `src/components/IconTile.astro` - Add depth layers for cards

### Phase 2 (Elevations)
- `src/styles/theme.css` - Add hover elevations to all interactive elements
- `src/styles/motion.css` - Add spring easing functions
- `src/scripts/motion.ts` - Enhance reveal animations

### Phase 3 (Microinteractions)
- `src/scripts/magnetic-hover.ts` - NEW: Magnetic hover effect
- `src/scripts/parallax.ts` - NEW: Parallax scrolling
- `src/scripts/momentum-scroll.ts` - NEW: Enhanced card rail scrolling
- `src/styles/theme.css` - Add microinteraction animations
- `src/styles/motion.css` - Add spring keyframes

### Phase 4 (Polish - Optional)
- `src/styles/theme.css` - Material effects and lighting
- `src/components/GlassBlur.astro` - NEW: Frosted glass component

## Impact

**Positive:**
- Significantly more polished, professional feel
- Better depth perception and visual hierarchy
- More engaging, responsive interactions
- Native macOS/iOS quality feel
- Enhanced accessibility through clearer affordances
- Better tactile feedback for touch interactions

**Neutral:**
- Bundle size: +3-5KB CSS, +2-4KB JS (optional features)
- Animation complexity increases (well-optimized)
- ~150-200 new lines of CSS
- ~200-300 lines of JS for advanced features

**Performance Considerations:**
- Use `transform` and `opacity` (GPU-accelerated)
- Implement `will-change` for frequently animated elements
- Add `contain: layout style` for cards
- Use `requestAnimationFrame` for JS animations
- Respect `prefers-reduced-motion` throughout

**Browser Support:**
- Spring curves: Modern browsers (fallback to ease-out)
- Magnetic hover: Pointer events (graceful degradation)
- Parallax: Intersection Observer (progressive enhancement)

## Implementation Phases

### Phase 1: Shadow Depth (60 minutes)
1A. Create elevation token system (20min)
1B. Enhance card shadows (20min)
1C. Refine icon tile depth in cards (20min)

### Phase 2: Hover Elevations (45 minutes)
2A. Implement universal elevation pattern (15min)
2B. Apply elevations to all elements (20min)
2C. Add spring physics easing (10min)

### Phase 3: Microinteractions (90 minutes)
3A. Spring physics animations (20min)
3B. Anticipatory movements (25min)
3C. Gesture-based interactions (25min)
3D. Focus & state transitions (10min)
3E. Scroll-based interactions (10min)

### Phase 4: Advanced Polish (60 minutes, OPTIONAL)
4A. Material effects (20min)
4B. Color & lighting (20min)
4C. Depth of field (20min)

**Total estimated time**: 3.25-4.5 hours (2.5-3 hours core, 1 hour optional)

## Success Criteria

- [ ] Cards have clear 3-level elevation hierarchy
- [ ] All interactive elements elevate on hover
- [ ] Icon tiles in cards match sidebar icon depth
- [ ] Spring physics feel natural and responsive
- [ ] Microinteractions enhance without distracting
- [ ] Performance: 60fps on hover/scroll
- [ ] Lighthouse performance score maintained
- [ ] Reduced motion is fully respected
- [ ] Touch interactions work smoothly on mobile
- [ ] Visual depth matches Apple HIG quality standards

## Design Principles

1. **Subtle Elevation** - Depth is felt, not forced
2. **Physics-Based** - Use spring curves and momentum
3. **Anticipatory** - Elements react before full interaction
4. **Consistent** - Same patterns across all similar elements
5. **Performant** - GPU-accelerated, optimized animations
6. **Accessible** - Respects reduced motion, maintains keyboard nav
7. **Progressive** - Core experience works without JS enhancements

## Apple HIG Compliance

This enhancement follows Apple Human Interface Guidelines for:
- **Materials & Vibrancy**: Layered shadows create depth perception
- **Motion**: Spring-based physics match system animations
- **Interactive Elements**: Clear hover states with elevation
- **Feedback**: Immediate visual response to interactions
- **Depth**: Multiple elevation levels establish hierarchy
