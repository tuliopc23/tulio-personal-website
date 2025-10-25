# Implementation Tasks

## Phase 1A: Icon Library Setup

- [ ] 1A.1 Install Phosphor Icons
  - [ ] Research best Phosphor package (@phosphor-icons/core vs phosphor-icons)
  - [ ] Run `bun add @phosphor-icons/core` or equivalent
  - [ ] Verify installation in package.json

- [ ] 1A.2 Create PhosphorIcon wrapper component
  - [ ] Create `src/components/PhosphorIcon.astro`
  - [ ] Implement props: name, size (default 24), weight (default "regular"), color
  - [ ] Add icon mapping for commonly used icons
  - [ ] Support multiple weights: thin, light, regular, bold, fill
  - [ ] Add proper TypeScript types

- [ ] 1A.3 Update IconTile component
  - [ ] Add Phosphor as icon source option alongside SF and Iconify
  - [ ] Add conditional logic: asset → brand → phosphor → SF → fallback
  - [ ] Test with sample Phosphor icons
  - [ ] Verify styling consistency

## Phase 1B: Sidebar Icon Consistency

- [ ] 1B.1 Audit current sidebar icons
  - [ ] Review Home (house) - check if outline style
  - [ ] Review Blog (notebook) - check if outline style
  - [ ] Review Projects (briefcase) - check if outline style
  - [ ] Review Email (mail) - check if outline style
  - [ ] Review Calendar - check if outline style
  - [ ] Document which icons need replacement

- [ ] 1B.2 Replace GitHub icon
  - [ ] Find Phosphor equivalent (GithubLogo in regular weight)
  - [ ] Update `src/layouts/Base.astro` sidebar navigation
  - [ ] Test visual consistency with other sidebar icons
  - [ ] Verify icon sizing (should be 20px at 1.4 stroke)

- [ ] 1B.3 Refine other sidebar icons if needed
  - [ ] Replace any icons that don't match outline aesthetic
  - [ ] Ensure consistent stroke width across all sidebar icons
  - [ ] Test hover states and active states

## Phase 1C: Strategic Icon Additions

- [ ] 1C.1 Article card metadata icons
  - [ ] Add reading time icon (Clock or BookOpen) to ArticleCard
  - [ ] Add date icon (Calendar or CalendarBlank) to ArticleCard
  - [ ] Add view count icon (Eye) if analytics available
  - [ ] Style icons at 12-14px with consistent spacing
  - [ ] Ensure icons align with text baseline

- [ ] 1C.2 External link indicators
  - [ ] Add ArrowUpRight icon to external links
  - [ ] Style at 14-16px, position inline with text
  - [ ] Add subtle opacity (0.6-0.7) for non-intrusive look
  - [ ] Implement hover state (opacity 1.0, translate 1px -1px)

- [ ] 1C.3 Card CTA icons
  - [ ] Add ArrowRight icon to "Read more" CTAs
  - [ ] Add ArrowSquareOut icon to project CTAs
  - [ ] Implement slide-right animation on hover
  - [ ] Test with Card component's existing CTA

- [ ] 1C.4 Category badge icons
  - [ ] Design icon mapping for categories (code → Code, design → PaintBrush, etc.)
  - [ ] Add icon prefixes to CategoryBadges component
  - [ ] Size at 12px, position 2px from text
  - [ ] Ensure icons don't break responsive layout

- [ ] 1C.5 Navigation breadcrumb icons
  - [ ] Add CaretRight icon as separator
  - [ ] Size at 10-12px
  - [ ] Add to Breadcrumbs component if exists

- [ ] 1C.6 Profile card enhancements
  - [ ] Review existing contact icons (already has IconTile)
  - [ ] Add any missing metadata icons
  - [ ] Ensure consistency with new icon system

- [ ] 1C.7 Footer social link icons
  - [ ] Review current footer icons
  - [ ] Add Phosphor social icons if missing
  - [ ] Ensure outline style consistency

## Phase 2A: Shadow & Depth Refinements

- [ ] 2A.1 Enhanced card shadow tokens
  - [ ] Add `--shadow-card-glow-blue` with 0-2px colored glow
  - [ ] Add `--shadow-card-glow-green`, `--shadow-card-glow-indigo`, etc.
  - [ ] Add `--shadow-card-pressed` for active state
  - [ ] Refine shadow spread values for more lift
  - [ ] Test shadow color temperature shifts

- [ ] 2A.2 Card shadow implementation
  - [ ] Update `.card:hover` to include micro-glow
  - [ ] Add `[data-tint]` specific glows
  - [ ] Implement pressed state shadow on `:active`
  - [ ] Refine transition curves for shadow changes
  - [ ] Test in both dark and light modes

- [ ] 2A.3 Icon tile dark mode enhancements
  - [ ] Add micro-gradient overlay via new `::before` layer (move current to layer ordering)
  - [ ] Refine inset highlight positioning (test 48% 15% vs current 50% 18%)
  - [ ] Add subtle noise texture via CSS filter or SVG
  - [ ] Implement split-tone border ring (gradient border)
  - [ ] Test vibrancy and depth perception

- [ ] 2A.4 Icon tile light mode enhancements
  - [ ] Increase inset highlight contrast (boost opacity from 0.32 to 0.5)
  - [ ] Add subtle outer glow for lift (2px blur, white 10% opacity)
  - [ ] Refine shadow color temperature (add warm brown tint)
  - [ ] Add micro-border gradient on top edge
  - [ ] Test against dark mode for consistency

