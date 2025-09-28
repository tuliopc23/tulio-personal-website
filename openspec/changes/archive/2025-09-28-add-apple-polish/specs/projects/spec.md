## ADDED Requirements

### Requirement: Gentle Card Hover Effects

Project cards SHALL provide subtle hover interactions that maintain Apple's design restraint.

#### Scenario: Subtle hover interaction

- **WHEN** user hovers over project cards
- **THEN** cards scale slightly (1.02x) with gentle shadow increase, using 200ms ease-out

### Requirement: Clean Status Indicators

Projects SHALL display status information using Apple's standard badge design.

#### Scenario: Status badge display

- **WHEN** user views project cards
- **THEN** projects show clean status indicators (Live, Beta, Coming Soon) using Apple's badge styling

### Requirement: Consistent Grid Layout

The projects grid SHALL maintain Apple's consistent, grid-based layout principles.

#### Scenario: Uniform grid spacing

- **WHEN** user views the projects page
- **THEN** projects maintain consistent card heights and spacing, following Apple's grid system

### Requirement: Filter State Persistence

Project filters SHALL maintain state across page interactions for better user experience.

#### Scenario: URL-based filter state

- **WHEN** user selects a project filter
- **THEN** the filter state is reflected in the URL and persists on page refresh

## MODIFIED Requirements

### Requirement: Project Card Typography

Project cards SHALL use Apple's typography standards for optimal readability and hierarchy.

#### Scenario: Typography consistency

- **WHEN** user views project cards
- **THEN** typography follows Apple's San Francisco font standards with proper hierarchy
