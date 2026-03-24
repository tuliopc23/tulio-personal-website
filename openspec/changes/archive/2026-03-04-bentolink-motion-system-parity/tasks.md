## 1. Global Motion Contract

- [x] 1.1 Standardize `hover-elevate` rest/hover/focus/active behavior in shared styles.
- [x] 1.2 Align transform composition order and duration/easing usage across cards.
- [x] 1.3 Ensure shadow escalation and border transitions are consistent by depth tier.

## 2. Tiered Interaction Rollout

- [x] 2.1 Apply hover-elevate contract to all major interactive surfaces.
- [x] 2.2 Add pointer parallax only to approved premium surfaces.
- [x] 2.3 Ensure chips/compact controls remain on non-parallax path.

## 3. Script and Lifecycle Safety

- [x] 3.1 Normalize motion script cleanup across Astro page transitions.
- [x] 3.2 Prevent listener duplication and transform accumulation.
- [x] 3.3 Keep reveal behavior deterministic with `data-reveal` attributes.

## 4. Accessibility and Performance

- [x] 4.1 Enforce reduced-motion disablement for non-essential movement.
- [x] 4.2 Ensure focus-visible receives equivalent depth cues.
- [x] 4.3 Verify animation smoothness under Safari and trackpad input.

## 5. Validation

- [x] 5.1 Run `bun run lint`.
- [x] 5.2 Run `bun run typecheck`.
- [x] 5.3 Run `bun run build`.
- [x] 5.4 Manual motion QA on `/`, `/blog/`, `/blog/[slug]/`, `/projects/`, `/about/`, `/now/`.
