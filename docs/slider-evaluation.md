# Liquid Slider Evaluation

## Summary
Two potential integration points were reviewed for the liquid glass slider demo. The Projects page emerged as the only location where the control could enhance understanding without feeling ornamental: using the slider to scrub through project depth (quick overview vs. full case study) or to reveal project milestones along a timeline. Other sections (Now page workload mix, Profile skill levels) would either duplicate existing content or introduce a control without clear feedback.

## Opportunities Considered
- **Projects page — case study depth**: the slider could interpolate between concise card content and expanded details, letting visitors decide how deep to dive without navigating away. This aligns with the interactive “choose your level of detail” pattern used in Apple marketing pages.
- **Projects page — timeline scrubber**: alternatively, the slider could scrub through project milestones, animating hero imagery or bullet points as the handle moves.
- **Now page — time allocation**: rejected. A slider would imply the user can adjust the data, but the content is informational only.
- **Profile/About — skill emphasis**: rejected. The site already uses static cards and iconography; adding a slider would create an extra interaction without additional insight.

## Recommendation
Adopt the slider as part of a Projects page enhancement where content density actually changes as the handle moves. The control should:
1. Map slider position to a discrete set of detail tiers (e.g., Overview → Highlights → Deep Dive).
2. Animate content changes with gentle crossfades that respect `prefers-reduced-motion`.
3. Preserve current scroll position to avoid disorienting visitors.

This behaviour requires additional content modelling (short vs. long descriptions, milestone data) that is out of scope for the current toggle change. Until that data is prepared, the slider should remain unused in production.

## Next Steps
- Audit existing Sanity project documents for fields that can power detail tiers or milestone lists.
- Prototype the interaction in isolation (Storybook or a dedicated Astro playground page) to validate performance on mobile.
- Once content is ready, create a dedicated change proposal to integrate the slider into the Projects page.
