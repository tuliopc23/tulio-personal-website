# Visual Design Implementation Guide

## Overview

This guide provides pixel-perfect specifications for implementing Apple HIG compliance based on the unified CSS file (`apple-hig-liquid-glass-unified.css`). All values are derived from official Apple design tokens and macOS Tahoe 26 / iOS 26 specifications.

---

## 1. Font System

### Font Face Declarations

```css
/* SF Pro Display - Variable Font for headings */
@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SF Pro/SF Pro.woff2') format('woff2'),
       url('/fonts/SF Pro/SF Pro.woff') format('woff');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* SF Pro Text - Variable Font for body text */
@font-face {
  font-family: 'SF Pro Text';
  src: url('/fonts/SF Pro Text/SF Pro Text.woff2') format('woff2'),
       url('/fonts/SF Pro Text/SF Pro Text.woff') format('woff');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* SF Mono - Variable Font for code */
@font-face {
  font-family: 'SF Mono';
  src: url('/fonts/SF Mono Medium/SF Mono Medium.woff2') format('woff2'),
       url('/fonts/SF Mono Medium/SF Mono Medium.woff') format('woff');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

### CDN Fallbacks

```css
/* Fallback imports if local fonts fail */
@import url('https://v1.fontapi.ir/css/SFProDisplay');
@import url('https://v1.fontapi.ir/css/SFUIDisplay');
@import url('https://v1.fontapi.ir/css/SFUIText');
@import url('https://v1.fontapi.ir/css/SFMono');
```

### Font Stacks

```css
--primitive-font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif;
--primitive-font-rounded: "SF Pro Rounded", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--primitive-font-mono: "SF Mono", ui-monospace, Menlo, Monaco, "Cascadia Code", monospace;
```

---

## 2. Typography Scale

### Primitive Font Sizes (Apple HIG Standard)

```css
--primitive-text-11: 11px;   /* Caption 2 */
--primitive-text-12: 12px;   /* Caption 1 */
--primitive-text-13: 13px;   /* Footnote */
--primitive-text-15: 15px;   /* Subhead, Body */
--primitive-text-16: 16px;   /* Callout */
--primitive-text-17: 17px;   /* Headline */
--primitive-text-20: 20px;   /* Title 3 */
--primitive-text-22: 22px;   /* Title 2 */
--primitive-text-28: 28px;   /* Title 1 */
--primitive-text-34: 34px;   /* Large Title */
```

### Line Heights

```css
--primitive-leading-13: 13px;
--primitive-leading-16: 16px;
--primitive-leading-18: 18px;
--primitive-leading-20: 20px;
--primitive-leading-21: 21px;
--primitive-leading-22: 22px;
--primitive-leading-25: 25px;
--primitive-leading-28: 28px;
--primitive-leading-34: 34px;
--primitive-leading-40: 40px;
```

### Letter Spacing

```css
--primitive-tracking-tight: -0.41px;   /* For large text */
--primitive-tracking-normal: 0px;      /* For body text */
--primitive-tracking-wide: 0.07px;     /* For small text */
```

### Font Weights

```css
--primitive-weight-regular: 400;
--primitive-weight-medium: 500;
--primitive-weight-semibold: 600;
--primitive-weight-bold: 700;
```

### Semantic Typography Mapping

```css
/* Headings */
h1: 34px / 40px / -0.41px / 700
h2: 28px / 34px / -0.41px / 700
h3: 22px / 28px / -0.41px / 600
h4: 20px / 25px / 0px / 600
h5: 17px / 22px / 0px / 600
h6: 15px / 20px / 0px / 600

