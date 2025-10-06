# Visual Design Specification

## ADDED Requirements

### Requirement: Liquid Glass Material System

The visual design system SHALL implement authentic Liquid Glass materials matching macOS Tahoe 26 specifications with multi-layer translucency, saturation, and blur effects.

#### Scenario: Glass surface on scrolled topbar

- **WHEN** the user scrolls past 60px
- **THEN** the topbar SHALL apply `backdrop-filter: saturate(2.4) blur(42px)` with `opacity: 88%`
- **AND** a 3px noise texture overlay at 2% opacity SHALL be applied
- **AND** the transition SHALL complete in 160ms with ease-out timing

#### Scenario: Glass variants for different contexts

- **WHEN** rendering a modal overlay
- **THEN** `glass-thick` variant SHALL be used (blur: 42px, saturation: 2.4, opacity: 88%)
- **WHEN** rendering a tooltip
- **THEN** `glass-thin` variant SHALL be used (blur: 18px, saturation: 1.8, opacity: 78%)
- **WHEN** rendering a sidebar panel
- **THEN** `glass-regular` variant SHALL be used (blur: 28px, saturation: 2.1, opacity: 82%)

### Requirement: Rounded Corner System

All interactive and container elements SHALL use continuous rounded corners following macOS Tahoe 26 specifications with responsive scaling.

#### Scenario: Card border radius at desktop viewport

- **WHEN** viewport width is ≥1280px
- **THEN** cards SHALL use `border-radius: 32px`
- **AND** buttons SHALL use `border-radius: 20px`
- **AND** chips SHALL use `border-radius: 12px`

#### Scenario: Card border radius at mobile viewport

- **WHEN** viewport width is ≤768px
- **THEN** cards SHALL use `border-radius: clamp(20px, 4vw, 32px)`
- **AND** the radius SHALL scale proportionally with viewport

#### Scenario: Continuous corner on hover

- **WHEN** user hovers over an interactive card
- **THEN** the border-radius SHALL be preserved during scale transform
- **AND** the corners SHALL maintain optical correctness via `transform-origin: center`

### Requirement: Typography Refinement

Typography SHALL match Apple system font rendering with precise letter-spacing, line-heights, and optical sizing.

#### Scenario: Hero title rendering

- **WHEN** rendering h1 hero title
- **THEN** `font-size` SHALL be `clamp(2.4rem, 4.2vw + 1.3rem, 4.25rem)`
- **AND** `letter-spacing` SHALL be `-0.032em`
- **AND** `line-height` SHALL be `1.02`
- **AND** `font-weight` SHALL be `700`
- **AND** optical sizing SHALL be enabled via `font-feature-settings: "ss01" 1`

#### Scenario: Body text rendering

- **WHEN** rendering paragraph text
- **THEN** `font-size` SHALL be `clamp(1rem, 1vw + 0.95rem, 1.2rem)`
- **AND** `letter-spacing` SHALL be `-0.008em`
- **AND** `line-height` SHALL be `1.65`
- **AND** `max-width` SHALL be `58ch` for optimal readability

#### Scenario: SF Pro contextual alternates

- **WHEN** rendering headings with system font stack
- **THEN** contextual alternates SHALL be enabled via `font-variant-ligatures: common-ligatures contextual`
- **AND** kerning SHALL be enabled via `font-kerning: normal`

### Requirement: Spring Physics Animations

All interactive animations SHALL use spring physics with bounce, overshoot, and natural motion curves.

#### Scenario: Card hover animation

- **WHEN** user hovers over a card
- **THEN** card SHALL scale from `1.0` to `1.024` in 180ms
- **AND** timing function SHALL be `cubic-bezier(0.16, 0.94, 0.28, 1.32)` (spring-out)
- **AND** shadow SHALL transition from `--shadow-card` to `--shadow-card-hover`
- **AND** border color SHALL lighten by 12% via `color-mix()`

#### Scenario: Button press feedback

- **WHEN** user clicks a button
- **THEN** button SHALL scale to `0.984` (press down)
- **AND** after 80ms SHALL bounce to `1.01` (overshoot)
- **AND** after 120ms SHALL settle to `1.0` (rest)
- **AND** the entire sequence SHALL complete in 200ms

#### Scenario: Sequential reveal on page load

- **WHEN** page loads with `data-reveal` elements
- **THEN** elements SHALL fade in sequentially with 50ms stagger delay
- **AND** each element SHALL use `opacity: 0 → 1` and `transform: translateY(8px) → translateY(0)`
- **AND** timing SHALL be 240ms with `cubic-bezier(0.2, 0.68, 0.32, 1.0)`

### Requirement: Color Mixing & Semantic Scales

All color values SHALL use `color-mix()` in `oklch` color space with semantic 9-step scales for precise blending.

#### Scenario: Muted text color mixing

- **WHEN** rendering muted text
- **THEN** color SHALL be `color-mix(in oklch, var(--text) 68%, transparent)`
- **AND** this SHALL replace legacy `rgba(235, 235, 245, 0.65)` values

