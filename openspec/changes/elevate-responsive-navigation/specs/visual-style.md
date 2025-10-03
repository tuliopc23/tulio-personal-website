## MODIFIED Requirements

### Requirement: Responsive Navigation Experience

#### Scenario: Mobile Navigation Carousel (≤768px)

- WHEN the user visits on a narrow viewport (≤768px)
- THEN the main navigation renders as a horizontal carousel with snap alignment, gradient edge hints, and smooth inertial scrolling tuned for 120Hz
- AND the active item is visually distinguished with an Apple-style pill/underline while the carousel respects reduced-motion settings.

#### Scenario: Tablet to Desktop Transition

- WHEN transitioning between tablet (769px–1279px) and standard desktop widths
- THEN navigation, hero, and card layouts adjust gutters and spacing to maintain balanced composition without layout jumps.

#### Scenario: Reduced Motion Support

- WHEN `prefers-reduced-motion` is set
- THEN navigation animations (carousel glides, active pill transitions) skip transforms and rely on immediate state changes without losing clarity.

#### Scenario: Large Desktop (≥1680px)

- WHEN on expanded displays
- THEN navigation remains centered with adjusted padding, ensuring the apple-inspired layout feels deliberate and not stretched.
