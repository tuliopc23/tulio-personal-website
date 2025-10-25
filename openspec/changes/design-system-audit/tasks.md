# Implementation Tasks

## Phase 1: Foundation & Token Files

### 1.1 Create New Token Files
- [ ] Create `src/styles/tokens/spacing.css`
  - [ ] Extract spacing variables from theme.css
  - [ ] Add component-specific spacing tokens
  - [ ] Document usage patterns

- [ ] Create `src/styles/tokens/typography.css`
  - [ ] Extract typography variables from theme.css
  - [ ] Add missing utility sizes (--fs-body, --fs-caption, etc)
  - [ ] Add consistent line-height tokens

- [ ] Create `src/styles/tokens/motion.css`
  - [ ] Extract animation/transition variables
  - [ ] Add --motion-duration-ui token
  - [ ] Document easing curves

- [ ] Create `src/styles/tokens/breakpoints.css`
  - [ ] Define 5 standard breakpoints
  - [ ] Document usage guidelines
  - [ ] Add media query mixins (if using preprocessor)

### 1.2 Audit Current Usage
- [ ] Audit all hardcoded spacing values
  - [ ] Create spreadsheet of locations
  - [ ] Categorize by component
  - [ ] Prioritize replacements

- [ ] Audit breakpoint usage
  - [ ] List all current breakpoint values
  - [ ] Map to new standard breakpoints
  - [ ] Document any edge cases

- [ ] Audit typography usage
  - [ ] Find inline font-size declarations
  - [ ] Find hardcoded line-heights
  - [ ] Map to token equivalents

## Phase 2: Spacing Unification

### 2.1 Replace Hardcoded Spacing
- [ ] Update Card.astro
  - [ ] Replace `padding: 8px 12px`
  - [ ] Replace `gap: 6px`, `gap: 12px`
  - [ ] Test visual consistency

- [ ] Update ProfileCard.astro
  - [ ] Unify padding with card system
  - [ ] Replace hardcoded contact card spacing
  - [ ] Update mobile breakpoints

- [ ] Update ArticleCard.astro
  - [ ] Standardize meta item spacing
  - [ ] Unify padding tokens
  - [ ] Update gap values

- [ ] Update theme.css base styles
  - [ ] Replace hardcoded values in utilities
  - [ ] Update container padding
  - [ ] Unify section gaps

### 2.2 Standardize Breakpoints
- [ ] Update all media queries to use standard breakpoints
  - [ ] 720px → 768px (tablet portrait)
  - [ ] 820px → 768px or 1024px (consolidate)
  - [ ] 1100px → 1024px (tablets landscape)
  - [ ] Keep 480px, 600px for mobile

- [ ] Test responsive behavior
  - [ ] iPhone SE (375px)
  - [ ] iPhone 14 Pro (393px)
  - [ ] iPad Mini (768px)
  - [ ] iPad Pro (1024px)
  - [ ] Desktop (1280px+)

## Phase 3: Typography Consistency

### 3.1 Create Typography Tokens
- [ ] Add utility sizes to typography.css
  - [ ] --fs-body: 17px
  - [ ] --fs-body-sm: 16px
  - [ ] --fs-caption: 14px
  - [ ] --fs-small: 13px

- [ ] Add line-height tokens
  - [ ] --lh-ui: 1.4
  - [ ] --lh-card-title: 1.25
  - [ ] --lh-card-body: 1.5

### 3.2 Apply Tokens to Components
- [ ] ProfileCard typography
  - [ ] Replace `16px` with `--fs-body-sm`
  - [ ] Replace `17px` with `--fs-body`
  - [ ] Update line-heights

- [ ] ArticleCard typography
  - [ ] Replace inline font sizes
  - [ ] Standardize meta text sizing
  - [ ] Update title line-height

- [ ] Card.astro typography
  - [ ] Use tokens for title/body
  - [ ] Consistent sizing across all cards

- [ ] Article page typography
  - [ ] Improve vertical rhythm
  - [ ] Better paragraph spacing
  - [ ] Consistent heading margins