/* Body */
p: 15px / 20px / -0.41px / 400
```

---

## 3. Spacing System (8px Grid)

### Primitive Spacing

```css
--primitive-space-0: 0px;
--primitive-space-1: 8px;    /* Base unit */
--primitive-space-2: 16px;   /* 2x */
--primitive-space-3: 24px;   /* 3x */
--primitive-space-4: 32px;   /* 4x */
--primitive-space-5: 40px;   /* 5x */
--primitive-space-6: 48px;   /* 6x */
--primitive-space-8: 64px;   /* 8x */
--primitive-space-10: 80px;  /* 10x */
--primitive-space-12: 96px;  /* 12x */
```

### Semantic Spacing

```css
--spacing-0: var(--primitive-space-0);
--spacing-1: var(--primitive-space-1);  /* 8px */
--spacing-2: var(--primitive-space-2);  /* 16px */
--spacing-3: var(--primitive-space-3);  /* 24px */
--spacing-4: var(--primitive-space-4);  /* 32px */
--spacing-5: var(--primitive-space-5);  /* 40px */
--spacing-6: var(--primitive-space-6);  /* 48px */
--spacing-8: var(--primitive-space-8);  /* 64px */
```

---

## 4. Border Radius System

### Primitive Radii

```css
--primitive-radius-4: 4px;
--primitive-radius-6: 6px;
--primitive-radius-10: 10px;
--primitive-radius-12: 12px;
--primitive-radius-16: 16px;
--primitive-radius-20: 20px;
--primitive-radius-28: 28px;   /* macOS Tahoe 26 standard */
--primitive-radius-full: 9999px;
```

### Semantic Radii

```css
--radius-xs: var(--primitive-radius-4);   /* Tags, badges */
--radius-sm: var(--primitive-radius-6);   /* Small buttons */
--radius-md: var(--primitive-radius-10);  /* Inputs, medium buttons */
--radius-lg: var(--primitive-radius-16);  /* Cards, panels */
--radius-xl: var(--primitive-radius-20);  /* Large cards */
--radius-2xl: var(--primitive-radius-28); /* Hero sections */
--radius-full: var(--primitive-radius-full);
```

---

## 5. Color System

### Light Mode Colors

```css
/* Backgrounds */
--color-background-primary: #ffffff;
--color-background-secondary: #f5f5f7;
--color-background-tertiary: #ffffff;
--color-background-elevated: #ffffff;

/* Text */
--color-text-primary: #1d1d1f;
--color-text-secondary: #8e8e93;
--color-text-tertiary: #aeaeb2;
--color-text-quaternary: #c7c7cc;
--color-text-on-accent: #ffffff;

/* Accent Colors */
--color-accent: #0071e3;
--color-accent-hover: #0077ed;
--color-accent-active: #006edb;

/* System Colors */
--color-blue: #0071e3;
--color-green: #34c759;
--color-orange: #ff9500;
--color-red: #ff3b30;
--color-purple: #af52de;
--color-yellow: #ffcc00;
--color-pink: #ff2d55;
--color-teal: #5ac8fa;
--color-indigo: #5856d6;

/* Borders & Dividers */
--color-border-primary: #d1d1d6;
--color-border-secondary: #e5e5ea;
--color-border-tertiary: #f5f5f7;
--color-divider: #e5e5ea;
--color-separator: rgba(60, 60, 67, 0.29);
--color-separator-opaque: #c6c6c8;

/* Fills */
--color-fill-primary: rgba(120, 120, 128, 0.2);
--color-fill-secondary: rgba(120, 120, 128, 0.16);
--color-fill-tertiary: rgba(118, 118, 128, 0.12);
--color-fill-quaternary: rgba(116, 116, 128, 0.08);

/* Shadows */
--color-shadow-light: rgba(0, 0, 0, 0.08);
--color-shadow-medium: rgba(0, 0, 0, 0.12);
--color-shadow-dark: rgba(0, 0, 0, 0.16);
```

### Dark Mode Colors

```css
@media (prefers-color-scheme: dark) {
  /* Backgrounds */
  --color-background-primary: #000000;
  --color-background-secondary: #1c1c1e;
  --color-background-tertiary: #2c2c2e;
  --color-background-elevated: #1c1c1e;

  /* Text */
  --color-text-primary: #f5f5f7;
  --color-text-secondary: #98989d;
  --color-text-tertiary: #7c7c80;
  --color-text-quaternary: #636366;

  /* Accent Colors */
  --color-accent: #0a84ff;
  --color-accent-hover: #409cff;
  --color-accent-active: #0077ed;

  /* System Colors */
  --color-blue: #0a84ff;
  --color-green: #32d74b;
  --color-orange: #ff9f0a;
  --color-red: #ff453a;
  --color-purple: #bf5af2;
  --color-yellow: #ffd60a;
  --color-pink: #ff375f;
  --color-teal: #64d2ff;
  --color-indigo: #5e5ce6;

  /* Borders & Dividers */
  --color-border-primary: #48484a;
  --color-border-secondary: #3a3a3c;
  --color-border-tertiary: #2c2c2e;
  --color-divider: #3a3a3c;
  --color-separator: rgba(84, 84, 88, 0.65);
  --color-separator-opaque: #38383a;

  /* Fills */
  --color-fill-primary: rgba(120, 120, 128, 0.36);
  --color-fill-secondary: rgba(120, 120, 128, 0.32);
  --color-fill-tertiary: rgba(118, 118, 128, 0.24);
  --color-fill-quaternary: rgba(116, 116, 128, 0.18);

  /* Shadows */
  --color-shadow-light: rgba(0, 0, 0, 0.3);
  --color-shadow-medium: rgba(0, 0, 0, 0.4);
  --color-shadow-dark: rgba(0, 0, 0, 0.5);
}
```

---

## 6. Liquid Glass Material System

### Glass Material Properties

```css
/* Glass Background & Stroke */
--color-glass-background: rgba(255, 255, 255, 0.72);  /* Light */
--color-glass-stroke: rgba(255, 255, 255, 0.18);
--glass-blur-amount: var(--primitive-blur-20);        /* 20px */
--glass-saturation: 180%;
--glass-texture-opacity: 0.03;

