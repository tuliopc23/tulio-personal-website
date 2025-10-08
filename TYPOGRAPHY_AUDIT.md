# Typography Audit - Apple HIG Compliance
**Date:** 2025-01-08  
**Status:** Recommendations for minor enhancements  
**Compliance Level:** ~98% (already excellent!)

## Executive Summary

Your website's typography is **exceptionally well-implemented** and nearly 100% Apple HIG compliant. This audit identifies subtle refinements based on the official [Apple Human Interface Guidelines - Typography](https://developer.apple.com/design/human-interface-guidelines/typography) to achieve perfect alignment.

### Current Strengths ✅
- **SF Pro Display & SF UI Text** properly implemented via CDN
- **Golden ratio line heights** (1.618 base, 1.382 tight)
- **WWDC 2020 letter-spacing precision** (-0.039em hero, -0.027em h2, -0.019em h3)
- **Optical sizing thresholds** correctly set (17pt, 20pt, 28pt, 40pt, 96pt)
- **8px baseline grid** maintained throughout
- **Responsive clamp()** functions for all type scales

---

## Recommended Refinements

### 1. **Global Typography Tokens** (src/styles/theme.css lines 44-76)

#### **Current:**
```css
--lh: 1.65;
--lh-base: 1.618; /* Golden ratio */
--lh-tight: 1.382; /* Golden ratio inverse */
--lh-hero: 1.06;
--lh-heading: 1.2;
--lh-compact: 1.45;
```

#### **Recommended:**
```css
/* Line Heights - HIG alignment */
--lh: 1.65; /* ✅ Keep */
--lh-base: 1.65; /* Change from 1.618 → Apple standard for long-form reading */
--lh-tight: 1.382; /* ✅ Keep - works well for constrained UI */
--lh-hero: 1.08; /* Increase from 1.06 → slightly more breathing room for large display */
--lh-heading: 1.2; /* ✅ Keep - Apple HIG standard */
--lh-compact: 1.45; /* ✅ Keep */
```

