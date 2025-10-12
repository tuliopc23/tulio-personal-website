# Apple-like Personal Developer Site (Astro)

This template gives you a personal, content‑driven website with an **Apple Developer Docs** feel:

- Apple‑style **navbar** with glass blur
- **Sticky left sidebar** (docs vibe) with quick filter
- Card‑driven layout with **symbol tiles**
- Clean typography using the **system font stack** (SF on Apple devices)
- **Light/dark mode**, prefers‑color‑scheme aware
- Liquid glass theme toggle with drag + tap interactions
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
3. Update your environment variables (see [Environment configuration](#environment-configuration) for the full list).
4. Run `bun run check` to verify linting, type generation, and the production build succeed with the current configuration.
5. Visit `/studio` locally to embed the Studio during development, or click the "Open the hosted Sanity Studio" link on that route in production to jump into the hosted editor.

With the deployment done you can log into the hosted Studio, use the latest Portable Text fixes, and author content that renders through the existing Apple-like typography and layout on the Astro front end.

## Environment configuration

Create a `.env` file (or copy `.env.example`) before running the site.

### Required in all environments

- `PUBLIC_SANITY_PROJECT_ID` — Sanity project ID used by Astro clients.
- `PUBLIC_SANITY_DATASET` — Dataset serving published content.

> **Production builds fail** if either variable is missing. Local development falls back to the defaults (`61249gtj` / `production`) but you should supply explicit values for staging/production.

### Optional overrides & URLs

- `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` — Use when the Studio needs to target a different project/dataset than the public site.
- `SANITY_STUDIO_PREVIEW_URL` — Preferred Presentation preview URL (default falls back to `PUBLIC_SANITY_PREVIEW_URL`).
- `PUBLIC_SANITY_STUDIO_URL` — Hosted Studio URL for the `/studio` route link.
- `PUBLIC_SANITY_PREVIEW_URL` — Deployed site URL for Presentation previews.

### Visual editing & tokens

- `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` — Enable (`true`) or disable (`false`) Presentation overlays.
- `SANITY_API_READ_TOKEN` — Required when visual editing is enabled or content datasets are private.

If `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` is `true` and the read token is missing the build/runtime will fail with a configuration error. Disable the flag or supply a token to continue.

### Deployment automation (optional)

- `SANITY_API_WRITE_TOKEN` — Write token for webhook-triggered deployments.
- `GITHUB_PERSONAL_ACCESS_TOKEN` — Token for GitHub-triggered deploy scripts.
- `SANITY_WEBHOOK_SECRET` — Shared secret for webhook validation.

## Verification checklist

Run these commands before deploying:

```bash
bun run check            # Lint → typecheck → production build (fails if required env vars missing)
bun run sanity:typegen   # Regenerates sanity.types.ts from current schema
```

## Additional docs

- [`docs/slider-evaluation.md`](docs/slider-evaluation.md) – analysis of where the liquid glass slider adds value (and when to defer it)
