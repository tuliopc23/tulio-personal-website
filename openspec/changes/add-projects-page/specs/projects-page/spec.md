## ADDED Requirements

### Requirement: Projects Gallery Page

The site SHALL provide a dedicated projects page that showcases recent work using the same Apple-inspired card visuals as the rest of the site. The page SHALL highlight each project with title, summary, role/stack details, and a primary action linking to the live build or case study.

#### Scenario: Projects available

- **GIVEN** at least one project entry is present in the chosen data source
- **WHEN** a visitor opens `/projects`
- **THEN** the page renders cards sorted by newest first and arranged in a responsive grid/rail that matches the rest of the site’s spacing tokens
- **AND** each card displays its title, short summary (≤160 characters), tech stack tags, and a primary link that opens in a new tab
- **AND** each card surfaces contextual metadata such as release timeframe and project origin, accompanied by card hover affordances that mirror the site’s icon tilting and glow motion

#### Scenario: Projects hero overview

- **WHEN** a visitor arrives on `/projects`
- **THEN** the header introduces the page with an Apple-inspired eyebrow label, gradient title, and descriptive lede
- **AND** the hero surfaces quick stats (e.g., featured build count and focus areas) inside pill-shaped badges matching the homepage polish

#### Scenario: Empty state

- **GIVEN** no projects are configured yet
- **WHEN** a visitor opens `/projects`
- **THEN** the page shows friendly placeholder copy explaining that projects are coming soon and includes a link to contact Tulio

#### Scenario: Responsive behavior

- **WHEN** the viewport width is ≤720px
- **THEN** the cards collapse into a horizontal carousel with scroll snapping and touch-friendly hit areas while preserving the same card styling used on desktop
- **AND** all typography follows the mobile clamp scales defined in the design tokens

#### Scenario: SEO metadata

- **WHEN** crawlers inspect the `/projects` page
- **THEN** the page includes descriptive `<title>`, meta description, and Open Graph/Twitter tags referencing the latest highlighted projects
