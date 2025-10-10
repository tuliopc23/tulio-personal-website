# styling-system Specification

## Purpose
TBD - created by archiving change refactor-css-architecture. Update Purpose after archive.
## Requirements
### Requirement: Modular CSS Architecture
The styling system SHALL be organized into logical modules with clear separation of concerns.

#### Scenario: Finding component styles
- **WHEN** developer needs to update card styles
- **THEN** styles are located in `src/styles/components/cards.css`
- **AND** not scattered across 5,150-line monolithic file

#### Scenario: Updating theme colors
- **WHEN** developer needs to change dark mode colors
- **THEN** all dark mode rules are in `src/styles/themes/dark.css`
- **AND** light mode rules are in `src/styles/themes/light.css`

### Requirement: CSS Token System
The styling system SHALL use CSS custom properties for all repeated color and shadow values.

#### Scenario: Consistent color usage
- **WHEN** a color value is used multiple times
- **THEN** it is defined as a CSS variable (e.g., `--color-dark-bg`)
- **AND** the exact rgba() value is preserved
- **AND** all usages reference the variable

#### Scenario: Shadow system preservation
- **WHEN** 4-layer elevation shadows are defined
- **THEN** exact shadow values are preserved in CSS variables
- **AND** symbol tiles maintain 3D elevated appearance
- **AND** all components maintain current shadow effects

### Requirement: Visual Preservation
The refactored styling system SHALL produce pixel-perfect identical output to the current implementation.

#### Scenario: Zero visual regression
- **WHEN** CSS refactor is complete
- **THEN** all pages render identically to before refactor
- **AND** all 750+ colors remain exact same rgba() values
- **AND** all 4-layer shadows remain identical
- **AND** all hover states and animations unchanged
- **AND** theme switching produces identical results

#### Scenario: Component elevation effects
- **WHEN** symbol tiles and cards are rendered
- **THEN** 3D elevation effects are preserved exactly
- **AND** glass morphism effects unchanged
- **AND** multi-layer shadows maintain depth perception

### Requirement: Style Organization Guidelines
The project SHALL document clear guidelines for where styles should be defined.

#### Scenario: Scoped vs global decision
- **WHEN** developer adds new component styles
- **THEN** guidelines specify when to use scoped `<style>` blocks
- **AND** when to use global theme.css modules
- **AND** how to handle theme-specific overrides

#### Scenario: Theme-specific styles
- **WHEN** component needs different styles per theme
- **THEN** theme rules are placed in `themes/dark.css` or `themes/light.css`
- **AND** not in scoped component styles with `[data-theme]` selectors

