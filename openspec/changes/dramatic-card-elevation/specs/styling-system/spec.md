# styling-system Specification Deltas

## MODIFIED Requirements

### Requirement: Card Shadow System
Card shadows SHALL be dramatically visible with sufficient opacity to create clear floating elevation.

#### Scenario: Resting card visibility
- **WHEN** card is displayed at rest (no hover)
- **THEN** shadow is CLEARLY VISIBLE with gap between card and background
- **AND** shadow uses minimum 6 layers
- **AND** shadow opacity ranges from 0.08 to 0.16 (not 0.03 to 0.08)
- **AND** users can immediately identify cards as elevated surfaces

#### Scenario: Hover state elevation increase
- **WHEN** card is hovered
- **THEN** shadow dramatically increases in size and opacity
- **AND** hover shadow opacity ranges from 0.10 to 0.20
- **AND** elevation change is IMMEDIATELY NOTICEABLE
- **AND** spread increases from 32px to 96px

#### Scenario: Six-layer shadow composition
- **WHEN** card shadow is rendered
- **THEN** layer 1 is border ring (0.5-1px at 0.06-0.12 opacity)
- **AND** layer 2 is contact shadow (0.5px blur at 0.14-0.20 opacity)
- **AND** layer 3 is near shadow (2-4px blur at 0.12-0.18 opacity)
- **AND** layer 4 is mid shadow (4-8px blur at 0.10-0.16 opacity)
- **AND** layer 5 is far shadow (8-16px blur at 0.08-0.14 opacity)
- **AND** layer 6 is ambient shadow (16-32px blur at 0.06-0.12 opacity)

#### Scenario: Light mode shadow adjustments
- **WHEN** light theme is active
- **THEN** shadows use warmer color (rgba(31, 35, 53, ...))
- **AND** opacity is slightly lower than dark mode
- **AND** shadows remain clearly visible
- **AND** no harsh black shadows

#### Scenario: All card types consistency
- **WHEN** any card-type component is rendered
- **THEN** `.card`, `.articleCard`, `.projectCard`, `.profileCard` all use same base shadow
- **AND** all card types float at same elevation level
- **AND** hover behavior is consistent across types
- **AND** no card appears flat or flush with background

### Requirement: Visible Depth Hierarchy
The visual depth hierarchy SHALL be immediately obvious, not subtle.

#### Scenario: Three-tier visual hierarchy
- **WHEN** user views page
- **THEN** background is clearly at lowest depth
- **AND** resting cards are clearly floating above background
- **AND** hovered cards are clearly floating above resting cards
- **AND** no ambiguity about elevation levels

#### Scenario: Shadow visibility threshold
- **WHEN** shadow is applied
- **THEN** shadow opacity is sufficient for visibility
- **AND** minimum opacity is 0.08 for any shadow layer
- **AND** contact shadows use minimum 0.14 opacity
- **AND** shadows create visible gap perception

### Requirement: Professional Polish Standards
Card elevation SHALL match or exceed Apple's macOS/iOS quality standards.

#### Scenario: Reference quality comparison
- **WHEN** cards are compared to macOS Ventura/Sonoma
- **THEN** shadow depth is comparable or greater
- **AND** floating effect is equally pronounced
- **AND** hover transitions are equally smooth
- **AND** overall polish matches system UI quality

#### Scenario: Screenshot test
- **WHEN** screenshot is taken of cards
- **THEN** elevation is visible in screenshot
- **AND** shadows are not "barely there"
- **AND** cards clearly float above background
- **AND** professional appearance is maintained

## REMOVED Requirements

### Requirement: Subtle Shadow System (REMOVED)
~~Shadows SHALL be subtle and non-distracting~~

**Reason:** Subtlety made shadows INVISIBLE. Proper elevation requires visible shadows.

## RENAMED Requirements
None