/* Dark Mode Glass */
@media (prefers-color-scheme: dark) {
  --color-glass-background: rgba(30, 30, 30, 0.7);
  --color-glass-stroke: rgba(255, 255, 255, 0.12);
  --glass-texture-opacity: 0.02;
}
```

### Glass Component

```css
.glass {
  position: relative;
  background: var(--color-glass-background);
  border: 1px solid var(--color-glass-stroke);
  backdrop-filter: saturate(var(--glass-saturation)) blur(var(--glass-blur-amount));
  -webkit-backdrop-filter: saturate(var(--glass-saturation)) blur(var(--glass-blur-amount));
}

/* Noise texture overlay */
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
  opacity: var(--glass-texture-opacity);
  pointer-events: none;
  border-radius: inherit;
  z-index: 1;
}

.glass > * {
  position: relative;
  z-index: 2;
}
```

### Browser Fallback

```css
@supports not (backdrop-filter: blur(10px)) {
  .glass {
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary);
  }

  .glass::before {
    display: none;
  }
}
```

---

## 7. Shadow System

### Shadow Tokens

```css
--shadow-xs: 0 1px 2px var(--color-shadow-light);
--shadow-sm: 0 1px 3px var(--color-shadow-light);
--shadow-md: 0 4px 6px var(--color-shadow-light);
--shadow-lg: 0 8px 16px var(--color-shadow-medium);
--shadow-xl: 0 12px 24px var(--color-shadow-medium);
--shadow-2xl: 0 24px 48px var(--color-shadow-dark);
```

### Multi-Layer Shadow Composition

```css
/* Card with 4-layer shadow */
.card {
  box-shadow:
    0 20px 48px var(--color-shadow-light),      /* Ambient */
    0 8px 16px var(--color-shadow-medium),      /* Direct */
    inset 0 1px 0 rgba(255, 255, 255, 0.12),   /* Highlight */
    0 0 0 1px rgba(255, 255, 255, 0.05);       /* Border */
}

/* Card hover state */
.card:hover {
  box-shadow:
    0 28px 56px rgba(0, 0, 0, 0.16),
    0 12px 24px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}
```

---

## 8. Animation System

### Duration Tokens

```css
--primitive-duration-instant: 100ms;
--primitive-duration-fast: 200ms;
--primitive-duration-normal: 300ms;
--primitive-duration-slow: 400ms;
--primitive-duration-slower: 600ms;
```

### Easing Curves

```css
--primitive-ease-in: cubic-bezier(0.4, 0, 1, 1);
--primitive-ease-out: cubic-bezier(0, 0, 0.2, 1);
--primitive-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--primitive-ease-spring: cubic-bezier(0.5, 1.5, 0.5, 1);  /* Spring bounce */
```

### Semantic Transitions

```css
--transition-fast: var(--primitive-duration-fast) var(--primitive-ease-out);
--transition-normal: var(--primitive-duration-normal) var(--primitive-ease-in-out);
--transition-slow: var(--primitive-duration-slow) var(--primitive-ease-out);
--transition-spring: var(--primitive-duration-slow) var(--primitive-ease-spring);
```

### Hover Animation Example

```css
.card {
  transition: transform var(--transition-spring), box-shadow var(--transition-normal);
}

.card:hover {
  transform: scale(1.024);
}

.card:active {
  transform: scale(0.984);
}
```

---

## 9. Accessibility

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast

```css
@media (prefers-contrast: high) {
  :root {
    --color-text-primary: #000000;
    --color-text-secondary: #000000;
    --color-accent: #0000ff;
    --color-border-primary: #000000;
    --glass-blur-amount: 0px;
    --color-glass-background: var(--color-background-secondary);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-text-primary: #ffffff;
      --color-text-secondary: #ffffff;
      --color-accent: #00ffff;
      --color-border-primary: #ffffff;
    }
  }
}
```

### Reduced Transparency

```css
@media (prefers-reduced-transparency) {
  :root {
    --glass-blur-amount: 0px;
    --color-glass-background: var(--color-background-secondary);
  }
}
```

### Focus States

```css
*:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## 10. Component Examples

