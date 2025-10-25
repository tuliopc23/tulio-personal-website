# Design System Audit & Polish

## Why

**Current State:** Design system is fundamentally strong but has inconsistencies that accumulate friction:
- Spacing uses mixed tokens and hardcoded values
- Mobile breakpoints are scattered (720px, 768px, 820px, 1023px, 1100px)
- Typography rhythm varies across components
- Card padding and internal spacing inconsistent
- Some animations feel abrupt
- Mobile layouts need tighter rhythm

**Goal:** Polish and unify the design system WITHOUT breaking changes. Focus on:
1. **Consistency** - Unify spacing, typography, breakpoints
2. **Rhythm** - Better vertical rhythm and breathing room
3. **Mobile UX** - Tighter, more refined mobile layouts
4. **Animation** - Smoother, more Apple-like transitions
5. **Organization** - Cleaner token usage, less duplication

**Not in scope:**
- NO redesigns or major visual changes
- NO new features or components
- NO breaking layout changes
- Keep all existing functionality intact

## What Changes

### Phase 1: Spacing Audit & Unification

**Standardize Breakpoints (NO breaking changes):**
```css
/* Current: 7 different breakpoints scattered */
--breakpoint-xs: 480px;   /* Tiny phones */
--breakpoint-sm: 600px;   /* Small phones */
--breakpoint-md: 768px;   /* Tablets portrait */
--breakpoint-lg: 1024px;  /* Tablets landscape / small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
```

**Replace Hardcoded Spacing:**
- `padding: 8px 12px` → `padding: var(--space-xxs) var(--space-xs)`
- `gap: 6px` → `gap: var(--space-xxs)`
- `gap: 12px` → `gap: var(--space-xs)`
- `margin: -1px` → Keep (intentional overlap)

**Component-Specific Tokens (DRY principle):**
```css
/* Card internal spacing */
--card-padding: clamp(var(--space-sm), 3vw, var(--space-lg));
--card-gap: clamp(var(--space-xs), 2vw, var(--space-sm));

/* Article card specific */
--article-card-padding: clamp(var(--space-md), 4vw, var(--space-xl));
--article-meta-gap: var(--space-xs);
```

### Phase 2: Typography Consistency

**Current Issues:**
- Some components use inline font-size values (17px, 16px, 14px)
- Line heights are sometimes hardcoded (1.5, 1.3, 1.55)
- Letter spacing occasionally missing

**Refinements:**
```css
/* Add missing utility sizes */
--fs-body: 17px;         /* iOS baseline */
--fs-body-sm: 16px;      /* Secondary text */
--fs-caption: 14px;      /* Metadata */
--fs-small: 13px;        /* Micro text */

/* Standardize line-heights */
--lh-ui: 1.4;            /* Buttons, labels */
--lh-card-title: 1.25;   /* Card headings */
--lh-card-body: 1.5;     /* Card descriptions */
```

**Apply Consistently:**
- ProfileCard: Use `--fs-body` instead of `16px`
- ArticleCard metadata: Use `--fs-caption` instead of `14px`
- Card titles: Use `--lh-card-title` consistently

### Phase 3: Card System Unification

**Current State:**
- Card base padding: `var(--space-md)`
- ProfileCard: `clamp(var(--space-sm), 3vw, var(--space-lg))`
- ArticleCard: varies by section
- ProjectCard: different again

**Unify Without Breaking:**
```css
/* Base card tokens */
--card-padding-sm: clamp(var(--space-sm), 2.5vw, var(--space-md));   /* Compact cards */
--card-padding-md: clamp(var(--space-md), 3.5vw, var(--space-lg));   /* Standard cards */
--card-padding-lg: clamp(var(--space-lg), 4.5vw, var(--space-xl));   /* Feature cards */

--card-gap-compact: var(--space-xs);    /* Tight internal spacing */
--card-gap-relaxed: var(--space-sm);    /* Comfortable spacing */
--card-gap-spacious: var(--space-md);   /* Generous spacing */
```

