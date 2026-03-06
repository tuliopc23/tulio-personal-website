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

Use **Node 24 LTS** for Sanity CLI tasks in this repo. Node 25 currently surfaces an upstream `DEP0169` `url.parse()` deprecation from Sanity dependencies.

## Replace content

- `public/avatar.svg`: your photo (use an image if you prefer)
- `src/pages/index.astro`: landing sections
- `src/pages/blog/`: posts & index
- `src/components/`: UI building blocks
- `src/styles/theme.css`: design tokens (colors, radii, spacing)

## Sanity Studio workflow

> Use Node 24 LTS when running `sanity` commands locally. The current published Sanity dependency chain still triggers `DEP0169` under Node 25, even though this repo does not call `url.parse()` directly.

1. Authenticate the CLI with your paid account: `bunx sanity@latest login`. The updated CLI (v4.10.x) ships with the new hosted deployment flows and dashboard tooling (see the 2025-09-25 changelog entry _"Sanity Studio v4.10.1: Portable Text Input fixes"_ for the current release cadence).
2. Deploy the Studio to Sanity's hosting: `bunx sanity@latest deploy`. Copy the generated `https://<project>.sanity.studio` URL.
3. Update your environment variables (see [Environment configuration](#environment-configuration) for the full list).
4. Run `bun run check` to verify linting, type generation, and the production build succeed with the current configuration.
5. Visit `/studio` locally to embed the Studio during development, or click the "Open the hosted Sanity Studio" link on that route in production to jump into the hosted editor.

With the deployment done you can log into the hosted Studio, use the latest Portable Text fixes, and author content that renders through the existing Apple-like typography and layout on the Astro front end.

## Environment configuration

Create a `.env` file (or copy `.env.example`) before running the site.

### Cloudflare Pages + Sanity webhook variables

This repo now treats **Cloudflare Pages** as the authoritative frontend deployment target.

- Keep sensitive values in your local `.env`, CI provider, or secret manager.
- The site itself is a **static Astro build**; it does **not** require Worker secrets for frontend deploys.
- Use a Cloudflare Pages **deploy hook** for Sanity-triggered rebuilds.

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

- `SANITY_API_WRITE_TOKEN` — Write token used by `bun run sanity:webhook` to create/update Sanity webhooks.
- `CLOUDFLARE_DEPLOY_HOOK_URL` — Direct Cloudflare Pages deploy hook URL for site rebuilds.
- `SANITY_STUDIO_WEBHOOK_URL` / `WEBHOOK_BASE_URL` — Optional external automation service for cross-posting or content-side workflows.
- `SANITY_WEBHOOK_SECRET` — Optional secret for external automation endpoints that validate webhook signatures.

## Verification checklist

Run these commands before deploying:

```bash
bun run check            # Lint → typecheck → production build (fails if required env vars missing)
bun run sanity:typegen   # Regenerates sanity.types.ts from current schema
```

## Production deploy (Cloudflare Pages)

The site is built with Astro and deployed as a **static site on Cloudflare Pages**.

### CI / platform build settings

**Install command:**

```bash
bun install
```

or `bun run install:ci`.

**Build command:** `bun run build`

**Build output directory:** `dist`

**Recommended deploy mode:** Cloudflare Pages Git integration

### If asset upload fails in CI

Errors like:

- Pages build/install failures
- intermittent provider-side build issues

usually mean a provider-side build or dependency issue, not a problem with the Pages architecture itself.

1. **Retry the deploy** (e.g. re-run the failed job or push an empty commit).
2. **Verify Pages settings** in Cloudflare:
   - install command: `bun install`
   - build command: `bun run build`
   - output directory: `dist`
3. **Check required environment variables** are available to the Pages build.

### Sanity-triggered rebuilds

Use a direct webhook path:

`Sanity publish/update/delete -> Sanity webhook -> Cloudflare Pages deploy hook`

Run this once after setting `SANITY_API_WRITE_TOKEN` and `CLOUDFLARE_DEPLOY_HOOK_URL`:

```bash
bun run sanity:webhook
```

This keeps rebuilds out of GitHub Actions and aligns Studio publishing with the active Cloudflare Pages deploy target.

## Additional docs

- [`docs/slider-evaluation.md`](docs/slider-evaluation.md) – analysis of where the liquid glass slider adds value (and when to defer it)
