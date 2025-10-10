## Context

Mobile optimization requires balancing Apple's design aesthetics with practical constraints of smaller screens and touch interaction. The current implementation prioritizes desktop experience, leaving mobile users with usability issues.

Key constraints:
- Must maintain Apple HIG design language on mobile
- Shadow effects are expensive on mobile GPUs
- Touch targets require larger tap areas than mouse pointers
- Horizontal scrolling needs clear affordances on touch devices
- Off-canvas navigation is standard mobile pattern but needs careful implementation

Stakeholders:
- Mobile users (60%+ of traffic)
- Accessibility requirements (WCAG 2.1 AA)
- Performance budgets (Lighthouse 90+)
- Design system consistency

## Goals / Non-Goals

### Goals
- Fix critical mobile UX issues (sidebar, card scrolling, shadows)
- Achieve 44x44px minimum touch targets (Apple HIG)
- Smooth 60fps scrolling on mobile devices
- Clear scroll affordances for horizontal card carousels
- Maintain visual consistency with desktop experience
- Pass Lighthouse mobile audit with 90+ performance

### Non-Goals
- Redesigning desktop layout (already working well)
- Adding new features or capabilities
- Changing color schemes or brand identity
- Supporting browsers older than iOS 14 / Chrome 90
- Implementing pull-to-refresh or other native gestures
- Creating separate mobile-only pages

## Decisions

### Sidebar Drawer Pattern
**Decision**: Use off-canvas drawer with backdrop overlay below 1024px breakpoint.

**Rationale**:
- Standard mobile pattern, users familiar with behavior
- Preserves full content width on mobile
- Allows sidebar to maintain full functionality (filter, links)
- Spring animation matches Apple's motion design language

**Alternatives considered**:
- Bottom sheet: Less familiar, conflicts with browser UI
- Collapsible accordion: Takes up vertical space, harder to scan
- Hamburger menu: Loses the sidebar's visual hierarchy

### Shadow Simplification
**Decision**: Reduce 4-layer shadow system to 2-layer on mobile with decreased blur radius.

**Rationale**:
- 4-layer shadows cause frame drops on mobile GPUs (measured <40fps on iPhone 12)
- 2-layer system maintains depth perception while improving performance
- Reduced blur (28px → 20px) improves rendering without losing effect
- Matches iOS native shadow performance patterns

**Alternatives considered**:
- Remove shadows entirely: Loses depth, feels flat
- Use box-shadow optimization: Not enough performance gain
- Prerender shadows as images: Doesn't work with dynamic content

### Scroll Indicators
**Decision**: Add edge fade gradients + arrow hints for horizontal scroll sections.

**Rationale**:
- Edge fades are iOS-native pattern (App Store, Photos)
- Arrow hints provide clear affordance without cluttering UI
- Auto-hide after interaction reduces visual noise
- Works without JavaScript (gradients in CSS)

**Alternatives considered**:
- Dot pagination: Takes up space, doesn't show position within continuous scroll
- Scroll bars: Hidden by default on iOS, inconsistent
- Explicit "next/prev" buttons: Interrupts momentum scrolling

### Breakpoint Strategy
**Decision**: Use 5 breakpoints with fluid scaling via clamp():
- 320-480px (ultra-compact mobile)
- 481-720px (standard mobile)
- 721-1023px (tablet portrait)
- 1024-1279px (tablet landscape)
- 1280px+ (desktop)

**Rationale**:
- Covers 95%+ of device sizes in analytics
- Natural breakpoints match common device widths
- `clamp()` provides smooth transitions between breakpoints
- Avoids too many media queries (easier maintenance)

**Alternatives considered**:
- Container queries: Not ready for production (limited support)
- 3 breakpoints only: Too coarse, causes layout jumps
- Device-specific breakpoints: Fragile, hard to maintain

## Risks / Trade-offs

### Risk: Shadow simplification might reduce perceived quality
**Mitigation**: A/B test visual quality perception, preserve elevation hierarchy with other cues (borders, backgrounds). Simplified shadows only apply below 1024px where users expect faster performance over perfection.

### Risk: Drawer pattern adds complexity to sidebar code
**Mitigation**: Extract drawer logic into reusable script (`sidebar-drawer.js`). Document pattern thoroughly. Keep desktop sidebar simple with conditional rendering.

### Risk: Horizontal scroll might confuse users
**Mitigation**: Add clear visual affordances (edge fades, arrows, "Scroll for More" CTA). Implement scroll snap for predictable behavior. Test with real users.

### Trade-off: Reduced animations on mobile
**Acceptance**: Mobile users prioritize speed over decoration. Simplified shadows and reduced motion improve performance significantly. Desktop keeps full effects.

### Trade-off: Larger touch targets increase visual bulk
**Acceptance**: 44x44px is non-negotiable for accessibility. Use spacing and visual hierarchy to prevent feeling cramped.

## Migration Plan

### Phase 1: Non-breaking foundation (Week 1)
1. Add mobile-specific CSS tokens (shadows, spacing)
2. Create ScrollIndicator component (not yet used)
3. Add sidebar-drawer.js script (feature-flagged)
4. Audit touch targets, document issues

### Phase 2: Incremental rollout (Week 2)
1. Enable sidebar drawer on mobile
2. Add scroll indicators to card carousels
3. Apply shadow optimizations below 1024px
4. Fix touch target issues

### Phase 3: Polish & validation (Week 3)
1. Test on real devices (iOS, Android, tablet)
2. Run Lighthouse audits, fix regressions
3. Accessibility audit with screen reader
4. Fix edge cases and browser quirks

### Rollback strategy
If critical issues found:
1. Feature flag allows disabling drawer (fallback to hidden sidebar)
2. Shadow simplification can be reverted via CSS variable override
3. Scroll indicators are additive (can be hidden with `display: none`)
4. Touch target changes are cumulative, no breaking changes

### Success criteria
- Lighthouse mobile performance: 90+
- All touch targets: 44x44px minimum
- Scroll FPS on iPhone 12: Consistent 60fps
- No layout breaks: 320px to 2560px
- Zero accessibility regressions

## Open Questions

1. **Should we add haptic feedback for drawer interactions?**
   - Requires Vibration API, not widely supported
   - Decision: Skip for now, monitor user feedback

2. **How aggressive should scroll snap be?**
   - Too strong: Feels forced, prevents free browsing
   - Too weak: Cards misalign, looks sloppy
   - Decision: Use `scroll-snap-type: x mandatory` with testing

3. **Should mobile users see fewer cards in carousels?**
   - Concern: Loading 8 cards on mobile wastes bandwidth
   - Decision: Keep consistent for now, monitor analytics

4. **Add pull-to-refresh for blog page?**
   - Common mobile pattern but not in MVP scope
   - Decision: Post-MVP feature if data shows need