**Apply to Components:**
- Standard cards (tech stack, tools) → `--card-padding-sm`
- ProfileCard → `--card-padding-md`
- ArticleCard, ProjectCard → `--card-padding-lg`

### Phase 4: Mobile Layout Refinement

**Tighten Mobile Padding:**
```css
@media (max-width: 768px) {
  --container-padding: clamp(20px, 5vw, 40px);  /* Tighter on mobile */
  --card-padding-sm: var(--space-sm);            /* Fixed on small screens */
  --card-padding-md: clamp(var(--space-sm), 4vw, var(--space-md));
}

@media (max-width: 480px) {
  --container-padding: clamp(16px, 4vw, 24px);  /* Very tight on tiny screens */
  --space-section: var(--space-lg);              /* Reduce section gaps */
}
```

**ProfileCard Mobile Improvements:**
- Photo size: 118px → 104px on smallest screens (better proportions)
- Contact cards: Reduce padding for better grid fit
- Social rail: Optimize snap points for better scrolling

**Article Page Improvements:**
- Tighter meta spacing on mobile
- Better reading width on tablets (currently breaks too early)
- Breadcrumbs: Reduce padding on small screens

### Phase 5: Animation Polish

**Micro-adjustments (NO breaking changes):**

**Hover Transitions:**
```css
/* Current: Some use 200ms, some 250ms */
/* Standardize to Apple's preferred durations */
--motion-duration-ui: 180ms;      /* UI interactions (NEW) */
--motion-duration-sm: 250ms;      /* Standard (keep) */
--motion-duration-md: 350ms;      /* Keep */
--motion-duration-lg: 500ms;      /* Keep */
```

**Card Hover Refinement:**
```css
/* Add subtle scale before translateY for smoother feel */
.card:hover {
  transform: scale(1.01) translateY(-4px) rotate(-0.5deg);
}

/* Stagger properties for liquid feel */
transition:
    transform 250ms var(--motion-ease-spring),
    box-shadow 280ms var(--motion-ease-spring) 20ms,  /* Slight delay */
    border-color 200ms var(--motion-ease-out);
```

**Scroll Animations:**
- Add `will-change: transform` only during animation (performance)
- Ensure all reveal animations use consistent easing
- Add 20-40ms stagger between card groups for flow

### Phase 6: Material Consistency

**Glass Effects:**
```css
/* Standardize blur values */
--glass-blur-none: 0px;
--glass-blur-light: 12px;    /* Subtle */
--glass-blur-base: 20px;     /* Standard */
--glass-blur-heavy: 32px;    /* Prominent */
--glass-blur-extreme: 48px;  /* Hero sections */
```

**Card Backgrounds (unify):**
```css
/* Dark mode - all cards use same base */
[data-theme="dark"] .card,
[data-theme="dark"] .profileCard,
[data-theme="dark"] .articleCard {
  background: rgba(29, 29, 32, 0.95);
  backdrop-filter: saturate(180%) blur(20px);
}

/* Light mode */
[data-theme="light"] .card,
[data-theme="light"] .profileCard,
[data-theme="light"] .articleCard {
  background: rgba(248, 248, 251, 0.95);
  backdrop-filter: saturate(180%) blur(20px);
}
```

### Phase 7: Typography Rhythm

**Vertical Spacing Improvements:**
```css
/* Article typography */
.article h2 {
  margin-top: var(--space-xl);          /* More breathing room above */
  margin-bottom: var(--space-md);       /* Consistent below */
}

.article h3 {
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
}

.article p + p {
  margin-top: var(--space-md);          /* Better paragraph rhythm */
}

.article ul, .article ol {
  margin-top: var(--space-sm);
  margin-bottom: var(--space-md);
}
```

