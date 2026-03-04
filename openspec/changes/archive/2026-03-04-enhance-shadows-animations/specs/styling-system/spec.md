# styling-system Specification Deltas

## ADDED Requirements

### Requirement: Elevation-Based Shadow System
The shadow system SHALL use distinct elevation levels to establish clear depth hierarchy and spatial relationships.

#### Scenario: Three elevation levels
- **WHEN** interactive element is in different states
- **THEN** appropriate elevation shadow is applied
- **AND** resting uses `--shadow-elevation-resting`
- **AND** hover/raised uses `--shadow-elevation-raised`
- **AND** active/floating uses `--shadow-elevation-floating`

#### Scenario: Card elevation shadows
- **WHEN** card is rendered
- **THEN** base uses `--shadow-card-resting` with 6 layers
- **AND** hover uses `--shadow-card-raised` with increased spread
- **AND** active uses `--shadow-card-pressed` for compression
- **AND** each includes contact shadow layer

#### Scenario: Contact shadows
- **WHEN** elevated element is displayed
- **THEN** tight dark shadow appears directly beneath
- **AND** contact shadow opacity increases with elevation
- **AND** spread is minimal (0-2px) for realism

#### Scenario: Ambient occlusion
- **WHEN** cards rest on surface
- **THEN** colored ambient shadow appears at edges
- **AND** color matches card tint at low opacity
- **AND** creates subtle depth perception

### Requirement: Icon Tile Depth in Cards
Icon tiles within cards SHALL have the same dimensional depth treatment as sidebar icons.

#### Scenario: Card icon tile depth layers
- **WHEN** icon tile renders in card
- **THEN** inset highlight at top edge (rgba(255,255,255,0.12-0.16))
- **AND** split-tone border (lighter top, darker bottom)
- **AND** micro-gradient overlay via ::before
- **AND** base shadow with 3-4 layers

#### Scenario: Icon tile color-specific glows
- **WHEN** card has data-tint attribute
- **THEN** icon tile glow matches tint color
- **AND** glow activates on card hover
- **AND** glow intensity is 0.08-0.12 opacity
- **AND** blur radius is 8-12px

#### Scenario: Icon tile hover enhancements
- **WHEN** icon tile or parent card is hovered
- **THEN** subtle rotation applies (0deg → 2deg)
- **AND** glow intensity increases
- **AND** micro-scale animation triggers (1.0 → 1.02)
- **AND** transitions use spring easing

### Requirement: Universal Hover Elevation Pattern
All interactive elements SHALL elevate on hover using consistent transform pattern.

#### Scenario: Standard hover elevation
- **WHEN** interactive element is hovered
- **THEN** transform applies: `scale(1.024) translateY(-4px) rotate(-0.5deg)`
- **AND** shadow transitions to raised elevation
- **AND** transition uses spring easing (cubic-bezier(0.34, 1.56, 0.64, 1))
- **AND** duration is 250ms

#### Scenario: Element-specific elevation values
- **WHEN** specific element type is hovered
- **THEN** translateY value matches element size
- **AND** large cards: -4px
- **AND** article cards: -3px
- **AND** icon tiles: -2px
- **AND** buttons/CTAs: -2px
- **AND** profile chips: -3px
- **AND** category badges: -1px

#### Scenario: Pressed/active state
- **WHEN** element is pressed or active
- **THEN** transform applies: `scale(0.98) translateY(1px)`
- **AND** shadow compresses to pressed variant
- **AND** transition is snappy (100ms ease-out)
- **AND** creates tactile compression feel

### Requirement: Spring Physics Animations
Animations SHALL use spring-based physics for natural, organic movement.

