# Spec: Light/Dark Mode Complete Feature Parity

## Overview

Every visual feature, interaction state, color treatment, and decorative effect in light mode must have an equivalent dark mode implementation with appropriate adaptations for dark backgrounds.

## Requirements

### 1. Missing Dark Mode Selectors

**Requirement**: All light-mode-specific CSS selectors must have dark mode equivalents.

#### Scenario 1.1: Topbar Shadow (Light Mode Only)

**Current**:

```css
[data-theme="light"] .topbar {
  box-shadow: var(--shadow-topbar);
}
```

**Expected**: Dark mode should use darker, more pronounced shadow for depth

```css
[data-theme="dark"] .topbar {
  box-shadow: var(--shadow-topbar);
}
```

#### Scenario 1.2: Topbar Nav Mask Gradients (Light Mode Only)

**Current**:

```css
[data-theme="light"] .topbar__navMask::before {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--surface) 96%, transparent),
    rgba(255, 255, 255, 0)
  );
}

[data-theme="light"] .topbar__navMask::after {
  background: linear-gradient(
    270deg,
    color-mix(in srgb, var(--surface) 96%, transparent),
    rgba(255, 255, 255, 0)
  );
}
```

**Expected**: Dark mode should use dark gradients (not white)

```css
[data-theme="dark"] .topbar__navMask::before {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bg) 92%, transparent),
    rgba(0, 0, 0, 0)
  );
}

[data-theme="dark"] .topbar__navMask::after {
  background: linear-gradient(
    270deg,
    color-mix(in srgb, var(--bg) 92%, transparent),
    rgba(0, 0, 0, 0)
  );
}
```

#### Scenario 1.3: Blog Hero Halo Effect (Light Mode Only)

**Current**:

```css
[data-theme="light"] .blogHero__halo {
  opacity: 0.62;
  filter: blur(52px);
}
```

**Expected**: Dark mode needs higher opacity for visibility on dark bg

```css
[data-theme="dark"] .blogHero__halo {
  opacity: 0.75;
  filter: blur(56px);
}
```

#### Scenario 1.4: Article Card Halo Effect (Light Mode Only)

**Current**:

```css
[data-theme="light"] .articleCard__halo {
  opacity: 0.58;
  filter: blur(46px);
}
```

**Expected**: Dark mode needs adjusted opacity and blur

```css
[data-theme="dark"] .articleCard__halo {
  opacity: 0.72;
  filter: blur(50px);
}
```

### 2. Typography Contrast Verification

**Requirement**: All text must meet WCAG AA contrast ratios (4.5:1 for body, 3:1 for large text).

#### Scenario 2.1: Hero Subtitle Dark Mode

**Current**: Uses `var(--muted)` which is `rgba(235, 235, 245, 0.65)` - may be too low contrast

**Expected**: Verify contrast ratio, increase opacity if needed:

```css
[data-theme="dark"] .hero__subtitle {
  color: rgba(235, 235, 245, 0.78); /* Increased from 0.65 if needed */
}
```

#### Scenario 2.2: Blog Hero Title Dark Mode

**Current**: Uses gradient with `var(--text)` and indigo mix

**Expected**: Ensure gradient endpoints have sufficient contrast

### 3. CTA Blue Accent Rendering

**Requirement**: All CTAs must display vibrant blue (`#0a84ff`) in dark mode.

#### Scenario 3.1: Article Card CTA

**Current**: Has `!important` rules but may not be applying

**Expected**: Verify blue renders correctly, increase specificity if needed

### 4. Interactive State Parity

**Requirement**: All hover, focus, and active states must have equivalent feedback in both themes.

#### Scenario 4.1: All Hover States

**Expected**: Every `:hover` state in light mode has dark mode equivalent with adapted colors

#### Scenario 4.2: All Focus States

**Expected**: Focus rings and outlines visible in both themes

## Validation

- [ ] Visual inspection: All typography readable in both themes
- [ ] DevTools inspection: All blue CTAs render `#0a84ff` in dark mode
- [ ] DevTools inspection: Halo effects visible in both themes
- [ ] Contrast checker: All text meets WCAG AA minimum
- [ ] Build passes without CSS errors
