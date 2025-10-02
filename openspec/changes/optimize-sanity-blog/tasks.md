## 1. Image Optimization Pipeline

- [ ] 1.1 Update `ArticlePortableImage.astro` to import `urlFor` from `src/sanity/lib/image.ts`
- [ ] 1.2 Generate responsive srcset with widths [320, 640, 768, 1024, 1280, 1920]
- [ ] 1.3 Configure auto-format for WebP/AVIF with JPEG fallback
- [ ] 1.4 Add LQIP (Low Quality Image Placeholder) blur-up effect
- [ ] 1.5 Set `loading="lazy"` for content images, `loading="eager"` for hero images
- [ ] 1.6 Add proper width/height attributes to prevent layout shift
- [ ] 1.7 Update hero image rendering in `src/pages/blog/[slug].astro` with Sanity URL builder
- [ ] 1.8 Test image optimization across mobile (375px), tablet (768px), desktop (1280px)

## 2. Homepage Recent Posts Integration

- [ ] 2.1 Create `src/components/RecentPosts.astro` component
- [ ] 2.2 Fetch 3 most recent posts using existing `getAllPosts` query with limit
- [ ] 2.3 Render with ArticleCard component for consistency
- [ ] 2.4 Add "View all articles →" link to `/blog`
- [ ] 2.5 Style section with existing theme tokens matching homepage aesthetic
- [ ] 2.6 Add loading state and empty state handling
- [ ] 2.7 Integrate component into `src/pages/index.astro` between existing sections
- [ ] 2.8 Test responsive layout on mobile and desktop

## 3. Automated Type Generation

- [ ] 3.1 Install `sanity-codegen` package (`bun add -D sanity-codegen`)
- [ ] 3.2 Create `sanity-codegen.config.ts` with schema paths and output location
- [ ] 3.3 Add `sanity:typegen` script to `package.json`
- [ ] 3.4 Generate initial types to `src/types/sanity.generated.ts`
- [ ] 3.5 Update `src/sanity/lib/posts.ts` to import and use generated types
- [ ] 3.6 Document type generation workflow in README
- [ ] 3.7 Add `.gitignore` entry for generated types if too large
- [ ] 3.8 Test that schema changes trigger type regeneration

## 4. Callout Block Component

- [ ] 4.1 Create `src/sanity/schemaTypes/callout.ts` schema with type variants (info, warning, success, error)
- [ ] 4.2 Add title and body fields (Portable Text for body)
- [ ] 4.3 Create `src/components/portable-text/Callout.astro` with Apple-inspired styling
- [ ] 4.4 Add SF Symbols icons for each variant
- [ ] 4.5 Style with theme tokens (colors, spacing, typography)
- [ ] 4.6 Register callout in `blockContent.ts` schema
- [ ] 4.7 Add callout component to ArticlePortableText component mapping
- [ ] 4.8 Test all four variants in a sample post

## 5. Video Embed Component

- [ ] 5.1 Create `src/sanity/schemaTypes/videoEmbed.ts` with URL field
- [ ] 5.2 Add validation for YouTube and Vimeo URLs
- [ ] 5.3 Create `src/components/portable-text/VideoEmbed.astro` with responsive aspect ratio
- [ ] 5.4 Extract video ID from URLs and generate embed code
- [ ] 5.5 Add play button overlay and thumbnail preview
- [ ] 5.6 Style video container with theme border radius and shadows
- [ ] 5.7 Register in blockContent.ts and component mapping
- [ ] 5.8 Test with YouTube and Vimeo embeds

## 6. Image Gallery Component

- [ ] 6.1 Create `src/sanity/schemaTypes/gallery.ts` with images array
- [ ] 6.2 Each image includes asset, alt, caption fields
- [ ] 6.3 Create `src/components/portable-text/Gallery.astro` with grid layout
- [ ] 6.4 Implement lightbox functionality (basic modal or use library)
- [ ] 6.5 Add keyboard navigation (arrow keys, escape)
- [ ] 6.6 Optimize gallery images with Sanity URL builder
- [ ] 6.7 Style with theme tokens and smooth transitions
- [ ] 6.8 Test with 2-8 images in different configurations

## 7. Table Component

- [ ] 7.1 Create `src/sanity/schemaTypes/table.ts` with rows array
- [ ] 7.2 Support header row flag and cell content
- [ ] 7.3 Create `src/components/portable-text/Table.astro` with responsive design
- [ ] 7.4 Add horizontal scroll for wide tables on mobile
- [ ] 7.5 Style with theme tokens (borders, padding, zebra striping)
- [ ] 7.6 Register in blockContent.ts and component mapping
- [ ] 7.7 Test with various table sizes and content types

## 8. Tweet Embed Component

- [ ] 8.1 Create `src/sanity/schemaTypes/tweetEmbed.ts` with tweet URL field
- [ ] 8.2 Add validation for valid Twitter/X URLs
- [ ] 8.3 Create `src/components/portable-text/TweetEmbed.astro`
- [ ] 8.4 Use Twitter's embed API or oEmbed for rendering
- [ ] 8.5 Add fallback for deleted tweets
- [ ] 8.6 Style to match site theme (not default Twitter styling)
- [ ] 8.7 Register in blockContent.ts and component mapping
- [ ] 8.8 Test with various tweet types (text, images, threads)

## 9. Divider Component

- [ ] 9.1 Create `src/sanity/schemaTypes/divider.ts` with style variants
- [ ] 9.2 Create `src/components/portable-text/Divider.astro`
- [ ] 9.3 Implement 3-4 visual styles (line, dots, asterisks, space)
- [ ] 9.4 Style with theme colors and spacing
- [ ] 9.5 Register in blockContent.ts and component mapping
- [ ] 9.6 Test visual spacing in article flow

