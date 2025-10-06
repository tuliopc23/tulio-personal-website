# Tasks: Ensure Complete Light/Dark Mode Feature Parity

## Phase 1: CSS Audit & Gap Analysis

- [ ] Extract all light mode color values and document
- [ ] Extract all dark mode color values and compare
- [ ] Document missing dark mode selectors (5 identified)
- [ ] Identify typography contrast issues
- [ ] Verify CTA blue accent rendering

## Phase 2: Implement Missing Dark Mode Features

### Missing Selectors

- [ ] Add `[data-theme="dark"] .topbar` shadow/styling variant
- [ ] Add `[data-theme="dark"] .topbar__navMask::before` gradient
- [ ] Add `[data-theme="dark"] .topbar__navMask::after` gradient
- [ ] Add `[data-theme="dark"] .blogHero__halo` glow effect
- [ ] Add `[data-theme="dark"] .articleCard__halo` glow effect

### Typography & Contrast

- [ ] Verify `.hero__subtitle` dark mode contrast
- [ ] Verify `.blogHero__title` dark mode visibility
- [ ] Verify `.blogHero__lede` dark mode contrast
- [ ] Ensure all body text has sufficient contrast

### Interactive Elements

- [ ] Verify `.card__cta` blue accents render in dark mode
- [ ] Verify `.projectCard__cta` blue accents render in dark mode
- [ ] Verify `.articleCard__cta` blue accents render in dark mode
- [ ] Check all hover states have proper color transitions
- [ ] Check all focus states are visible in dark mode

## Phase 3: CSS Quality & Specificity

- [ ] Review all `!important` declarations for necessity
- [ ] Ensure dark mode rules don't conflict with base styles
- [ ] Verify CSS cascade order is correct
- [ ] Check for any inline styles overriding theme rules

## Phase 4: Validation & Testing

- [ ] Run `npm run build` - ensure no CSS errors
- [ ] Run `npm run lint` - check for issues
- [ ] Run `npm run format` - verify formatting
- [ ] Visual test: Homepage hero subtitle visibility
- [ ] Visual test: Blog page title visibility
- [ ] Visual test: All "Read article" CTAs show blue in dark mode
- [ ] Visual test: Hover states work in both themes
- [ ] Visual test: Glow/halo effects render correctly
- [ ] Browser DevTools inspection: Verify computed styles

## Phase 5: Documentation

- [ ] Update CRITICAL-FINDINGS.md with resolution
- [ ] Document all color adaptations made
- [ ] Create before/after comparison (optional)
- [ ] Mark change as complete via `openspec archive`
