## ADDED Requirements

### Requirement: Apple-Inspired Desktop Styling Baseline

The desktop experience SHALL reflect Apple HIG-inspired styling through disciplined tokens, elevations, and typography while preserving flat backgrounds on the page chrome and content tiles. Surface colors SHALL stay neutral with translucent borders, and interactions SHALL deliver smooth hover elevation without harsh transitions.

#### Scenario: Surface treatment

- **WHEN** a desktop visitor views primary panels (hero wrapper, cards, sidebar)
- **THEN** each surface uses updated light/dark tokens with translucent hairline borders and soft multi-layer shadows
- **AND** no gradient backgrounds are applied directly to the page chrome or card/tile surfaces

#### Scenario: Typography rhythm

- **WHEN** headings (`h1`–`h3`), body text, and supporting copy render on desktop
- **THEN** they follow the refined weights, letter spacing, and max-widths defined for the Apple-like hierarchy (bold hero titles, tight tracking, 60ch body width)
- **AND** paragraph spacing and section paddings match the documented rhythm

#### Scenario: Interaction feedback

- **WHEN** a user hovers or focuses cards, buttons, or navigation items on desktop
- **THEN** elements respond with subtle elevation (translateY, softened shadow, lighting accent) and 120–180ms easing consistent with Apple HIG behavior
- **AND** focus states remain accessible and visible in both light and dark themes

#### Scenario: Icon accents

- **WHEN** icon tiles render within cards or sections
- **THEN** icons sit on subtle non-gradient lighting accents (e.g., soft highlight or shadow) that reinforce depth without altering tile background colors
- **AND** accent colors come from the shared Apple-inspired palette tokens