## 10. Update Block Content Schema

- [ ] 10.1 Update `src/sanity/schemaTypes/blockContent.ts` to include all new block types
- [ ] 10.2 Organize blocks into logical groups in Studio UI
- [ ] 10.3 Add helpful descriptions for each block type
- [ ] 10.4 Update `ArticlePortableText.astro` component mappings for all new blocks
- [ ] 10.5 Test that all blocks render correctly in Studio preview

## 11. Category Archive Pages

- [ ] 11.1 Create `src/pages/blog/category/[slug].astro`
- [ ] 11.2 Add `getStaticPaths()` to fetch all categories from Sanity
- [ ] 11.3 Query posts filtered by category reference
- [ ] 11.4 Display category title, description, and post count
- [ ] 11.5 Render posts with ArticleCard component
- [ ] 11.6 Add pagination if category has >12 posts
- [ ] 11.7 Include breadcrumbs (Home > Blog > Category Name)
- [ ] 11.8 Add SEO metadata and structured data

## 12. Tag Archive Pages

- [ ] 12.1 Create `src/pages/blog/tag/[slug].astro`
- [ ] 12.2 Add `getStaticPaths()` to fetch all unique tags from posts
- [ ] 12.3 Query posts filtered by tag array
- [ ] 12.4 Display tag name and post count
- [ ] 12.5 Render posts with ArticleCard component
- [ ] 12.6 Include breadcrumbs (Home > Blog > Tag Name)
- [ ] 12.7 Add related tags section
- [ ] 12.8 Add SEO metadata

## 13. Enhanced Blog Filtering

- [ ] 13.1 Update blog listing to show active category/tag filters
- [ ] 13.2 Add category chips that link to category pages
- [ ] 13.3 Add tag chips that link to tag pages
- [ ] 13.4 Highlight active filter in URL with clear visual indicator
- [ ] 13.5 Add "Clear filters" option when filtered
- [ ] 13.6 Update article count to reflect filtered results

## 14. Syntax Highlighting Setup

- [ ] 14.1 Install `shiki` package (`bun add shiki`)
- [ ] 14.2 Create `src/lib/shiki.ts` with highlighter configuration
- [ ] 14.3 Configure Apple-inspired theme (SF Mono font, Apple colors)
- [ ] 14.4 Support languages: JS, TS, JSX, TSX, HTML, CSS, Python, Swift, Go, Rust, SQL, Bash, JSON, YAML, Markdown
- [ ] 14.5 Update `ArticleCodeBlock.astro` to use Shiki for highlighting
- [ ] 14.6 Add line numbers with proper alignment
- [ ] 14.7 Add copy-to-clipboard button with feedback
- [ ] 14.8 Test syntax highlighting for all supported languages

## 15. Performance Optimizations

- [ ] 15.1 Code-split visual editing component (conditional import in VisualEditing.astro)
- [ ] 15.2 Optimize GROQ queries to project only needed fields
- [ ] 15.3 Add caching headers for static blog pages (Cache-Control, ETag)
- [ ] 15.4 Analyze bundle size with `bun run build` and check for large dependencies
- [ ] 15.5 Lazy-load images below fold with IntersectionObserver
- [ ] 15.6 Preload critical fonts and hero images
- [ ] 15.7 Implement content-visibility for long articles
- [ ] 15.8 Run Lighthouse audit and target ≥95 scores

## 16. SEO Enhancements

- [ ] 16.1 Update sitemap generation to include category/tag pages
- [ ] 16.2 Add priority values to sitemap (1.0 homepage, 0.8 blog listing, 0.6 posts, 0.4 archives)
- [ ] 16.3 Add JSON-LD BreadcrumbList schema for category/tag pages
- [ ] 16.4 Generate Open Graph images from post hero images with Sanity transformations
- [ ] 16.5 Add reading time estimates to meta descriptions
- [ ] 16.6 Include category in URL structure for better SEO context
- [ ] 16.7 Add canonical URLs for paginated pages
- [ ] 16.8 Test with Google Rich Results testing tool

## 17. Documentation

- [ ] 17.1 Update README with type generation workflow
- [ ] 17.2 Document new Portable Text block types with examples
- [ ] 17.3 Add section on image optimization and responsive images
- [ ] 17.4 Document category/tag page structure and navigation
- [ ] 17.5 Add troubleshooting section for common issues
- [ ] 17.6 Document syntax highlighting language support
- [ ] 17.7 Include performance optimization tips
- [ ] 17.8 Add content authoring guide for editors

## 18. Testing & Quality Assurance

- [ ] 18.1 Create sample post with all new block types (callout, video, gallery, table, tweet, divider)
- [ ] 18.2 Test image optimization at different viewport sizes (375px, 768px, 1280px, 1920px)
- [ ] 18.3 Verify WebP/AVIF images serve to supporting browsers
- [ ] 18.4 Test category and tag pages with multiple posts
- [ ] 18.5 Verify syntax highlighting for 5+ different languages
- [ ] 18.6 Run Lighthouse audit on blog listing and detail pages
- [ ] 18.7 Test visual editing with new block types in Presentation tool
- [ ] 18.8 Verify homepage recent posts section displays and links correctly

## 19. Build & Deploy Verification

- [ ] 19.1 Run `bun run check` (lint, format, types, build)
- [ ] 19.2 Verify build completes in <60 seconds
- [ ] 19.3 Check bundle size of blog pages (<50KB gzipped)
- [ ] 19.4 Test production build with `bun run preview`
- [ ] 19.5 Verify all images optimize correctly in production build
- [ ] 19.6 Test Studio deployment with new schema types
- [ ] 19.7 Verify sitemap includes all pages
- [ ] 19.8 Deploy and smoke test on production
