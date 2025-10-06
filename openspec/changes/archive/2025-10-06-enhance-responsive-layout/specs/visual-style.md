## MODIFIED Requirements

### Requirement: Responsive Layout Baseline

- Maintain a layout system that feels native on Apple hardware while scaling to larger desktop displays.

#### Scenario: MacBook Pro 14" Baseline

- WHEN the site renders on a viewport between 1280px and 1680px wide (e.g., MBP 14" at default retina scale)
- THEN the main content column width is between 1180px and 1240px with outer gutters ≥24px
- AND body copy measure remains within 68–72 characters per line
- AND the sidebar (when visible) aligns to the same optical grid without overlapping gutters.

#### Scenario: Compact Desktop / Stage Manager

- WHEN the viewport is between 960px and 1280px (Stage Manager half-width or smaller laptops)
- THEN the sidebar width collapses or docks so the primary content retains ≥60ch readability
- AND container padding adapts to keep ≥16px outer gutters.

#### Scenario: Expanded Desktop

- WHEN the viewport exceeds 1680px
- THEN the main content column scales up to a maximum of 80ch while maintaining centered alignment
- AND gutters expand proportionally so the layout never feels pinned to the center
- AND navigation/hero elements remain aligned with the updated grid.

#### Scenario: Motion & Accessibility Parity

- WHEN layout tiers switch (e.g., resizing between breakpoints)
- THEN transitions are limited to 200ms ease-out without disruptive motion
- AND prefers-reduced-motion users observe instant layout changes with no animated shifts.