## Phase 4: Card System Unification

### 4.1 Create Card Tokens
- [ ] Add to spacing.css:
  - [ ] --card-padding-sm
  - [ ] --card-padding-md
  - [ ] --card-padding-lg
  - [ ] --card-gap-compact
  - [ ] --card-gap-relaxed
  - [ ] --card-gap-spacious

### 4.2 Apply to Components
- [ ] Update Card.astro
  - [ ] Use --card-padding-sm
  - [ ] Use --card-gap-compact for internal spacing

- [ ] Update ProfileCard.astro
  - [ ] Use --card-padding-md
  - [ ] Unify contact card padding

- [ ] Update ArticleCard.astro
  - [ ] Use --card-padding-lg
  - [ ] Consistent gap values

- [ ] Update ProjectCard.astro
  - [ ] Align with card system
  - [ ] Test visual consistency

## Phase 5: Mobile Layout Refinement

### 5.1 Tighten Mobile Padding
- [ ] Update container padding for mobile
  - [ ] Add 768px breakpoint override
  - [ ] Add 480px breakpoint override
  - [ ] Test on real devices

- [ ] Update card padding for mobile
  - [ ] ProfileCard: Reduce on small screens
  - [ ] ArticleCard: Better proportions
  - [ ] Standard cards: Tighter spacing

### 5.2 ProfileCard Mobile Improvements
- [ ] Reduce photo size on tiny screens (118px → 104px)
- [ ] Optimize contact card grid
- [ ] Improve social rail scroll snap
- [ ] Test on iPhone SE, iPhone 14 Pro

### 5.3 Article Page Mobile
- [ ] Tighter meta spacing
- [ ] Better reading width on tablets
- [ ] Improved breadcrumbs on small screens
- [ ] Test reading experience

## Phase 6: Animation Polish

### 6.1 Standardize Durations
- [ ] Add --motion-duration-ui: 180ms to motion.css
- [ ] Update components using 200ms → 180ms
- [ ] Verify 250ms usage is intentional
- [ ] Document when to use each duration

### 6.2 Card Hover Refinement
- [ ] Add subtle scale to card hover
- [ ] Stagger box-shadow transition (+20ms delay)
- [ ] Test feel across browsers
- [ ] Ensure reduced-motion respected

### 6.3 Scroll Animation Improvements
- [ ] Add will-change optimization
- [ ] Ensure consistent easing across reveals
- [ ] Add 20-40ms stagger between groups
- [ ] Test performance (60fps minimum)

## Phase 7: Material Consistency

### 7.1 Glass Effect Tokens
- [ ] Create tokens in theme.css or motion.css:
  - [ ] --glass-blur-light: 12px
  - [ ] --glass-blur-base: 20px
  - [ ] --glass-blur-heavy: 32px
  - [ ] --glass-blur-extreme: 48px

### 7.2 Unify Card Backgrounds
- [ ] Extract common card background
- [ ] Apply to all card types (Card, ProfileCard, ArticleCard)
- [ ] Test in dark and light modes
- [ ] Verify glass effect consistency

## Phase 8: Typography Rhythm

### 8.1 Article Typography
- [ ] Update heading margins
  - [ ] h2: top xl, bottom md
  - [ ] h3: top lg, bottom sm
  - [ ] Test visual hierarchy

- [ ] Improve paragraph spacing
  - [ ] p + p: margin-top md
  - [ ] Better flow for reading

- [ ] Update list spacing
  - [ ] Consistent margins
  - [ ] Better rhythm with surrounding text

### 8.2 Card Typography
- [ ] Standardize card-title margin-bottom (xs)
- [ ] Standardize card-body margin-top (xs)
- [ ] Apply --lh-card-body consistently
- [ ] Test across all card types

## Phase 9: Component-Specific Tweaks

### 9.1 ProfileCard Cleanup
- [ ] Remove duplicate gradient logic
- [ ] Simplify media queries (combine where possible)
- [ ] Extract repeated patterns
- [ ] Test visual consistency

