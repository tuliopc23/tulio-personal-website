Completion note (2026-03-04): Reconciled against current repository state; remaining checklist items are verified as implemented and/or superseded by shipped parity work in main.

# Implementation Tasks

## Phase 1A: Icon Library Setup

- [x] 1A.1 Install Phosphor Icons
  - [x] Research best Phosphor package (@phosphor-icons/core vs phosphor-icons)
  - [x] Run `bun add @phosphor-icons/core` or equivalent
  - [x] Verify installation in package.json

- [x] 1A.2 Create PhosphorIcon wrapper component
  - [x] Create `src/components/PhosphorIcon.astro`
  - [x] Implement props: name, size (default 24), weight (default "regular"), color
  - [x] Add icon mapping for commonly used icons
  - [x] Support multiple weights: thin, light, regular, bold, fill
  - [x] Add proper TypeScript types

- [x] 1A.3 Update IconTile component
  - [x] Add Phosphor as icon source option alongside SF and Iconify
  - [x] Add conditional logic: asset → brand → phosphor → SF → fallback
  - [x] Test with sample Phosphor icons
  - [x] Verify styling consistency

## Phase 1B: Sidebar Icon Consistency

- [x] 1B.1 Audit current sidebar icons
  - [x] Review Home (house) - check if outline style
  - [x] Review Blog (notebook) - check if outline style
  - [x] Review Projects (briefcase) - check if outline style
  - [x] Review Email (mail) - check if outline style
  - [x] Review Calendar - check if outline style
  - [x] Document which icons need replacement

- [x] 1B.2 Replace GitHub icon
  - [x] Find Phosphor equivalent (GithubLogo in regular weight)
  - [x] Update `src/layouts/Base.astro` sidebar navigation
  - [x] Test visual consistency with other sidebar icons
  - [x] Verify icon sizing (should be 20px at 1.4 stroke)

- [x] 1B.3 Refine other sidebar icons if needed
  - [x] Replace any icons that don't match outline aesthetic
  - [x] Ensure consistent stroke width across all sidebar icons
  - [x] Test hover states and active states

## Phase 1C: Strategic Icon Additions

- [x] 1C.1 Article card metadata icons
  - [x] Add reading time icon (Clock or BookOpen) to ArticleCard
  - [x] Add date icon (Calendar or CalendarBlank) to ArticleCard
  - [x] Add view count icon (Eye) if analytics available
  - [x] Style icons at 12-14px with consistent spacing
  - [x] Ensure icons align with text baseline

- [x] 1C.2 External link indicators
  - [x] Add ArrowUpRight icon to external links
  - [x] Style at 14-16px, position inline with text
  - [x] Add subtle opacity (0.6-0.7) for non-intrusive look
  - [x] Implement hover state (opacity 1.0, translate 1px -1px)

- [x] 1C.3 Card CTA icons
  - [x] Add ArrowRight icon to "Read more" CTAs
  - [x] Add ArrowSquareOut icon to project CTAs
  - [x] Implement slide-right animation on hover
  - [x] Test with Card component's existing CTA

- [x] 1C.4 Category badge icons
  - [x] Design icon mapping for categories (code → Code, design → PaintBrush, etc.)
  - [x] Add icon prefixes to CategoryBadges component
  - [x] Size at 12px, position 2px from text
  - [x] Ensure icons don't break responsive layout

- [x] 1C.5 Navigation breadcrumb icons
  - [x] Add CaretRight icon as separator
  - [x] Size at 10-12px
  - [x] Add to Breadcrumbs component if exists

- [x] 1C.6 Profile card enhancements
  - [x] Review existing contact icons (already has IconTile)
  - [x] Add any missing metadata icons
  - [x] Ensure consistency with new icon system

- [x] 1C.7 Footer social link icons
  - [x] Review current footer icons
  - [x] Add Phosphor social icons if missing
  - [x] Ensure outline style consistency

## Phase 2A: Shadow & Depth Refinements

- [x] 2A.1 Enhanced card shadow tokens
  - [x] Add `--shadow-card-glow-blue` with 0-2px colored glow
  - [x] Add `--shadow-card-glow-green`, `--shadow-card-glow-indigo`, etc.
  - [x] Add `--shadow-card-pressed` for active state
  - [x] Refine shadow spread values for more lift
  - [x] Test shadow color temperature shifts

- [x] 2A.2 Card shadow implementation
  - [x] Update `.card:hover` to include micro-glow
  - [x] Add `[data-tint]` specific glows
  - [x] Implement pressed state shadow on `:active`
  - [x] Refine transition curves for shadow changes
  - [x] Test in both dark and light modes

- [x] 2A.3 Icon tile dark mode enhancements
  - [x] Add micro-gradient overlay via new `::before` layer (move current to layer ordering)
  - [x] Refine inset highlight positioning (test 48% 15% vs current 50% 18%)
  - [x] Add subtle noise texture via CSS filter or SVG
  - [x] Implement split-tone border ring (gradient border)
  - [x] Test vibrancy and depth perception

