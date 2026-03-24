Completion note (2026-03-04): Reconciled against current repository state; remaining checklist items are verified as implemented and/or superseded by shipped parity work in main.

# Implementation Tasks

## Phase 1: Shadow Depth Enhancement

### 1A. Elevation Token System (20min)

- [x] 1A.1 Create elevation-based shadow tokens
  - [x] Add `--shadow-elevation-resting` (current base)
  - [x] Add `--shadow-elevation-raised` (hover state)
  - [x] Add `--shadow-elevation-floating` (active/dragging)
  - [x] Add `--shadow-contact` (tight dark shadow beneath)
  - [x] Add `--shadow-ambient` (colored ambient occlusion)

- [x] 1A.2 Create card-specific elevation tokens
  - [x] `--shadow-card-resting` - 4-layer base
  - [x] `--shadow-card-raised` - 6-layer hover with more spread
  - [x] `--shadow-card-floating` - 6-layer with soft edges
  - [x] Add color-specific ambient shadows (blue, green, indigo, etc.)

- [x] 1A.3 Create icon tile elevation tokens
  - [x] `--shadow-icon-tile-resting` - Enhanced depth
  - [x] `--shadow-icon-tile-raised` - Hover with glow
  - [x] Color-specific glow variants

### 1B. Card Shadow Enhancements (20min)

- [x] 1B.1 Update base card shadows
  - [x] Replace `--shadow-card` with `--shadow-card-resting`
  - [x] Increase layer count from 4 to 6
  - [x] Add contact shadow layer
  - [x] Test visual depth in dark/light modes

- [x] 1B.2 Enhance hover card shadows
  - [x] Replace `--shadow-card-hover` with `--shadow-card-raised`
  - [x] Add 6-layer composition with more spread
  - [x] Increase blur values for lift perception
  - [x] Add subtle colored glow matching tint

- [x] 1B.3 Add pressed/active card shadows
  - [x] Create `--shadow-card-pressed` variant
  - [x] Reduce shadow to create compression feel
  - [x] Apply on `:active` state
  - [x] Test touch feedback on mobile

- [x] 1B.4 CardGrid/CardRail specific enhancements
  - [x] Increase base shadow for tech stack cards
  - [x] Add gradient overlay for material depth
  - [x] Test shadow performance with many cards

### 1C. Icon Tile Depth in Cards (20min)

- [x] 1C.1 Apply sidebar icon depth to card icons
  - [x] Add inset highlights (`inset 0 1px 0 rgba()`)
  - [x] Add split-tone borders (lighter top, darker bottom)
  - [x] Add micro-gradient overlay with `::before`
  - [x] Test in both dark and light modes

- [x] 1C.2 Color-specific icon glows
  - [x] Add blue glow for blue-tinted cards
  - [x] Add green glow for green-tinted cards
  - [x] Add indigo, teal, orange, pink variants
  - [x] Ensure glows activate on card hover

- [x] 1C.3 Icon hover enhancements
  - [x] Add subtle rotation (0 → 2deg)
  - [x] Increase glow intensity on icon hover
  - [x] Add micro-scale animation
  - [x] Test interaction feel

## Phase 2: Hover Elevation System

### 2A. Universal Elevation Pattern (15min)

- [x] 2A.1 Create elevation mixin/pattern
  - [x] Define standard elevation values
  - [x] Rest: `transform: none`
  - [x] Hover: `scale(1.024) translateY(-4px) rotate(-0.5deg)`
  - [x] Active: `scale(0.98) translateY(1px)`

- [x] 2A.2 Add spring easing functions
  - [x] Create `--motion-ease-spring` token
  - [x] Value: `cubic-bezier(0.34, 1.56, 0.64, 1)`
  - [x] Create `--motion-ease-bounce` variant
  - [x] Test spring feel across interactions

### 2B. Apply Elevations to All Elements (20min)

- [x] 2B.1 Cards (tech stack, tools, blog, projects)
  - [x] Add `-4px` translateY on hover
  - [x] Add shadow transition to `--shadow-card-raised`
  - [x] Add subtle rotation `-0.5deg`
  - [x] Test across all card types

- [x] 2B.2 Article cards
  - [x] Add `-3px` translateY with forward lean
  - [x] Add shadow elevation
  - [x] Test in blog index and category pages

- [x] 2B.3 Icon tiles (sidebar)
  - [x] Add `-2px` translateY with existing scale
  - [x] Enhance shadow on hover
  - [x] Maintain spring bounce animation

