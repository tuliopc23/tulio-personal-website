## Why

The homepage currently highlights portfolio and contact cards but does not surface recent writing, forcing visitors to click into the blog to discover new content.

## What Changes

- Add a "Latest writing" section to the homepage that lists the three most recent blog posts with title, summary, and publish date.
- Include a fallback state when fewer than three posts exist and a call-to-action for the full archive.
- Ensure the section respects the existing card layout and light/dark theme tokens.

## Impact

- Affected specs: `homepage-content`
- Affected code: `src/pages/index.astro`, `src/components/PostCard.astro`, `src/styles/section.css`
