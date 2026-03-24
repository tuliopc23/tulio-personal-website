# styling-system Specification Deltas

## ADDED Requirements

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

## MODIFIED Requirements

None

## REMOVED Requirements

None
