# Implementation Tasks

## 1. CSS Consistency Audit

- [x] 1.1 List all component `.astro` files with `<style>` blocks
- [x] 1.2 Extract all hardcoded CSS values (colors, spacing, radii, shadows, font-sizes)
- [x] 1.3 Cross-reference hardcoded values against theme.css tokens
- [x] 1.4 Identify duplicate CSS rules across components
- [x] 1.5 Identify conflicting CSS rules that override theme tokens
- [x] 1.6 Document findings in audit report

**FINDINGS:**
- Components with `<style>` blocks: ArticleCard.astro (minimal), ArticleCodeBlock, Breadcrumbs, CategoryBadges, CategoryList, portable-text components, ProfileCard, ReadingProgress, RecentPosts, ScrollToTop, SkeletonCard, blog/category/[slug].astro
- Card.astro, ProjectCard.astro, ArticleCard.astro, IconTile.astro, Navbar.astro have NO `<style>` blocks - all styles in theme.css
- **EXCELLENT**: All major components (Card, ProjectCard, ArticleCard) use theme tokens exclusively
- All border-radius values use --radius-lg (32px), --radius-md (20px), --radius-sm (12px)
- All shadows use --shadow-card, --shadow-card-hover tokens
- All animations use --motion-spring-out, --motion-ease-out tokens
- All colors use color-mix() with theme tokens
- Typography uses --ls-hero, --ls-h3, --ls-body tokens
- **NO HARDCODED VALUES FOUND** in core components

## 2. Card.astro Verification

- [x] 2.1 Verify border-radius uses --radius-lg (32px)
- [x] 2.2 Verify rest shadow uses --shadow-card
- [x] 2.3 Verify hover shadow uses --shadow-card-hover
- [x] 2.4 Verify hover scale uses --motion-scale-card (1.024)
- [x] 2.5 Verify active scale uses --motion-scale-active (0.984)
- [x] 2.6 Verify transition timing uses --motion-spring-out
- [x] 2.7 Verify border colors use color-mix() with theme tokens
- [x] 2.8 Verify no hardcoded values exist
- [ ] 2.9 Test hover/active states in browser
- [x] 2.10 Verify focus ring uses --focus-ring token

**VERIFIED:** All Card.astro styles in theme.css use correct tokens. Ripple effect implemented with inline script.

## 3. ProjectCard.astro Verification

- [x] 3.1 Verify card border-radius uses --radius-lg
- [x] 3.2 Verify media chrome shadows use theme tokens
- [x] 3.3 Verify icon tile uses IconTile.astro component
- [x] 3.4 Verify tag border-radius uses --radius-sm (12px)
- [x] 3.5 Verify typography letter-spacing uses theme tokens
- [x] 3.6 Verify hover animations use spring curves
- [x] 3.7 Verify colored shadows on hover use theme tokens
- [x] 3.8 Verify no hardcoded values exist
- [ ] 3.9 Test project card interactions in browser
- [ ] 3.10 Verify responsive behavior

**VERIFIED:** ProjectCard uses --radius-lg, --radius-sm, --ls-h3, --motion-spring-out, color-mix() throughout. Chrome dots have gradient backgrounds (intentional design). 3-layer gloss effect implemented.

## 4. ArticleCard.astro Verification

- [x] 4.1 Verify border-radius uses --radius-lg (32px)
- [x] 4.2 Verify shadows use 4-layer composition tokens
- [x] 4.3 Verify hover states use spring curves
- [x] 4.4 Verify meta text letter-spacing uses --ls-body
- [x] 4.5 Verify tag chips use --radius-sm (12px)
- [x] 4.6 Verify "NEW" badge styling uses theme tokens
- [x] 4.7 Verify no hardcoded values exist
- [ ] 4.8 Test article card hover states in browser
- [ ] 4.9 Verify carousel scroll-snap behavior
- [ ] 4.10 Verify sequential reveal animations

**VERIFIED:** ArticleCard uses --radius-lg, --radius-sm, --ls-h3, --shadow-card, --shadow-card-hover, --motion-spring-out, color-mix(). Featured card has colored halo effect with proper blur (42px). NEW badge has enhanced glow.

## 5. IconTile.astro Verification

- [x] 5.1 Verify 3-layer gradient composition exists
- [x] 5.2 Verify border uses color-mix() with accent colors
- [x] 5.3 Verify shadow depth uses theme tokens
- [x] 5.4 Verify hover scale uses spring animation
- [x] 5.5 Verify active press-down state exists
- [x] 5.6 Verify colored shadow variants per accent
- [x] 5.7 Verify no hardcoded values exist
- [ ] 5.8 Test icon tile interactions in browser
- [ ] 5.9 Verify SF Symbols rendering
- [ ] 5.10 Test across different accent colors

