# styling-system Specification Deltas

## ADDED Requirements

### Requirement: Bentolink Home Surface Parity
The home surface system SHALL use a unified depth hierarchy that matches Bentolink-grade materials, sizing, and tile quality.

#### Scenario: Profile shell depth hierarchy
- **WHEN** the homepage profile region is rendered
- **THEN** the outer shell SHALL present a stronger depth tier than inner subcards
- **AND** contact and social tiles SHALL read as subordinate layers
- **AND** hover/active transitions SHALL preserve that hierarchy

#### Scenario: Contact chip material fidelity
- **WHEN** contact chips are rendered
- **THEN** they SHALL use glass-tinted chip materials with visible border and inner sheen
- **AND** hover SHALL increase contrast and lift without clipping text

#### Scenario: Icon tile coupling
- **WHEN** a parent interactive card is hovered or focused
- **THEN** its icon tile SHALL receive a synchronized micro-lift and glow intensification
- **AND** tile transforms SHALL remain bounded to avoid blur artifacts

#### Scenario: Writing CTA parity
- **WHEN** article tiles are rendered in featured-writing contexts
- **THEN** CTA SHALL be chip-based with icon affordance
- **AND** CTA visual hierarchy SHALL be stronger than metadata chips

### Requirement: Outlined Iconography Consistency
The interface SHALL preserve one outlined icon language across equivalent UI contexts.

#### Scenario: Cross-component icon consistency
- **WHEN** icons appear in section headers, metadata, breadcrumbs, cards, and CTA affordances
- **THEN** outlined icon style and stroke rhythm SHALL remain consistent
- **AND** mixed icon systems SHALL NOT appear within the same context block

## ADDED Requirements

### Requirement: Route Surface Consistency
Legacy pages and references that are intentionally removed SHALL not persist as dead UI artifacts.

#### Scenario: Uses surface removal
- **WHEN** the navigation, sitemap, and theme styles are evaluated
- **THEN** there SHALL be no `/uses` route links
- **AND** there SHALL be no `.uses__*` visual rules remaining in active stylesheets

## REMOVED Requirements
None
