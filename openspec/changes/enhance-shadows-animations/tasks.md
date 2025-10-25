# Implementation Tasks

## Phase 1: Shadow Depth Enhancement

### 1A. Elevation Token System (20min)

- [ ] 1A.1 Create elevation-based shadow tokens
  - [ ] Add `--shadow-elevation-resting` (current base)
  - [ ] Add `--shadow-elevation-raised` (hover state)
  - [ ] Add `--shadow-elevation-floating` (active/dragging)
  - [ ] Add `--shadow-contact` (tight dark shadow beneath)
  - [ ] Add `--shadow-ambient` (colored ambient occlusion)

- [ ] 1A.2 Create card-specific elevation tokens
  - [ ] `--shadow-card-resting` - 4-layer base
  - [ ] `--shadow-card-raised` - 6-layer hover with more spread
  - [ ] `--shadow-card-floating` - 6-layer with soft edges
  - [ ] Add color-specific ambient shadows (blue, green, indigo, etc.)

- [ ] 1A.3 Create icon tile elevation tokens
  - [ ] `--shadow-icon-tile-resting` - Enhanced depth
  - [ ] `--shadow-icon-tile-raised` - Hover with glow
  - [ ] Color-specific glow variants

### 1B. Card Shadow Enhancements (20min)

- [ ] 1B.1 Update base card shadows
  - [ ] Replace `--shadow-card` with `--shadow-card-resting`
  - [ ] Increase layer count from 4 to 6
  - [ ] Add contact shadow layer
  - [ ] Test visual depth in dark/light modes

- [ ] 1B.2 Enhance hover card shadows
  - [ ] Replace `--shadow-card-hover` with `--shadow-card-raised`
  - [ ] Add 6-layer composition with more spread
  - [ ] Increase blur values for lift perception
  - [ ] Add subtle colored glow matching tint

- [ ] 1B.3 Add pressed/active card shadows
  - [ ] Create `--shadow-card-pressed` variant
  - [ ] Reduce shadow to create compression feel
  - [ ] Apply on `:active` state
  - [ ] Test touch feedback on mobile

- [ ] 1B.4 CardGrid/CardRail specific enhancements
  - [ ] Increase base shadow for tech stack cards
  - [ ] Add gradient overlay for material depth
  - [ ] Test shadow performance with many cards

### 1C. Icon Tile Depth in Cards (20min)

- [ ] 1C.1 Apply sidebar icon depth to card icons
  - [ ] Add inset highlights (`inset 0 1px 0 rgba()`)
  - [ ] Add split-tone borders (lighter top, darker bottom)
  - [ ] Add micro-gradient overlay with `::before`
  - [ ] Test in both dark and light modes

- [ ] 1C.2 Color-specific icon glows
  - [ ] Add blue glow for blue-tinted cards
  - [ ] Add green glow for green-tinted cards
  - [ ] Add indigo, teal, orange, pink variants
  - [ ] Ensure glows activate on card hover

- [ ] 1C.3 Icon hover enhancements
  - [ ] Add subtle rotation (0 → 2deg)
  - [ ] Increase glow intensity on icon hover
  - [ ] Add micro-scale animation
  - [ ] Test interaction feel

## Phase 2: Hover Elevation System

### 2A. Universal Elevation Pattern (15min)

- [ ] 2A.1 Create elevation mixin/pattern
  - [ ] Define standard elevation values
  - [ ] Rest: `transform: none`
  - [ ] Hover: `scale(1.024) translateY(-4px) rotate(-0.5deg)`
  - [ ] Active: `scale(0.98) translateY(1px)`

- [ ] 2A.2 Add spring easing functions
  - [ ] Create `--motion-ease-spring` token
  - [ ] Value: `cubic-bezier(0.34, 1.56, 0.64, 1)`
  - [ ] Create `--motion-ease-bounce` variant
  - [ ] Test spring feel across interactions

### 2B. Apply Elevations to All Elements (20min)

- [ ] 2B.1 Cards (tech stack, tools, blog, projects)
  - [ ] Add `-4px` translateY on hover
  - [ ] Add shadow transition to `--shadow-card-raised`
  - [ ] Add subtle rotation `-0.5deg`
  - [ ] Test across all card types

- [ ] 2B.2 Article cards
  - [ ] Add `-3px` translateY with forward lean
  - [ ] Add shadow elevation
  - [ ] Test in blog index and category pages

- [ ] 2B.3 Icon tiles (sidebar)
  - [ ] Add `-2px` translateY with existing scale
  - [ ] Enhance shadow on hover
  - [ ] Maintain spring bounce animation

- [ ] 2B.4 Buttons and CTAs
  - [ ] Add `-2px` translateY
  - [ ] Add glow effect on hover
  - [ ] Test "Read more" and primary buttons

