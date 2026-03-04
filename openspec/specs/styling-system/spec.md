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

### Requirement: Blog and Reader Surface Consistency
Blog listing and article-reader surfaces SHALL share the same material/elevation language as the homepage.

#### Scenario: Blog listing card parity
- **WHEN** article cards are rendered on blog listing pages
- **THEN** card shell depth, border treatment, and CTA hierarchy SHALL match the shared visual system
- **AND** theme switching SHALL preserve contrast and legibility

#### Scenario: Reader shell hierarchy
- **WHEN** a blog article page is rendered
- **THEN** header/body/related sections SHALL use coherent surface tiers
- **AND** visual separation SHALL improve scannability without reducing readability

#### Scenario: Portable block material cohesion
- **WHEN** images, callouts, and code blocks appear in article bodies
- **THEN** block surfaces SHALL follow shared radius/border/shadow conventions
- **AND** content SHALL remain readable in both light and dark themes

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

### Requirement: Route Surface Consistency
Legacy pages and references that are intentionally removed SHALL not persist as dead UI artifacts.

#### Scenario: Uses surface removal
- **WHEN** the navigation, sitemap, and theme styles are evaluated
- **THEN** there SHALL be no `/uses` route links
- **AND** there SHALL be no `.uses__*` visual rules remaining in active stylesheets

