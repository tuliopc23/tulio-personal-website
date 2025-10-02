## Why

The Sanity CMS integration is functional, but key optimizations will dramatically improve performance, user experience, and content authoring capabilities:

1. **Image Performance**: Images from Sanity are not using the built-in CDN optimization (responsive srcsets, WebP/AVIF, proper sizing)
2. **Homepage Disconnect**: Recent posts aren't surfaced on the homepage, missing a key engagement opportunity
3. **Manual Type Safety**: Schema changes require manual TypeScript interface updates, increasing maintenance burden
4. **Limited Content Blocks**: Authors can only use basic formatting—no callouts, video embeds, or rich media blocks
5. **Category/Tag Navigation**: Users can't browse by category or filter by tags effectively
6. **No Syntax Highlighting**: Code blocks lack proper syntax highlighting for readability

## What Changes

### 1. Image Optimization Pipeline
- Update `ArticlePortableImage.astro` to use Sanity's image URL builder
- Generate responsive srcset (320w, 640w, 768w, 1024w, 1280w, 1920w)
- Auto-convert to WebP/AVIF with JPEG fallback
- Implement blur-up placeholder from LQIP
- Add `loading="eager"` for hero images, `loading="lazy"` for content
- Optimize hero image rendering in blog detail pages

### 2. Homepage Recent Posts Section
- Create `src/components/RecentPosts.astro` component
- Fetch 3 most recent posts from Sanity
- Display with card layout matching site aesthetic
- Add "View all articles →" link to `/blog`
- Integrate into `src/pages/index.astro`

### 3. Automated Type Generation
- Install `sanity-codegen` for schema-to-TypeScript generation
- Add `npm run sanity:typegen` script
- Generate `src/types/sanity.generated.ts` from schemas
- Update `src/sanity/lib/posts.ts` to use generated types
- Add git pre-commit hook to regenerate types on schema changes

### 4. Enhanced Portable Text Components
- **Callout block**: Info, warning, success, error variants with icons
- **Video embed**: YouTube, Vimeo support with responsive aspect ratios
- **Image gallery**: Multi-image carousel with lightbox
- **Tweet embed**: Twitter/X post embedding
- **Table component**: Responsive data tables
- **Divider**: Horizontal rules with custom styling
- All styled with Apple-inspired design tokens

### 5. Category & Tag Pages
- Create `src/pages/blog/category/[slug].astro` for category archives
- Create `src/pages/blog/tag/[slug].astro` for tag archives
- Add category/tag metadata pages with descriptions
- Update blog listing to show active filters
- Add breadcrumbs for navigation context

### 6. Syntax Highlighting
- Install `shiki` for server-side syntax highlighting
- Configure with Apple-inspired theme (SF Mono, Apple colors)
- Support 20+ languages (JS, TS, Python, Swift, Go, etc.)
- Add line numbers and highlighting
- Include copy-to-clipboard button

### 7. Performance Optimizations
- Code-split Sanity visual editing (only load in preview mode)
- Optimize GROQ queries (limit projections to needed fields)
- Add caching headers for static blog pages
- Implement incremental static regeneration pattern
- Reduce bundle size (<50KB for blog pages)

### 8. SEO & Discovery Enhancements
- Generate sitemap with Sanity post URLs and priority
- Add JSON-LD BreadcrumbList for category/tag pages
- Implement Open Graph image generation from hero images
- Add reading time estimates to metadata
- Include category in canonical URL structure

## Impact

### Affected Specs
- **MODIFIED**: `sanity-cms-integration` (image optimization, type generation)
- **ADDED**: `blog-enhancements` (new spec for advanced features)

### Affected Code
- `src/components/ArticlePortableImage.astro` → Add Sanity image URL builder
- `src/components/RecentPosts.astro` → New component for homepage
- `src/components/portable-text/` → New callout, video, gallery, table components
- `src/pages/index.astro` → Add recent posts section
- `src/pages/blog/category/[slug].astro` → New category archive pages
- `src/pages/blog/tag/[slug].astro` → New tag archive pages
- `src/sanity/lib/posts.ts` → Use generated types, optimize queries
- `src/sanity/schemaTypes/` → Add callout, video, gallery schemas
- `package.json` → Add sanity-codegen, shiki dependencies
- `sanity.config.ts` → Add custom input components for new block types