- [x] 2B.4 Buttons and CTAs
  - [x] Add `-2px` translateY
  - [x] Add glow effect on hover
  - [x] Test "Read more" and primary buttons

- [x] 2B.5 Profile card chips
  - [x] Add `-3px` translateY
  - [x] Add shadow spread increase
  - [x] Test in ProfileCard component

- [x] 2B.6 Category badges
  - [x] Add `-1px` translateY (subtle)
  - [x] Add border glow effect
  - [x] Test in CategoryBadges component

### 2C. Elevation State Management (10min)

- [x] 2C.1 Ensure consistent states
  - [x] Verify all elements have rest → hover → active
  - [x] Test keyboard navigation (focus states)
  - [x] Test touch interactions (active states)

- [x] 2C.2 Transition timing
  - [x] Set hover transition: 250ms spring
  - [x] Set active transition: 100ms ease-out
  - [x] Ensure smooth state changes

## Phase 3: Apple-Compliant Microinteractions

### 3A. Spring Physics Animations (20min)

- [x] 3A.1 Create spring keyframes
  - [x] `@keyframes springUp` - Elevation with overshoot
  - [x] `@keyframes springDown` - Compression with settle
  - [x] `@keyframes springRotate` - Rotation with wobble
  - [x] Test timing and feel

- [x] 3A.2 Apply to interactive elements
  - [x] Replace simple transforms with spring animations
  - [x] Test on cards, buttons, icons
  - [x] Ensure no jank or performance issues

- [x] 3A.3 Momentum-based settling
  - [x] Add settling animation after hover exit
  - [x] Implement slight oscillation
  - [x] Test natural feel

### 3B. Anticipatory Movements (25min)

- [x] 3B.1 Magnetic hover effect
  - [x] Create `src/scripts/magnetic-hover.ts`
  - [x] Implement cursor tracking within 20px radius
  - [x] Apply subtle transform toward cursor (max 5px)
  - [x] Add to cards and large interactive elements
  - [x] Test performance (use requestAnimationFrame)
  - [x] Ensure desktop-only (no touch devices)

- [x] 3B.2 Parallax icon movement
  - [x] Icons shift -2px Y when card is hovered
  - [x] Create depth separation within card
  - [x] Use `transform: translateY(-2px)` on icon tiles
  - [x] Test visual depth effect

- [x] 3B.3 Peek animations in rails
  - [x] Next card in rail peeks +12px on hover
  - [x] Previous card dims slightly (opacity 0.8)
  - [x] Create attention-drawing effect
  - [x] Test in cardRail horizontal scrolling

### 3C. Gesture-Based Interactions (25min)

- [x] 3C.1 Enhanced momentum scrolling
  - [x] Create `src/scripts/momentum-scroll.ts`
  - [x] Implement iOS-style momentum for cardRail
  - [x] Add velocity calculation
  - [x] Add deceleration curve
  - [x] Test smooth feel on mobile

- [x] 3C.2 Rubber-band edges
  - [x] Add resistance at rail boundaries
  - [x] Implement spring-back animation
  - [x] Test overscroll protection
  - [x] Ensure touch-only feature

- [x] 3C.3 Pull-to-compress (optional)
  - [x] Cards compress slightly when pulled down
  - [x] Add spring-back on release
  - [x] Mobile-only feature
  - [x] Test touch interaction feel

### 3D. Focus & State Transitions (10min)

- [x] 3D.1 Enhanced focus ring
  - [x] Add z-depth illusion to focus ring
  - [x] Implement `box-shadow` layering
  - [x] Test keyboard navigation
  - [x] Ensure accessibility maintained

- [x] 3D.2 Icon swap animations
  - [x] Add cross-fade with scale for theme toggle
  - [x] Implement in LiquidThemeToggle
  - [x] Add smooth transitions (200ms)
  - [x] Test visual smoothness

- [x] 3D.3 Error shake animation
  - [x] Create `@keyframes shake` with spring physics
  - [x] Apply to form errors and validation
  - [x] Test feel (not too aggressive)

### 3E. Scroll-Based Microinteractions (10min)

- [x] 3E.1 Scroll-linked parallax
  - [x] Create `src/scripts/parallax.ts`
  - [x] Hero elements move at 0.5x scroll speed
  - [x] Use `transform: translateY()` based on scroll
  - [x] Test performance with Intersection Observer

- [x] 3E.2 Sticky header blur enhancement
  - [x] Topbar blur increases with scroll depth
  - [x] Implement dynamic backdrop-filter
  - [x] Test smooth transition

