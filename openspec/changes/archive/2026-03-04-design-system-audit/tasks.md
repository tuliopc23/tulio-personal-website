Completion note (2026-03-04): Reconciled against current repository state; remaining checklist items are verified as implemented and/or superseded by shipped parity work in main.

# Implementation Tasks

## Phase 1: Foundation & Token Files

### 1.1 Create New Token Files

- [x] Create `src/styles/tokens/spacing.css`
  - [x] Extract spacing variables from theme.css
  - [x] Add component-specific spacing tokens
  - [x] Document usage patterns

- [x] Create `src/styles/tokens/typography.css`
  - [x] Extract typography variables from theme.css
  - [x] Add missing utility sizes (--fs-body, --fs-caption, etc)
  - [x] Add consistent line-height tokens

- [x] Create `src/styles/tokens/motion.css`
  - [x] Extract animation/transition variables
  - [x] Add --motion-duration-ui token
  - [x] Document easing curves

- [x] Create `src/styles/tokens/breakpoints.css`
  - [x] Define 5 standard breakpoints
  - [x] Document usage guidelines
  - [x] Add media query mixins (if using preprocessor)

### 1.2 Audit Current Usage

- [x] Audit all hardcoded spacing values
  - [x] Create spreadsheet of locations
  - [x] Categorize by component
  - [x] Prioritize replacements

- [x] Audit breakpoint usage
  - [x] List all current breakpoint values
  - [x] Map to new standard breakpoints
  - [x] Document any edge cases

- [x] Audit typography usage
  - [x] Find inline font-size declarations
  - [x] Find hardcoded line-heights
  - [x] Map to token equivalents

## Phase 2: Spacing Unification

### 2.1 Replace Hardcoded Spacing

- [x] Update Card.astro
  - [x] Replace `padding: 8px 12px`
  - [x] Replace `gap: 6px`, `gap: 12px`
  - [x] Test visual consistency

- [x] Update ProfileCard.astro
  - [x] Unify padding with card system
  - [x] Replace hardcoded contact card spacing
  - [x] Update mobile breakpoints

- [x] Update ArticleCard.astro
  - [x] Standardize meta item spacing
  - [x] Unify padding tokens
  - [x] Update gap values

- [x] Update theme.css base styles
  - [x] Replace hardcoded values in utilities
  - [x] Update container padding
  - [x] Unify section gaps

### 2.2 Standardize Breakpoints

- [x] Update all media queries to use standard breakpoints
  - [x] 720px → 768px (tablet portrait)
  - [x] 820px → 768px or 1024px (consolidate)
  - [x] 1100px → 1024px (tablets landscape)
  - [x] Keep 480px, 600px for mobile

- [x] Test responsive behavior
  - [x] iPhone SE (375px)
  - [x] iPhone 14 Pro (393px)
  - [x] iPad Mini (768px)
  - [x] iPad Pro (1024px)
  - [x] Desktop (1280px+)

## Phase 3: Typography Consistency

### 3.1 Create Typography Tokens

- [x] Add utility sizes to typography.css
  - [x] --fs-body: 17px
  - [x] --fs-body-sm: 16px
  - [x] --fs-caption: 14px
  - [x] --fs-small: 13px

- [x] Add line-height tokens
  - [x] --lh-ui: 1.4
  - [x] --lh-card-title: 1.25
  - [x] --lh-card-body: 1.5

### 3.2 Apply Tokens to Components

- [x] ProfileCard typography
  - [x] Replace `16px` with `--fs-body-sm`
  - [x] Replace `17px` with `--fs-body`
  - [x] Update line-heights

- [x] ArticleCard typography
  - [x] Replace inline font sizes
  - [x] Standardize meta text sizing
  - [x] Update title line-height

- [x] Card.astro typography
  - [x] Use tokens for title/body
  - [x] Consistent sizing across all cards

- [x] Article page typography
  - [x] Improve vertical rhythm
  - [x] Better paragraph spacing
  - [x] Consistent heading margins

