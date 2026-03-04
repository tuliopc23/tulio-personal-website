## ADDED Requirements

### Requirement: Profile Contact Cards Use Compact Card Layout
The Profile card SHALL render Email and Location as compact cards that sit beneath the profile header and reuse the site’s card styling at a reduced scale.

#### Scenario: Desktop contact cards align under header
- **WHEN** the viewport is ≥1024px wide
- **THEN** the Email and Location entries SHALL appear as two cards positioned between the header and summary copy
- **AND** each card SHALL include an icon tile sized 32px (±2px) using the new Socials assets, alongside text content
- **AND** spacing/padding SHALL be reduced compared to social CTAs so both cards fit comfortably without widening the profile card.

#### Scenario: Mobile contact cards stack cleanly
- **WHEN** the viewport is below tablet breakpoint
- **THEN** the contact cards SHALL stack vertically with touch-friendly padding and maintain the same icon/text relationship
- **AND** no horizontal scrolling SHALL be introduced; cards remain fully visible within the profile card.

### Requirement: Contact Cards Surface Label and Value Only
Each contact card SHALL present a heading and direct value (no descriptive body copy) while keeping the full card clickable.

#### Scenario: Email card exposes address
- **WHEN** the Email card renders
- **THEN** it SHALL display the heading “Email” and the value `contact@tuliocunha.dev`
- **AND** activating the card SHALL trigger the `mailto:` link with an accessible label such as “Email Tulio Cunha”.

#### Scenario: Location card exposes location string
- **WHEN** the Location card renders
- **THEN** it SHALL display the heading “Location” and the current location string (e.g., “Brazil”)
- **AND** activating the card SHALL open the Apple Maps deep link in a new tab
- **AND** both contact cards SHALL respect hover/focus states consistent with other cards in the profile section.
