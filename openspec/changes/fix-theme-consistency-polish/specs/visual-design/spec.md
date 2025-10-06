# Visual Design Specification - Consistency Polish

## MODIFIED Requirements

### Requirement: Color System & Mixing

All color values SHALL use `color-mix()` in `oklch` color space with semantic 9-step scales for precise blending.

**MODIFICATION**: Extend requirement to enforce `color-mix()` for ALL interactive elements, eliminating legacy `rgba()` usage.

#### Scenario: Sidebar link hover state

- **WHEN** user hovers over a sidebar link in dark mode
- **THEN** background SHALL be `color-mix(in oklch, var(--blue) 15%, transparent)` instead of `rgba(0, 122, 255, 0.15)`
- **AND** the color SHALL maintain exact visual parity with legacy value

#### Scenario: Sidebar link active state

- **WHEN** sidebar link has aria-current="page" in dark mode
- **THEN** background SHALL use `color-mix(in oklch, var(--blue) 20%, transparent)`
- **WHEN** in light mode
- **THEN** background SHALL use `color-mix(in oklch, var(--blue) 12%, transparent)`

#### Scenario: Active icon tile in dark mode sidebar

- **WHEN** sidebar link is active ([aria-current="page"]) in dark mode
- **THEN** the .icon-tile SHALL have distinct styling to match light mode treatment
- **AND** SHALL use gradient or colored shadow to indicate active state

## ADDED Requirements

### Requirement: Complete Theme Coverage

All text elements SHALL have theme-specific styling when contrast requirements differ between light and dark modes.

#### Scenario: Hero subtitle in dark mode

- **WHEN** rendering .hero\_\_subtitle in dark mode
- **THEN** color SHALL be `var(--muted)` (already defined in theme)
- **WHEN** rendering in light mode
- **THEN** color SHALL be `color-mix(in oklch, var(--text) 82%, transparent)` for reduced contrast

#### Scenario: Blog hero lede text theming

- **WHEN** rendering .blogHero\_\_lede in dark mode
- **THEN** color SHALL be `var(--muted)` for proper contrast
- **WHEN** rendering in light mode
- **THEN** color SHALL be `color-mix(in oklch, var(--text) 80%, transparent)` for subtle hierarchy

#### Scenario: Topbar navigation hover feedback

- **WHEN** user hovers over .topbar\_\_navLink in dark mode
- **THEN** text color SHALL shift to `color-mix(in oklch, var(--text) 95%, var(--blue) 5%)`
- **AND** underline SHALL be `color-mix(in oklch, var(--blue) 90%, transparent)`
- **WHEN** in light mode
- **THEN** hover SHALL use `color-mix(in oklch, var(--text) 92%, var(--blue) 8%)`

### Requirement: Typography Token Consistency

All font-size declarations SHALL use design tokens from the type scale, with documented exceptions for special cases.

#### Scenario: Blog hero title sizing

- **WHEN** rendering .blogHero\_\_title
- **THEN** font-size SHOULD evaluate if existing direct clamp is appropriate
- **IF** the size doesn't match existing tokens (--fs-hero is close)
- **THEN** either adjust to use --fs-hero with scale adjustment OR document rationale for direct value

#### Scenario: Design token documentation

- **WHEN** a font-size uses direct pixel/rem values instead of tokens
- **THEN** a CSS comment SHALL explain why (e.g., "/_ Direct value: unique size between --fs-h2 and --fs-hero _/")

### Requirement: Interactive State Completeness

All interactive elements SHALL have consistent styling across both light and dark themes for all states (rest, hover, active, focus).

#### Scenario: Navigation link active indicator theming

- **WHEN** .topbar\_\_navLink[aria-current="page"]::after is rendered
- **THEN** the indicator SHALL have theme-specific colors
- **AND** SHALL maintain same visual weight in both themes
- **AND** contrast ratio SHALL meet WCAG AA standards (3:1 for UI components)

#### Scenario: Icon tile hover consistency

- **WHEN** .icon-tile is hovered in any theme
- **THEN** transform, shadow, and color changes SHALL be consistent
- **AND** theme-specific accent colors SHALL apply where appropriate