#### Scenario: Interactive hover state

- **WHEN** user hovers over an interactive element
- **THEN** background SHALL lighten via `color-mix(in oklch, var(--surface) 96%, white 4%)`
- **AND** border SHALL strengthen via `color-mix(in oklch, var(--panel-border-strong) 92%, transparent)`

#### Scenario: Semantic blue scale

- **WHEN** using blue accent color
- **THEN** scale SHALL provide `--blue-50` through `--blue-950` (9 steps)
- **AND** `--blue-500` SHALL match Apple system blue `#007AFF`
- **AND** each step SHALL maintain perceptual uniformity in oklch space

#### Scenario: Dark mode vibrancy boost

- **WHEN** theme is dark mode
- **THEN** accent colors SHALL increase saturation by 10%
- **WHEN** theme is light mode
- **THEN** accent colors SHALL decrease saturation by 5%

### Requirement: Multi-Layer Shadow System

All elevated surfaces SHALL use 4-layer shadow composition for authentic depth perception.

#### Scenario: Card shadow layers

- **WHEN** rendering a card in rest state
- **THEN** shadow SHALL composite 4 layers:
  1. Ambient: `0 20px 48px rgba(0, 0, 0, 0.12)` (large, soft)
  2. Direct: `0 8px 16px rgba(0, 0, 0, 0.24)` (focused, medium)
  3. Inset highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.12)` (top gloss)
  4. Border: `0 0 0 1px rgba(255, 255, 255, 0.05)` (edge definition)

#### Scenario: Card shadow on hover

- **WHEN** user hovers over a card
- **THEN** ambient shadow SHALL expand to `0 28px 56px rgba(0, 0, 0, 0.16)`
- **AND** direct shadow SHALL expand to `0 12px 24px rgba(0, 0, 0, 0.32)`
- **AND** inset highlight SHALL strengthen to `rgba(255, 255, 255, 0.16)`
- **AND** transition SHALL occur over 200ms with ease-out

#### Scenario: Interactive button with colored glow

- **WHEN** rendering a primary action button
- **THEN** shadow SHALL include blue glow: `0 12px 28px rgba(0, 122, 255, 0.24)`
- **AND** on hover SHALL intensify to: `0 16px 36px rgba(0, 122, 255, 0.36)`

### Requirement: Enhanced Interactive States

All interactive elements SHALL provide rich, multi-dimensional feedback via transform, opacity, and color changes.

#### Scenario: Focus ring composition

- **WHEN** user focuses on an interactive element via keyboard
- **THEN** focus ring SHALL apply 2-layer composition:
  1. Outer glow: `0 0 0 4px rgba(0, 122, 255, 0.24)`
  2. Inner border: `0 0 0 2px rgba(255, 255, 255, 0.9)`
- **AND** ring SHALL appear instantly (0ms transition)
- **AND** element content SHALL remain visually unchanged

#### Scenario: Loading skeleton pulse

- **WHEN** rendering a loading skeleton
- **THEN** opacity SHALL pulse from `1.0` to `0.6` to `1.0`
- **AND** cycle duration SHALL be `1200ms`
- **AND** timing function SHALL be `ease-in-out`
- **AND** background SHALL use `color-mix(in oklch, var(--surface-elevated) 85%, transparent)`

#### Scenario: Button ripple effect on click

- **WHEN** user clicks a button
- **THEN** a radial gradient SHALL expand from tap coordinates
- **AND** gradient SHALL animate from `circle at center 0%` to `circle at center 200%`
- **AND** opacity SHALL fade from `0.24` to `0.0` over 480ms
- **AND** color SHALL match button accent with `color-mix()`

### Requirement: Icon Dimensional Effects

Icon symbols SHALL render with 3-layer depth using gradients, shadows, and gloss effects.

#### Scenario: Icon tile at rest

- **WHEN** rendering an icon tile
- **THEN** 3 layers SHALL composite:
  1. Background: `linear-gradient(135deg, base-color-85%, base-color-92%)`
  2. Symbol: solid color at 90% opacity with 1px offset shadow
  3. Gloss: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 48%)`
- **AND** border SHALL be `1px solid` with `color-mix(in oklch, accent 60%, border 40%)`

### Requirement: Dark Mode Color Treatment

All interactive elements SHALL have theme-specific color treatments to maintain visual hierarchy and contrast in both light and dark modes.

#### Scenario: Blog title gradient in dark mode

- **WHEN** user is viewing the blog page in dark mode
- **THEN** the blog hero title SHALL use gradient: `linear-gradient(130deg, color-mix(in oklch, var(--text) 98%, transparent), color-mix(in oklch, var(--text) 88%, var(--indigo) 12%))`
- **AND** text SHALL remain clearly visible with high contrast
- **WHEN** user is viewing in light mode
- **THEN** the gradient SHALL be: `linear-gradient(130deg, color-mix(in oklch, var(--text) 100%, transparent), color-mix(in oklch, var(--text) 75%, var(--indigo) 25%))`

