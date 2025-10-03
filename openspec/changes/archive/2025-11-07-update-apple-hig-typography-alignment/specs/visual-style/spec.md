## MODIFIED Requirements

### Requirement: Micro-Typography & Icon Precision

Typography, spacing, and iconography SHALL align to a consistent baseline grid and conform to Apple HIG treatments across breakpoints, ensuring polished rhythm and state clarity, while preserving existing corner radii and shapes.

#### Scenario: Baseline grid alignment

- **WHEN** headings, body copy, and metadata render on desktop or mobile
- **THEN** their line heights, margins, and max line lengths adhere to the documented baseline grid and a 58–60ch body width target
- **AND** multi-line headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty` where supported

#### Scenario: Icon and badge detailing

- **WHEN** icon tiles, badges, or status pills appear
- **THEN** icons sit within 8px padding frames, share consistent corner radii, and receive lighting accents sourced from the token palette
- **AND** primary navigation and feature glyphs reuse the curated SF vectors with Apple system tint tokens (blue, teal, green, orange, yellow)
- **AND** hover/focus states include high-contrast rings or glows that pass WCAG contrast checks

#### Scenario: Non-destructive polish constraints

- **WHEN** applying visual refinements
- **THEN** radius tokens and corner shapes SHALL NOT change
- **AND** card/nav hover transforms remain subtle (|scale−1| ≤ 0.01, |translateY| ≤ 1px) favoring shadow/elevation cues
- **AND** focus ring thickness remains visually 3–4px with tokenized color and no clipping under overflow
- **AND** hero/section glow intensity remains subtle to preserve text legibility in both themes
