# client-scripts Specification - Update Liquid Theme Toggle

## ADDED Requirements

### Requirement: Liquid Toggle Interaction Behaviour
The theme toggle script SHALL support tap, drag, and keyboard interactions without external runtime dependencies.

#### Scenario: Drag and tap events
- **WHEN** a user drags or taps the toggle knob
- **THEN** the script SHALL update the theme state immediately
- **AND** the interaction SHALL persist the choice using existing theme storage logic

#### Scenario: Keyboard accessibility
- **WHEN** the toggle has focus
- **THEN** pressing Space or Enter SHALL toggle the theme exactly once
- **AND** the control SHALL announce the updated `aria-pressed` state

#### Scenario: Reduced motion fallback
- **WHEN** `prefers-reduced-motion` is enabled
- **THEN** the script SHALL disable spring/bounce animations
- **AND** the toggle SHALL still respond within 150ms

#### Scenario: Dependency review
- **WHEN** the toggle integrates the new visuals
- **THEN** any third-party animation library (e.g., GSAP) SHALL be justified in documentation or replaced with native animation
- **AND** bundle impact SHALL be documented if a dependency remains

## MODIFIED Requirements
None.

## REMOVED Requirements
None.

## RENAMED Requirements
None.