### Performance Impact
- **Image sizes**: 60-80% reduction with WebP/AVIF
- **LCP improvement**: 40-60% faster with responsive images
- **Bundle size**: 15-20KB reduction with code splitting
- **Build time**: 5-10% increase for type generation (acceptable tradeoff)

## Non-Goals

- **Advanced CMS features**: Workflows, versioning, multi-user collaboration (Sanity provides these)
- **i18n/Multi-language**: Not in scope for initial blog (future consideration)
- **Comments system**: External solution (Disqus, etc.) if needed later
- **Newsletter integration**: Separate implementation if desired
- **Analytics**: External tools (Plausible, Fathom) recommended
- **Full-text search**: Vector search via Sanity embeddings is separate concern

## Success Criteria

1. **Performance**: Lighthouse scores ≥95 for all metrics
2. **Image optimization**: WebP/AVIF served to supporting browsers, proper srcsets
3. **Homepage engagement**: Recent posts visible and clickable
4. **Type safety**: Schema changes auto-generate TypeScript types
5. **Content richness**: Authors can use callouts, videos, galleries in posts
6. **Navigation**: Users can browse by category/tag with clear filtering
7. **Code readability**: Syntax highlighting works for 15+ languages
8. **Build time**: Under 60 seconds with <100 posts
9. **Bundle size**: Blog pages under 50KB gzipped JS

## Rollout Plan

### Phase 1: Image Optimization (Priority: High, 2-3 hours)
- Implement Sanity image URL builder in ArticlePortableImage
- Add responsive srcset generation
- Configure WebP/AVIF with fallbacks
- Add LQIP blur-up placeholders
- Test across different device sizes

### Phase 2: Homepage Integration (Priority: High, 1 hour)
- Create RecentPosts component
- Integrate with homepage
- Style with existing card components
- Add loading states

### Phase 3: Type Generation (Priority: Medium, 1 hour)
- Install and configure sanity-codegen
- Generate initial types
- Update posts.ts imports
- Add npm script and documentation

### Phase 4: Enhanced Blocks (Priority: Medium, 3-4 hours)
- Design and implement callout schema/component
- Add video embed support
- Create image gallery component
- Add table support
- Style all with Apple-inspired tokens

### Phase 5: Category/Tag Pages (Priority: Medium, 2-3 hours)
- Create category archive page
- Create tag archive page
- Add category/tag metadata
- Update breadcrumbs and navigation

### Phase 6: Syntax Highlighting (Priority: Low, 1-2 hours)
- Install and configure Shiki
- Apply Apple-inspired theme
- Add line numbers and copy button
- Test with various languages

### Phase 7: Performance Polish (Priority: Low, 2 hours)
- Code-split visual editing
- Optimize GROQ queries
- Add caching headers
- Run performance audits
- Document optimizations

## Estimated Timeline

**Total**: 12-16 hours over 1-2 weeks

- **Week 1**: Phases 1-3 (Image optimization, homepage, types)
- **Week 2**: Phases 4-7 (Enhanced blocks, navigation, syntax highlighting, polish)

## Alternative Approaches

### Image Optimization Alternative
- Use Astro's built-in image optimization instead of Sanity's CDN
- **Rejected**: Sanity's CDN is faster and purpose-built for their images

### Type Generation Alternative
- Continue manual TypeScript interfaces
- **Rejected**: Error-prone and doesn't scale with schema complexity

### Content Blocks Alternative
- Use MDX components instead of Portable Text blocks
- **Rejected**: Sanity's Portable Text is platform-agnostic and more flexible

## Dependencies

- `sanity-codegen` - Schema to TypeScript generation
- `shiki` - Syntax highlighting
- `@sanity/image-url` - Already installed ✅

## Migration Notes

- Existing posts will automatically benefit from image optimization
- No content migration needed
- New block types are additive (old posts unaffected)
- Type generation is development-time only (no runtime changes)
