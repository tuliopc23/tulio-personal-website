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
