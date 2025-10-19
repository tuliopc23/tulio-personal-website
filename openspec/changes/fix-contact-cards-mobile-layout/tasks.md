# Tasks: Fix Contact Cards Mobile Layout

## Implementation
- [ ] Add mobile breakpoint override to `.profileCard__contactList` in ProfileCard.astro
- [ ] Add `min-width: 0` to `.profileCard__contactCard` for mobile
- [ ] Reduce `.profileCard__contactValue` font size to 11px on mobile
- [ ] Test on iPhone 13 Pro viewport (393×852)
- [ ] Test on iPhone SE (375×667)
- [ ] Verify desktop/tablet layouts unchanged
- [ ] Test light and dark modes
- [ ] Run `bun run check`

## Verification
- [ ] Cards display side-by-side on all mobile viewports
- [ ] No layout shifts on desktop/tablet
- [ ] Touch targets remain accessible (44×44pt minimum)
- [ ] Text remains readable at reduced size
- [ ] Long email addresses wrap gracefully

## Documentation
- [ ] Update proposal.md with implementation notes
- [ ] Document any deviations from original plan
