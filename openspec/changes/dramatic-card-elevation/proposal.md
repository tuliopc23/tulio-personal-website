# Dramatic Card Elevation - Proper Floating Surfaces

## Why

**CRITICAL ISSUE:** Current cards appear completely FLAT with no visible elevation despite shadow tokens being present.

**Root Cause:**
- Shadow opacity values are TOO LOW (0.03-0.08) to be visible
- Not enough contrast between resting and elevated states
- Shadows need to be 2-3x more opaque to match macOS Big Sur/Ventura/Sonoma levels
- Missing the "floating above surface" effect seen in modern Apple interfaces

**Current State (BROKEN):**
```css
--shadow-card-resting:
  0 0.5px 1px rgba(0, 0, 0, 0.06),  /* Invisible */
  0 1px 2px rgba(0, 0, 0, 0.08),    /* Barely visible */
  0 2px 4px rgba(0, 0, 0, 0.04),    /* Invisible */
  0 4px 8px rgba(0, 0, 0, 0.03);    /* Invisible */
```

**What We Need (VISIBLE):**
```css
--shadow-card-resting:
  0 0 0 1px rgba(255, 255, 255, 0.08),        /* Border ring */
  0 0.5px 1px rgba(0, 0, 0, 0.16),             /* Contact shadow */
  0 2px 4px rgba(0, 0, 0, 0.14),               /* Near shadow */
  0 4px 8px rgba(0, 0, 0, 0.12),               /* Mid shadow */
  0 8px 16px rgba(0, 0, 0, 0.10),              /* Far shadow */
  0 16px 32px rgba(0, 0, 0, 0.08);             /* Ambient shadow */
```

**Reference:** macOS Ventura Notification cards, iOS 17 card stacks, Vision Pro window shadows

## What Changes

### Phase 1: Dramatically Increase Shadow Visibility

**ALL Card Types Get Visible Shadows:**
- Profile cards (social icons container)
- Article cards (blog post cards)
- Tech stack cards (homepage cards)
- Tool cards (homepage cards)
- Project cards
- Category badge containers
- Any card-like surface

**Shadow Opacity Increases:**
- Resting state: Increase opacity by 2.5-3x
- Hover state: Increase opacity by 3-4x  
- Pressed state: Keep subtle but visible

**Shadow Composition - 6 Layers (Not 4):**
1. **Border ring** - Subtle outline (0.5-1px at 0.06-0.08 opacity)
2. **Contact shadow** - Tight, dark shadow directly beneath (0.16-0.20 opacity)
3. **Near shadow** - Close to element (0.12-0.16 opacity)
4. **Mid shadow** - Medium distance (0.10-0.14 opacity)
5. **Far shadow** - Creates lift perception (0.08-0.12 opacity)
6. **Ambient shadow** - Large, soft halo (0.06-0.10 opacity)

### Phase 2: Proper Floating Effect

**Key Changes:**
- Base cards should ALWAYS look elevated (not flush with background)
- Hover should look like cards lift HIGHER (not go from flat → elevated)
- Clear visual hierarchy: Background → Cards (floating) → Hovered cards (higher)

**Visual Separation:**
- Background: Dark solid (#050505)
- Cards: Semi-transparent glass CLEARLY floating above
- Shadows: Dark enough to see the gap between card and background

### Phase 3: Apply to ALL Card Components

**Comprehensive Application:**
- `.card` - Base card component
- `.articleCard` - Blog article cards
- `.projectCard` - Project showcase cards
- `.profileCard` - Social icons container
- Any component with card-like appearance

**Consistency:**
- Same base shadow across all card types
- Same hover elevation behavior
- Same pressed state feedback

## Implementation

### Step 1: Replace Shadow Tokens (Critical Fix)

```css
/* OLD (Invisible) */
--shadow-card-resting:
  0 0.5px 1px rgba(0, 0, 0, 0.06),
  0 1px 2px rgba(0, 0, 0, 0.08),
  0 2px 4px rgba(0, 0, 0, 0.04),
  0 4px 8px rgba(0, 0, 0, 0.03);

/* NEW (VISIBLE) */
--shadow-card-resting:
  0 0 0 1px rgba(255, 255, 255, 0.08),
  0 0.5px 1px rgba(0, 0, 0, 0.16),
  0 2px 4px rgba(0, 0, 0, 0.14),
  0 4px 8px rgba(0, 0, 0, 0.12),
  0 8px 16px rgba(0, 0, 0, 0.10),
  0 16px 32px rgba(0, 0, 0, 0.08);
```

### Step 2: Enhanced Hover Shadows

```css
/* OLD (Barely noticeable) */
--shadow-card-raised:
  0 2px 4px rgba(0, 0, 0, 0.10),
  0 4px 8px rgba(0, 0, 0, 0.08),
  0 8px 16px rgba(0, 0, 0, 0.06);

/* NEW (DRAMATIC) */
--shadow-card-raised:
  0 0 0 1px rgba(255, 255, 255, 0.12),
  0 2px 4px rgba(0, 0, 0, 0.20),
  0 6px 12px rgba(0, 0, 0, 0.18),
  0 12px 24px rgba(0, 0, 0, 0.16),
  0 24px 48px rgba(0, 0, 0, 0.14),
  0 48px 96px rgba(0, 0, 0, 0.10);
```

### Step 3: Light Mode Adjustments

```css
/* Light mode needs WARMER, SOFTER shadows */
[data-theme="light"] {
  --shadow-card-resting:
    0 0 0 1px rgba(0, 0, 0, 0.08),
    0 0.5px 1px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(31, 35, 53, 0.10),
    0 4px 8px rgba(31, 35, 53, 0.08),
    0 8px 16px rgba(31, 35, 53, 0.07),
    0 16px 32px rgba(31, 35, 53, 0.06);
}
```

## Impact

**Visual Changes:**
- Cards will CLEARLY appear to float above background
- Hover states will be DRAMATICALLY more noticeable
- Depth hierarchy will be OBVIOUS, not subtle
- Professional, polished appearance matching Apple's quality standards

**Performance:**
- No performance impact (same number of layers, just different opacity)
- Still GPU-accelerated
- No additional bundle size

**Accessibility:**
- Better visual affordances (clearer what's clickable)
- Improved contrast helps users understand card boundaries
- No impact on screen readers or keyboard navigation

## Success Criteria

- [ ] At rest, cards are CLEARLY elevated (visible shadow gap)
- [ ] On hover, elevation increase is IMMEDIATELY noticeable
- [ ] All card types have consistent shadow depth
- [ ] Light mode shadows are warm and soft (not harsh)
- [ ] Dark mode shadows are deep and dimensional
- [ ] Screenshots show obvious floating effect

## Reference Images

**macOS Ventura Notification Center:** Cards have STRONG shadows (~0.12-0.18 opacity)
**iOS 17 Control Center:** Cards clearly float with deep shadows
**Vision Pro Windows:** Pronounced shadows with 6+ layers
**Apple.com Product Cards:** Dramatic elevation on hover

## Files to Modify

- `src/styles/tokens/shadows.css` - Replace all shadow token values
- No other files need changes - just fix the opacity values!

## Estimated Time

**15 minutes** - This is purely adjusting opacity values in shadow tokens!
