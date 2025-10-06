# Visual Design Specification

## MODIFIED Requirements

### Requirement: CSS Consistency and Single Source of Truth

The visual design system SHALL maintain a single source of truth for all design tokens in `theme.css`, with zero hardcoded values in component styles, ensuring consistency and maintainability across the entire application.

#### Scenario: Component uses design token

- **WHEN** a component needs a border-radius value
- **THEN** it SHALL reference `var(--radius-lg)` or appropriate token
- **AND** it SHALL NOT use hardcoded values like `32px`
- **AND** the token SHALL be defined in `theme.css`

#### Scenario: Audit detects hardcoded value

- **WHEN** CSS audit tool scans component styles
- **THEN** it SHALL flag any hardcoded color, spacing, radius, shadow, or font-size values
- **AND** developer SHALL replace with appropriate theme token reference
- **OR** create new token in theme.css if legitimate component-specific value

#### Scenario: Duplicate CSS rule detected

- **WHEN** multiple components define the same CSS rule
- **THEN** the rule SHALL be extracted to theme.css as a shared token or utility class
- **AND** components SHALL reference the shared definition
- **AND** duplicate rules SHALL be removed

### Requirement: Component Implementation Verification

All components SHALL be verified to correctly implement the enhanced Apple HIG design tokens, with proper hover states, animations, shadows, and typography as specified in the visual design system.

#### Scenario: Card component verification

- **WHEN** Card.astro is audited
- **THEN** it SHALL use `--radius-lg` for border-radius
- **AND** it SHALL use `--shadow-card` for rest state
- **AND** it SHALL use `--shadow-card-hover` for hover state
- **AND** it SHALL use `--motion-scale-card` for hover scale
- **AND** it SHALL use `--motion-spring-out` for transition timing
- **AND** all values SHALL be verified in browser DevTools

#### Scenario: Navbar glass effect verification

- **WHEN** Navbar.astro is audited
- **THEN** scrolled state SHALL use `--glass-blur-active` (42px)
- **AND** scrolled state SHALL use `--glass-saturation-active` (2.4)
- **AND** scrolled state SHALL use `--glass-opacity-active` (88%)
- **AND** transition SHALL use `--motion-duration-sm` (180ms)
- **AND** effect SHALL be verified by scrolling page in browser

#### Scenario: Typography token verification

- **WHEN** hero title is audited
- **THEN** it SHALL use `--ls-hero` (-0.032em) for letter-spacing
- **AND** it SHALL use `--lh-hero` (1.02) for line-height
- **AND** it SHALL use `--fs-hero` for font-size
- **AND** rendering SHALL be verified in browser at multiple viewport sizes

### Requirement: Accessibility Compliance Verification

All accessibility enhancements SHALL be tested and verified to work correctly across different user preferences and assistive technologies, ensuring WCAG 2.1 AA compliance.

#### Scenario: Reduced motion preference

- **WHEN** user enables prefers-reduced-motion in system settings
- **THEN** all transform and scale animations SHALL be disabled
- **AND** opacity transitions SHALL be limited to 50ms
- **AND** page SHALL remain fully functional
- **AND** behavior SHALL be verified by toggling system setting

#### Scenario: High contrast preference

- **WHEN** user enables prefers-contrast: more in system settings
- **THEN** all borders SHALL increase opacity to 90%
- **AND** gradient backgrounds SHALL be replaced with solid colors
- **AND** text contrast SHALL meet WCAG AA standards (4.5:1)
- **AND** behavior SHALL be verified by toggling system setting

#### Scenario: Focus indicator visibility

- **WHEN** user navigates with keyboard (Tab key)
- **THEN** all interactive elements SHALL show visible focus ring
- **AND** focus ring SHALL use `--focus-ring` token
- **AND** focus ring SHALL have 4px offset and 2.5px thickness
- **AND** focus ring SHALL be verified on all interactive components

#### Scenario: Screen reader compatibility

