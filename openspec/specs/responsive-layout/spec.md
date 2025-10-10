# responsive-layout Specification

## Purpose
TBD - created by archiving change optimize-mobile-responsive-ux. Update Purpose after archive.
## Requirements
### Requirement: Mobile Sidebar Navigation
The system SHALL provide an accessible off-canvas sidebar drawer on mobile devices.

#### Scenario: Open drawer on mobile
- **WHEN** user taps the sidebar toggle button on screens below 1024px
- **THEN** sidebar slides in from the left with spring animation (300ms)
- **AND** backdrop overlay appears with blur effect
- **AND** body scroll is locked

#### Scenario: Close drawer via backdrop
- **WHEN** user taps the backdrop overlay
- **THEN** sidebar slides out with spring animation
- **AND** backdrop fades out
- **AND** body scroll is restored

#### Scenario: Close drawer via Escape key
- **WHEN** user presses Escape key while drawer is open
- **THEN** drawer closes with animation
- **AND** focus returns to toggle button

#### Scenario: Filter sidebar in drawer
- **WHEN** user types in the filter input inside the drawer
- **THEN** sidebar links filter in real-time
- **AND** filter state persists between drawer open/close

### Requirement: Card Carousel Scroll Affordances
The system SHALL provide clear visual indicators for horizontal card scrolling.

#### Scenario: Show edge fade on scroll
- **WHEN** card carousel has content beyond viewport
- **THEN** left and/or right edge fades appear based on scroll position
- **AND** fade gradients match theme background color

#### Scenario: Scroll snap alignment
- **WHEN** user scrolls horizontally in card carousel on mobile
- **THEN** cards snap to alignment points
- **AND** scrolling feels smooth with momentum physics

#### Scenario: Keyboard navigation in carousel
- **WHEN** user focuses on a card and presses arrow keys
- **THEN** carousel scrolls to next/previous card
- **AND** focused card remains visible in viewport

#### Scenario: Scroll CTA on mobile
- **WHEN** mobile user views card carousel for first time
- **THEN** "Scroll for More →" hint appears on first card
- **AND** hint fades out after user interacts with carousel

### Requirement: Mobile Shadow Performance Optimization
The system SHALL use simplified shadow effects on mobile for performance.

#### Scenario: Apply mobile shadows below 1024px
- **WHEN** viewport width is less than 1024px
- **THEN** card shadows use 2-layer system instead of 4-layer
- **AND** blur radius reduces from 28px to 20px
- **AND** saturation reduces from 2.1 to 1.9

#### Scenario: Maintain visual hierarchy with simplified shadows
- **WHEN** mobile shadows are active
- **THEN** cards still show clear elevation differences
- **AND** hover states maintain perceptible depth changes

#### Scenario: Achieve 60fps scroll on mobile
- **WHEN** user scrolls on iPhone 12 or equivalent device
- **THEN** frame rate maintains consistent 60fps
- **AND** no janky or stuttering animation occurs

### Requirement: Touch Target Accessibility
The system SHALL provide touch targets meeting Apple HIG minimum size.

#### Scenario: Button touch targets
- **WHEN** user taps any button on mobile
- **THEN** tap target area is at least 44x44px
- **AND** button activation is reliable and predictable

#### Scenario: Link touch targets
- **WHEN** user taps any navigation link on mobile
- **THEN** tap target area is sufficient for reliable activation
- **AND** minimum 8px spacing exists between adjacent links

#### Scenario: Filter pill touch targets
- **WHEN** user taps category filter pills on mobile
- **THEN** pill height is at least 44px
- **AND** pills have adequate horizontal spacing

### Requirement: Responsive Layout Continuity
The system SHALL provide smooth layouts across all viewport sizes.

#### Scenario: Test at 320px width (iPhone SE)
- **WHEN** viewport is 320px wide
- **THEN** all content remains readable and accessible
- **AND** no horizontal overflow occurs
- **AND** touch targets remain adequately sized

#### Scenario: Test at 768px width (iPad portrait)
- **WHEN** viewport is 768px wide
- **THEN** layout adapts smoothly from mobile to tablet styles
- **AND** sidebar drawer still functions correctly
- **AND** card carousels display appropriate number of cards

#### Scenario: Test at 1024px width (iPad landscape)
- **WHEN** viewport is 1024px wide
- **THEN** sidebar transitions from drawer to persistent column
- **AND** card carousels transition to desktop grid
- **AND** shadow system switches to full 4-layer

#### Scenario: Handle orientation changes
- **WHEN** user rotates device from portrait to landscape
- **THEN** layout adapts smoothly without content reflow issues
- **AND** sidebar drawer state persists if appropriate for new width

### Requirement: Mobile Typography Optimization
The system SHALL provide optimized typography for mobile readability.

#### Scenario: Scale hero text on small screens
- **WHEN** viewport is 320px to 480px wide
- **THEN** hero title scales fluidly via clamp()
- **AND** text remains readable without being too large or small
- **AND** line-height prevents text from feeling cramped

#### Scenario: Maintain body text readability
- **WHEN** user views body text on any mobile device
- **THEN** font size is at least 16px to prevent zoom
- **AND** line-height provides comfortable reading rhythm
- **AND** text wrapping prevents orphans and widows

#### Scenario: Adjust letter-spacing on mobile
- **WHEN** viewport is below 720px
- **THEN** hero text letter-spacing tightens slightly for better fit
- **AND** tracking adjustments don't compromise readability

### Requirement: Scroll Indicator Component
The system SHALL provide a reusable scroll indicator for horizontal content.

#### Scenario: Show scroll indicator initially
- **WHEN** horizontal scrollable content first loads
- **THEN** arrow indicators appear at appropriate edges
- **AND** indicators fade in with smooth animation

#### Scenario: Hide scroll indicator after interaction
- **WHEN** user scrolls horizontally for the first time
- **THEN** arrow indicators fade out after 2 seconds
- **AND** indicators don't reappear for that session

#### Scenario: Respect reduced motion preference
- **WHEN** user has `prefers-reduced-motion: reduce` enabled
- **THEN** scroll indicators appear instantly without animation
- **AND** fade transitions are instant or omitted

#### Scenario: Announce scroll state to screen readers
- **WHEN** scroll position changes significantly
- **THEN** ARIA live region announces current position
- **AND** announcements are throttled to prevent spam

### Requirement: Mobile Safe Area Support
The system SHALL respect device safe area insets on notched devices.

#### Scenario: Handle notch safe areas
- **WHEN** site loads on iPhone with notch (iPhone X and newer)
- **THEN** navbar respects `safe-area-inset-top`
- **AND** content doesn't clip behind notch or home indicator

#### Scenario: Handle landscape safe areas
- **WHEN** device rotates to landscape on notched device
- **THEN** sidebar drawer respects `safe-area-inset-left`
- **AND** footer respects `safe-area-inset-bottom`

