# client-scripts Specification Deltas

## ADDED Requirements

### Requirement: Solid Island Integration for GitHub Activity

The system SHALL support a Solid island for the GitHub activity experience.

#### Scenario: Island hydration on interactive pages

- **WHEN** the homepage or now page loads GitHub activity section
- **THEN** the GitHub island SHALL hydrate client-side without mismatches
- **AND** interactive carousel/keyboard behavior SHALL be available

#### Scenario: GitHub API resilience

- **WHEN** GitHub API requests fail or are rate-limited
- **THEN** the widget SHALL display a graceful fallback state
- **AND** the page SHALL remain usable without script errors

#### Scenario: Token and auth fallback

- **WHEN** authenticated token is unavailable
- **THEN** the widget SHALL continue with unauthenticated mode and reduced capability
- **AND** user-facing UI SHALL remain coherent and informative

## MODIFIED Requirements

None

## REMOVED Requirements

None
