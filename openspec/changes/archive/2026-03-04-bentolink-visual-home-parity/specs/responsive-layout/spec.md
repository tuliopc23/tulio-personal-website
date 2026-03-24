# responsive-layout Specification Deltas

## ADDED Requirements

### Requirement: Parity Across Breakpoints

Bentolink visual parity SHALL hold across desktop, tablet, and mobile breakpoints.

#### Scenario: Profile and social layout scaling

- **WHEN** viewport width changes from desktop to tablet/mobile
- **THEN** profile content hierarchy SHALL remain intact
- **AND** social tile grid SHALL preserve clear visual grouping and target size

#### Scenario: Writing tile CTA readability

- **WHEN** featured writing cards collapse into narrower layouts
- **THEN** metadata chips and CTA chips SHALL remain legible and non-overlapping
- **AND** CTA affordance SHALL remain obvious without overflow or clipping

#### Scenario: Uses removal does not break responsive nav

- **WHEN** mobile and desktop navigation are rendered
- **THEN** removal of `/uses` SHALL not introduce spacing gaps or broken focus order

## MODIFIED Requirements

None

## REMOVED Requirements

None