#### Scenario: Spring easing functions
- **WHEN** animation requires spring feel
- **THEN** `--motion-ease-spring` easing is used
- **AND** value is `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **AND** provides subtle overshoot and settle
- **AND** duration is 250-350ms for hover states

#### Scenario: Overshoot animations
- **WHEN** element transitions to hover state
- **THEN** scale overshoots target (1.0 → 1.06 → 1.024)
- **AND** animation uses spring keyframes
- **AND** settling is visible and natural
- **AND** no jarring instant stops

#### Scenario: Momentum-based settling
- **WHEN** hover state exits
- **THEN** element settles back with slight oscillation
- **AND** uses spring physics for return
- **AND** feels organic, not linear

### Requirement: Anticipatory Microinteractions
Interactive elements SHALL react to nearby cursor presence before direct interaction.

#### Scenario: Magnetic hover effect
- **WHEN** cursor enters 20px radius of element
- **THEN** element shifts subtly toward cursor (max 5px)
- **AND** uses smooth transform transition
- **AND** implemented via requestAnimationFrame
- **AND** desktop-only (no touch devices)
- **AND** applied to cards and large interactive elements

#### Scenario: Parallax icon movement
- **WHEN** card is hovered
- **THEN** icon tile shifts -2px translateY
- **AND** creates depth separation within card
- **AND** transitions smoothly (200ms)
- **AND** enhances 3D perception

#### Scenario: Peek animations in rails
- **WHEN** card in horizontal rail is hovered
- **THEN** next card peeks +12px to the left
- **AND** previous card dims to opacity 0.8
- **AND** draws attention to navigation opportunity
- **AND** only in desktop cardRail layouts

### Requirement: Gesture-Based Interactions
Touch and scroll interactions SHALL have iOS/macOS-style physics and feedback.

#### Scenario: Momentum scrolling in rails
- **WHEN** user swipes cardRail on touch device
- **THEN** scroll continues with momentum
- **AND** velocity calculation determines distance
- **AND** deceleration curve matches iOS feel
- **AND** implemented with smooth physics

#### Scenario: Rubber-band edges
- **WHEN** user scrolls past rail boundary
- **THEN** resistance increases (rubber-band effect)
- **AND** spring-back animation on release
- **AND** overscroll is visually bounded
- **AND** touch-only feature

#### Scenario: Pull-to-compress (optional)
- **WHEN** user pulls card downward
- **THEN** card compresses vertically (scale-y)
- **AND** spring-back on release
- **AND** mobile touch-only
- **AND** provides tactile feedback

### Requirement: Scroll-Based Microinteractions
Scroll position SHALL influence animations and visual effects.

#### Scenario: Scroll-linked parallax
- **WHEN** user scrolls page
- **THEN** hero elements move at 0.5x scroll speed
- **AND** creates depth-of-field effect
- **AND** uses transform for performance
- **AND** implemented with Intersection Observer

#### Scenario: Dynamic edge fade indicators
- **WHEN** cardRail scroll position changes
- **THEN** left fade visible when not at start
- **AND** right fade visible when not at end
- **AND** opacity transitions smoothly
- **AND** provides scroll affordance

#### Scenario: Sticky header blur enhancement
- **WHEN** user scrolls down page
- **THEN** topbar backdrop-filter blur increases
- **AND** starts at 8px, increases to 20px
- **AND** transitions smoothly with scroll
- **AND** creates spatial depth

### Requirement: Focus State Enhancements
Focus states SHALL have elevated visual treatment with depth perception.

#### Scenario: Z-depth focus ring illusion
- **WHEN** element receives keyboard focus
- **THEN** focus ring appears "above" element
- **AND** uses layered box-shadows for depth
- **AND** animates in with scale (covered in previous phase)
- **AND** maintains accessibility contrast

#### Scenario: Focus state elevation
- **WHEN** element is keyboard-focused
- **THEN** same elevation as hover state applies
- **AND** shadow matches raised elevation
- **AND** provides clear visual feedback
- **AND** works without hover (keyboard-only users)

### Requirement: Advanced Material Effects
Cards and surfaces SHALL support optional material-based visual effects for enhanced realism when enabled.

#### Scenario: Frosted glass shadows
- **WHEN** card has glass-like appearance
- **THEN** colored blur appears beneath card
- **AND** uses backdrop-filter for effect
- **AND** fallback is standard shadow
- **AND** performance is monitored

#### Scenario: Ambient occlusion
- **WHEN** card rests on surface
- **THEN** darker shadow appears at card edges
- **AND** simulates light blockage
- **AND** uses gradient or multi-layer shadow
- **AND** subtle effect (low opacity)

#### Scenario: Specular highlights
- **WHEN** icon tile or card edge has light reflection
- **THEN** bright highlight appears at top-left
- **AND** uses ::after pseudo-element
- **AND** positioned precisely for realism
- **AND** subtle, not distracting

#### Scenario: Surface texture
- **WHEN** card or panel is displayed
- **THEN** micro-noise overlay applies (1-2% opacity)
- **AND** adds organic quality
- **AND** avoids flat digital appearance
- **AND** texture is subtle

## MODIFIED Requirements

### Requirement: CSS Shadow System (Enhanced)
The shadow system SHALL use elevation-based tokens with multiple layers and contact shadows.

#### Scenario: Card shadow composition (updated)
- **WHEN** card shadow is applied
- **THEN** minimum 6 layers are used (up from 4)
- **AND** layers include: fill shadow, ambient, contact, lift shadows
- **AND** each layer has distinct blur, spread, and offset
- **AND** contact shadow is tightest, darkest layer

#### Scenario: Shadow transitions (updated)
- **WHEN** shadow changes between states
- **THEN** transition uses spring easing (not linear)
- **AND** duration is 250ms (up from 200ms)
- **AND** includes transform transition
- **AND** all properties transition together

### Requirement: Interactive Transform System (Enhanced)
Interactive elements SHALL use compound transforms including translation, scale, and rotation.

#### Scenario: Hover transform (updated)
- **WHEN** element is hovered
- **THEN** transform includes: scale, translateY, rotate
- **AND** all three transform functions combine
- **AND** rotate adds organic feel (-0.5deg)
- **AND** translateY provides elevation (-2px to -4px)

#### Scenario: Transform origin (new)
- **WHEN** element transforms
- **THEN** transform-origin is set appropriately
- **AND** cards use center origin
- **AND** icons use center origin
- **AND** rotation appears natural

### Requirement: Reduced Motion Support (Enhanced)
Animations SHALL fully respect prefers-reduced-motion while maintaining functionality.

#### Scenario: Spring animations with reduced motion
- **WHEN** user prefers reduced motion
- **THEN** spring physics are disabled
- **AND** transitions become instant or very short (<100ms)
- **AND** no overshoot or settling animations
- **AND** elevations still apply (no animation, instant)

#### Scenario: Microinteractions with reduced motion
- **WHEN** user prefers reduced motion
- **THEN** magnetic hover is disabled
- **AND** parallax effects are disabled
- **AND** momentum scrolling simplified
- **AND** core functionality remains accessible

## RENAMED Requirements
None

## REMOVED Requirements
None
