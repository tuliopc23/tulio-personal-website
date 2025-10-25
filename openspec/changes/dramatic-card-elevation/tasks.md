# Implementation Tasks

## Phase 1: Fix Shadow Opacity Values (Critical)

- [ ] 1.1 Update `--shadow-card-resting` 
  - [ ] Increase opacity from 0.03-0.08 to 0.08-0.16
  - [ ] Add 6th shadow layer for ambient depth
  - [ ] Test visibility in dark mode
  - [ ] Test visibility in light mode

- [ ] 1.2 Update `--shadow-card-raised` (hover)
  - [ ] Increase opacity from 0.05-0.10 to 0.10-0.20
  - [ ] Expand to 6 layers
  - [ ] Increase spread values for more drama
  - [ ] Test hover visibility

- [ ] 1.3 Update `--shadow-card-pressed` (active)
  - [ ] Keep subtle but ensure it's visible
  - [ ] Opacity around 0.12-0.14
  - [ ] Test click feedback

- [ ] 1.4 Add light mode specific overrides
  - [ ] Warmer shadow color (rgba(31, 35, 53, ...))
  - [ ] Slightly lower opacity than dark mode
  - [ ] Test in light theme

## Phase 2: Test All Card Types

- [ ] 2.1 Homepage tech stack cards
  - [ ] Verify shadows visible at rest
  - [ ] Test hover elevation
  - [ ] Check color-specific ambient glows work

- [ ] 2.2 Article cards (blog)
  - [ ] Verify card elevation visible
  - [ ] Test hover state
  - [ ] Check metadata icons visible

- [ ] 2.3 Profile card (social icons)
  - [ ] Test icon tile shadows
  - [ ] Verify container elevation
  - [ ] Check hover interactions

- [ ] 2.4 Project cards
  - [ ] Verify frame shadows
  - [ ] Test hover states
  - [ ] Check image container depth

- [ ] 2.5 Tool cards (homepage)
  - [ ] Same as tech stack verification
  - [ ] Test all color variants

## Phase 3: Visual Verification

- [ ] 3.1 Screenshot comparison
  - [ ] Take before/after screenshots
  - [ ] Verify dramatic difference
  - [ ] Check both dark and light modes

- [ ] 3.2 Cross-browser testing
  - [ ] Test in Safari (primary)
  - [ ] Test in Chrome
  - [ ] Test in Firefox
  - [ ] Test on mobile Safari

- [ ] 3.3 Accessibility check
  - [ ] Verify contrast maintained
  - [ ] Check reduced motion still works
  - [ ] Test keyboard navigation visibility

## Phase 4: Build and Deploy

- [ ] 4.1 Build verification
  - [ ] Run `bun run check`
  - [ ] Verify no errors
  - [ ] Check bundle size unchanged

- [ ] 4.2 Dev server testing
  - [ ] Start dev server
  - [ ] Hard refresh browser
  - [ ] Verify shadows visible immediately

- [ ] 4.3 Production build test
  - [ ] Build for production
  - [ ] Test dist files
  - [ ] Verify CSS includes new opacity values