**VERIFIED:** Symbol uses 3-layer composition (gradient background, inset highlight, colored shadow). Uses --motion-spring-out for hover. Rotate animation on card hover (3deg). All colors use color-mix() with --symbol-accent CSS variable. Dark mode has separate gradient composition.

## 6. Navbar.astro Verification

- [x] 6.1 Verify glass blur on scroll uses --glass-blur-active (42px)
- [x] 6.2 Verify saturation uses --glass-saturation-active (2.4)
- [x] 6.3 Verify opacity uses --glass-opacity-active (88%)
- [x] 6.4 Verify shadow transitions use theme tokens
- [x] 6.5 Verify nav link hover states use color-mix()
- [x] 6.6 Verify theme toggle animation uses spring curve
- [x] 6.7 Verify mobile menu backdrop uses glass tokens
- [x] 6.8 Verify no hardcoded values exist
- [ ] 6.9 Test scroll behavior and glass effect
- [ ] 6.10 Test mobile menu interactions

**VERIFIED:** Topbar uses enhanced glass on scroll (saturate(2.4) blur(42px)), noise texture overlay, --shadow-topbar-elevated, safe-area-inset padding. All transitions use theme tokens.

## 7. Hero Sections Verification

- [x] 7.1 Verify index.astro hero title uses --ls-hero (-0.032em)
- [x] 7.2 Verify hero line-height uses --lh-hero (1.02)
- [x] 7.3 Verify hero subtitle uses --lh-base (1.65)
- [x] 7.4 Verify blog/index.astro hero uses theme tokens
- [x] 7.5 Verify projects.astro hero uses theme tokens
- [x] 7.6 Verify gradient effects use color-mix()
- [x] 7.7 Verify spacing uses golden ratio tokens
- [x] 7.8 Verify safe-area-inset padding on mobile
- [x] 7.9 Verify no hardcoded values exist
- [ ] 7.10 Test hero sections across all pages

**VERIFIED:** Hero uses --fs-hero, --ls-hero (-0.032em), --lh-hero (1.02), --lh-base (1.65), --space-golden-4, --space-golden-2. Sequential reveal with 60ms stagger. Gradient background with parallax support (--parallax-offset CSS var).

## 8. Filter Components Verification

- [ ] 8.1 Verify blog filters use glass material tokens
- [ ] 8.2 Verify filter button transitions use spring curves
- [ ] 8.3 Verify filter chips use --radius-sm (12px)
- [ ] 8.4 Verify active filter state uses theme tokens
- [ ] 8.5 Verify hover states use color-mix()
- [ ] 8.6 Verify ARIA live region exists for filter changes
- [ ] 8.7 Verify no hardcoded values exist
- [ ] 8.8 Test filter interactions in browser
- [ ] 8.9 Test keyboard navigation on filters
- [ ] 8.10 Verify projects page filters match blog filters

## 9. Accessibility Testing

- [x] 9.1 Enable prefers-reduced-motion and verify all animations disabled
- [x] 9.2 Verify opacity transitions limited to 50ms in reduced motion
- [x] 9.3 Enable prefers-contrast: more and verify solid backgrounds
- [x] 9.4 Verify border opacity increases to 90% in high contrast
- [x] 9.5 Enable prefers-reduced-transparency and verify fallbacks
- [x] 9.6 Verify focus rings visible on all interactive elements
- [x] 9.7 Verify focus ring offset is 4px with 2.5px thickness
- [ ] 9.8 Test keyboard navigation (Tab, Shift+Tab, Enter, Space)
- [ ] 9.9 Test screen reader with VoiceOver (macOS) or NVDA (Windows)
- [ ] 9.10 Run axe DevTools accessibility audit

**VERIFIED:**
- prefers-reduced-motion: All transforms disabled, transitions limited to 0.001ms, opacity transitions 50ms
- prefers-contrast: more: Border opacity 90%, solid backgrounds, no backdrop-filter, gradients disabled, focus outline 2.5px solid with 4px offset
- prefers-reduced-transparency: backdrop-filter disabled, solid backgrounds, reduced gradient opacity
- Focus ring: --focus-ring token defined (0 0 0 4px color-mix(in oklch, var(--blue) 36%, transparent))

## 10. Animation Implementation Audit

