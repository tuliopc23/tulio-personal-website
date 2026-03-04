# styling-system Specification Deltas

## ADDED Requirements

### Requirement: GitHub Widget Visual Parity
The GitHub widget SHALL match Bentolink-grade surface depth and interaction polish while using the target design tokens.

#### Scenario: Repository card depth
- **WHEN** repository cards render in the GitHub widget
- **THEN** cards SHALL use elevated material surfaces with tiered shadows and glass-compatible borders
- **AND** hover/focus states SHALL provide clear elevation feedback

#### Scenario: Scroll and progress affordances
- **WHEN** widget content overflows horizontally
- **THEN** scroll hints/progress affordances SHALL be visible and token-consistent
- **AND** affordances SHALL not obstruct card content or focus order

#### Scenario: Commit row interaction clarity
- **WHEN** commit rows are hovered or focused
- **THEN** row states SHALL present stronger border/background contrast
- **AND** directional/action affordances SHALL remain legible in both themes

## MODIFIED Requirements
None

## REMOVED Requirements
None
