# styling-system Specification Deltas

## NEW Requirements

### Requirement: Unified Spacing System
All spacing SHALL use design tokens from a centralized spacing system.

#### Scenario: No hardcoded spacing values
- **GIVEN** a component needs spacing
- **WHEN** developer adds padding, margin, or gap
- **THEN** spacing token MUST be used (e.g., `var(--space-sm)`)
- **AND** hardcoded values (e.g., `8px`, `12px`) SHALL NOT be used
- **EXCEPT** for intentional pixel-perfect needs (document in comments)

#### Scenario: Component-specific spacing tokens
- **GIVEN** a component needs consistent internal spacing
- **WHEN** spacing is used multiple times within that component
- **THEN** component-specific token SHALL be created (e.g., `--card-padding-sm`)
- **AND** token SHALL reference base spacing tokens
- **EXAMPLE** `--card-padding-sm: clamp(var(--space-sm), 2.5vw, var(--space-md))`

#### Scenario: Mobile spacing reduction
- **GIVEN** viewport width is below 768px
- **WHEN** layout needs mobile optimization
- **THEN** container padding SHALL reduce to `clamp(20px, 5vw, 40px)`
- **AND** card padding SHALL scale down appropriately
- **AND** section gaps SHALL reduce for tighter rhythm

### Requirement: Standardized Breakpoints
All responsive design SHALL use 5 standard breakpoint tokens.

#### Scenario: Standard breakpoint usage
- **GIVEN** component needs responsive behavior
- **WHEN** media query is written
- **THEN** standard breakpoint token MUST be used
- **AND** breakpoint values are:
  - xs: 480px (tiny phones)
  - sm: 600px (small phones)
  - md: 768px (tablets portrait)
  - lg: 1024px (tablets landscape, small laptops)
  - xl: 1280px (desktops)

#### Scenario: No custom breakpoints
- **GIVEN** existing component uses non-standard breakpoint
- **WHEN** migrating to new system
- **THEN** breakpoint SHALL be mapped to nearest standard
- **EXAMPLE** 720px → 768px, 820px → 768px or 1024px, 1100px → 1024px
- **AND** visual behavior SHALL be preserved

### Requirement: Typography Token Consistency
All typography SHALL use centralized typography tokens.

#### Scenario: Font size tokens
- **GIVEN** component needs text sizing
- **WHEN** font-size is applied
- **THEN** typography token MUST be used
- **AND** inline values (e.g., `16px`, `17px`) SHALL NOT be used
- **EXCEPT** for one-off display text (document why)

#### Scenario: Available typography tokens
- **GIVEN** design needs text sizing
- **WHEN** choosing token
- **THEN** tokens available are:
  - --fs-hero (large display)
  - --fs-h2, --fs-h3 (headings)
  - --fs-body: 17px (iOS baseline)
  - --fs-body-sm: 16px (secondary text)
  - --fs-caption: 14px (metadata)
  - --fs-small: 13px (micro text)
  - --fs-0, --fs--1, --fs--2 (utility scale)

#### Scenario: Line-height consistency
- **GIVEN** component renders text
- **WHEN** line-height is needed
- **THEN** token SHALL be used (not hardcoded 1.5, 1.3, etc)
- **AND** tokens available:
  - --lh-hero: 1.08 (display text)
  - --lh-heading: 1.2 (headings)
  - --lh-card-title: 1.25 (card headings)
  - --lh-ui: 1.4 (buttons, labels)
  - --lh-card-body: 1.5 (card descriptions)
  - --lh-base: 1.65 (body text)

### Requirement: Unified Card System
All card components SHALL use unified padding and spacing tokens.

#### Scenario: Card padding tiers
- **GIVEN** card component is created
- **WHEN** padding is applied
- **THEN** appropriate tier token SHALL be used:
  - --card-padding-sm: Compact cards (tech stack, tools)
  - --card-padding-md: Standard cards (profile, generic)
  - --card-padding-lg: Feature cards (articles, projects)
- **AND** custom padding SHALL NOT be used without justification

#### Scenario: Card internal spacing
- **GIVEN** card has multiple child elements
- **WHEN** gap between elements is needed
- **THEN** card gap token SHALL be used:
  - --card-gap-compact: Tight internal spacing
  - --card-gap-relaxed: Comfortable spacing
  - --card-gap-spacious: Generous spacing
- **AND** visual hierarchy SHALL be maintained

### Requirement: Touch Target Accessibility
All interactive elements SHALL meet minimum touch target sizes.

#### Scenario: Minimum touch target size
- **GIVEN** element is interactive (button, link, card)
- **WHEN** rendered on mobile
- **THEN** touch target SHALL be minimum 44x44px
- **AND** visual size MAY be smaller but hit area MUST be 44x44px
- **REFERENCE** Apple HIG, WCAG 2.5.5

#### Scenario: Page indicator dots
- **GIVEN** page indicators on mobile
- **WHEN** user attempts to tap
- **THEN** dot hit area SHALL be minimum 44x44px
- **AND** visual dot MAY be 8-12px but padding SHALL increase hit area
- **AND** dots SHALL have adequate spacing (minimum 8px gap)

