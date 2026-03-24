# sanity-cms Specification Deltas

## ADDED Requirements

### Requirement: Editorial Fidelity Guidance

Sanity schemas SHALL include guidance that preserves front-end visual fidelity for cards and article readers.

#### Scenario: Summary and hook quality constraints

- **WHEN** editors input `summary` and optional `hook`
- **THEN** schema guidance SHALL describe target length and tone suitable for card rendering
- **AND** guidance SHALL discourage overflow-prone or low-signal copy

#### Scenario: Hero image quality alignment

- **WHEN** editors configure hero images and social metadata
- **THEN** schema guidance SHALL define expected aspect ratio and quality expectations
- **AND** metadata fields SHALL support consistent social preview rendering

#### Scenario: Studio workflow clarity

- **WHEN** editors browse content sections in Studio
- **THEN** structure labels and ordering SHALL support a clear high-fidelity publishing workflow
- **AND** the workflow SHALL remain compatible with existing custom actions

## MODIFIED Requirements

None

## REMOVED Requirements

None
