## 1. Solid Integration

- [x] 1.1 Add `@astrojs/solid-js` integration to Astro config.
- [x] 1.2 Add required runtime dependencies for Solid island support.
- [x] 1.3 Confirm build and hydration behavior remain stable.

## 2. Widget Port

- [x] 2.1 Add Solid GitHub island component (`GitHubActivity.tsx`).
- [x] 2.2 Port carousel/commit rendering and keyboard interactions.
- [x] 2.3 Implement refresh/fallback handling for API errors and rate limits.

## 3. Styling Parity

- [x] 3.1 Add/adapt `github-activity-widget.css` to target token system.
- [x] 3.2 Ensure card surfaces, hints, and indicators match Bentolink depth language.

## 4. Page Integration

- [x] 4.1 Wire island into homepage GitHub section.
- [x] 4.2 Wire island into now page GitHub section.
- [x] 4.3 Preserve existing aria labels and section semantics.

## 5. Validation

- [x] 5.1 Run `bun run lint`.
- [x] 5.2 Run `bun run typecheck`.
- [x] 5.3 Run `bun run build`.
- [x] 5.4 Manual QA for `/` and `/now` interaction and fallback states.
