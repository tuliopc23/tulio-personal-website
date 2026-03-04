# styling-system Specification - Update Liquid Theme Toggle

## ADDED Requirements

### Requirement: Liquid Glass Theme Toggle Styling
The theme toggle SHALL adopt the liquid glass aesthetic while integrating with existing design tokens and accessibility requirements.

#### Scenario: Toggle uses design tokens
- **WHEN** the new toggle renders
- **THEN** colors, shadows, and blur values SHALL be driven by existing CSS custom properties (or newly documented tokens)
- **AND** no hard-coded hex values from the demo SHALL remain in production styles

#### Scenario: Reduced motion support
- **WHEN** the user prefers reduced motion
- **THEN** the toggle SHALL provide a simplified transition without bounce/drag animations
- **AND** the control SHALL remain visually consistent with the rest of the UI

#### Scenario: Visual regression guard
- **WHEN** the toggle replaces the existing control
- **THEN** overall header layout height and spacing SHALL remain unchanged
- **AND** light/dark states SHALL match current color palettes

### Requirement: Slider Evaluation Documentation
The styling system SHALL include documentation describing whether and how the liquid slider fits into the site.

#### Scenario: Slider recommendation captured
- **WHEN** this change is completed
- **THEN** a brief design note SHALL exist (e.g., `docs/slider-evaluation.md`)
- **AND** it SHALL state the recommended use case (or explain why it is deferred)
- **AND** the note SHALL reference impacted components/pages if adoption is proposed

## MODIFIED Requirements
None.

## REMOVED Requirements
None.

## RENAMED Requirements
None.
