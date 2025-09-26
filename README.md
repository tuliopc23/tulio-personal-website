# Apple-like Personal Developer Site (Astro)

This template gives you a personal, content‑driven website with an **Apple Developer Docs** feel:

- Apple‑style **navbar** with glass blur
- **Sticky left sidebar** (docs vibe) with quick filter
- Card‑driven layout with **symbol tiles**
- Clean typography using the **system font stack** (SF on Apple devices)
- **Light/dark mode**, prefers‑color‑scheme aware
- Blog powered by **Astro + MDX**

## Quick start

```bash
bun create astro@latest -- --template minimal
# OR just use this folder directly:
bun install
bun run dev
```

## Replace content

- `public/avatar.svg`: your photo (use an image if you prefer)
- `src/pages/index.astro`: landing sections
- `src/pages/blog/`: posts & index
- `src/components/`: UI building blocks
- `src/styles/theme.css`: design tokens (colors, radii, spacing)

## Sanity Studio workflow

1. Authenticate the CLI with your paid account: `bunx sanity@latest login`. The updated CLI (v4.10.x) ships with the new hosted deployment flows and dashboard tooling (see the 2025-09-25 changelog entry _"Sanity Studio v4.10.1: Portable Text Input fixes"_ for the current release cadence).
2. Deploy the Studio to Sanity's hosting: `bunx sanity@latest deploy`. Copy the generated `https://<project>.sanity.studio` URL.
3. Update environment variables:
   - `PUBLIC_SANITY_STUDIO_URL` → hosted Studio URL so the `/studio` route links you to the web interface.
   - `PUBLIC_SANITY_PREVIEW_URL` → the deployed Astro site (e.g. `https://yourdomain.com`) so Presentation surfaces your Apple-inspired UI.
   - `SANITY_API_READ_TOKEN` → viewer token from **Manage project → API → Tokens**; required when datasets are private or when enabling Visual Editing overlays.
   - Optional: set `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true` in environments where you want Presentation overlays.
4. Run `bun run build` (or the full `bun run check`) to be sure the token and project IDs are wired correctly. The Sanity client now consumes the token server-side, so no secret is exposed to the browser.
5. Visit `/studio` locally to embed the Studio during development, or click the "Open the hosted Sanity Studio" link on that route in production to jump into the hosted editor.

With the deployment done you can log into the hosted Studio, use the latest Portable Text fixes, and author content that renders through the existing Apple-like typography and layout on the Astro front end.