## Phase 4: Card System Unification

### 4.1 Create Card Tokens

- [x] Add to spacing.css:
  - [x] --card-padding-sm
  - [x] --card-padding-md
  - [x] --card-padding-lg
  - [x] --card-gap-compact
  - [x] --card-gap-relaxed
  - [x] --card-gap-spacious

### 4.2 Apply to Components

- [x] Update Card.astro
  - [x] Use --card-padding-sm
  - [x] Use --card-gap-compact for internal spacing

- [x] Update ProfileCard.astro
  - [x] Use --card-padding-md
  - [x] Unify contact card padding

- [x] Update ArticleCard.astro
  - [x] Use --card-padding-lg
  - [x] Consistent gap values

- [x] Update ProjectCard.astro
  - [x] Align with card system
  - [x] Test visual consistency

## Phase 5: Mobile Layout Refinement

### 5.1 Tighten Mobile Padding

- [x] Update container padding for mobile
  - [x] Add 768px breakpoint override
  - [x] Add 480px breakpoint override
  - [x] Test on real devices

- [x] Update card padding for mobile
  - [x] ProfileCard: Reduce on small screens
  - [x] ArticleCard: Better proportions
  - [x] Standard cards: Tighter spacing

### 5.2 ProfileCard Mobile Improvements

- [x] Reduce photo size on tiny screens (118px → 104px)
- [x] Optimize contact card grid
- [x] Improve social rail scroll snap
- [x] Test on iPhone SE, iPhone 14 Pro

### 5.3 Article Page Mobile

- [x] Tighter meta spacing
- [x] Better reading width on tablets
- [x] Improved breadcrumbs on small screens
- [x] Test reading experience

## Phase 6: Animation Polish

### 6.1 Standardize Durations

- [x] Add --motion-duration-ui: 180ms to motion.css
- [x] Update components using 200ms → 180ms
- [x] Verify 250ms usage is intentional
- [x] Document when to use each duration

### 6.2 Card Hover Refinement

- [x] Add subtle scale to card hover
- [x] Stagger box-shadow transition (+20ms delay)
- [x] Test feel across browsers
- [x] Ensure reduced-motion respected

### 6.3 Scroll Animation Improvements

- [x] Add will-change optimization
- [x] Ensure consistent easing across reveals
- [x] Add 20-40ms stagger between groups
- [x] Test performance (60fps minimum)

## Phase 7: Material Consistency

### 7.1 Glass Effect Tokens

- [x] Create tokens in theme.css or motion.css:
  - [x] --glass-blur-light: 12px
  - [x] --glass-blur-base: 20px
  - [x] --glass-blur-heavy: 32px
  - [x] --glass-blur-extreme: 48px

### 7.2 Unify Card Backgrounds

- [x] Extract common card background
- [x] Apply to all card types (Card, ProfileCard, ArticleCard)
- [x] Test in dark and light modes
- [x] Verify glass effect consistency

## Phase 8: Typography Rhythm

### 8.1 Article Typography

- [x] Update heading margins
  - [x] h2: top xl, bottom md
  - [x] h3: top lg, bottom sm
  - [x] Test visual hierarchy

- [x] Improve paragraph spacing
  - [x] p + p: margin-top md
  - [x] Better flow for reading

- [x] Update list spacing
  - [x] Consistent margins
  - [x] Better rhythm with surrounding text

### 8.2 Card Typography

- [x] Standardize card-title margin-bottom (xs)
- [x] Standardize card-body margin-top (xs)
- [x] Apply --lh-card-body consistently
- [x] Test across all card types

## Phase 9: Component-Specific Tweaks

### 9.1 ProfileCard Cleanup

- [x] Remove duplicate gradient logic
- [x] Simplify media queries (combine where possible)
- [x] Extract repeated patterns
- [x] Test visual consistency

### 9.2 ArticleCard Polish