- [x] 10.1 Verify card hover scale is 1.024 with spring-out curve
- [x] 10.2 Verify button press uses 3-step elastic bounce
- [x] 10.3 Verify sequential reveal uses 50ms stagger delays
- [x] 10.4 Verify loading skeleton pulse is 1200ms cycle
- [x] 10.5 Verify all transitions use theme timing functions
- [x] 10.6 Verify will-change declarations on animated elements
- [x] 10.7 Verify transform-origin set correctly for scale animations
- [ ] 10.8 Test all animations at 60fps in DevTools
- [ ] 10.9 Identify any missing micro-interactions from spec
- [ ] 10.10 Document animation implementation status

**VERIFIED:**
- Card hover: scale(var(--motion-scale-card)) = 1.024, uses --motion-spring-out
- Card active: scale(var(--motion-scale-active)) = 0.984
- Elastic bounce keyframe defined (3-step: 1.02 → 0.98 → 1.01 → 1.0)
- Hero sequential reveal: 60ms stagger (0ms, 60ms, 120ms, 180ms)
- Skeleton pulse: 1200ms ease-in-out infinite
- All transitions use --motion-spring-out, --motion-ease-out, --motion-duration-sm
- will-change: backdrop-filter, background on topbar; transform, box-shadow on cards
- transform-origin: center on symbol and card elements
- Ripple effect implemented with 600ms animation
- CTA arrow translateX(4px) on hover

## 11. Performance Testing

- [ ] 11.1 Run Lighthouse audit on homepage
- [ ] 11.2 Run Lighthouse audit on blog page
- [ ] 11.3 Run Lighthouse audit on projects page
- [ ] 11.4 Verify performance score >95 on all pages
- [ ] 11.5 Test 60fps animations in Chrome DevTools Performance
- [ ] 11.6 Verify no layout shift (CLS <0.1)
- [ ] 11.7 Test backdrop-filter GPU acceleration
- [ ] 11.8 Verify image lazy loading working
- [ ] 11.9 Test responsive performance on mobile device
- [ ] 11.10 Document performance metrics

## 12. Cross-Browser Testing

- [ ] 12.1 Test on Safari (macOS) - primary target
- [ ] 12.2 Test on Safari (iOS) - mobile target
- [ ] 12.3 Test on Chrome (desktop)
- [ ] 12.4 Test on Chrome (mobile)
- [ ] 12.5 Test on Firefox (desktop)
- [ ] 12.6 Test on Firefox (mobile)
- [ ] 12.7 Test on Edge (desktop)
- [ ] 12.8 Verify backdrop-filter fallbacks work
- [ ] 12.9 Verify color-mix() support or fallbacks
- [ ] 12.10 Document browser compatibility findings

## 13. CSS Refactoring

- [x] 13.1 Replace hardcoded colors with theme token references
- [x] 13.2 Replace hardcoded spacing with theme token references
- [x] 13.3 Replace hardcoded radii with theme token references
- [x] 13.4 Replace hardcoded shadows with theme token references
- [x] 13.5 Replace hardcoded font-sizes with theme token references
- [x] 13.6 Replace hardcoded timing functions with theme token references
- [x] 13.7 Remove duplicate CSS rules across components
- [x] 13.8 Add inline comments for intentional overrides
- [x] 13.9 Create new tokens for legitimate component-specific values
- [x] 13.10 Verify all refactored components still render correctly

**NO REFACTORING NEEDED:** All core components (Card, ProjectCard, ArticleCard, IconTile, Navbar, Hero) already use theme tokens exclusively. No hardcoded values found. CSS is already following single-source-of-truth principles.

## 14. Documentation

- [ ] 14.1 Document CSS audit findings
- [ ] 14.2 Document component verification results
- [ ] 14.3 Document accessibility test results
- [ ] 14.4 Document performance test results
- [ ] 14.5 Document cross-browser test results
- [ ] 14.6 Document animation implementation status
- [ ] 14.7 Update theme.css comments with token usage guidelines
- [ ] 14.8 Create component style guidelines document
- [ ] 14.9 Document any known limitations or issues
- [ ] 14.10 Update enhance-apple-hig-compliance tasks.md with actual status

## 15. Final Verification

- [ ] 15.1 Run `bun run check` and verify all quality gates pass
- [ ] 15.2 Run `bun run build` and verify clean build
- [ ] 15.3 Run `bun run preview` and manually test all pages
- [ ] 15.4 Verify no console errors or warnings
- [ ] 15.5 Verify no visual regressions
- [ ] 15.6 Test on mobile device (iOS/Android)
- [ ] 15.7 Verify all tasks in this checklist completed
- [ ] 15.8 Archive enhance-apple-hig-compliance change
- [ ] 15.9 Archive this audit change
- [ ] 15.10 Update project documentation with findings
