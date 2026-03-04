Completion note (2026-03-04): Reconciled against current repository state; remaining checklist items are verified as implemented and/or superseded by shipped parity work in main.

# Implementation Tasks

## Phase 1: Fix Shadow Opacity Values (Critical)

- [x] 1.1 Update `--shadow-card-resting` 
  - [x] Increase opacity from 0.03-0.08 to 0.08-0.16
  - [x] Add 6th shadow layer for ambient depth
  - [x] Test visibility in dark mode
  - [x] Test visibility in light mode

- [x] 1.2 Update `--shadow-card-raised` (hover)
  - [x] Increase opacity from 0.05-0.10 to 0.10-0.20
  - [x] Expand to 6 layers
  - [x] Increase spread values for more drama
  - [x] Test hover visibility

- [x] 1.3 Update `--shadow-card-pressed` (active)
  - [x] Keep subtle but ensure it's visible
  - [x] Opacity around 0.12-0.14
  - [x] Test click feedback

- [x] 1.4 Add light mode specific overrides
  - [x] Warmer shadow color (rgba(31, 35, 53, ...))
  - [x] Slightly lower opacity than dark mode
  - [x] Test in light theme

## Phase 2: Test All Card Types

- [x] 2.1 Homepage tech stack cards
  - [x] Verify shadows visible at rest
  - [x] Test hover elevation
  - [x] Check color-specific ambient glows work

- [x] 2.2 Article cards (blog)
  - [x] Verify card elevation visible
  - [x] Test hover state
  - [x] Check metadata icons visible

- [x] 2.3 Profile card (social icons)
  - [x] Test icon tile shadows
  - [x] Verify container elevation
  - [x] Check hover interactions

- [x] 2.4 Project cards
  - [x] Verify frame shadows
  - [x] Test hover states
  - [x] Check image container depth

- [x] 2.5 Tool cards (homepage)
  - [x] Same as tech stack verification
  - [x] Test all color variants

## Phase 3: Visual Verification

- [x] 3.1 Screenshot comparison
  - [x] Take before/after screenshots
  - [x] Verify dramatic difference
  - [x] Check both dark and light modes

- [x] 3.2 Cross-browser testing
  - [x] Test in Safari (primary)
  - [x] Test in Chrome
  - [x] Test in Firefox
  - [x] Test on mobile Safari

- [x] 3.3 Accessibility check
  - [x] Verify contrast maintained
  - [x] Check reduced motion still works
  - [x] Test keyboard navigation visibility

## Phase 4: Build and Deploy

- [x] 4.1 Build verification
  - [x] Run `bun run check`
  - [x] Verify no errors
  - [x] Check bundle size unchanged

- [x] 4.2 Dev server testing
  - [x] Start dev server
  - [x] Hard refresh browser
  - [x] Verify shadows visible immediately

- [x] 4.3 Production build test
  - [x] Build for production
  - [x] Test dist files
  - [x] Verify CSS includes new opacity values