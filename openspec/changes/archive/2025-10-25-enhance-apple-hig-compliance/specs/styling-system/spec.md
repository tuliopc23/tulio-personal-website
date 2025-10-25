# styling-system Specification Deltas

## MODIFIED Requirements

### Requirement: CSS Token System
The styling system SHALL use CSS custom properties for all repeated color, shadow, typography, and motion values, organized into semantic hierarchies following Apple Human Interface Guidelines.

#### Scenario: Consistent color usage
- **WHEN** a color value is used multiple times
- **THEN** it is defined as a CSS variable (e.g., `--color-dark-bg`)
- **AND** the exact rgba() value is preserved
- **AND** all usages reference the variable

#### Scenario: Shadow system preservation
- **WHEN** 4-layer elevation shadows are defined
- **THEN** exact shadow values are preserved in CSS variables
- **AND** symbol tiles maintain 3D elevated appearance
- **AND** all components maintain current shadow effects

#### Scenario: Granular color hierarchy
- **WHEN** developer needs surface colors for cards
- **THEN** granular tokens are available: `--surface-card`, `--surface-card-hover`, `--surface-card-active`
- **AND** text hierarchy provides 4 levels: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-quaternary`
- **AND** accent system includes tint and glow variants

#### Scenario: Enhanced shadow tokens
- **WHEN** developer needs icon tile shadows
- **THEN** dedicated tokens with inset highlights are available: `--shadow-symbol-dark`, `--shadow-symbol-light`
- **AND** colored shadow variants exist for interactive elements
- **AND** all shadows include 4-layer composition (contact, ambient, key light, highlight)

#### Scenario: Glass material fidelity
- **WHEN** developer applies glass effects
- **THEN** 6-level blur system is available: ultra-thin (18px) through ultra-thick (80px)
- **AND** saturation levels range from subtle (140%) to vibrant (220%)
- **AND** noise texture overlay tokens are available

## ADDED Requirements

### Requirement: Apple HIG Design Compliance
The styling system SHALL implement design tokens and patterns that follow Apple Human Interface Guidelines for native macOS/iOS quality.

#### Scenario: Vibrant icon colors
- **WHEN** icon tiles are rendered in dark mode
- **THEN** colors use 95% opacity for maximum vibrancy (e.g., `rgba(10, 132, 255, 0.95)`)
- **AND** inset highlights create dimensional depth
- **AND** inner border rings add polish via `::after` pseudo-element

#### Scenario: Atmospheric depth
- **WHEN** pages render background gradients
- **THEN** 3 radial gradients layer for dark mode depth
- **AND** positioning follows HIG standards: 28% 4%, 74% 12%, 50% 118%
- **AND** light mode uses single radial gradient

#### Scenario: Glass noise texture
- **WHEN** glass surfaces are rendered
- **THEN** subtle noise texture overlay is applied via SVG filter
- **AND** opacity adjusts on hover: base 0.03, active 0.042
- **AND** texture enhances organic material feel

#### Scenario: Enhanced interactive states
- **WHEN** cards receive hover interaction
- **THEN** radial gradient overlay intensifies via `::before` pseudo-element
- **AND** elevation lifts with customizable `--hover-elevate-translate`
- **AND** scale adjusts via `--hover-elevate-scale`
- **AND** focus ring appears via `::after` for keyboard navigation

#### Scenario: Refined typography scale
- **WHEN** profile components render text
- **THEN** component-specific line-heights apply: profile name (1.16), tight (1.24), snug (1.34)
- **AND** letter-spacing follows HIG precision: profile name (-0.028em), title (-0.018em)
- **AND** fluid sizing uses clamp() for responsive scaling

### Requirement: Accessibility Compliance
All enhanced design tokens and patterns SHALL maintain WCAG AA accessibility standards and Apple HIG touch target requirements.

#### Scenario: Focus state contrast
- **WHEN** interactive elements receive keyboard focus
- **THEN** focus ring meets 3:1 contrast ratio minimum
- **AND** multi-layer shadow provides visibility in all contexts
- **AND** reduced motion users see simplified focus indicator

#### Scenario: Touch target sizing
- **WHEN** interactive elements render on mobile
- **THEN** minimum touch target is 44x44px (Apple HIG)
- **AND** contact chips maintain this minimum even at small breakpoints
- **AND** navigation links preserve adequate spacing

#### Scenario: Color contrast preservation
- **WHEN** new text tokens are applied
- **THEN** primary text maintains 14.2:1 contrast ratio
- **AND** secondary text maintains 10.8:1 ratio
- **AND** tertiary text maintains minimum 6.1:1 ratio
- **AND** all ratios meet WCAG AA for respective text sizes

### Requirement: Progressive Enhancement
Enhanced design tokens SHALL degrade gracefully in browsers without modern CSS support.

#### Scenario: Backdrop filter fallback
- **WHEN** glass materials render in unsupported browsers
- **THEN** solid background colors provide fallback
- **AND** `-webkit-` prefixes support Safari
- **AND** visual hierarchy remains clear without blur

#### Scenario: Color-mix() fallback
- **WHEN** accent tinting uses color-mix() in unsupported browsers
- **THEN** pre-computed rgba() values provide fallback
- **AND** visual appearance remains acceptable
- **AND** no content becomes inaccessible

#### Scenario: Reduced motion compliance
- **WHEN** user prefers reduced motion
- **THEN** all transitions reduce to 0.01ms duration
- **AND** transform animations are disabled
- **AND** scroll behavior becomes instant
- **AND** content remains fully accessible

## RENAMED Requirements
None

## REMOVED Requirements
None