**Card Typography:**
```css
.card-title {
  margin-bottom: var(--space-xs);       /* Consistent across all cards */
}

.card-body {
  margin-top: var(--space-xs);          /* Unified gap */
  line-height: var(--lh-card-body);
}
```

### Phase 8: Component-Specific Tweaks

**ProfileCard:**
- Remove duplicate photo gradient logic (already in theme)
- Unify contact card padding with base card system
- Simplify media queries (combine overlapping breakpoints)

**ArticleCard:**
- Standardize meta item spacing
- Use consistent icon sizes (currently 14px hardcoded)
- Better category badge alignment

**Card.astro:**
- Extract inline styles to tokens
- Unify icon tile sizing
- Consistent CTA styling

**Navbar:**
- Better mobile menu padding
- Unified link hover states
- Tighter spacing on small screens

**Footer:**
- Consistent padding with container
- Better link spacing
- Improved mobile layout

### Phase 9: Organization & Cleanup

**Create Missing Token Files:**
```
src/styles/tokens/
  ├── colors.css (✅ exists)
  ├── shadows.css (✅ exists)
  ├── spacing.css (NEW)
  ├── typography.css (NEW)
  ├── motion.css (NEW)
  └── breakpoints.css (NEW)
```

**Extract from theme.css:**
- Move all spacing tokens → `spacing.css`
- Move typography tokens → `typography.css`
- Move animation tokens → `motion.css`
- Move breakpoints → `breakpoints.css`
- Keep theme.css for component styles only

**Reduce Duplication:**
- Combine repeated media queries
- Extract common patterns to utility classes
- Use CSS custom property inheritance better

### Phase 10: Mobile UX Polish

**Touch Targets:**
- Ensure all interactive elements ≥ 44x44px
- Better tap feedback (add active states where missing)
- Improve scroll snap points on card rails

**Scroll Indicators:**
- More visible on mobile (current sometimes hard to see)
- Better positioning on small screens
- Add haptic-style feedback (CSS only)

**Page Indicators:**
- Larger dots on mobile (better visibility)
- Increased tap targets
- Better contrast in light mode

## Implementation Strategy

### Week 1: Foundation
- Create token files (spacing, typography, motion, breakpoints)
- Audit and document current usage
- No visual changes yet

### Week 2: Token Migration
- Replace hardcoded values with tokens
- Update components to use new tokens
- Test across all pages

### Week 3: Refinement
- Apply animation polish
- Improve mobile layouts
- Component-specific tweaks

### Week 4: Testing & Documentation
- Cross-browser testing
- Mobile device testing
- Update style guide
- Document patterns

## Success Criteria

- [ ] Zero hardcoded spacing values (except intentional)
- [ ] All breakpoints use standard tokens
- [ ] Typography consistently uses design tokens
- [ ] Cards have unified padding/spacing system
- [ ] Animations use standardized durations
- [ ] Mobile layouts feel tighter and more refined
- [ ] All touch targets meet 44x44px minimum
- [ ] No visual regressions (screenshot comparison)
- [ ] Performance maintained or improved
- [ ] Lighthouse scores unchanged or better

## Risk Assessment

**LOW RISK:**
- All changes are refinements, not redesigns
- Existing functionality preserved
- No breaking changes to HTML structure
- Tokens add flexibility without forcing changes
- Can be rolled back easily

**Mitigation:**
- Test each phase independently
- Take screenshots before/after each change
- Keep git history clean for easy rollback
- Test on real devices (not just browser devtools)

## References

- **Apple HIG:** Spacing, typography, touch targets
- **Material Design 3:** Elevation system guidance
- **Fluent 2:** Animation timing reference
- **Current site:** Maintain established visual identity

## Out of Scope

This audit DOES NOT include:
- ❌ New components or features
- ❌ Content changes
- ❌ Functionality additions
- ❌ Backend/API changes
- ❌ Major layout redesigns
- ❌ Color palette changes
- ❌ New page templates
- ❌ Third-party integrations

This is PURELY about polish, consistency, and refinement.
