## 1. Research & Alignment
- [x] 1.1 Audit `ProfileCard.astro` meta block and existing card utility classes to confirm reusable pieces and identify spacing constraints.
- [x] 1.2 Review assets in `public/icons/Socials/` (Email, Location) and verify light/dark coverage plus required tints.
- [x] 1.3 Sync with `update-profile-card-social-cta` change to ensure shared card tokens (radius, shadows, motion) stay consistent.

## 2. Component Design
- [x] 2.1 Define a `contactCards` data model (title, helper copy, href, icon, tint, ariaLabel) mirroring the social CTA schema.
- [x] 2.2 Prototype a compact card variant that reuses the `card` shell and `IconTile` while tightening paddings and icon size (target 40–44px tile).
- [x] 2.3 Author copy for the Email and Location cards with clear action phrasing and hidden URLs.

## 3. Layout & Behaviour
- [x] 3.1 Replace the `<dl>` meta markup with the new contact cards in the desktop profile layout, ensuring they fit between the header and summary without overflow.
- [x] 3.2 Implement the mobile treatment (either inline stack or horizontal rail) with PageIndicator/ScrollIndicator hooks if scrollable, preserving 44×44px touch targets.
- [x] 3.3 Ensure the cards open the correct destinations (`mailto:` link, Apple Maps deep link) in a single interactive surface with proper aria labels.

## 4. Visual Polish & QA
- [x] 4.1 Tune theme-specific colors, shadows, and reveal timings so the contact micro cards blend with the existing profile and social cards.
- [x] 4.2 Validate keyboard navigation, focus outlines, and screen reader announcements across desktop and mobile layouts.
- [x] 4.3 Run `bun run check` and perform manual light/dark QA in Safari and Chrome viewports.
