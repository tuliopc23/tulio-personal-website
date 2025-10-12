# Project: Tulio Personal Website

## Overview

Apple-inspired personal developer website built with Astro, featuring a content-driven architecture with Sanity CMS integration. The design philosophy emphasizes clean typography, glass morphism effects, and system-native feel.

**Live Site:** https://www.tuliocunha.dev

## Tech Stack

### Core Framework
- **Astro 5.14.x** - Static site generator with islands architecture (currently 5.14.4)
- **TypeScript 5.9** - Strict typing via `astro/tsconfigs/strict`
- **Bun 1.2.22** - Package manager, task runner, and runtime

### UI & Styling
- **React 19.2.0** - For interactive components
- **Styled Components 6.1.x** - CSS-in-JS styling with SSR shim
- **clsx / tailwind-merge** - Utility class composition
- **Apple HIG Design** - Glass morphism, system fonts (SF Pro on Apple devices)
- **Custom CSS** - `apple-hig-liquid-glass-unified.css` for unified design system

### Content Management
- **Sanity CMS** - Headless CMS with visual editing
  - Project ID: `61249gtj`
  - Dataset: `production`
  - Studio embedded at `/studio` (dev) and hosted separately (prod)
- **Portable Text** - Rich text content format
- **@sanity/astro 3.2.10** - Astro integration with Presentation tool wiring
- **@sanity/visual-editing 3.0.5** - Visual editing overlays

### Development Tools
- **Biome 2.2.5** - Primary formatter & linter (`bun run lint`, `bun run format`, `bun run check`)
- **ESLint 9 / @typescript-eslint 8** - Supplemental lint rules when needed
- **Prettier 3 + prettier-plugin-astro** - Legacy formatting compatibility
- **MDX** - Markdown with JSX for blog posts
- **Shiki** - Code syntax highlighting
- **@spotlightjs/astro** - Local debugging overlay

## Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components (.astro, .tsx)
├── content/        # Local content collections
├── data/           # Static data files
├── layouts/        # Page layouts
├── lib/            # Utility libraries
├── pages/          # Route pages (index, blog, etc.)
├── sanity/         # Sanity schema and queries
├── scripts/        # Build and utility scripts
├── styles/         # Global styles and theme
└── utils/          # Helper functions