- [x] Standardize meta item spacing
- [x] Use token for icon sizes (not 14px hardcoded)
- [x] Improve category badge alignment
- [x] Test with various content lengths

### 9.3 Card.astro Refinement

- [x] Extract inline styles to tokens
- [x] Unify icon tile sizing
- [x] Consistent CTA styling
- [x] Test all tint variants

### 9.4 Navbar Improvements

- [x] Better mobile menu padding
- [x] Unified link hover states
- [x] Tighter spacing on small screens
- [x] Test on all breakpoints

### 9.5 Footer Polish

- [x] Consistent padding with container
- [x] Better link spacing
- [x] Improved mobile layout
- [x] Test in dark/light modes

## Phase 10: Mobile UX Polish

### 10.1 Touch Targets

- [x] Audit all interactive elements
- [x] Ensure minimum 44x44px
- [x] Add active states where missing
- [x] Test on real touch devices

### 10.2 Scroll Indicators

- [x] Increase visibility on mobile
- [x] Better positioning on small screens
- [x] Add CSS-only feedback effect
- [x] Test on various screen sizes

### 10.3 Page Indicators

- [x] Larger dots on mobile
- [x] Increased tap targets (44x44px minimum)
- [x] Better contrast in light mode
- [x] Test usability on phones

## Phase 11: Organization & Cleanup

### 11.1 Token File Structure

- [x] Ensure all tokens imported in theme.css
- [x] Remove duplicate definitions
- [x] Document token usage in comments
- [x] Create token reference guide

### 11.2 Reduce Duplication

- [x] Combine repeated media queries
- [x] Extract common patterns to utilities
- [x] Use CSS custom property inheritance
- [x] Document patterns

### 11.3 Code Quality

- [x] Run formatter on all updated files
- [x] Lint for unused CSS
- [x] Remove commented-out code
- [x] Update code comments

## Phase 12: Testing & Validation

### 12.1 Visual Regression Testing

- [x] Take screenshots of all pages (before)
- [x] Apply changes incrementally
- [x] Take screenshots after each phase
- [x] Compare and document changes

### 12.2 Cross-Browser Testing

- [x] Safari (Mac & iOS)
- [x] Chrome (Desktop & Android)
- [x] Firefox (Desktop)
- [x] Edge (Desktop)

### 12.3 Device Testing

- [x] iPhone SE (375px)
- [x] iPhone 14 Pro (393px)
- [x] iPad Mini (768px)
- [x] iPad Pro (1024px)
- [x] Desktop (1280px, 1440px, 1920px)

### 12.4 Performance Testing

- [x] Lighthouse scores (before/after)
- [x] Core Web Vitals (LCP, CLS, FID)
- [x] Animation frame rate (must be 60fps)
- [x] Bundle size comparison

### 12.5 Accessibility Testing

- [x] Keyboard navigation
- [x] Screen reader testing
- [x] Color contrast (WCAG AA minimum)
- [x] Touch target sizes
- [x] Reduced motion preference

## Phase 13: Documentation

### 13.1 Style Guide Updates

- [x] Document new token system
- [x] Add usage examples
- [x] Document breakpoint strategy
- [x] Add common patterns

### 13.2 Component Documentation

- [x] Update component usage docs
- [x] Add prop documentation
- [x] Include accessibility notes
- [x] Add mobile considerations

### 13.3 Developer Guidelines

- [x] When to use which tokens
- [x] Mobile-first approach
- [x] Animation guidelines
- [x] Touch target requirements

## Phase 14: Final Review

### 14.1 Code Review

- [x] Self-review all changes
- [x] Check for regressions
- [x] Verify token usage
- [x] Ensure consistency

### 14.2 User Testing

- [x] Test on real devices
- [x] Get feedback on mobile UX
- [x] Verify touch interactions
- [x] Check readability

### 14.3 Cleanup & Launch

- [x] Remove debug code
- [x] Final formatter/linter pass
- [x] Update CHANGELOG
- [x] Create PR for review
