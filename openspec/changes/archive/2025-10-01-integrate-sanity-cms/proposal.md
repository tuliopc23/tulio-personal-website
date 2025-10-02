## Why

The site currently uses only MDX for local content, limiting content management capabilities and requiring code deployments for new blog posts. Integrating Sanity CMS will enable:

1. **Content editor empowerment**: Non-technical editors can create and publish blog posts through Sanity Studio without developer intervention
2. **Visual editing workflow**: Real-time preview with clickable overlays linking directly to editable fields improves content authoring experience
3. **Structured content foundation**: Establishes extensible schemas that support future marketplace features with services, pricing, and transactions
4. **Custom design preservation**: Maintains complete control over Apple-inspired visual design by avoiding all Sanity templates and visual builder themes

## What Changes

### Core Integration

- Install and configure Sanity v4 with `@sanity/astro`, `@sanity/client`, and `astro-portabletext` packages
- Set up environment variables for project ID (61249gtj), production dataset, API tokens, and studio URL
- Embed Sanity Studio at `/admin` route with authentication and deployment workflows

### Content Schemas

- Define blog post schema with title, slug, summary, publishedAt, author reference, categories, tags, hero image, and Portable Text body
- Create author schema with name, bio, avatar, and social links
- Create category schema for content organization
- Design schemas with future marketplace extensibility (services, pricing, transactions)

### Content Rendering

- Build custom Astro article template using repository CSS tokens (`src/styles/theme.css`) exclusively
- Map Portable Text blocks to custom components for paragraphs, headings, lists, quotes, code blocks, and images
- Implement responsive image optimization with Sanity's image pipeline (srcset, WebP/AVIF, lazy loading)
- Configure visual editing with `VisualEditing` component, stega encoding, and content source maps

### Data Fetching

- Create GROQ queries for blog listing, detail pages, and related posts with proper filtering and pagination
- Implement `loadQuery` helper to switch between `published` and `previewDrafts` perspectives
- Configure Sanity client with CDN endpoint for published content and live API for drafts
- Set up type-safe query results using generated TypeScript types

### Studio Configuration

- Configure Presentation tool for live preview of draft content using custom article template
- Add desk structure for organized content management (posts, authors, categories)
- Include field validation, help text, and required alt text for images
- Deploy studio to hosted URL (`bunx sanity@latest deploy`)

### SEO and Discovery

- Generate RSS and Atom feeds from Sanity content at `/blog/feed.xml` and `/blog/atom.xml`
- Add Open Graph and Twitter Card metadata using Sanity fields
- Include JSON-LD Article structured data for search engines
- Update sitemap generation to include Sanity post URLs

### Development Workflow

- Add `.env.example` with required Sanity environment variables
- Update `README.md` with Sanity setup instructions and Studio access
- Create `SANITY_DOCUMENTATION.md` with comprehensive integration reference
- Configure quality gates (`bun run check`) to validate Sanity integration

## Impact

### Affected Specs

- **ADDED**: `sanity-cms-integration` (complete new specification)
- **MODIFIED**: `blog-experience` (extends with Sanity-powered content management and visual editing)

### Affected Code

- `astro.config.mjs` → Add Sanity integration configuration
- `src/pages/admin/[...index].astro` → Embed Sanity Studio
- `src/lib/sanity/` → New directory for client, queries, and utilities
- `src/schemas/` → New directory for Sanity schema definitions
- `src/components/portable-text/` → New directory for Portable Text component mappings
- `src/layouts/ArticleLayout.astro` → Update or create for Sanity content rendering
- `src/pages/blog/[slug].astro` → Modify to fetch from Sanity instead of MDX
- `src/pages/blog/index.astro` → Update to query Sanity for post listing
- `package.json` → Add Sanity dependencies
- `.env.example` → Add Sanity environment variables
- `README.md` → Update with Sanity setup instructions
- `SANITY_DOCUMENTATION.md` → Create comprehensive integration reference

### Documentation Updates

- Project README with Sanity onboarding steps
- Environment variable configuration guide
- Studio deployment workflow
- Content editor documentation for Sanity Studio usage
- GROQ query patterns and examples

## Non-Goals

- **Sanity templates**: Will NOT use any prebuilt Sanity templates or visual builder themes
- **Shopify integration**: Future marketplace will use custom payment integration, not Shopify
- **eCommerce platform**: Not building a traditional eCommerce site with Sanity's commerce tools
- **User roles in Sanity**: Basic Studio authentication is sufficient; advanced role management is out of scope
- **Content migration**: Starting fresh; not migrating existing MDX content to Sanity automatically

## Success Criteria

1. **Studio accessibility**: Developers can access Studio at `/admin` locally and deployed URL in production
2. **Content creation**: Editors can create blog posts with rich text, images, and metadata without code changes
3. **Visual editing**: Preview mode shows clickable overlays that link directly to Studio fields
4. **Custom styling**: All rendered content uses repository CSS tokens with zero Sanity template classes
5. **Type safety**: TypeScript catches schema mismatches at build time
6. **Performance**: Lighthouse scores remain ≥90 for performance, accessibility, and SEO
7. **Build speed**: `bun run build` completes in under 60 seconds with <100 posts
8. **Quality gates**: `bun run check` passes with no lint, format, or type errors

## Rollout Plan

### Phase 1: Foundation (Week 1)

- Install Sanity packages and configure environment
- Embed Studio at `/admin` with authentication
- Define initial blog post, author, and category schemas
- Verify Studio access and content creation

### Phase 2: Rendering Pipeline (Week 2)

- Build custom Astro article template with repository CSS
- Map Portable Text blocks to custom components
- Implement image optimization with Sanity image API
- Configure GROQ queries for blog listing and detail pages

### Phase 3: Visual Editing (Week 3)

- Set up `VisualEditing` component with stega encoding
- Configure Presentation tool for live preview
- Implement perspective switching (published vs. previewDrafts)
- Test editor workflow with draft content

### Phase 4: SEO and Polish (Week 4)

- Generate RSS/Atom feeds from Sanity content
- Add Open Graph, Twitter Card, and JSON-LD metadata
- Update sitemap with Sanity post URLs
- Document editor workflows and Studio usage

### Phase 5: Validation and Launch

- Run `bun run check` and fix any issues
- Verify Lighthouse scores remain ≥90
- Test responsive behavior on mobile and desktop
- Deploy Studio to production URL
- Update project documentation