### Button

```css
.button {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-callout);
  font-weight: var(--primitive-weight-semibold);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: var(--color-text-on-accent);
  border: none;
  cursor: pointer;
  transition: transform var(--transition-spring), box-shadow var(--transition-normal);
}

.button:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
}

.button:active {
  transform: scale(0.98);
}
```

### Card

```css
.card {
  background: var(--color-glass-background);
  backdrop-filter: saturate(var(--glass-saturation)) blur(var(--glass-blur-amount));
  border: 1px solid var(--color-glass-stroke);
  border-radius: var(--radius-lg);
  padding: var(--spacing-3);
  box-shadow:
    0 20px 48px var(--color-shadow-light),
    0 8px 16px var(--color-shadow-medium),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transition: transform var(--transition-spring), box-shadow var(--transition-normal);
}

.card:hover {
  transform: scale(1.024);
  box-shadow:
    0 28px 56px rgba(0, 0, 0, 0.16),
    0 12px 24px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
}
```

### Input

```css
.input {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-primary);
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}
```

---

## 11. Implementation Checklist

### Phase 1: Design Tokens (4-6 hours)
- [ ] Replace `src/styles/theme.css` with unified token system
- [ ] Add font-face declarations for SF Pro Display, SF Pro Text, SF Mono
- [ ] Add CDN fallbacks for font loading
- [ ] Implement 8px spacing grid
- [ ] Update border radius values to Tahoe 26 standards
- [ ] Migrate all colors to semantic tokens
- [ ] Add glass material variables
- [ ] Add animation tokens (duration, easing)
- [ ] Add shadow tokens

### Phase 2: Component Updates (8-12 hours)
- [ ] Update Card.astro with new radii, shadows, glass effects
- [ ] Update ProjectCard.astro with hover animations
- [ ] Update ArticleCard.astro with typography tokens
- [ ] Update IconTile.astro with 3-layer depth effects
- [ ] Update Navbar.astro with glass material
- [ ] Update Footer.astro with spacing tokens
- [ ] Update all buttons with spring animations
- [ ] Update all inputs with focus states

### Phase 3: Page Updates (4-6 hours)
- [ ] Update index.astro hero section with glass effects
- [ ] Update blog/index.astro (preserve layout, enhance styling)
- [ ] Update projects.astro with filter animations
- [ ] Update blog/[slug].astro with typography tokens
- [ ] Add reveal animations on page load
- [ ] Add scroll-linked parallax effects

### Phase 4: Accessibility (2-3 hours)
- [ ] Add reduced motion support
- [ ] Add high contrast support
- [ ] Add reduced transparency support
- [ ] Verify focus indicators on all interactive elements
- [ ] Test keyboard navigation
- [ ] Run WCAG contrast checks

### Phase 5: Testing & QA (3-4 hours)
- [ ] Test in Safari (primary browser for Apple HIG)
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test on iOS devices
- [ ] Test on Android devices
- [ ] Verify Lighthouse performance score >95
- [ ] Verify no layout shift or jank
- [ ] Verify 60fps animations

---

## 12. Migration Notes

### Breaking Changes
- None - all changes are design token refinements

### Non-Breaking Changes
- Design tokens updated to match Apple HIG exactly
- Animation curves enhanced with spring physics
- Shadow system expanded to 4-layer composition
- Glass materials enhanced with noise texture

### Preserved Elements
- Blog page layout structure (title left, featured right, carousel below)
- All component APIs remain unchanged
- All functionality remains identical
- Navigation structure unchanged

---

## 13. Success Metrics

- [ ] Visual parity with Apple's developer documentation
- [ ] Lighthouse performance >95
- [ ] WCAG 2.1 AA compliance
- [ ] 60fps animations on all interactions
- [ ] Zero layout shift (CLS = 0)
- [ ] Cross-browser compatibility verified
- [ ] Reduced motion support tested
- [ ] High contrast mode tested
- [ ] Keyboard navigation verified

---

## 14. Reference Links

- Apple HIG Typography: https://developer.apple.com/design/human-interface-guidelines/typography
- Apple HIG Color: https://developer.apple.com/design/human-interface-guidelines/color
- Apple HIG Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- Apple HIG Materials: https://developer.apple.com/design/human-interface-guidelines/materials
- SF Pro Font: https://developer.apple.com/fonts/
- Liquid Glass Documentation: https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass

---

**Version:** 2.0.0
**Date:** 2025-01-06
**Status:** Ready for Implementation