#### Scenario: Article card CTA hover in dark mode

- **WHEN** user hovers over an article card in dark mode
- **THEN** the "Read article" link SHALL change from `color-mix(in oklch, var(--blue) 85%, transparent)` to `color-mix(in oklch, var(--blue) 98%, transparent)`
- **AND** the blue accent SHALL be significantly brighter to indicate interactivity
- **WHEN** in light mode
- **THEN** hover SHALL change from `color-mix(in oklch, var(--blue) 90%, transparent)` to `color-mix(in oklch, var(--blue) 100%, transparent)`

#### Scenario: Project card CTA hover in dark mode

- **WHEN** user hovers over a project card CTA in dark mode
- **THEN** color SHALL transition from `color-mix(in oklch, var(--blue) 84%, transparent)` to `color-mix(in oklch, var(--blue) 98%, transparent)`
- **AND** transition SHALL complete in 180ms with ease-out timing

#### Scenario: Generic card CTA hover in dark mode

- **WHEN** user hovers over any card with CTA in dark mode
- **THEN** CTA link color SHALL brighten from 82% to 96% opacity
- **AND** visual feedback SHALL be immediately perceivable

### Requirement: Blog Featured Card Proportions

The featured article card SHALL maintain harmonious aspect ratio and spacing that matches the carousel article cards.

#### Scenario: Featured card sizing at desktop

- **WHEN** viewport width is ≥1024px
- **THEN** featured card container SHALL have `max-width: clamp(380px, 38vw, 480px)`
- **AND** featured card SHALL have `min-height: 460px`
- **AND** padding SHALL be `clamp(var(--space-md), 3vw, var(--space-lg))` to match carousel cards

#### Scenario: Featured card content distribution

- **WHEN** rendering featured article card
- **THEN** card SHALL use flexbox layout with `flex-direction: column`
- **AND** inner link SHALL have `flex: 1` to distribute space evenly
- **AND** gap between elements SHALL be `var(--space-sm)` (consistent with carousel)
- **AND** card SHALL NOT appear cylindrical or overly rounded

#### Scenario: Featured card aspect ratio at mobile

- **WHEN** viewport width is ≤768px
- **THEN** featured card SHALL have `min-height: 420px`
- **AND** card SHALL maintain readable proportions without excessive vertical stretching
- **AND** padding SHALL scale responsively with viewport

#### Scenario: Icon tile on hover

- **WHEN** user hovers over an icon tile
- **THEN** scale SHALL increase to `1.06` with spring curve
- **AND** shadow SHALL deepen from `0 6px 14px` to `0 12px 26px`
- **AND** gloss opacity SHALL strengthen from `0.2` to `0.32`
- **AND** transition SHALL occur over 180ms

### Requirement: Responsive Spacing System

Spacing SHALL follow 8px baseline grid with golden ratio multipliers and safe-area-inset support.

#### Scenario: Container padding at desktop

- **WHEN** viewport width is ≥1280px
- **THEN** container padding SHALL be `clamp(40px, 6vw, 160px)`
- **AND** vertical section gaps SHALL be `var(--space-xl)` = `48px`

#### Scenario: Container padding on mobile with notch

- **WHEN** viewport width is ≤768px
- **AND** device has notch/Dynamic Island
- **THEN** padding SHALL include `max(var(--space-sm), env(safe-area-inset-left))`
- **AND** top padding SHALL include `env(safe-area-inset-top)`

#### Scenario: Vertical rhythm preservation

- **WHEN** stacking multiple text elements
- **THEN** margin-bottom SHALL be multiples of `8px`
- **AND** headings SHALL use `--space-sm` (16px) bottom margin
- **AND** paragraphs SHALL use `--space-xs` (12px) bottom margin

### Requirement: Accessibility Enhancements

Visual design SHALL adapt to user preferences for motion, contrast, and transparency.

#### Scenario: Reduced motion preference

- **WHEN** user enables `prefers-reduced-motion`
- **THEN** all transform-based animations SHALL be disabled
- **AND** opacity transitions SHALL be limited to 50ms
- **AND** scroll-behavior SHALL change from `smooth` to `auto`

#### Scenario: Increased contrast preference

- **WHEN** user enables `prefers-contrast: more`
- **THEN** border opacity SHALL increase from 12% to 90%
- **AND** background gradients SHALL be replaced with solid colors
- **AND** text contrast SHALL meet WCAG AAA standards (7:1 minimum)

#### Scenario: Reduced transparency preference

- **WHEN** user enables `prefers-reduced-transparency`
- **THEN** backdrop-filter SHALL be removed
- **AND** glass materials SHALL use solid `var(--surface)` at 96% opacity
- **AND** blur effects SHALL be disabled

#### Scenario: Keyboard focus navigation

- **WHEN** user navigates via keyboard
- **THEN** focus indicator SHALL be clearly visible on all interactive elements
- **AND** focus ring SHALL have 4px offset from element edge
- **AND** focus order SHALL follow logical reading order (top-to-bottom, left-to-right)
