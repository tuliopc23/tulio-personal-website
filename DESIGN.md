---
name: Tulio Cunha — Personal Developer Site
description: Apple HIG–aligned premium personal developer portfolio with Tahoe depth, SF Pro typography, and native-feeling materials.
colors:
  bg-base: "#050505"
  bg-elevated: "#101115"
  surface: "#161618"
  surface-card: "#1a1a1e"
  text-primary: "#f5f5f7"
  text-secondary: "#dce8ffc2"
  text-tertiary: "#c2d2f09e"
  accent-primary: "#0d8aff"
  accent-success: "#30d948"
  accent-warning: "#ffa00d"
  accent-error: "#ff473c"
  hairline: "#ffffff14"
  light-bg: "#f5f5f7"
  light-text: "#1d1d1f"
typography:
  display:
    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    fontSize: "clamp(2.125rem, 4.2vw + 1.2rem, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    fontSize: "clamp(1.625rem, 2.6vw + 0.92rem, 1.9375rem)"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    fontSize: "clamp(1.0625rem, 1vw + 0.95rem, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.65
  reader:
    fontFamily: '"New York Reader", "Iowan Old Style", Georgia, serif'
    fontSize: "clamp(1.0625rem, 1vw + 0.95rem, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.65
  mono:
    fontFamily: '"SF Mono", ui-monospace, Menlo, Monaco, monospace'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "12px"
  md: "20px"
  lg: "32px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
components:
  card-surface:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "clamp(1.25rem, 3vw, 2rem)"
  card-surface-hover:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.accent-primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  icon-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: Tulio Cunha — Personal Developer Site

## Overview

**Creative North Star: "The Native Workshop"**

A personal developer site that reads like macOS Tahoe documentation crossed with a premium indie Mac app: dark layered surfaces, precise SF Pro hierarchy, restrained motion, and depth that communicates engineering craft. The system rejects generic portfolio templates, SaaS landing clichés, and decorative glass without purpose.

**Key Characteristics:**

- Dark-first with full light-mode parity via `[data-theme="light"]`
- Token-driven CSS in `src/styles/tokens/` (no Tailwind on marketing surfaces)
- 4-layer elevation shadows with inset highlights on cards
- Liquid-glass mobile nav at ≤1024px
- Fluid typography with Apple HIG scale ratios
- Editorial blog surfaces use New York Reader for long-form

## Colors

Tahoe dark neutrals with system-accent blues; light mode uses cool off-white grouped surfaces.

### Primary

- **System Blue** (`#0d8aff`): Links, primary CTAs, interactive glow, accent tints on cards and nav.

### Neutral

- **Obsidian Base** (`#050505`): Page background, hero fade targets.
- **Elevated Graphite** (`#161618`–`#232327`): Cards, panels, grouped sections.
- **Primary Text** (`#f5f5f7`): Headings and body on dark surfaces.
- **Secondary Text** (rgba cool blue-white ~76%): Supporting copy, eyebrows.
- **Hairline** (rgba white ~8%): Card borders, separators.

### Named Rules

**The Restraint Rule.** Accent blue appears on links, focus, and intentional highlights only. Surfaces stay neutral; color signals interaction.

## Typography

**Display Font:** SF Pro (system-ui fallback)
**Body Font:** SF Pro
**Reader Font:** New York Reader (blog prose)
**Mono Font:** SF Mono

**Character:** Native, confident, readable. Hierarchy through scale and weight, not decorative type.

### Hierarchy

- **Display** (600, `--fs-large-title`, lh 1.08): Hero-adjacent titles, profile name.
- **Headline** (600, `--fs-title-2`/`--fs-title-3`): Section titles.
- **Body** (400, `--fs-body`, lh 1.65, max ~72ch on marketing): Lede copy, card summaries.
- **Label** (600, `--fs-eyebrow`, uppercase, tracked): Section eyebrows, used sparingly.
- **Reader** (400, `--font-reader-serif`): Blog article body.

### Named Rules

**The Measure Rule.** Marketing ledes cap at 62–72ch; blog prose uses reader measure tokens.

## Elevation

Hybrid: tonal layering plus 4-layer macOS-style shadows. Depth is structural on cards and chrome, ambient on hover.

### Shadow Vocabulary

- **Card rest** (`--shadow-card`): Default interactive surfaces with inset top highlight.
- **Card hover** (`--shadow-card-hover`): Lift on hover/focus-visible.
- **Topbar** (`--shadow-topbar`): Shell chrome separation.
- **Focus ring** (shadow tokens in `shadows.css`): Keyboard focus on tiles and links.

### Named Rules

**The Earned Depth Rule.** Shadows intensify on interaction; idle surfaces stay calm.

## Components

### Buttons

- **Shape:** `--radius-sm` (12px)
- **Primary:** System blue fill, white text, spring easing on hover
- **Ghost/secondary:** Fill tokens `--fill-secondary`, hairline border

### Cards / Containers

- **Corner Style:** `--radius-md` (20px)
- **Background:** `--surface-card` with `--surface-card-border`
- **Shadow Strategy:** `--shadow-card` → `--shadow-card-hover`
- **Internal Padding:** `--card-padding` (fluid clamp)

### Icon tiles / dock links

- **Shape:** 20px radius, brand-tinted ambient glow per icon
- **States:** Hover lift, focus-visible ring, active press depth

### Navigation

- **Desktop:** Centered pill in topbar, sidebar icon rail
- **Mobile (≤1024px):** Liquid-glass bottom dock; theme toggle in topbar
- **Search:** Command palette popover (shadcn/Base UI)

### Hero (Remotion)

- Full-viewport bleed behind topbar; bottom gradient feather into `--bg`
- Fallback static Macintosh image when island not hydrated

## Do's and Don'ts

### Do:

- **Do** use CSS custom properties from `src/styles/tokens/` for all repeated values.
- **Do** preserve reduced-motion paths and `DOMContentLoaded` fallbacks.
- **Do** use `touch-action: pan-x pan-y` on idle horizontal rails.
- **Do** keep liquid glass purposeful on mobile nav and selective chrome only.

### Don't:

- **Don't** use cream/sand body backgrounds or SaaS hero-metric templates.
- **Don't** add gradient text, side-stripe borders, or uppercase eyebrows on every section.
- **Don't** use decorative glassmorphism without hierarchy purpose.
- **Don't** introduce fake Apple branding or clone Apple product pages literally.
- **Don't** use `touch-action: pan-x` alone on idle scroll rails (traps vertical scroll).