- [ ] 2B.5 Profile card chips
  - [ ] Add `-3px` translateY
  - [ ] Add shadow spread increase
  - [ ] Test in ProfileCard component

- [ ] 2B.6 Category badges
  - [ ] Add `-1px` translateY (subtle)
  - [ ] Add border glow effect
  - [ ] Test in CategoryBadges component

### 2C. Elevation State Management (10min)

- [ ] 2C.1 Ensure consistent states
  - [ ] Verify all elements have rest → hover → active
  - [ ] Test keyboard navigation (focus states)
  - [ ] Test touch interactions (active states)

- [ ] 2C.2 Transition timing
  - [ ] Set hover transition: 250ms spring
  - [ ] Set active transition: 100ms ease-out
  - [ ] Ensure smooth state changes

## Phase 3: Apple-Compliant Microinteractions

### 3A. Spring Physics Animations (20min)

- [ ] 3A.1 Create spring keyframes
  - [ ] `@keyframes springUp` - Elevation with overshoot
  - [ ] `@keyframes springDown` - Compression with settle
  - [ ] `@keyframes springRotate` - Rotation with wobble
  - [ ] Test timing and feel

- [ ] 3A.2 Apply to interactive elements
  - [ ] Replace simple transforms with spring animations
  - [ ] Test on cards, buttons, icons
  - [ ] Ensure no jank or performance issues

- [ ] 3A.3 Momentum-based settling
  - [ ] Add settling animation after hover exit
  - [ ] Implement slight oscillation
  - [ ] Test natural feel

### 3B. Anticipatory Movements (25min)

- [ ] 3B.1 Magnetic hover effect
  - [ ] Create `src/scripts/magnetic-hover.ts`
  - [ ] Implement cursor tracking within 20px radius
  - [ ] Apply subtle transform toward cursor (max 5px)
  - [ ] Add to cards and large interactive elements
  - [ ] Test performance (use requestAnimationFrame)
  - [ ] Ensure desktop-only (no touch devices)

- [ ] 3B.2 Parallax icon movement
  - [ ] Icons shift -2px Y when card is hovered
  - [ ] Create depth separation within card
  - [ ] Use `transform: translateY(-2px)` on icon tiles
  - [ ] Test visual depth effect

- [ ] 3B.3 Peek animations in rails
  - [ ] Next card in rail peeks +12px on hover
  - [ ] Previous card dims slightly (opacity 0.8)
  - [ ] Create attention-drawing effect
  - [ ] Test in cardRail horizontal scrolling

### 3C. Gesture-Based Interactions (25min)

- [ ] 3C.1 Enhanced momentum scrolling
  - [ ] Create `src/scripts/momentum-scroll.ts`
  - [ ] Implement iOS-style momentum for cardRail
  - [ ] Add velocity calculation
  - [ ] Add deceleration curve
  - [ ] Test smooth feel on mobile

- [ ] 3C.2 Rubber-band edges
  - [ ] Add resistance at rail boundaries
  - [ ] Implement spring-back animation
  - [ ] Test overscroll protection
  - [ ] Ensure touch-only feature

- [ ] 3C.3 Pull-to-compress (optional)
  - [ ] Cards compress slightly when pulled down
  - [ ] Add spring-back on release
  - [ ] Mobile-only feature
  - [ ] Test touch interaction feel

### 3D. Focus & State Transitions (10min)

- [ ] 3D.1 Enhanced focus ring
  - [ ] Add z-depth illusion to focus ring
  - [ ] Implement `box-shadow` layering
  - [ ] Test keyboard navigation
  - [ ] Ensure accessibility maintained

- [ ] 3D.2 Icon swap animations
  - [ ] Add cross-fade with scale for theme toggle
  - [ ] Implement in LiquidThemeToggle
  - [ ] Add smooth transitions (200ms)
  - [ ] Test visual smoothness

- [ ] 3D.3 Error shake animation
  - [ ] Create `@keyframes shake` with spring physics
  - [ ] Apply to form errors and validation
  - [ ] Test feel (not too aggressive)

### 3E. Scroll-Based Microinteractions (10min)

- [ ] 3E.1 Scroll-linked parallax
  - [ ] Create `src/scripts/parallax.ts`
  - [ ] Hero elements move at 0.5x scroll speed
  - [ ] Use `transform: translateY()` based on scroll
  - [ ] Test performance with Intersection Observer

- [ ] 3E.2 Sticky header blur enhancement
  - [ ] Topbar blur increases with scroll depth
  - [ ] Implement dynamic backdrop-filter
  - [ ] Test smooth transition