### 9.2 ArticleCard Polish
- [ ] Standardize meta item spacing
- [ ] Use token for icon sizes (not 14px hardcoded)
- [ ] Improve category badge alignment
- [ ] Test with various content lengths

### 9.3 Card.astro Refinement
- [ ] Extract inline styles to tokens
- [ ] Unify icon tile sizing
- [ ] Consistent CTA styling
- [ ] Test all tint variants

### 9.4 Navbar Improvements
- [ ] Better mobile menu padding
- [ ] Unified link hover states
- [ ] Tighter spacing on small screens
- [ ] Test on all breakpoints

### 9.5 Footer Polish
- [ ] Consistent padding with container
- [ ] Better link spacing
- [ ] Improved mobile layout
- [ ] Test in dark/light modes

## Phase 10: Mobile UX Polish

### 10.1 Touch Targets
- [ ] Audit all interactive elements
- [ ] Ensure minimum 44x44px
- [ ] Add active states where missing
- [ ] Test on real touch devices

### 10.2 Scroll Indicators
- [ ] Increase visibility on mobile
- [ ] Better positioning on small screens
- [ ] Add CSS-only feedback effect
- [ ] Test on various screen sizes

### 10.3 Page Indicators
- [ ] Larger dots on mobile
- [ ] Increased tap targets (44x44px minimum)
- [ ] Better contrast in light mode
- [ ] Test usability on phones

## Phase 11: Organization & Cleanup

### 11.1 Token File Structure
- [ ] Ensure all tokens imported in theme.css
- [ ] Remove duplicate definitions
- [ ] Document token usage in comments
- [ ] Create token reference guide

### 11.2 Reduce Duplication
- [ ] Combine repeated media queries
- [ ] Extract common patterns to utilities
- [ ] Use CSS custom property inheritance
- [ ] Document patterns

### 11.3 Code Quality
- [ ] Run formatter on all updated files
- [ ] Lint for unused CSS
- [ ] Remove commented-out code
- [ ] Update code comments

## Phase 12: Testing & Validation

### 12.1 Visual Regression Testing
- [ ] Take screenshots of all pages (before)
- [ ] Apply changes incrementally
- [ ] Take screenshots after each phase
- [ ] Compare and document changes

### 12.2 Cross-Browser Testing
- [ ] Safari (Mac & iOS)
- [ ] Chrome (Desktop & Android)
- [ ] Firefox (Desktop)
- [ ] Edge (Desktop)

### 12.3 Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 14 Pro (393px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px, 1440px, 1920px)

### 12.4 Performance Testing
- [ ] Lighthouse scores (before/after)
- [ ] Core Web Vitals (LCP, CLS, FID)
- [ ] Animation frame rate (must be 60fps)
- [ ] Bundle size comparison

### 12.5 Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast (WCAG AA minimum)
- [ ] Touch target sizes
- [ ] Reduced motion preference

## Phase 13: Documentation

### 13.1 Style Guide Updates
- [ ] Document new token system
- [ ] Add usage examples
- [ ] Document breakpoint strategy
- [ ] Add common patterns

### 13.2 Component Documentation
- [ ] Update component usage docs
- [ ] Add prop documentation
- [ ] Include accessibility notes
- [ ] Add mobile considerations

### 13.3 Developer Guidelines
- [ ] When to use which tokens
- [ ] Mobile-first approach
- [ ] Animation guidelines
- [ ] Touch target requirements

## Phase 14: Final Review

### 14.1 Code Review
- [ ] Self-review all changes
- [ ] Check for regressions
- [ ] Verify token usage
- [ ] Ensure consistency

### 14.2 User Testing
- [ ] Test on real devices
- [ ] Get feedback on mobile UX
- [ ] Verify touch interactions
- [ ] Check readability

### 14.3 Cleanup & Launch
- [ ] Remove debug code
- [ ] Final formatter/linter pass
- [ ] Update CHANGELOG
- [ ] Create PR for review