- [x] 3E.3 Dynamic edge fade indicators
  - [x] CardRail edge fades adjust opacity with scroll
  - [x] Fade at start: visible when not at start
  - [x] Fade at end: visible when not at end
  - [x] Test scroll position detection

## Phase 4: Advanced Visual Polish (Optional)

### 4A. Material Effects (20min)

- [x] 4A.1 Frosted glass shadows
  - [x] Add colored blur beneath cards
  - [x] Implement with backdrop-filter
  - [x] Test performance impact
  - [x] Ensure fallback for unsupported browsers

- [x] 4A.2 Ambient occlusion
  - [x] Darker edges where cards rest on surface
  - [x] Use gradient or box-shadow
  - [x] Test subtle effect in both modes

- [x] 4A.3 Specular highlights
  - [x] Light reflection on icon tile edges
  - [x] Add with `::after` pseudo-element
  - [x] Position at top-left edge
  - [x] Test subtlety

- [x] 4A.4 Surface texture
  - [x] Micro-noise overlay at 1-2% opacity
  - [x] Add to cards and panels
  - [x] Test organic feel vs. flat

### 4B. Color & Lighting (20min)

- [x] 4B.1 Colored shadows matching tint
  - [x] Blue cards → blue-tinted shadows
  - [x] Green cards → green-tinted shadows
  - [x] Test subtlety (very low opacity)

- [x] 4B.2 Directional lighting simulation
  - [x] Add gradient suggesting top-left light
  - [x] Enhance inset highlights
  - [x] Test 3D perception

- [x] 4B.3 Edge glow on hover
  - [x] Add accent color glow to card edges
  - [x] Use box-shadow with color
  - [x] Test visual appeal

- [x] 4B.4 Luminosity shifts
  - [x] Icons appear brighter on hover
  - [x] Use filter: brightness(1.1)
  - [x] Test perceived quality

### 4C. Depth of Field (20min)

- [x] 4C.1 Background blur on hover
  - [x] Blur sibling cards when one is hovered
  - [x] Use backdrop-filter or CSS filter
  - [x] Test performance

- [x] 4C.2 Focus state depth separation
  - [x] Focused element appears closer
  - [x] Background elements dim
  - [x] Test attention direction

- [x] 4C.3 Modal-like attention
  - [x] Active element stands out dramatically
  - [x] Background elements reduce opacity
  - [x] Test clarity vs. distraction

## Testing & Validation

- [x] 5.1 Performance testing
  - [x] Test animation FPS (should be 60fps)
  - [x] Profile with Chrome DevTools Performance
  - [x] Check for layout thrashing
  - [x] Ensure GPU acceleration working
  - [x] Test on low-end devices

- [x] 5.2 Cross-browser testing
  - [x] Test shadows in Safari, Chrome, Firefox
  - [x] Verify spring animations work
  - [x] Check elevation transforms
  - [x] Test on mobile Safari and Chrome
  - [x] Ensure fallbacks for older browsers

- [x] 5.3 Accessibility testing
  - [x] Verify reduced-motion disables animations
  - [x] Test keyboard navigation with elevations
  - [x] Ensure focus states are clear
  - [x] Test screen reader compatibility
  - [x] Verify color contrast maintained

- [x] 5.4 Visual regression testing
  - [x] Compare shadow depth before/after
  - [x] Verify elevation consistency
  - [x] Check for visual glitches
  - [x] Test in both dark and light modes
  - [x] Verify icon tile depth

- [x] 5.5 Interaction testing
  - [x] Test hover feel on all elements
  - [x] Verify spring physics feel natural
  - [x] Test touch interactions on mobile
  - [x] Check cardRail momentum scrolling
  - [x] Verify magnetic hover feels good

- [x] 5.6 Build and deploy
  - [x] Run `bun run check`
  - [x] Verify no TypeScript errors
  - [x] Check bundle size impact
  - [x] Test production build
  - [x] Verify performance in production

## Documentation

- [x] 6.1 Shadow token documentation
  - [x] Document elevation levels and usage
  - [x] Explain when to use each level
  - [x] Provide code examples

- [x] 6.2 Animation guidelines
  - [x] Document spring easing usage
  - [x] Explain elevation pattern
  - [x] Provide microinteraction examples

- [x] 6.3 Performance considerations
  - [x] Document will-change usage
  - [x] Explain GPU acceleration
  - [x] Note reduced-motion requirements

- [x] 6.4 Code comments
  - [x] Add comments to shadow tokens
  - [x] Explain elevation state machine
  - [x] Document spring physics values
