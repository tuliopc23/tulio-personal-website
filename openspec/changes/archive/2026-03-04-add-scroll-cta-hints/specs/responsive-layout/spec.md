## ADDED Requirements

### Requirement: Horizontal Rails Provide Scroll CTA Hint
All horizontally scrollable rails SHALL surface a blue CTA-style hint prompting users to scroll left until they interact with the rail.

#### Scenario: Mobile card rails show hint before interaction
- **WHEN** a mobile viewport (<1024px) renders a horizontal rail (home quick links, Tech stack, Tools, Featured writing, Profile socials, Projects grid)
- **THEN** a blue “Scroll left →” hint SHALL appear above the rail
- **AND** the hint SHALL inherit CTA typography tokens and remain visually separate from the rail surface
- **AND** the hint SHALL hide once the user scrolls, drags, or focuses within the rail (persisting for the remainder of the session).

#### Scenario: Desktop blog carousel exposes hint
- **WHEN** the blog article carousel renders on desktop (≥1024px) or tablet landscape where horizontal scrolling persists
- **THEN** the blue scroll hint SHALL render above the carousel items
- **AND** the hint SHALL dismiss after the user scrolls or uses carousel controls
- **AND** other desktop rails that present full-width grids SHALL keep the hint hidden.

#### Scenario: Accessibility parity
- **WHEN** a keyboard or assistive tech user focuses into a rail without pointer input
- **THEN** the hint SHALL be announced once via accessible text
- **AND** it SHALL hide after the first keyboard navigation or scroll event
- **AND** users with `prefers-reduced-motion: reduce` SHALL not see animated hint transitions.