### Requirement: Consistent Animation Timing
All animations SHALL use standardized duration tokens.

#### Scenario: Standard animation durations
- **GIVEN** animation or transition is needed
- **WHEN** duration is set
- **THEN** standard token SHALL be used:
  - --motion-duration-ui: 180ms (fast UI interactions)
  - --motion-duration-sm: 250ms (standard transitions)
  - --motion-duration-md: 350ms (moderate animations)
  - --motion-duration-lg: 500ms (elaborate animations)
- **AND** hardcoded millisecond values SHALL NOT be used

#### Scenario: Easing curve consistency
- **GIVEN** transition needs easing
- **WHEN** easing is applied
- **THEN** standard curve SHALL be used:
  - --motion-ease-out (ease-out, most common)
  - --motion-ease-spring (spring physics)
  - --motion-spring-out (spring with overshoot)
- **AND** custom cubic-bezier SHALL be documented if needed

### Requirement: Mobile-First Responsive Design
Layouts SHALL be designed mobile-first with progressive enhancement.

#### Scenario: Mobile padding optimization
- **GIVEN** viewport is mobile size (< 768px)
- **WHEN** content is rendered
- **THEN** padding SHALL be tighter for better space utilization
- **AND** container padding: `clamp(20px, 5vw, 40px)`
- **AND** very small screens (< 480px): `clamp(16px, 4vw, 24px)`

#### Scenario: Card rail behavior
- **GIVEN** horizontal card rail on mobile
- **WHEN** user scrolls
- **THEN** scroll-snap SHALL be enabled
- **AND** snap points SHALL align cards naturally
- **AND** scroll indicators SHALL be visible
- **AND** touch scrolling SHALL feel smooth (-webkit-overflow-scrolling)

### Requirement: Glass Material Consistency
Glass effects SHALL use standardized blur and saturation values.

#### Scenario: Standard glass blur levels
- **GIVEN** component needs glass material
- **WHEN** backdrop-filter is applied
- **THEN** standard blur token SHALL be used:
  - --glass-blur-light: 12px (subtle)
  - --glass-blur-base: 20px (standard)
  - --glass-blur-heavy: 32px (prominent)
  - --glass-blur-extreme: 48px (hero sections)
- **AND** saturation SHALL be 180% for richness

#### Scenario: Card background unification
- **GIVEN** any card-type component
- **WHEN** background is applied
- **THEN** standard card background SHALL be used
- **AND** dark mode: `rgba(29, 29, 32, 0.95)` with blur
- **AND** light mode: `rgba(248, 248, 251, 0.95)` with blur
- **AND** ALL card types SHALL use same base (consistency)

### Requirement: Typography Vertical Rhythm
Typography SHALL maintain consistent vertical spacing for readability.

#### Scenario: Heading spacing
- **GIVEN** article with headings
- **WHEN** headings are rendered
- **THEN** spacing SHALL be:
  - h2: margin-top xl (48px), margin-bottom md (24px)
  - h3: margin-top lg (32px), margin-bottom sm (16px)
  - h4: margin-top md (24px), margin-bottom xs (12px)
- **AND** breathing room SHALL be generous above, tight below

#### Scenario: Paragraph flow
- **GIVEN** multiple paragraphs
- **WHEN** rendered in sequence
- **THEN** p + p SHALL have margin-top: md (24px)
- **AND** paragraph line-height SHALL be --lh-base (1.65)
- **AND** comfortable reading rhythm SHALL be maintained

#### Scenario: List spacing
- **GIVEN** lists in content
- **WHEN** rendered adjacent to text
- **THEN** margin-top SHALL be sm (16px)
- **AND** margin-bottom SHALL be md (24px)
- **AND** consistent rhythm with surrounding text SHALL be maintained

## MODIFIED Requirements

### Requirement: Card Shadow System
Cards SHALL use TAHOE 3D shadow system with proper elevation tokens.

#### Scenario: Card shadow application (UPDATED)
- **WHEN** card component is rendered
- **THEN** shadow token SHALL be applied:
  - Resting: `var(--shadow-card-resting)` (7 layers)
  - Hover: `var(--shadow-card-raised)` (7 layers with higher opacity)
  - Pressed: `var(--shadow-card-pressed)` (reduced depth)
- **AND** ALL card types SHALL use same shadow system (CHANGED from varied)
- **AND** split lighting (inset highlights) SHALL be present

## REMOVED Requirements

### ~~Requirement: Component-Specific Padding~~ (REMOVED)
~~Each component MAY define custom padding values~~

**Reason:** Replaced with unified card padding token system for consistency.

### ~~Requirement: Flexible Breakpoint Usage~~ (REMOVED)
~~Components MAY use breakpoints as needed~~

**Reason:** Standardized to 5 specific breakpoints to reduce fragmentation.

## RENAMED Requirements

None