- [ ] 3E.3 Dynamic edge fade indicators
  - [ ] CardRail edge fades adjust opacity with scroll
  - [ ] Fade at start: visible when not at start
  - [ ] Fade at end: visible when not at end
  - [ ] Test scroll position detection

## Phase 4: Advanced Visual Polish (Optional)

### 4A. Material Effects (20min)

- [ ] 4A.1 Frosted glass shadows
  - [ ] Add colored blur beneath cards
  - [ ] Implement with backdrop-filter
  - [ ] Test performance impact
  - [ ] Ensure fallback for unsupported browsers

- [ ] 4A.2 Ambient occlusion
  - [ ] Darker edges where cards rest on surface
  - [ ] Use gradient or box-shadow
  - [ ] Test subtle effect in both modes

- [ ] 4A.3 Specular highlights
  - [ ] Light reflection on icon tile edges
  - [ ] Add with `::after` pseudo-element
  - [ ] Position at top-left edge
  - [ ] Test subtlety

- [ ] 4A.4 Surface texture
  - [ ] Micro-noise overlay at 1-2% opacity
  - [ ] Add to cards and panels
  - [ ] Test organic feel vs. flat

### 4B. Color & Lighting (20min)

- [ ] 4B.1 Colored shadows matching tint
  - [ ] Blue cards → blue-tinted shadows
  - [ ] Green cards → green-tinted shadows
  - [ ] Test subtlety (very low opacity)

- [ ] 4B.2 Directional lighting simulation
  - [ ] Add gradient suggesting top-left light
  - [ ] Enhance inset highlights
  - [ ] Test 3D perception

- [ ] 4B.3 Edge glow on hover
  - [ ] Add accent color glow to card edges
  - [ ] Use box-shadow with color
  - [ ] Test visual appeal

- [ ] 4B.4 Luminosity shifts
  - [ ] Icons appear brighter on hover
  - [ ] Use filter: brightness(1.1)
  - [ ] Test perceived quality

### 4C. Depth of Field (20min)

- [ ] 4C.1 Background blur on hover
  - [ ] Blur sibling cards when one is hovered
  - [ ] Use backdrop-filter or CSS filter
  - [ ] Test performance

- [ ] 4C.2 Focus state depth separation
  - [ ] Focused element appears closer
  - [ ] Background elements dim
  - [ ] Test attention direction

- [ ] 4C.3 Modal-like attention
  - [ ] Active element stands out dramatically
  - [ ] Background elements reduce opacity
  - [ ] Test clarity vs. distraction

## Testing & Validation

- [ ] 5.1 Performance testing
  - [ ] Test animation FPS (should be 60fps)
  - [ ] Profile with Chrome DevTools Performance
  - [ ] Check for layout thrashing
  - [ ] Ensure GPU acceleration working
  - [ ] Test on low-end devices

- [ ] 5.2 Cross-browser testing
  - [ ] Test shadows in Safari, Chrome, Firefox
  - [ ] Verify spring animations work
  - [ ] Check elevation transforms
  - [ ] Test on mobile Safari and Chrome
  - [ ] Ensure fallbacks for older browsers

- [ ] 5.3 Accessibility testing
  - [ ] Verify reduced-motion disables animations
  - [ ] Test keyboard navigation with elevations
  - [ ] Ensure focus states are clear
  - [ ] Test screen reader compatibility
  - [ ] Verify color contrast maintained

- [ ] 5.4 Visual regression testing
  - [ ] Compare shadow depth before/after
  - [ ] Verify elevation consistency
  - [ ] Check for visual glitches
  - [ ] Test in both dark and light modes
  - [ ] Verify icon tile depth

- [ ] 5.5 Interaction testing
  - [ ] Test hover feel on all elements
  - [ ] Verify spring physics feel natural
  - [ ] Test touch interactions on mobile
  - [ ] Check cardRail momentum scrolling
  - [ ] Verify magnetic hover feels good

- [ ] 5.6 Build and deploy
  - [ ] Run `bun run check`
  - [ ] Verify no TypeScript errors
  - [ ] Check bundle size impact
  - [ ] Test production build
  - [ ] Verify performance in production

## Documentation

- [ ] 6.1 Shadow token documentation
  - [ ] Document elevation levels and usage
  - [ ] Explain when to use each level
  - [ ] Provide code examples

- [ ] 6.2 Animation guidelines
  - [ ] Document spring easing usage
  - [ ] Explain elevation pattern
  - [ ] Provide microinteraction examples

- [ ] 6.3 Performance considerations
  - [ ] Document will-change usage
  - [ ] Explain GPU acceleration
  - [ ] Note reduced-motion requirements

- [ ] 6.4 Code comments
  - [ ] Add comments to shadow tokens
  - [ ] Explain elevation state machine
  - [ ] Document spring physics values
