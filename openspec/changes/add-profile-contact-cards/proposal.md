# Profile Contact Micro Cards

**Status:** draft  
**Date:** 2025-10-14  
**Author:** Codex (AI assistant)

## Why
- The Profile card still renders Location and Email as a legacy definition list that exposes raw strings and chip-era iconography, which breaks visual continuity with the new card rail architecture.
- Those meta items do not take advantage of the curated Apple-style assets already shipped in `public/icons/Socials/` (`Email.webp`, `Location.svg`), so the section feels less polished than the refreshed social CTAs.
- The current presentation splits copy across multiple focus targets (label, value link) that feel cramped on mobile and fail to communicate clear actions (“Email”, “View on Maps”).

## What Changes
- Replace the definition-list meta block with a pair of compact “contact micro cards” that reuse the card rail anatomy (icon tile, card shell, reveal hooks) scaled down to sit directly beneath the profile header without crowding the summary.
- Introduce action-led copy (“Email Tulio”, “View Location”) with optional helper text while keeping the underlying URLs hidden—contacts open the appropriate `mailto:` or Maps deep link when the card is activated.
- Leverage the dedicated Mail and Maps assets from `public/icons/Socials/`, ensuring light/dark variants, tint tokens, and hover/focus treatments match the social CTA cards while adopting a slightly tighter layout to preserve balance inside the Profile card.
- Wire the cards into both desktop and mobile layouts: side-by-side on desktop, horizontally scrollable on narrow viewports, integrated with Page/Scroll indicators where necessary.

## Impact
- **Design:** Profile hero regains parity with the Apple-inspired card system and removes the remaining chip-era styling.
- **Engineering:** Requires new contact card data model, updates to `ProfileCard.astro`, and potential tweaks to card utility classes for the compact variant.
- **Accessibility:** Consolidates each contact method into a single focusable surface with descriptive aria labels, improving keyboard and screen reader clarity.
- **Dependencies:** Complements the pending `update-profile-card-social-cta` change; both changes must coordinate on shared card tokens to avoid divergent styling.
