## MODIFIED Requirements

### Requirement: Interactive Feedback

- Maintain a consistent motion vocabulary that echoes modern Apple design cues while keeping interactions accessible.

#### Scenario: Card & Tile Hover Feedback

- WHEN a card, CTA, or icon tile receives hover/focus
- THEN it scales up subtly (≤1.02), elevates with intensified shadow, and may adjust background tint
- AND the transition does not exceed 180ms, uses Apple-aligned easing, and respects `prefers-reduced-motion`.

#### Scenario: Icon Magnification

- WHEN navigation or sidebar icons are hovered/focused
- THEN the icon magnifies and/or glows gently while text color shifts to an active state
- AND spacing prevents layout shift.

#### Scenario: Button & CTA Animation

- WHEN primary CTAs are hovered/focused
- THEN icons slide or fade subtly in sync with button elevation and background shift, without affecting layout stability
- AND active/focus states remain usable via keyboard.

#### Scenario: Reduced Motion Compliance

- WHEN `prefers-reduced-motion: reduce` is set
- THEN transforms and animated transitions are disabled in favor of immediate visual state changes.

#### Scenario: Hero & Breadcrumb Reveal

- WHEN a page loads
- THEN hero gradients/breadcrumbs may use a short, subtle opacity/translate reveal consistent with Apple design language
- AND animation is limited to 160ms and removed for reduced-motion users.
