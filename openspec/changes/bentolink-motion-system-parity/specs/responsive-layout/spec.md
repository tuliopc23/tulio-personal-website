# responsive-layout Specification Deltas

## ADDED Requirements

### Requirement: Motion Accessibility Across Breakpoints
Motion behavior SHALL remain accessible and stable across viewport sizes.

#### Scenario: Reduced motion preference
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** non-essential reveal displacement and parallax SHALL be disabled
- **AND** interaction affordance SHALL remain clear through non-motion cues

#### Scenario: Mobile interaction stability
- **WHEN** interactive cards are used on touch devices
- **THEN** motion effects SHALL avoid scroll-jank and accidental gesture conflicts
- **AND** touch targets SHALL preserve usability with motion enabled

## MODIFIED Requirements
None

## REMOVED Requirements
None
