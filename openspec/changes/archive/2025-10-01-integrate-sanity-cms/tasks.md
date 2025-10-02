## 1. Foundation Setup

- [ ] 1.1 Install Sanity packages (`@sanity/astro`, `@sanity/client`, `@sanity/code-input`, `@sanity/vision`, `astro-portabletext`, `@portabletext/react`)
- [ ] 1.2 Create `.env.example` with `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `PUBLIC_SANITY_STUDIO_URL`, `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`
- [ ] 1.3 Configure Sanity integration in `astro.config.mjs` with project ID (61249gtj) and production dataset
- [ ] 1.4 Create `src/pages/admin/[...index].astro` to embed Sanity Studio at `/admin` route
- [ ] 1.5 Initialize `sanity.config.ts` with project settings, plugins (vision, code-input), and dataset configuration

## 2. Schema Definition

- [ ] 2.1 Create `src/schemas/blockContent.ts` for Portable Text schema with headings, lists, marks, images, and code blocks
- [ ] 2.2 Create `src/schemas/author.ts` with name, slug, bio (Portable Text), avatar image, and social links fields
- [ ] 2.3 Create `src/schemas/category.ts` with title, slug, and description fields
- [ ] 2.4 Create `src/schemas/post.ts` with title, slug, summary, publishedAt, author reference, categories array, tags, hero image, and body (blockContent)
- [ ] 2.5 Create `src/schemas/index.ts` to export all schema types and configure schema array
- [ ] 2.6 Add field validation (required fields, unique slugs, alt text for images)
- [ ] 2.7 Include help text and descriptions for editor guidance

## 3. Sanity Client Configuration

- [ ] 3.1 Create `src/lib/sanity/config.ts` with project ID, dataset, API version (2024-01-01), and CDN configuration
- [ ] 3.2 Create `src/lib/sanity/client.ts` with configured Sanity client for queries
- [ ] 3.3 Create `src/lib/sanity/image.ts` with image URL builder and optimization helpers
- [ ] 3.4 Create `src/lib/sanity/loadQuery.ts` helper for perspective switching (published vs. previewDrafts)
- [ ] 3.5 Configure environment variable validation with clear error messages

## 4. TypeScript Type Generation

- [ ] 4.1 Install `@sanity/types` or `sanity-codegen` for type generation
- [ ] 4.2 Generate TypeScript types from Sanity schemas
- [ ] 4.3 Create `src/types/sanity.ts` with exported types for Post, Author, Category, and BlockContent
- [ ] 4.4 Configure automatic type regeneration on schema changes
- [ ] 4.5 Update `tsconfig.json` to include Sanity type paths

## 5. GROQ Queries

- [ ] 5.1 Create `src/lib/sanity/queries/posts.ts` with query to fetch all published posts with pagination
- [ ] 5.2 Add query to fetch single post by slug with author and category resolution
- [ ] 5.3 Add query to fetch related posts by tags or categories
- [ ] 5.4 Add query to fetch recent posts for homepage (limit 3)
- [ ] 5.5 Create `src/lib/sanity/queries/authors.ts` with author queries
- [ ] 5.6 Create `src/lib/sanity/queries/categories.ts` with category queries
- [ ] 5.7 Add GROQ query parameter typing for type safety

## 6. Portable Text Components

- [ ] 6.1 Create `src/components/portable-text/PortableText.astro` as main renderer using `astro-portabletext`
- [ ] 6.2 Create `src/components/portable-text/Heading.astro` for h1-h6 with anchor links and theme tokens
- [ ] 6.3 Create `src/components/portable-text/Paragraph.astro` for body text with theme typography
- [ ] 6.4 Create `src/components/portable-text/List.astro` for ul/ol with theme spacing
- [ ] 6.5 Create `src/components/portable-text/BlockQuote.astro` for quotes with Apple-inspired styling
- [ ] 6.6 Create `src/components/portable-text/CodeBlock.astro` for syntax-highlighted code with theme colors
- [ ] 6.7 Create `src/components/portable-text/Image.astro` for responsive images with Sanity image API
- [ ] 6.8 Create `src/components/portable-text/Link.astro` for inline links with theme link styling
- [ ] 6.9 Configure component mappings in PortableText.astro using only `src/styles/theme.css` tokens

## 7. Article Template

- [ ] 7.1 Create or update `src/layouts/ArticleLayout.astro` for blog post rendering with Apple-inspired layout
- [ ] 7.2 Add article header with title, publish date, reading time, and author info using theme tokens
- [ ] 7.3 Add hero image rendering with responsive sources and lazy loading
- [ ] 7.4 Add tag chips styled with theme tokens
- [ ] 7.5 Add article footer with related posts section using card layout
- [ ] 7.6 Add share links and navigation controls
- [ ] 7.7 Ensure semantic HTML structure (article, header, main, footer landmarks)
- [ ] 7.8 Add structured data (JSON-LD Article) generation from Sanity fields

## 8. Blog Pages

- [ ] 8.1 Update `src/pages/blog/index.astro` to query Sanity for published posts
- [ ] 8.2 Implement card-based post listing with title, summary, publish date, and hero image
- [ ] 8.3 Add tag filter functionality (client-side or server-side)
- [ ] 8.4 Add featured post section using newest post
- [ ] 8.5 Update `src/pages/blog/[slug].astro` to fetch post by slug from Sanity
- [ ] 8.6 Implement static path generation for all published posts
- [ ] 8.7 Add 404 handling for missing or draft posts
- [ ] 8.8 Add pagination for blog listing if post count exceeds threshold

## 9. Visual Editing Setup

- [ ] 9.1 Install `@sanity/visual-editing` package for stega encoding
- [ ] 9.2 Create `src/components/VisualEditing.astro` component for overlay enablement
- [ ] 9.3 Update `src/lib/sanity/loadQuery.ts` to use `encodeSourceMap` when visual editing is enabled
- [ ] 9.4 Add conditional rendering of VisualEditing component based on preview context
- [ ] 9.5 Configure Presentation tool in `sanity.config.ts` with preview URL and resolve functions
- [ ] 9.6 Test visual editing overlays in Studio preview with clickable fields
- [ ] 9.7 Ensure custom template styling is preserved in preview mode

## 10. Studio Configuration

- [ ] 10.1 Configure desk structure in `sanity.config.ts` for organized content sections (Posts, Authors, Categories)
- [ ] 10.2 Add custom branding and logo to Studio if desired
- [ ] 10.3 Set up Presentation tool with live preview configuration
- [ ] 10.4 Add Vision plugin for GROQ query testing in Studio
- [ ] 10.5 Configure custom actions or workflows if needed
- [ ] 10.6 Test Studio content creation, editing, and publishing workflows
- [ ] 10.7 Deploy Studio to production URL using `bunx sanity@latest deploy`

## 11. Image Optimization

- [ ] 11.1 Configure Sanity image URL builder in `src/lib/sanity/image.ts` with default parameters
- [ ] 11.2 Implement responsive image component with srcset generation (320w, 640w, 768w, 1024w, 1280w)
- [ ] 11.3 Add WebP and AVIF format support with fallback to JPEG
- [ ] 11.4 Configure lazy loading for non-critical images with `loading="lazy"`
- [ ] 11.5 Set `loading="eager"` for hero images and above-the-fold content
- [ ] 11.6 Add width and height attributes to prevent layout shift
- [ ] 11.7 Enforce required alt text in schema validation

## 12. SEO and Metadata

- [ ] 12.1 Create `src/components/SEO.astro` component for metadata generation
- [ ] 12.2 Generate page title and meta description from Sanity post fields
- [ ] 12.3 Add Open Graph metadata (og:title, og:description, og:image, og:url, og:type)
- [ ] 12.4 Add Twitter Card metadata (twitter:card, twitter:title, twitter:description, twitter:image)
- [ ] 12.5 Generate JSON-LD Article structured data with headline, author, publish date, and image
- [ ] 12.6 Add canonical URL generation
- [ ] 12.7 Include author metadata and publish date in meta tags

## 13. Feed Generation

- [ ] 13.1 Create `src/pages/blog/feed.xml.ts` for RSS feed generation from Sanity posts
- [ ] 13.2 Create `src/pages/blog/atom.xml.ts` for Atom feed generation
- [ ] 13.3 Include title, summary, author, publish date, and canonical link in feed items
- [ ] 13.4 Add `<link rel="alternate" type="application/rss+xml">` to blog pages
- [ ] 13.5 Add `<link rel="alternate" type="application/atom+xml">` to blog pages
- [ ] 13.6 Update sitemap generation to include Sanity post URLs with last-modified timestamps

## 14. Error Handling

- [ ] 14.1 Implement error boundary for Sanity API failures with user-friendly messages
- [ ] 14.2 Add retry logic for transient API errors with exponential backoff
- [ ] 14.3 Create styled 404 page for missing post slugs
- [ ] 14.4 Add logging for Sanity errors with context (query, parameters, response)
- [ ] 14.5 Handle draft content access control (return 404 for unauthenticated users)
- [ ] 14.6 Validate environment variables on startup with clear error messages

## 15. Performance Optimization

- [ ] 15.1 Configure Sanity CDN usage for published content queries
- [ ] 15.2 Implement GROQ query projections to minimize payload size
- [ ] 15.3 Add parallel query execution where queries are independent
- [ ] 15.4 Configure cache headers for static blog pages
- [ ] 15.5 Code-split visual editing code to load conditionally in preview mode
- [ ] 15.6 Tree-shake unused Sanity client code in production build
- [ ] 15.7 Verify bundle size remains under 50KB gzipped for blog pages

## 16. Accessibility

- [ ] 16.1 Ensure heading hierarchy follows logical structure (h1 > h2 > h3)
- [ ] 16.2 Add proper ARIA landmarks (main, article, nav, complementary)
- [ ] 16.3 Verify keyboard navigation works for all interactive elements
- [ ] 16.4 Add visible focus indicators matching theme styling
- [ ] 16.5 Test with screen readers (VoiceOver, NVDA, JAWS)
- [ ] 16.6 Add skip links for long content
- [ ] 16.7 Verify color contrast meets WCAG AA standards (4.5:1 for text)
- [ ] 16.8 Test with `prefers-reduced-motion` and respect animation preferences

## 17. Documentation

- [ ] 17.1 Update project README with Sanity setup instructions and Studio access steps
- [ ] 17.2 Document all required environment variables in `.env.example` with descriptions
- [ ] 17.3 Create editor onboarding guide for content creation in Sanity Studio
- [ ] 17.4 Document GROQ query patterns with examples in `SANITY_DOCUMENTATION.md`
- [ ] 17.5 Add schema evolution and migration patterns documentation
- [ ] 17.6 Document Portable Text component customization process
- [ ] 17.7 Add troubleshooting section for common Sanity integration issues
- [ ] 17.8 Document Studio deployment workflow (`bunx sanity@latest deploy`)

## 18. Testing and Quality

- [ ] 18.1 Verify `bun run check` passes (lint, format, types, build)
- [ ] 18.2 Test blog listing page with multiple posts
- [ ] 18.3 Test blog detail page with various content types (headings, lists, images, code)
- [ ] 18.4 Test visual editing in Studio preview with clickable overlays
- [ ] 18.5 Test responsive behavior on mobile (≤414px) and desktop (≥1280px)
- [ ] 18.6 Run Lighthouse audit and verify scores ≥90 for performance, accessibility, SEO
- [ ] 18.7 Verify build time under 60 seconds with sample content
- [ ] 18.8 Test feed generation (RSS and Atom) in feed readers
- [ ] 18.9 Test 404 handling for missing slugs
- [ ] 18.10 Test draft content access control (published vs. preview)

## 19. Deployment Preparation

- [ ] 19.1 Configure Sanity environment variables in deployment platform (Netlify/Vercel/Cloudflare)
- [ ] 19.2 Deploy Sanity Studio to hosted URL
- [ ] 19.3 Update `PUBLIC_SANITY_STUDIO_URL` with production Studio URL
- [ ] 19.4 Verify Studio authentication works in production
- [ ] 19.5 Test content creation and publishing in production Studio
- [ ] 19.6 Verify published content appears on production site
- [ ] 19.7 Test visual editing in production preview mode
- [ ] 19.8 Monitor Sanity API usage and performance

## 20. Future Extensibility

- [ ] 20.1 Document schema patterns for future marketplace service content type
- [ ] 20.2 Design pricing and service schema structure (draft, not implemented)
- [ ] 20.3 Document payment integration approach (no Shopify)
- [ ] 20.4 Plan for service catalog page structure
- [ ] 20.5 Document schema versioning and migration strategy for future changes