- **WHEN** user navigates with VoiceOver (macOS) or NVDA (Windows)
- **THEN** all interactive elements SHALL be announced correctly
- **AND** ARIA live regions SHALL announce dynamic content changes
- **AND** semantic HTML SHALL provide proper document structure
- **AND** compatibility SHALL be verified by testing with screen reader

### Requirement: Performance and Animation Verification

All animations and interactive effects SHALL maintain 60fps performance, with proper GPU acceleration and no layout shift, verified through browser DevTools and Lighthouse audits.

#### Scenario: Animation frame rate verification

- **WHEN** user hovers over card with scale animation
- **THEN** animation SHALL maintain 60fps throughout
- **AND** Chrome DevTools Performance panel SHALL show no dropped frames
- **AND** GPU acceleration SHALL be active (transform/opacity only)
- **AND** will-change declarations SHALL be present during animation

#### Scenario: Lighthouse performance audit

- **WHEN** Lighthouse audit runs on any page
- **THEN** Performance score SHALL be >95
- **AND** Cumulative Layout Shift (CLS) SHALL be <0.1
- **AND** First Contentful Paint (FCP) SHALL be <1.8s
- **AND** Time to Interactive (TTI) SHALL be <3.8s

#### Scenario: Backdrop-filter performance

- **WHEN** topbar uses backdrop-filter on scroll
- **THEN** scrolling SHALL remain smooth at 60fps
- **AND** GPU acceleration SHALL be active
- **AND** fallback SHALL exist for unsupported browsers
- **AND** performance SHALL be verified in Safari, Chrome, Firefox

### Requirement: Cross-Browser Compatibility Verification

All visual design enhancements SHALL work correctly across Safari, Chrome, Firefox, and Edge, with appropriate fallbacks for unsupported features, verified through manual testing on each browser.

#### Scenario: Safari compatibility

- **WHEN** site is tested on Safari (macOS and iOS)
- **THEN** backdrop-filter SHALL render correctly
- **AND** color-mix() SHALL work or have fallback
- **AND** safe-area-inset SHALL handle notch correctly
- **AND** all animations SHALL be smooth

#### Scenario: Chrome compatibility

- **WHEN** site is tested on Chrome (desktop and mobile)
- **THEN** all CSS features SHALL work correctly
- **AND** DevTools Performance panel SHALL show 60fps
- **AND** Lighthouse audit SHALL pass
- **AND** responsive behavior SHALL work at all viewport sizes

#### Scenario: Firefox compatibility

- **WHEN** site is tested on Firefox (desktop and mobile)
- **THEN** backdrop-filter SHALL work or have fallback
- **AND** color-mix() SHALL work or have fallback
- **AND** all interactive states SHALL function correctly
- **AND** no console errors SHALL appear

#### Scenario: Feature fallback

- **WHEN** browser doesn't support backdrop-filter
- **THEN** solid background with opacity SHALL be used
- **AND** visual hierarchy SHALL be maintained
- **AND** fallback SHALL be defined via @supports rule
- **AND** site SHALL remain fully functional

## ADDED Requirements

### Requirement: CSS Audit Tooling and Process

The project SHALL establish a systematic CSS audit process to detect hardcoded values, duplicate rules, and conflicts, ensuring ongoing compliance with single-source-of-truth principles.

#### Scenario: Manual CSS audit

- **WHEN** developer runs CSS audit process
- **THEN** all component `.astro` files SHALL be scanned for `<style>` blocks
- **AND** all hardcoded values SHALL be extracted and documented
- **AND** all duplicate rules SHALL be identified
- **AND** audit report SHALL be generated with findings and recommendations

#### Scenario: Token usage documentation

- **WHEN** developer needs to use a design value
- **THEN** theme.css SHALL have inline comments documenting token usage
- **AND** component style guidelines SHALL exist
- **AND** examples SHALL show correct token reference patterns
- **AND** anti-patterns SHALL be documented to avoid

#### Scenario: Refactoring verification

- **WHEN** hardcoded values are replaced with tokens
- **THEN** visual regression testing SHALL confirm no changes
- **AND** browser DevTools SHALL show token values applied
- **AND** component SHALL render identically to before refactoring
- **AND** all interactive states SHALL function correctly