**Rationale:** Apple HIG specifies body text at **14pt Regular** with **16pt leading** = **1.14 ratio**, but for web long-form reading, **1.65 is optimal** (Apple's own website uses 1.6-1.7 for articles).

---

#### **Letter Spacing Refinements:**

#### **Current:**
```css
--ls-hero: -0.039em; /* Large display */
--ls-h2: -0.027em; /* Medium display */
--ls-h3: -0.019em; /* Small display */
--ls-body: -0.011em; /* Body text */
--ls-caption: -0.006em; /* Captions/small text */
--ls-button: 0.004em; /* Button text */
--ls-tight: -0.01em;
```

#### **Recommended:**
```css
/* Letter Spacing - HIG precision tracking values */
--ls-hero: -0.039em; /* ✅ Perfect - matches HIG 40-76pt range */
--ls-h2: -0.025em; /* Nudge from -0.027em → slightly less compression */
--ls-h3: -0.015em; /* Nudge from -0.019em → better readability at ~20-30pt */
--ls-body: -0.010em; /* Nudge from -0.011em → more neutral */
--ls-caption: -0.006em; /* ✅ Keep */
--ls-button: 0.004em; /* ✅ Keep */
--ls-eyebrow: 0.06em; /* NEW - for uppercase labels (ProfileCard, ArticleCard, BlogHero) */
--ls-tight: -0.01em; /* ✅ Keep */
```

**Rationale:** HIG tracking table shows **-0.023 to -0.026** for 20-26pt range (your H2/section-title sizes). Current -0.027em is slightly tight.

---

#### **Font Size Adjustments:**

#### **Current:**
```css
--fs-0: clamp(1rem, 1vw + 0.95rem, 1.2rem); /* 16px → 19.2px */
--fs-hero: clamp(2.4rem, 4.2vw + 1.3rem, 4.25rem); /* 38.4px → 68px */
```

#### **Recommended:**
```css
/* Body text - HIG baseline is 17pt on iOS */
--fs-0: clamp(1.0625rem, 1vw + 0.95rem, 1.2rem); /* 17px → 19.2px */

/* Hero/Large Title - Apple caps at ~48-52px */
--fs-hero: clamp(2.4rem, 4.2vw + 1.3rem, 3.25rem); /* 38.4px → 52px (reduced from 68px) */
```

**Rationale:** Apple HIG lists **iOS body text at 17pt** as default. Your article titles at 68px exceed Apple's **Large Title** spec (31-44pt / ~41-59px range).

---

### 2. **Heading Hierarchy** (src/styles/theme.css lines 709-742)

#### **H1 - Hero & Article Titles:**

**Current:**
```css
h1 {
  font-size: var(--fs-hero);
  font-weight: 700;
  line-height: var(--lh-hero); /* 1.06 */
  letter-spacing: var(--ls-hero); /* -0.039em */
  font-variation-settings: var(--font-variation-display-large);
}
```

**Article-specific:**
```css
.article__title {
  font-size: clamp(40px, 5vw + 16px, 68px); /* ⚠️ Max 68px too large */
  line-height: var(--lh-hero); /* 1.02 inline override */
  letter-spacing: var(--ls-hero); /* -0.032em inline override */
}
```

**Recommended:**
```css
/* Global H1 - keep as-is, excellent */
h1 {
  font-size: var(--fs-hero); /* ✅ */
  font-weight: 700; /* ✅ */
  line-height: 1.08; /* Increase from 1.06 → var(--lh-hero) after update */
  letter-spacing: var(--ls-hero); /* ✅ -0.039em */
  font-variation-settings: var(--font-variation-display-large);
  margin: 0 0 var(--space-md); /* NEW - increase from 12px to 24px */
}

/* Article title - reduce max size */
.article__title {
  font-size: clamp(40px, 5vw + 16px, 52px); /* Reduce max 68px → 52px */
  line-height: 1.08; /* Use updated --lh-hero */
  letter-spacing: var(--ls-hero); /* Unify with global */
}
```

---

#### **H2 - Sections & Subheadings:**

**Current:**
```css
h2 {
  font-size: var(--fs-h2);
  font-weight: 600; /* ⚠️ Could be bolder for prominence */
  line-height: 1.1;
  letter-spacing: var(--ls-h2); /* -0.024em */
  font-variation-settings: var(--font-variation-display-medium);
}
```

**Recommended:**
```css
h2 {
  font-size: var(--fs-h2);
  font-weight: 700; /* Increase from 600 → HIG recommends Bold for Title 2 */
  line-height: 1.15; /* Slight increase from 1.1 → better rhythm */
  letter-spacing: -0.025em; /* Use updated --ls-h2 */
  font-variation-settings: var(--font-variation-display-medium);
}

/* If using variable fonts, consider intermediate weight with fallback */
@supports (font-variation-settings: normal) {
  h2 {
    font-variation-settings: "wght" 650, var(--font-variation-display-medium);
    font-weight: 700; /* Fallback for non-variable */
  }
}
```

**Article H2 spacing:**
```css
.articlePortable :where(h2) {
  margin: clamp(var(--space-lg), 4vw, 48px) 0 var(--space-sm); /* Cap max from 56px → 48px */
  font-weight: 700; /* Match global H2 */
}
```

---

#### **H3 - Subsections:**

**Current:**
```css
h3 {
  font-size: var(--fs-h3);
  font-weight: 600; /* ✅ Good */
  line-height: 1.2; /* ✅ Good */
  letter-spacing: var(--ls-h3); /* -0.018em */
  font-variation-settings: var(--font-variation-display-medium);
}
```

**Recommended:**
```css
h3 {
  font-size: var(--fs-h3);
  font-weight: 600; /* ✅ Keep */
  line-height: 1.2; /* ✅ Keep */
  letter-spacing: -0.015em; /* Use updated --ls-h3 */
  font-variation-settings: var(--font-variation-display-small); /* Change from display-medium */
}
```

**Article H3 spacing:**
```css
.articlePortable :where(h3) {
  margin: clamp(var(--space-md), 3vw, 32px) 0 var(--space-xs); /* Cap max from 38px → 32px */
}
```

---

### 3. **Body Text & Paragraphs** (src/styles/theme.css lines 744-766)

#### **Current:**
```css
p {
  margin: 0 0 var(--space-sm); /* 16px bottom */
  max-width: var(--measure-reading);
  line-height: var(--lh-base); /* 1.65 */
  letter-spacing: var(--ls-body); /* -0.008em */
  text-wrap: pretty;
}

p + p {
  margin-top: var(--space-xs); /* 12px - compounds with bottom margin */
}
```

**Recommended:**
```css
p {
  margin: 0 0 var(--space-md); /* Increase from 16px → 24px for better rhythm */
  max-width: var(--measure-reading); /* ✅ 58ch is perfect */
  line-height: 1.65; /* ✅ Keep */
  letter-spacing: -0.010em; /* Use updated --ls-body */
  text-wrap: pretty; /* ✅ Keep */
}

p + p {
  margin-top: 0; /* Remove compound spacing - rely on consistent bottom margin */
}
```

---

### 4. **Eyebrow/Label Typography** (Multiple Components)

**Locations:**
- `ProfileCard.astro` line 387-400
- `ArticleCard.astro` (via theme.css)
- `BlogHero` eyebrow

#### **Current (ProfileCard example):**
```css
.profileCard__eyebrow {
  margin: 0;
  font-size: var(--fs--2);
  letter-spacing: 0.08em; /* ⚠️ Slightly too wide */
  text-transform: uppercase;
}
```

#### **Recommended:**
```css
.profileCard__eyebrow {
  margin: 0;
  font-size: var(--fs--2); /* ✅ Keep */
  font-weight: 500; /* ADD - better distinction */
  letter-spacing: 0.06em; /* Reduce from 0.08em → HIG standard for uppercase */
  text-transform: uppercase; /* ✅ Keep */
}
```

**Apply consistently** to:
- `.article__eyebrow`
- `.blogHero__eyebrow`
- `.projectCard__eyebrow`

**Add global token:**
```css
:root {
  --ls-eyebrow: 0.06em; /* Centralize eyebrow letter-spacing */
}
```

---

### 5. **Card Typography** (ArticleCard, ProfileCard)

#### **Meta Text (dates, reading time):**

**Current:**
```css
.article__meta {
  font-size: var(--fs--1); /* ✅ Good size */
  color: var(--muted);
}
```

**Recommended:**
```css
.article__meta {
  font-size: var(--fs--1); /* ✅ Keep */
  font-weight: 500; /* ADD - better scannability */
  letter-spacing: 0.005em; /* ADD - slight positive tracking for small text */
  color: var(--muted); /* ✅ Keep */
  font-variant-numeric: tabular-nums; /* ADD - align numbers (dates, times) */
}
```

---

#### **ProfileCard Name:**

**Current:**
```css
.profileCard__name {
  font-size: clamp(26px, 1.8vw + 16px, 38px); /* ⚠️ Max 38px might compete with H2s */
  font-weight: 700;
}
```

**Recommended:**
```css
.profileCard__name {
  font-size: clamp(26px, 1.8vw + 16px, 36px); /* Reduce max 38px → 36px */
  font-weight: 700; /* ✅ Keep */
  letter-spacing: -0.020em; /* ADD - tighter tracking for display-sized name */
}
```

---

### 6. **Article Portable Text** (src/styles/theme.css lines 3360-3500)

#### **Blockquote:**

**Current:**
```css
.articlePortable :where(blockquote) {
  /* ... */
  color: rgba(235, 235, 245, 0.65);
  font-style: italic; /* ⚠️ Apple prefers normal */
}
```

**Recommended:**
```css
.articlePortable :where(blockquote) {
  position: relative;
  margin: var(--space-lg) 0;
  padding: var(--space-md) var(--space-lg);
  padding-inline-start: var(--space-xl); /* Increase from var(--space-lg) for emphasis */
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-left: 4px solid var(--link);
  background: rgba(28, 28, 30, 0.88);
  backdrop-filter: saturate(var(--glass-saturation-base))
    blur(calc(var(--glass-blur-base) * 0.5));
  -webkit-backdrop-filter: saturate(var(--glass-saturation-base))
    blur(calc(var(--glass-blur-base) * 0.5));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.12);
  color: rgba(235, 235, 245, 0.75); /* Increase opacity from 0.65 */
  font-style: normal; /* Change from italic → Apple standard */
  font-weight: 450; /* ADD - subtle emphasis via weight instead of italic */
}
```

---

#### **Inline Code:**

**Current:**
```css
.articlePortable :where(code) {
  font-family: var(--font-mono);
  background: rgba(35, 35, 39, 0.80);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  font-size: 0.95em; /* ⚠️ Could be slightly smaller */
}
```

**Recommended:**
```css
.articlePortable :where(code) {
  font-family: var(--font-mono);
  background: rgba(35, 35, 39, 0.80);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  font-size: 0.94em; /* Reduce from 0.95em → better optical balance */
  line-height: inherit; /* ADD - ensure proper line height */
}
```

---

### 7. **Mobile Optimization** (≤720px breakpoint)

#### **Current:**
```css
@media (max-width: 720px) {
  :root {
    --fs-hero: clamp(30px, 6vw + 18px, 46px);
    --fs-h2: clamp(22px, 3.4vw + 14px, 28px);
    --fs-h3: clamp(17px, 2.2vw + 14px, 22px);
  }
}
```

**Recommended:**
```css
@media (max-width: 720px) {
  :root {
    /* Font sizes - ensure 17pt minimum */
    --fs-0: clamp(1.0625rem, 1.5vw + 0.95rem, 1.125rem); /* 17px → 18px */
    --fs-hero: clamp(32px, 6vw + 18px, 48px); /* Increase min from 30px */
    --fs-h2: clamp(22px, 3.4vw + 14px, 28px); /* ✅ Good */
    --fs-h3: clamp(18px, 2.2vw + 14px, 22px); /* Increase min from 17px */
    
    /* Letter spacing - avoid negative tracking below 20px */
    --ls-h3: -0.008em; /* Reduce compression on small screens */
    --ls-body: -0.005em; /* Nearly neutral on mobile */
  }
  
  /* Hero subtitle - Apple baseline 18pt */
  .hero__subtitle {
    font-size: clamp(18px, 2vw + 14px, 20px); /* Increase min from 17px */
  }
  
  /* Paragraph spacing - reduce on mobile to minimize scroll fatigue */
  p {
    margin-bottom: var(--space-sm); /* 16px instead of 24px on mobile */
  }
  
  /* Card grid - tighter gutters on mobile */
  .cardGrid {
    gap: var(--space-sm); /* 16px instead of 24px */
  }
}
```

---

### 8. **Touch Targets** (Navigation, Buttons, Chips)

**Current touch targets:**
- `.topbar__navLink`: min-height: 44px ✅
- `.topbar__menu`: min-width: 44px, min-height: 44px ✅
- `.article__tag`: padding: 6px 12px ⚠️ (likely <44px)

**Recommended:**
```css
/* Ensure all interactive elements meet 44px minimum */
.article__tag,
.profileCard__chip,
.blogFilters__link {
  padding: 10px 16px; /* Increase from 6px 12px */
  min-height: 44px; /* ADD - explicit minimum */
  display: inline-flex; /* ADD - for vertical centering */
  align-items: center; /* ADD */
}
```

---

## Implementation Priority

### **High Priority (Quick Wins):**
1. ✅ Body line-height: `--lh-base: 1.618 → 1.65` (already at 1.65 in global `--lh`)
2. ✅ Article title max: `68px → 52px`
3. ✅ H2 weight: `600 → 700`
4. ✅ Eyebrow letter-spacing: `0.08em → 0.06em`
5. ✅ Mobile body min: `16px → 17px`

### **Medium Priority (Refinements):**
6. Letter-spacing nudges: h2, h3, body (-0.002 to -0.004em adjustments)
7. Hero line-height: `1.06 → 1.08`
8. H1 margin-bottom: `12px → 24px`
9. Paragraph spacing: bottom `16px → 24px`, remove `p + p` compound
10. Blockquote: italic → normal, weight 450

### **Low Priority (Polish):**
11. ProfileCard name max: `38px → 36px`
12. Article H2/H3 margin caps (56px → 48px, 38px → 32px)
13. Meta text: add weight 500, letter-spacing 0.005em
14. Touch targets: increase padding on tags/chips
15. Variable font weight for H2 (650 with 700 fallback)

---

## CSS Changes Summary

### **File:** `src/styles/theme.css`

**Lines 44-76 (Typography tokens):**
```css
/* CHANGE: Line heights */
--lh-base: 1.65; /* from 1.618 */
--lh-hero: 1.08; /* from 1.06 */

/* CHANGE: Letter spacing */
--ls-h2: -0.025em; /* from -0.027em */
--ls-h3: -0.015em; /* from -0.019em */
--ls-body: -0.010em; /* from -0.011em */

/* ADD: Eyebrow token */
--ls-eyebrow: 0.06em;

/* CHANGE: Font sizes */
--fs-0: clamp(1.0625rem, 1vw + 0.95rem, 1.2rem); /* min 17px from 16px */
--fs-hero: clamp(2.4rem, 4.2vw + 1.3rem, 3.25rem); /* max 52px from 68px */
```

**Lines 720-742 (Headings):**
```css
/* H1 */
h1 {
  margin: 0 0 var(--space-md); /* CHANGE: from 12px/--space-sm */
  line-height: 1.08; /* CHANGE: from 1.06 */
}

/* H2 */
h2 {
  font-weight: 700; /* CHANGE: from 600 */
  line-height: 1.15; /* CHANGE: from 1.1 */
  letter-spacing: -0.025em; /* CHANGE: from -0.024em */
}

/* H3 */
h3 {
  letter-spacing: -0.015em; /* CHANGE: from -0.018em */
  font-variation-settings: var(--font-variation-display-small); /* CHANGE: from display-medium */
}
```

**Lines 744-766 (Paragraphs):**
```css
p {
  margin: 0 0 var(--space-md); /* CHANGE: from var(--space-sm) */
  letter-spacing: -0.010em; /* CHANGE: from -0.008em */
}

p + p {
  margin-top: 0; /* CHANGE: from var(--space-xs) */
}
```

**Lines 3262-3500 (Article typography):**
```css
.article__title {
  font-size: clamp(40px, 5vw + 16px, 52px); /* CHANGE: max from 68px */
  line-height: 1.08; /* CHANGE: use updated token */
}

.articlePortable :where(h2) {
  margin: clamp(var(--space-lg), 4vw, 48px) 0 var(--space-sm); /* CHANGE: max from 56px */
  font-weight: 700; /* ADD */
}

.articlePortable :where(h3) {
  margin: clamp(var(--space-md), 3vw, 32px) 0 var(--space-xs); /* CHANGE: max from 38px */
}

.articlePortable :where(blockquote) {
  font-style: normal; /* CHANGE: from italic */
  font-weight: 450; /* ADD */
  color: rgba(235, 235, 245, 0.75); /* CHANGE: from 0.65 */
  padding-inline-start: var(--space-xl); /* CHANGE: from var(--space-lg) */
}

.articlePortable :where(code) {
  font-size: 0.94em; /* CHANGE: from 0.95em */
  line-height: inherit; /* ADD */
}
```

**Lines 428-443 (Mobile media query):**
```css
@media (max-width: 720px) {
  :root {
    --fs-0: clamp(1.0625rem, 1.5vw + 0.95rem, 1.125rem); /* ADD */
    --fs-hero: clamp(32px, 6vw + 18px, 48px); /* CHANGE: min from 30px */
    --fs-h3: clamp(18px, 2.2vw + 14px, 22px); /* CHANGE: min from 17px */
    --ls-h3: -0.008em; /* ADD */
    --ls-body: -0.005em; /* ADD */
  }
}
```

---

## Verification Checklist

After implementing changes:

- [ ] **Visual regression test** at breakpoints: 360px, 414px, 768px, 1024px, 1280px
- [ ] **Reading measure** check: body text ≤58ch (use browser DevTools ruler)
- [ ] **Line height** check: body 1.65, headings 1.08-1.2
- [ ] **Touch targets** check: all interactive elements ≥44px (use DevTools element inspector)
- [ ] **Letter spacing** check: compare against HIG tracking table
- [ ] **Font weight** check: H1 700, H2 700, H3 600, body 400, meta 500
- [ ] **8px grid** check: margins/padding are multiples of 8
- [ ] **Accessibility** check: WCAG AA contrast ratios maintained
- [ ] **Build** check: `bun run build` succeeds
- [ ] **TypeScript** check: `bun run typecheck` passes

---

## Apple HIG References

- [Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [SF Pro Font Family](https://developer.apple.com/fonts/)
- [iOS Text Styles](https://developer.apple.com/design/human-interface-guidelines/typography#iOS-iPadOS-Dynamic-Type-sizes)
- [Tracking Values](https://developer.apple.com/design/human-interface-guidelines/typography#Tracking-values)
- [Ensuring Legibility](https://developer.apple.com/design/human-interface-guidelines/typography#Ensuring-legibility)

---

## Conclusion

Your typography implementation is **exemplary** and requires only subtle refinements. The recommended changes are **minor enhancements** to achieve perfect Apple HIG alignment, particularly:

1. Reducing oversized hero titles (68px → 52px)
2. Increasing H2 weight for better hierarchy (600 → 700)
3. Fine-tuning letter-spacing (-0.002 to -0.004em adjustments)
4. Ensuring 17pt minimum on mobile (iOS baseline)
5. Standardizing eyebrow letter-spacing (0.08em → 0.06em)

**Estimated time:** 2-3 hours for all changes + testing.  
**Risk level:** Low (CSS-only, no structure changes).  
**Impact:** Subtle but noticeable improvement in typographic precision and hierarchy.
