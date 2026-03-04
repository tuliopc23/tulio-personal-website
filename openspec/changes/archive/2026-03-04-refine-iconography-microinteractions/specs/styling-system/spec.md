# styling-system Specification Deltas

## ADDED Requirements

### Requirement: Icon System Consistency
The icon system SHALL use a consistent outline style throughout UI elements to match Apple SF Symbols aesthetic.

#### Scenario: Sidebar navigation icons
- **WHEN** sidebar navigation is rendered
- **THEN** all icons use outline style at consistent stroke width
- **AND** GitHub icon uses outline variant instead of filled logo
- **AND** icons are 20px at 1.4 stroke weight

#### Scenario: Icon library selection
- **WHEN** UI element needs an icon
- **THEN** system checks for asset first (custom SVG)
- **AND** falls back to brand icons (Iconify logos)
- **AND** falls back to Phosphor icons (UI elements)
- **AND** falls back to SF icons (custom icons)
- **AND** uses sparkle as final fallback

#### Scenario: Phosphor icon integration
- **WHEN** PhosphorIcon component is used
- **THEN** supports name, size, weight, and color props
- **AND** weight options include: thin, light, regular, bold, fill
- **AND** default weight is "regular" matching SF Symbols default

### Requirement: Strategic Icon Additions
The system SHALL add subtle, semantic icons to enhance visual hierarchy without overwhelming content.

#### Scenario: Article metadata icons
- **WHEN** article card displays metadata
- **THEN** reading time shows Clock icon at 12-14px
- **AND** publish date shows Calendar icon at 12-14px
- **AND** icons align with text baseline
- **AND** icons have 4-6px spacing from text

#### Scenario: External link indicators
- **WHEN** link targets external domain
- **THEN** ArrowUpRight icon displays inline at 14-16px
- **AND** icon has 0.6-0.7 opacity at rest
- **AND** icon animates to opacity 1.0 and translates 1px -1px on hover
- **AND** icon has aria-hidden="true"

#### Scenario: Call-to-action icons
- **WHEN** card displays CTA text
- **THEN** "Read more" shows ArrowRight icon
- **AND** project links show ArrowSquareOut icon
- **AND** icon slides right 2-4px on hover
- **AND** transition uses ease-out curve

#### Scenario: Category badge icons
- **WHEN** category badge is rendered
- **THEN** appropriate icon prefix displays at 12px
- **AND** icon maps to category semantics (code → Code, design → PaintBrush)
- **AND** icon has 2px spacing from text
- **AND** responsive layout is maintained

### Requirement: Enhanced Shadow System
Card and tile shadows SHALL include micro-glow effects and refined layering for dimensional depth.

#### Scenario: Card hover micro-glow
- **WHEN** card is hovered
- **THEN** 0-2px colored glow matching tint is added
- **AND** glow opacity is 0.1-0.15 for subtlety
- **AND** glow transitions smoothly over 200ms
- **AND** shadow spread values create noticeable lift

#### Scenario: Card pressed state
- **WHEN** card is pressed (:active)
- **THEN** shadow reduces to pressed state variant
- **AND** transition is snappy (50-100ms)
- **AND** visual feedback is immediate

#### Scenario: Tint-specific glows
- **WHEN** card has data-tint attribute
- **THEN** hover glow uses corresponding color
- **AND** blue tint shows blue glow
- **AND** green tint shows green glow
- **AND** all system colors supported

### Requirement: Icon Tile Dimensional Refinement
Icon tiles SHALL have enhanced depth perception through layered effects in both dark and light modes.

#### Scenario: Dark mode icon tile depth
- **WHEN** icon tile renders in dark mode
- **THEN** micro-gradient overlay (0-5% opacity) creates subtle dimensionality
- **AND** inset highlight is positioned at 48% 15% for optimal lighting
- **AND** subtle texture overlay (1-2% opacity) adds organic quality
- **AND** border ring uses split-tone (lighter top, darker bottom)

#### Scenario: Light mode icon tile depth
- **WHEN** icon tile renders in light mode
- **THEN** inset highlight has 0.5 opacity for increased contrast
- **AND** 2px white outer glow at 10% opacity creates lift
- **AND** shadow color has warm brown tint
- **AND** micro-border gradient on top edge adds detail

#### Scenario: Icon tile hover enhancement
- **WHEN** icon tile is hovered
- **THEN** glow intensity increases
- **AND** scale animation includes micro-bounce (1.0 → 1.05 → 1.03 → 1.05)
- **AND** subtle rotation (-1deg → 0deg) adds organic feel
- **AND** total animation duration is 200-300ms

### Requirement: Refined Microinteractions
Animations and interactions SHALL have refined timing, easing, and choreography for polished feel.

#### Scenario: Card grid stagger reveal
- **WHEN** card grid loads
- **THEN** cards reveal with 50ms stagger increment
- **AND** stagger is based on grid position
- **AND** animation uses ease-out curve
- **AND** stagger delay max is 500-800ms

#### Scenario: Focus ring animation
- **WHEN** element receives keyboard focus
- **THEN** focus ring scales in from 0.95 to 1.0
- **AND** opacity animates from 0 to 1
- **AND** duration is 200ms with ease-out
- **AND** animation respects reduced-motion preference

#### Scenario: Icon hover micro-animation
- **WHEN** interactive icon is hovered
- **THEN** icon scales with micro-bounce effect
- **AND** animation uses spring curve
- **AND** total duration is 200-300ms
- **AND** no layout shift occurs

#### Scenario: Reduced motion compliance
- **WHEN** user has reduced-motion preference
- **THEN** all animations disable or reduce to instant transitions
- **AND** stagger delays are removed
- **AND** micro-bounces become simple scale
- **AND** core functionality remains accessible

### Requirement: Optional Touch Interactions
Advanced touch interactions SHALL be opt-in via data attributes with proper performance optimization.

#### Scenario: Touch ripple effect (OPTIONAL)
- **WHEN** element has data-ripple attribute
- **THEN** touch/click spawns ripple animation
- **AND** ripple uses radial gradient animation
- **AND** ripple color matches element tint or accent
- **AND** multiple rapid touches are handled gracefully
- **AND** respects reduced-motion preference

#### Scenario: Magnetic hover effect (OPTIONAL)
- **WHEN** element has data-magnetic attribute
- **THEN** cursor within 20px radius attracts element
- **AND** transform is subtle (max 5px translate)
- **AND** uses requestAnimationFrame for performance
- **AND** returns to center smoothly on mouse leave
- **AND** effect is desktop-only (no touch devices)

#### Scenario: Loading skeleton shimmer (OPTIONAL)
- **WHEN** async content is loading
- **THEN** skeleton component shows shimmer animation
- **AND** shimmer uses gradient animation across element
- **AND** skeleton matches card aesthetic
- **AND** transitions smoothly to real content

## MODIFIED Requirements

### Requirement: CSS Token System
The styling system SHALL use CSS custom properties for all repeated color, shadow, typography, motion values, and now includes icon sizing and shadow glow variants.

#### Scenario: Icon sizing tokens
- **WHEN** icon needs consistent sizing
- **THEN** icon-xs: 12px, icon-sm: 14px, icon-md: 16px, icon-lg: 20px, icon-xl: 24px tokens are available
- **AND** tokens are used consistently throughout components

#### Scenario: Shadow glow tokens
- **WHEN** card needs colored glow effect
- **THEN** `--shadow-card-glow-[color]` tokens are available
- **AND** colors include: blue, green, indigo, teal, orange, pink
- **AND** glow opacity is calibrated per color

## RENAMED Requirements
None

## REMOVED Requirements
None
