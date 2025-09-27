## ADDED Requirements

### Requirement: Apple HIG Motion System

The experience SHALL provide a cohesive motion system patterned after Apple Human Interface Guidelines, including defined duration/easing tokens, reduced-motion accommodations, and reusable utilities for page transitions, section reveals, and component feedback.

#### Scenario: Page transition choreography

- **WHEN** a user navigates between major pages
- **THEN** the entering content animates with a 180–220ms ease-out translation and opacity fade using motion tokens
- **AND** the outgoing content gracefully fades out without abrupt jumps or scroll position resets

#### Scenario: Section reveal timing

- **WHEN** sections enter the viewport during scroll
- **THEN** they use staggered reveal animations (e.g., fade + 8px translate) driven by intersection observers or CSS timelines
- **AND** users with prefers-reduced-motion receive immediate static rendering without delayed content

#### Scenario: Interactive micro-motion

- **WHEN** buttons, cards, or list items are hovered, focused, or pressed
- **THEN** they respond with tokenized scaling / translation and shadow adjustments within 120–180ms curves
- **AND** focus-visible outlines remain accessible and unobstructed by motion effects

### Requirement: Responsive Glass & Lighting Surfaces

Navigation, sidebar, and utility panels SHALL employ dynamic translucency, blur, and light accents that adapt to scroll position, background contrast, and color mode while preserving content legibility.

#### Scenario: Scroll-reactive translucency

- **WHEN** the user scrolls beyond the hero region
- **THEN** the primary navigation and sidebar increase blur radius and adjust opacity tokens to maintain separation from content
- **AND** hairline borders gain subtle highlights in light mode and soft glows in dark mode for depth

#### Scenario: Theme parity

- **WHEN** light or dark theme is active
- **THEN** glass panels reuse shared translucency tokens while swapping lighting accent colors to preserve contrast ratios ≥ 4.5:1
- **AND** reduced-motion users still see static glass visuals without pulse animations

### Requirement: Micro-Typography & Icon Precision

Typography, spacing, and iconography SHALL align to a consistent baseline grid and conform to Apple HIG treatments across breakpoints, ensuring polished rhythm and state clarity.

#### Scenario: Baseline grid alignment

- **WHEN** headings, body copy, and metadata render on desktop or mobile
- **THEN** their line heights, margins, and max line lengths adhere to the documented baseline grid and 60ch body width target
- **AND** vertical spacing between sections matches the updated spacing scale tokens

#### Scenario: Icon and badge detailing

- **WHEN** icon tiles, badges, or status pills appear
- **THEN** icons sit within 8px padding frames, share consistent corner radii, and receive lighting accents sourced from the token palette
- **AND** primary navigation and feature glyphs reuse the curated SF vectors (journal, constellation, triple-spark) with Apple system tint tokens (blue, teal, green, orange, yellow) replacing ad-hoc purples or pinks
- **AND** hover/focus states include high-contrast rings or glows that pass WCAG contrast checks

#### Scenario: QA checklist

- **WHEN** preparing a release
- **THEN** the team validates light/dark parity, reduced motion, keyboard navigation, and retina/standard pixel density rendering against the documented checklist
- **AND** screenshots or recordings are captured to demonstrate compliance with the updated spec
