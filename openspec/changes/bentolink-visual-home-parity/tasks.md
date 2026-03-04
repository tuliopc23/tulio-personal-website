## 1. Home Primitive Alignment
- [x] 1.1 Align `ProfileCard` container/panel depth and spacing hierarchy with Bentolink reference.
- [x] 1.2 Align shared widget shell treatment on `index.astro` (`widget-box`, header hierarchy, depth states).
- [x] 1.3 Normalize `IconTile` embossed/glow behavior and ensure parent-hover coupling is consistent.

## 2. Profile Contacts + Social Completion
- [x] 2.1 Apply Bentolink-grade glass-tinted contact chip treatment.
- [x] 2.2 Expand social grid to 6 entries with GitHub and Mastodon.
- [x] 2.3 Ensure social tile labels, icon balance, and responsive grid behavior are parity-compliant.

## 3. Writing Card CTA Parity
- [x] 3.1 Replace plain CTA pill with chip-based CTA + icon affordance.
- [x] 3.2 Ensure metadata chips and CTA hierarchy match Bentolink style language.

## 4. Uses Removal
- [x] 4.1 Remove `/uses` links from layout/nav shells.
- [x] 4.2 Remove `/uses/` from sitemap.
- [x] 4.3 Remove `.uses__*` style blocks and any stale route references.

## 5. Validation
- [x] 5.1 Run `bun run lint`.
- [x] 5.2 Run `bun run typecheck`.
- [x] 5.3 Run `bun run build`.
- [x] 5.4 Manual QA of `/` (light/dark, desktop/mobile) and grep check for `/uses` leftovers.
