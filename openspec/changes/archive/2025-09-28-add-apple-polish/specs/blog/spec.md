## ADDED Requirements

### Requirement: Clean Reading Progress

Blog articles SHALL provide a subtle, non-intrusive reading progress indicator.

#### Scenario: Reading progress display

- **WHEN** user scrolls through an article
- **THEN** a clean progress bar appears at the top, using Apple's standard blue color

### Requirement: Smooth Filter Transitions

Blog filters SHALL transition smoothly without flashy effects.

#### Scenario: Clean filter changes

- **WHEN** user changes filter selection
- **THEN** articles fade in/out smoothly with 200ms ease-out transition (no stagger effects)

### Requirement: Subtle Status Indicators

Recent posts SHALL be marked with clean, minimal indicators.

#### Scenario: New post indicator

- **WHEN** a post is published within the last 7 days
- **THEN** a small, clean "New" badge appears using Apple's standard badge styling

### Requirement: Keyboard Navigation

Blog filters SHALL support proper keyboard navigation following Apple's accessibility standards.

#### Scenario: Keyboard filter control

- **WHEN** user focuses on filter buttons
- **THEN** arrow keys navigate between filters, Enter activates, Escape closes

## MODIFIED Requirements

### Requirement: Article Card Interactions

Article cards SHALL provide subtle hover states that feel natural and purposeful.

#### Scenario: Gentle card hover

- **WHEN** user hovers over article cards
- **THEN** cards scale slightly with subtle shadow increase, maintaining Apple's restraint
