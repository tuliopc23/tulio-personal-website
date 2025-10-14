## ADDED Requirements

### Requirement: Profile Card Uses Card Rail CTA Layout
The homepage Profile section SHALL present social calls-to-action using the same card rail architecture as the Tech stack/Tools sections, scaled to fit the profile layout.

#### Scenario: Desktop CTA grid mirrors card anatomy
- **WHEN** the viewport is at or above the desktop breakpoint (≥1024px)
- **THEN** the Profile card SHALL render its social CTAs as a two-column grid of compact cards that inherit the `card` spacing, corner radius, layered shadows, and reveal sequencing used by Tech stack/Tools
- **AND** the grid SHALL sit alongside the avatar/summary without breaking the Profile card’s max width or existing spacing tokens
- **AND** each card SHALL include a top-aligned icon tile (48–56px square) with consistent padding so the layout reads as a reduced-scale sibling of the main card grid.

#### Scenario: Mobile CTA rail reuses scroll instrumentation
- **WHEN** the viewport is below the desktop breakpoint
- **THEN** the social CTAs SHALL render as a horizontal `cardRail` carousel that reuses the existing `PageIndicator` and `ScrollIndicator` hooks
- **AND** the rail SHALL meet 44×44px touch target requirements while preserving the Tech stack snap/scroll behaviour
- **AND** no legacy chip markup SHALL remain in the mobile template.

### Requirement: Social CTA Cards Emphasise CTA Copy and Updated Iconography
Social CTA cards SHALL replace raw URLs/handles with action-focused copy and leverage the refreshed icon assets provided in `public/icons/Socials/`.

#### Scenario: Action-first copy with hidden URLs
- **WHEN** a social CTA card is rendered
- **THEN** the card title SHALL use the same heading style as other card sections (sentence-case, no uppercase eyebrow)
- **AND** a single-sentence description SHALL invite the user to engage (e.g., “Explore current GitHub experiments”) without explaining the platform
- **AND** no raw URL or handle text SHALL be visible; the underlying link still points to the correct destination and opens in a new tab.

#### Scenario: Updated icon assets with theme parity
- **WHEN** a social CTA card resolves its icon
- **THEN** it SHALL load the corresponding asset from `public/icons/Socials/` (prefer light/dark variants when available) within the icon tile
- **AND** icons SHALL maintain contrast in both light and dark themes, falling back to the existing brand icon pipeline if an asset is missing
- **AND** the icon tile color/tint SHALL align with the Tech stack palette so the cards feel cohesive.

#### Scenario: Single interactive surface with accessible focus
- **WHEN** a user hovers, focuses, or activates a social CTA card
- **THEN** the entire card SHALL act as a single interactive element with hover, active, and focus-visible states matching Tech stack cards
- **AND** keyboard focus order SHALL progress logically through the Profile section before entering the rail
- **AND** each card SHALL expose descriptive aria-label text (e.g., “Visit Tulio on LinkedIn”) so screen readers understand the CTA without seeing the URL.
