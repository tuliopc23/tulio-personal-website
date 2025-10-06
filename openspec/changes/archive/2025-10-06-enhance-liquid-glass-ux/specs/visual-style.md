## MODIFIED Requirements

### Requirement: Layered Liquid Glass

#### Scenario: Hero / Card / Sidebar Surfaces

- WHEN a user interacts with key surfaces (hero, cards, sidebar)
- THEN a secondary glass layer subtly adjusts blur/tint to imply depth
- AND light glints animate gently on interaction while respecting reduced motion.

#### Scenario: Hero Entry

- WHEN the page loads with preferences allowing motion
- THEN hero eyebrow, title, and lede appear with a brief, staggered reveal (<180ms)
- AND reduced-motion users see static content with no animation.

#### Scenario: Mobile Carousel Nav

- WHEN on mobile
- THEN existing carousel nav remains structurally unchanged but inherits the layered glass aesthetic (glow, blur adjustments) consistent with desktop.
