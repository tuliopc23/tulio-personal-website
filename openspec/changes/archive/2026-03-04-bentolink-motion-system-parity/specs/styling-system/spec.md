# styling-system Specification Deltas

## ADDED Requirements

### Requirement: Canonical Elevation Motion Contract

Interactive surfaces SHALL follow one shared elevation-motion contract.

#### Scenario: Shared hover-elevate behavior

- **WHEN** an interactive card/tile is hovered, focused, or focus-within
- **THEN** it SHALL apply shared translate/scale variables from the global contract
- **AND** it SHALL escalate shadow and border in a consistent tiered manner

#### Scenario: Active press feedback

- **WHEN** an interactive surface enters active state
- **THEN** it SHALL apply a bounded press-down scale
- **AND** it SHALL return smoothly to rest without residual transform drift

#### Scenario: Icon tile synchronization

- **WHEN** parent interactive surfaces transition to hover/focus states
- **THEN** child icon tiles SHALL receive synchronized micro-lift and glow adjustment
- **AND** child motion SHALL not exceed readability-safe transform bounds

### Requirement: Tiered Motion Density

Not all interactive surfaces SHALL use the same motion complexity.

#### Scenario: Premium card parallax eligibility

- **WHEN** a surface is designated as premium (feature/writing/spotlight class)
- **THEN** pointer parallax MAY be enabled
- **AND** compact chips and utility controls SHALL remain hover-elevate only

## MODIFIED Requirements

None

## REMOVED Requirements

None