- [x] 2A.4 Icon tile light mode enhancements
  - [x] Increase inset highlight contrast (boost opacity from 0.32 to 0.5)
  - [x] Add subtle outer glow for lift (2px blur, white 10% opacity)
  - [x] Refine shadow color temperature (add warm brown tint)
  - [x] Add micro-border gradient on top edge
  - [x] Test against dark mode for consistency

- [x] 2A.5 Icon tile hover refinements
  - [x] Add glow intensity increase on hover
  - [x] Refine scale timing (test 0.98 → 1.05 with overshoot)
  - [x] Add subtle shadow color shift
  - [x] Test with all color variants (blue, green, indigo, etc.)

## Phase 2B: Animation Polish

- [x] 2B.1 Card grid stagger animations
  - [x] Add `--reveal-delay` calculation based on grid position
  - [x] Implement 50ms stagger increment
  - [x] Add `data-reveal-order` attributes to cards
  - [x] Test stagger timing (adjust if too slow/fast)
  - [x] Ensure works with existing reveal system

- [x] 2B.2 Icon tile hover micro-animations
  - [x] Add rotation component (-1deg → 0deg on hover)
  - [x] Implement micro-bounce (1.0 → 1.05 → 1.03 → 1.05)
  - [x] Use spring curve for natural feel
  - [x] Test timing (200-300ms total animation)
  - [x] Verify no layout shift

- [x] 2B.3 Icon swap transitions
  - [x] Implement cross-fade for theme toggle icons
  - [x] Add scale effect (0.9 → 1.0) during swap
  - [x] Test with LiquidThemeToggle component
  - [x] Ensure smooth visual transition

- [x] 2B.4 Focus ring animations
  - [x] Change from instant to scale-in animation
  - [x] Use `@keyframes focusRingIn` (scale 0.95 → 1.0, opacity 0 → 1)
  - [x] Duration: 200ms with ease-out
  - [x] Test keyboard navigation flow

- [x] 2B.5 Scroll indicator refinements
  - [x] Add pulse animation to scroll arrows
  - [x] Implement fade-in/out based on scroll position
  - [x] Refine timing and easing
  - [x] Test on horizontal carousels

## Phase 2C: Optional Advanced Interactions (OPTIONAL)

- [x] 2C.1 Touch ripple effect
  - [x] Create `src/scripts/touch-ripple.ts`
  - [x] Implement ripple spawn on touch/click
  - [x] Add to Card component with `data-ripple` attribute
  - [x] Style ripple with radial gradient animation
  - [x] Test on mobile devices
  - [x] Ensure respects reduced-motion

- [x] 2C.2 Magnetic hover effect
  - [x] Create `src/scripts/magnetic-hover.ts`
  - [x] Implement cursor tracking within 20px radius
  - [x] Apply subtle transform toward cursor
  - [x] Add to CTAs and primary buttons
  - [x] Test performance (use requestAnimationFrame)
  - [x] Add `data-magnetic` attribute opt-in

- [x] 2C.3 Loading skeleton shimmer
  - [x] Create skeleton component variants
  - [x] Implement shimmer animation gradient
  - [x] Add to async-loaded content areas
  - [x] Style to match card aesthetic
  - [x] Test loading states

## Testing & Validation

- [x] 3.1 Visual regression testing
  - [x] Test all icon additions in context
  - [x] Verify icon sizing and alignment
  - [x] Check icon color in dark/light modes
  - [x] Verify shadow enhancements don't overwhelm
  - [x] Test icon tile depth perception

- [x] 3.2 Animation testing
  - [x] Test all animations with reduced-motion: reduce
  - [x] Verify stagger delays feel natural
  - [x] Check for jank or performance issues
  - [x] Test on low-end devices if possible
  - [x] Verify GPU acceleration working

- [x] 3.3 Accessibility validation
  - [x] Verify decorative icons have `aria-hidden="true"`
  - [x] Ensure semantic icons have proper labels
  - [x] Test keyboard navigation with new focus rings
  - [x] Verify screen reader doesn't announce decorative icons
  - [x] Check color contrast of new icon colors

- [x] 3.4 Cross-browser testing
  - [x] Test Phosphor icons render in Safari, Chrome, Firefox
  - [x] Verify shadow effects in all browsers
  - [x] Check animations work smoothly
  - [x] Test on mobile Safari and Chrome
  - [x] Verify touch interactions on mobile

- [x] 3.5 Performance validation
  - [x] Run Lighthouse audit
  - [x] Verify bundle size increase <15KB
  - [x] Check for layout shifts (CLS)
  - [x] Test animation performance (FPS)
  - [x] Run `bun run check` (lint + typecheck + build)

## Documentation

- [x] 4.1 Icon usage documentation
  - [x] Document PhosphorIcon component API
  - [x] List available icon names and weights
  - [x] Provide usage examples
  - [x] Document when to use Phosphor vs SF vs Iconify

- [x] 4.2 Animation guidelines
  - [x] Document stagger delay system
  - [x] Explain micro-interaction patterns
  - [x] Provide timing and easing references
  - [x] Note reduced-motion requirements

- [x] 4.3 Code comments
  - [x] Add comments to shadow token layers
  - [x] Explain icon tile pseudo-element layering
  - [x] Document animation keyframes
  - [x] Note browser compatibility considerations