- [ ] 2A.5 Icon tile hover refinements
  - [ ] Add glow intensity increase on hover
  - [ ] Refine scale timing (test 0.98 → 1.05 with overshoot)
  - [ ] Add subtle shadow color shift
  - [ ] Test with all color variants (blue, green, indigo, etc.)

## Phase 2B: Animation Polish

- [ ] 2B.1 Card grid stagger animations
  - [ ] Add `--reveal-delay` calculation based on grid position
  - [ ] Implement 50ms stagger increment
  - [ ] Add `data-reveal-order` attributes to cards
  - [ ] Test stagger timing (adjust if too slow/fast)
  - [ ] Ensure works with existing reveal system

- [ ] 2B.2 Icon tile hover micro-animations
  - [ ] Add rotation component (-1deg → 0deg on hover)
  - [ ] Implement micro-bounce (1.0 → 1.05 → 1.03 → 1.05)
  - [ ] Use spring curve for natural feel
  - [ ] Test timing (200-300ms total animation)
  - [ ] Verify no layout shift

- [ ] 2B.3 Icon swap transitions
  - [ ] Implement cross-fade for theme toggle icons
  - [ ] Add scale effect (0.9 → 1.0) during swap
  - [ ] Test with LiquidThemeToggle component
  - [ ] Ensure smooth visual transition

- [ ] 2B.4 Focus ring animations
  - [ ] Change from instant to scale-in animation
  - [ ] Use `@keyframes focusRingIn` (scale 0.95 → 1.0, opacity 0 → 1)
  - [ ] Duration: 200ms with ease-out
  - [ ] Test keyboard navigation flow

- [ ] 2B.5 Scroll indicator refinements
  - [ ] Add pulse animation to scroll arrows
  - [ ] Implement fade-in/out based on scroll position
  - [ ] Refine timing and easing
  - [ ] Test on horizontal carousels

## Phase 2C: Optional Advanced Interactions (OPTIONAL)

- [ ] 2C.1 Touch ripple effect
  - [ ] Create `src/scripts/touch-ripple.ts`
  - [ ] Implement ripple spawn on touch/click
  - [ ] Add to Card component with `data-ripple` attribute
  - [ ] Style ripple with radial gradient animation
  - [ ] Test on mobile devices
  - [ ] Ensure respects reduced-motion

- [ ] 2C.2 Magnetic hover effect
  - [ ] Create `src/scripts/magnetic-hover.ts`
  - [ ] Implement cursor tracking within 20px radius
  - [ ] Apply subtle transform toward cursor
  - [ ] Add to CTAs and primary buttons
  - [ ] Test performance (use requestAnimationFrame)
  - [ ] Add `data-magnetic` attribute opt-in

- [ ] 2C.3 Loading skeleton shimmer
  - [ ] Create skeleton component variants
  - [ ] Implement shimmer animation gradient
  - [ ] Add to async-loaded content areas
  - [ ] Style to match card aesthetic
  - [ ] Test loading states

## Testing & Validation

- [ ] 3.1 Visual regression testing
  - [ ] Test all icon additions in context
  - [ ] Verify icon sizing and alignment
  - [ ] Check icon color in dark/light modes
  - [ ] Verify shadow enhancements don't overwhelm
  - [ ] Test icon tile depth perception

- [ ] 3.2 Animation testing
  - [ ] Test all animations with reduced-motion: reduce
  - [ ] Verify stagger delays feel natural
  - [ ] Check for jank or performance issues
  - [ ] Test on low-end devices if possible
  - [ ] Verify GPU acceleration working

- [ ] 3.3 Accessibility validation
  - [ ] Verify decorative icons have `aria-hidden="true"`
  - [ ] Ensure semantic icons have proper labels
  - [ ] Test keyboard navigation with new focus rings
  - [ ] Verify screen reader doesn't announce decorative icons
  - [ ] Check color contrast of new icon colors

- [ ] 3.4 Cross-browser testing
  - [ ] Test Phosphor icons render in Safari, Chrome, Firefox
  - [ ] Verify shadow effects in all browsers
  - [ ] Check animations work smoothly
  - [ ] Test on mobile Safari and Chrome
  - [ ] Verify touch interactions on mobile

- [ ] 3.5 Performance validation
  - [ ] Run Lighthouse audit
  - [ ] Verify bundle size increase <15KB
  - [ ] Check for layout shifts (CLS)
  - [ ] Test animation performance (FPS)
  - [ ] Run `bun run check` (lint + typecheck + build)

## Documentation

- [ ] 4.1 Icon usage documentation
  - [ ] Document PhosphorIcon component API
  - [ ] List available icon names and weights
  - [ ] Provide usage examples
  - [ ] Document when to use Phosphor vs SF vs Iconify

- [ ] 4.2 Animation guidelines
  - [ ] Document stagger delay system
  - [ ] Explain micro-interaction patterns
  - [ ] Provide timing and easing references
  - [ ] Note reduced-motion requirements

- [ ] 4.3 Code comments
  - [ ] Add comments to shadow token layers
  - [ ] Explain icon tile pseudo-element layering
  - [ ] Document animation keyframes
  - [ ] Note browser compatibility considerations
