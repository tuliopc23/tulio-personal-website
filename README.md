#  Tulio's Personal Developer Site

A high-performance, content-driven personal website and portfolio with a professional **Apple Developer Docs** aesthetic. Built with **Astro 6**, **Sanity**, and **pnpm** (optionally [Vite+](https://viteplus.dev/) `vp` for a unified CLI), it features a refined design system, macOS-level visual effects, and AI-powered content workflows.

---

## ✨ Core Feature Highlights

### 🎨 macOS Tahoe 3D Shadows

Experience dramatic 3D elevation with a **7-layer shadow system** matching the quality of macOS Tahoe and Sonoma.

- **Split Inset Lighting**: Simulates a light source from above with top highlights and bottom depth shadows.
- **Dual Ambient Glows**: Color-specific 2-layer halos for brand icons (LinkedIn blue, Instagram pink, etc.).
- **DRAMATIC Hover States**: Smooth, spring-based transitions with up to 128px of shadow expansion.
- **Surface Polish**: Inset highlight layers create a "beveled edge" effect on all interactive cards.

### 🍱 BentoLink Integration

A full implementation of a "link-in-bio" style architecture seamlessly integrated into the site's design language.

- **Symbol Tiles**: High-fidelity icon-driven layout for social links and professional tools.
- **Reflector Treatment**: Atmospheric background layers and material language derived from the BentoLink design system.
- **Unified Depth**: Social modules share the same 3D elevation tokens as the rest of the site.

### 🤖 AI-Powered Content Engine

Content management is supercharged with native AI integrations and automated workflows.

- **Sanity Auto-Tagging**: Powered by **Sanity Blueprints** and **AI Agents**, posts are automatically analyzed and tagged based on title, summary, and Portable Text content.
- **Smart Reuse**: The AI prioritizes reusing existing tags (`Engineering`, `Design`, `Accessibility`, etc.) to maintain a clean taxonomy.
- **Visual Editing**: Real-time previews and overlays via Sanity's Presentation tool for "what you see is what you get" authoring.

### 📐 Robust Design System (Tokenized)

A unified, strict token-based styling system that ensures 100% consistency.

- **Tiered Spacing**: A 3-tier padding system (sm/md/lg) for cards, sections, and containers.
- **Glassmorphism Tiers**: 4 standard levels of glass blur with optimized `backdrop-filter` usage.
- **Typography Rhythm**: Standardized line-heights and font-size tokens derived from Apple's HIG.
- **Interaction Easing**: Spring-based motion tokens (`var(--motion-ease-spring)`) for a "liquid" feel.

---

## 🚀 The Tech Stack

### Frontend & Runtime

- **Framework**: [Astro 6](https://astro.build/) (Static Site Generation with Islands Architecture)
- **Package manager**: [pnpm 9](https://pnpm.io/) with Corepack; optional global [Vite+](https://viteplus.dev/) (`vp`) for install/build/test commands
- **Islands**: **React 19** (Hero animations, Remotion players) and **SolidJS** (High-performance UI fragments)
- **Content**: MDX and Portable Text (via `@portabletext/react`)

### CMS & Data

- **Backend**: [Sanity v5](https://www.sanity.io/) (Headless CMS)
- **Schema**: Type-safe definitions with automatic TypeScript generation.
- **Blueprints**: Automated content-lake side-effects (like auto-tagging).

### Styling & Quality

- **CSS**: Pure Vanilla CSS with a strict tokenized architecture (no Tailwind).
- **Linting**: [Biome](https://biomejs.dev/) (25x faster than ESLint/Prettier).
- **Deployment**: [Cloudflare Workers](https://developers.cloudflare.com/workers/) with static assets and global edge delivery.

---

## 🛠 Project Structure

```bash
├── functions/              # Sanity Blueprints & Cloudflare Workers
│   └── auto-tag/           # AI-powered tagging logic
├── openspec/               # Design specs and implementation plans
├── public/                 # Static assets (fonts, icons, branding)
├── src/
│   ├── components/         # Atomic UI building blocks (Astro/React/Solid)
│   ├── layouts/            # Base layouts with atmospheric shell logic
│   ├── pages/              # Route definitions (Blog, Projects, Now)
│   ├── sanity/             # Schema types and client configuration
│   ├── scripts/            # Theme, motion, and visual-editing logic
│   └── styles/
│       ├── tokens/         # Canonical design tokens (colors, shadows, etc.)
│       └── theme.css       # Style orchestrator
├── tests/                  # Multi-layer testing suite
└── wrangler.jsonc          # Cloudflare Worker + static asset configuration
```

---

## 📦 Developer Workflows

### Primary Commands

| Command                     | Description                                                                      |
| :-------------------------- | :------------------------------------------------------------------------------- |
| `pnpm run dev`              | Start the Astro dev server with system certs.                                    |
| `pnpm run check`            | Run Biome lint → TypeScript check → Production build.                            |
| `pnpm run check:ci`         | Run the production-oriented gate: Sanity health → Biome CI → TypeScript → build. |
| `pnpm run sanity:health`    | Verify Sanity environment, connectivity, and required singleton documents.       |
| `pnpm run deploy:preflight` | Run the full deployment preflight before Cloudflare Worker deploys.              |
| `pnpm run sanity:typegen`   | Regenerate `sanity.types.ts` from the current schema.                            |
| `pnpm run cf:deploy`        | Run deploy preflight and then deploy the Worker plus `dist/` static assets.      |
| `pnpm run test`             | Execute unit and Astro-specific integration tests.                               |
| `pnpm run test:e2e`         | Run Playwright end-to-end browser tests.                                         |

### Testing Strategy

- **Unit/DOM**: `vitest` for component logic and utility functions.
- **Astro Integration**: `vitest` with Node environment for SSR/Page verification.
- **E2E**: `playwright` for cross-browser visual and functional testing.
- **Smoke Tests**: Custom script that builds and verifies layout integrity.

---

## 📂 Documentation Deep Dives

- [**Design Audit Summary**](DESIGN_AUDIT_SUMMARY.md) — Breakdown of the 2026 design system overhaul.
- [**Tahoe 3D Shadows**](TAHOE_3D_SHADOWS.md) — Technical details of the 7-layer elevation system.
- [**Auto-Tagging Setup**](AUTO_TAGGING.md) — Deep dive into the AI-Agent integration.
- [**BentoLink Implementation**](BENTOLINK_FULL_IMPLEMENTATION_MASTERPLAN.md) — Architectural parity plan.
- [**Visual Language Reference**](BLOG_VISUAL_LANGUAGE_REFERENCE.md) — Editorial design patterns.

---

## 🔐 Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# Required for Sanity content access
PUBLIC_SANITY_PROJECT_ID="61249gtj"
PUBLIC_SANITY_DATASET="production"

# Required when:
# - the dataset is private, or
# - visual editing is enabled, or
# - the build environment cannot read published content anonymously
SANITY_API_READ_TOKEN="your_read_token"

# Optional local-only escape hatch.
# Lets development builds fall back when you are intentionally offline.
SANITY_ALLOW_BUILD_FALLBACK="false"

# Required for GitHub featured repo activity
# Either variable name is accepted by the build.
GITHUB_TOKEN="your_github_token"
# GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token"

# Optional for Automation
GITHUB_REPOSITORY_DISPATCH_TOKEN="your_github_repo_dispatch_token"
```

### Deployment Checklist

Before deploying to Cloudflare Workers:

1. Run `pnpm run deploy:preflight`
2. Confirm `pnpm run check:ci` is green
3. Deploy only after both pass without Sanity connectivity warnings

---

## 🍏 Quality Standards

Every pixel is aligned to Apple's **Human Interface Guidelines**.

1. **Performance**: 60fps interaction rhythm and sub-second TTI.
2. **Accessibility**: 44x44px minimum touch targets, keyboard-nav ready, and `prefers-reduced-motion` support.
3. **Consistency**: Zero hardcoded values; 100% token usage.

---

© 2026 Tulio. Built with precision.
