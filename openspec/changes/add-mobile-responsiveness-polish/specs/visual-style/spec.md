## ADDED Requirements

### Requirement: Mobile And Tablet Responsive Layout

The marketing pages SHALL present an optimized layout, typography, and interaction model across common mobile (≤480px) and tablet (481–1024px) breakpoints so the experience remains readable, touch-friendly, and branded without requiring horizontal scrolling.

#### Scenario: Small-phone viewport

- **GIVEN** a visitor opens the site on a device with a viewport width between 320px and 480px
- **WHEN** the page renders
- **THEN** the layout collapses into a single-column stack with consistent spacing tokens, no horizontal overflow, and legible typography at mobile scale
- **AND** navigation, hero, and card components adapt to full-width presentation while preserving theme tokens

#### Scenario: Tablet viewport

- **GIVEN** a visitor opens the site on a viewport width between 768px and 1024px
- **WHEN** the page renders
- **THEN** key sections (hero grid, sidebar, card grids) reflow into tablet-specific two-column patterns with balanced gutters and spacing
- **AND** typography scales smoothly between mobile and desktop settings without jumps in line height or letter spacing

#### Scenario: Touch targets and interactions

- **WHEN** a visitor interacts with buttons, cards, or navigation items on a touch device
- **THEN** each interactive element maintains a minimum 44px touch target with clear focus/active states
- **AND** hover-only cues are complemented by tactile feedback (e.g., active states) so mobile users receive equivalent affordances