openspec/           # OpenSpec documentation
public/             # Public static files
types/              # TypeScript type definitions
```

## Key Components

### Astro Components
- `Navbar.astro` - Glass blur navigation with sticky positioning
- `Footer.astro` - Site footer
- `Card.astro` - Base card component
- `PostCard.astro` - Blog post preview card
- `ProjectCard.astro` - Project showcase card
- `ProfileCard.astro` - Author/profile card
- `ArticleCard.astro` - Full article card
- `IconTile.astro` - Symbol/icon tiles (Apple style)
- `Breadcrumbs.astro` - Navigation breadcrumbs
- `ReadingProgress.astro` - Progress indicator for articles
- `ScrollToTop.astro` - Scroll to top button
- `CategoryBadges.astro` - Category/tag badges
- `CategoryList.astro` - Filterable category list
- `RecentPosts.astro` - Recent blog posts widget
- `LiquidThemeToggle.astro` - Liquid glass theme toggle with drag/tap interactions

### Sanity-Specific Components
- `ArticlePortableText.astro` - Renders Portable Text content
- `ArticlePortableImage.astro` - Optimized image rendering
- `ArticlePortableLink.astro` - Link rendering with routing
- `ArticleCodeBlock.astro` - Code blocks with syntax highlighting
- `VisualEditing.astro` - Visual editing overlay integration
- `src/sanity/actions/*` - Custom document actions for editorial workflow
- `src/sanity/lib/resolve.ts` - Presentation tool route resolver

## Coding Conventions

### TypeScript
- **Strict mode enabled** - Full type safety
- Use `interface` for object shapes
- Avoid `any`, use `unknown` when type is uncertain
- Path alias: `astro-portabletext` mapped to `types/astro-portabletext`

### Component Patterns
- **Astro components** for static/server-rendered content
- **React components** for client interactivity (use `client:load`, `client:visible`, etc.)
- Props typing with TypeScript interfaces
- Minimal use of comments - code should be self-documenting

### Styling
- **CSS Custom Properties** for theming (`--color-primary`, etc.)
- **System font stack** - Uses SF Pro on Apple devices
- **Glass morphism** - `backdrop-filter: blur()` for nav and overlays
- **Responsive design** - Mobile-first approach
- **Dark mode** - Uses `prefers-color-scheme`

### File Naming
- Components: PascalCase (e.g., `PostCard.astro`, `BrandIcon.astro`)
- Utilities: camelCase (e.g., `styled-components-shim.ts`)
- Pages: kebab-case for routes (e.g., `blog/[slug].astro`)

### Imports
- Use absolute imports from `src/` where beneficial
- Group imports: external → Astro/React → components → utils → types
- No unused imports (Biome enforces this)

## Development Workflow

### Running Locally
```bash
bun install              # Install dependencies
bun run dev              # Start dev server (localhost:4321)
bun run build            # Production build
bun run preview          # Preview production build
```

### Quality Checks
```bash
bun run lint             # Run Biome linting (non-destructive)
bun run lint:fix         # Apply Biome lint fixes
bun run format:check     # Dry-run Biome formatter
bun run format           # Format with Biome (writes)
bun run typecheck        # Run TypeScript compiler
bun run check            # Biome check (writes), typecheck, then build
```

**Always run `bun run check` before committing changes.**

### Sanity Workflow
```bash
bunx sanity login        # Authenticate (one-time)
bunx sanity deploy       # Deploy Studio to hosting
bun run sanity:typegen   # Generate TypeScript types from schema
```

## Environment Variables

### Required
- `PUBLIC_SANITY_PROJECT_ID` - Sanity project ID (default: `61249gtj`)
- `PUBLIC_SANITY_DATASET` - Dataset name (default: `production`)
- **Note:** Local dev falls back to the defaults above, but `bun run check` (production build) will fail if the variables are not explicitly set.

### Optional
- `SANITY_API_READ_TOKEN` - Read token for private datasets or visual editing
- `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` - Override Studio credentials when deploying
- `SANITY_STUDIO_PREVIEW_URL` - Explicit preview URL for Presentation mode
- `PUBLIC_SANITY_STUDIO_URL` - Hosted Studio URL (e.g., `https://project.sanity.studio`)
- `PUBLIC_SANITY_PREVIEW_URL` - Deployed site URL for Presentation mode
- `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` - Enable/disable visual editing overlays

## Design Principles

### Apple-Inspired Aesthetics
1. **Clean Typography** - System fonts, generous whitespace, clear hierarchy
2. **Glass Morphism** - Translucent surfaces with blur effects
3. **Subtle Animations** - Smooth transitions, respect reduced motion
4. **System Integration** - Respects user's color scheme and accessibility preferences
5. **Content First** - Design serves content, not vice versa

### Performance
- Static generation by default
- Island architecture for selective hydration
- Optimized images through Sanity CDN
- Minimal JavaScript footprint

### Accessibility
- Semantic HTML
- Keyboard navigation support
- ARIA labels where needed
- Color contrast compliance
- Reduced motion support

## Content Architecture

### Sanity Schema
Located in `src/sanity/` - defines content types:
- Posts/Articles
- Projects
- Categories
- Author profiles
- Media assets

### Content Types
- **Blog Posts** - MDX or Sanity-managed articles
- **Projects** - Portfolio/showcase items
- **Pages** - Static pages (About, Contact, etc.)

## Dependencies Notes

### Key Version Requirements
- React 19.2.0 - Latest stable, using new hooks
- Astro 5.14.x - Latest features and performance
- Sanity 4.10.2 - Modern Studio with hosted deployment
- Styled Components 6.1.x - Latest stable with SSR fixes
- Biome 2.2.5 - Unified formatting/linting across Astro + TS files

### Custom Shims
- `src/utils/styled-components-shim.ts` - Ensures SSR compatibility
- Vite aliases configured for styled-components resolution

## Common Tasks

### Adding a New Component
1. Create component file in `src/components/`
2. Follow naming convention (PascalCase)
3. Add TypeScript types for props
4. Use existing components as reference
5. Test in multiple viewports
6. Run `bun run check`

### Adding a New Page
1. Create `.astro` file in `src/pages/`
2. Use appropriate layout from `src/layouts/`
3. Follow URL structure conventions
4. Add to navigation if needed
5. Test routing and links

### Modifying Styles
1. Check `src/styles/theme.css` for existing variables
2. Use CSS custom properties for consistency
3. Test in light and dark modes
4. Verify responsive behavior
5. Check accessibility (contrast, focus states)

### Working with Sanity Content
1. Update schema in `src/sanity/` if needed
2. Run `bun run sanity:typegen` to update types
3. Query content in pages/components
4. Use `ArticlePortableText` for rich text
5. Test in Studio and on site

## Constraints & Considerations

### Browser Support
- Modern browsers only (ES2021+)
- Safari/WebKit optimized (target Apple ecosystem)
- Progressive enhancement for older browsers

### Performance Targets
- Lighthouse score: 90+ (all categories)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: Minimal JS

### Security
- No sensitive data in client-side code
- API tokens server-side only
- Sanity token not exposed to browser
- Content Security Policy considerations

## Known Issues & Workarounds

### Styled Components SSR
- Use custom shim in `src/utils/styled-components-shim.ts`
- Vite aliases configured for both standard and SSR builds

### Type Imports
- Custom types for `astro-portabletext` in `types/` directory
- Path mapping in `tsconfig.json`

## Future Considerations

- Consider migration paths as frameworks evolve
- Monitor Sanity API version changes
- Keep dependencies updated for security
- Evaluate new Astro features (View Transitions, etc.)
- Consider adding E2E tests (Playwright/Cypress)

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [React Documentation](https://react.dev)
