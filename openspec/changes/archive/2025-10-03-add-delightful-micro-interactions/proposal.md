## Why

After dialing in the layout and typography, the surface still feels deliberately static. Apple’s current design language leans on ultra-subtle but present micro-interactions—micro-elevations, icon magnification, and time-aligned motion cues that deliver premium feedback. Applying those in a controlled way (respecting reduced-motion settings) will make the experience feel more alive without drifting from the editorial tone.

## What Changes

- Card & tile animation
  - Introduce restrained elevation / scale transitions on cards and icon tiles (e.g., 1.01–1.02 scale, shadow shift) aligned with Apple’s latest easing.
  - Add soft highlight pulses on featured cards with delay staggering.
- Iconography
  - Magnify navigation and sidebar icons slightly on hover/focus; provide complementary background glow/elevation.
  - Ensure icon transitions feel springy but brief (≤180ms) and fall back gracefully on hoverless devices.
- Buttons & CTAs
  - Add depth cues (shadow/pop) and icon slide interactions on primary CTAs, aligning durations with card motion.
- Navigation & hero
  - Update topbar link underline animation to the new Apple tab treatment (swifter, slight overshoot).
  - Animate hero gradients and breadcrumbs on page load for a subtle reveal.
- Accessibility & preferences
  - Respect `prefers-reduced-motion` by disabling non-essential transforms and falling back to static shadow changes.
  - Keep focus-visible states readable and avoid motion-only feedback.

## Impact

- Affected specs: `visual-style`
- Affected files: `src/styles/theme.css`, components using card/icon/button interactions (`Card.astro`, `CategoryList.astro`, `ProfileCard.astro`, `RecentPosts.astro`, `ScrollToTop.astro`, etc.).
