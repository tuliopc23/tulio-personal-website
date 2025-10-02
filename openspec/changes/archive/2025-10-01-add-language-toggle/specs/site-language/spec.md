## ADDED Requirements

### Requirement: Language Segmented Toggle

The site SHALL provide an Apple HIG–styled segmented control that lets visitors switch between English (default) and Portuguese (Brazil) without reloading the page.

#### Scenario: Switch to Portuguese

- **GIVEN** the visitor is viewing any page with the default English locale
- **WHEN** they activate the Portuguese segment in the language toggle
- **THEN** visible UI copy updates to Portuguese (Brazil)
- **AND** the selection persists for subsequent page visits in the same browser

#### Scenario: Maintain English Default

- **GIVEN** a first-time visitor with no stored language preference
- **WHEN** the page renders
- **THEN** English remains the active segment and copy is shown in English
