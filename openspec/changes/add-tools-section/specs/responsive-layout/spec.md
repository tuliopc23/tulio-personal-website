## ADDED Requirements

### Requirement: Tools Section Mirrors Tech Stack Layout
The homepage Tools section SHALL reuse the Tech stack layout, spacing, and scroll instrumentation without introducing bespoke styling.

#### Scenario: Section placement and anchor
- **WHEN** the homepage renders the Tech stack section
- **THEN** a Tools section with heading “Tools” SHALL be inserted immediately after it
- **AND** the section SHALL expose `id="tools"` for in-page navigation
- **AND** the section SHALL reuse the existing `cardGrid cardRail` classes with identical margins and gaps.

#### Scenario: Desktop grid parity
- **WHEN** the viewport is wide enough for the Tech stack grid to render multiple columns (>=1024px breakpoint)
- **THEN** the Tools lineup (Ghostty, Neovim, Xcode, Containerization, Transmit, Kaleidoscope, Code Edit, Tower, Orbstack) SHALL render in the same three-column grid
- **AND** cards SHALL use the same reveal sequencing, spacing tokens, and typography as Tech stack cards
- **AND** any overflow cards SHALL wrap to additional rows while preserving the exact column width and gaps.

#### Scenario: Mobile carousel parity
- **WHEN** the viewport is below the Tech stack desktop breakpoint
- **THEN** the Tools cards SHALL behave as a horizontal scroll rail with identical snap points and scroll affordances
- **AND** both `ScrollIndicator` and `PageIndicator` instances SHALL target the Tools rail using the same data attributes and aria-label pattern as Tech stack.

### Requirement: Tools Cards Reuse Icon & Accessibility Patterns
Tool cards SHALL use the existing icon pipeline and accessibility behaviours defined for Tech stack cards.

#### Scenario: Icon asset reuse
- **WHEN** a Tools card renders with an icon slug
- **THEN** `IconTile` SHALL first attempt to resolve a registered brand icon
- **AND** if none exists, it SHALL load `/public/icons/{slug}.svg` assets with light/dark variants when supplied
- **AND** if an asset is missing, the fallback monogram tile SHALL match the Tech stack placeholder styling.

#### Scenario: Card interaction parity
- **WHEN** a user hovers, focuses, or activates a Tools card
- **THEN** hover, focus-visible, and active states SHALL match the Tech stack implementation pixel-for-pixel
- **AND** each card SHALL remain a single focus target with identical aria labelling semantics for screen readers.
