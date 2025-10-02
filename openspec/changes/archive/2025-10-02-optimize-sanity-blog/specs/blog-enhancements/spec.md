## ADDED Requirements

### Requirement: Optimized Image Delivery

The blog SHALL serve images from Sanity's CDN with responsive srcsets, modern formats (WebP/AVIF), and blur-up placeholders for optimal performance.

#### Scenario: Responsive image generation

- **WHEN** a post includes images in content or as hero
- **THEN** the system generates srcset with widths [320, 640, 768, 1024, 1280, 1920]
- **AND** serves WebP/AVIF to supporting browsers with JPEG fallback
- **AND** includes width/height attributes to prevent layout shift

#### Scenario: Blur-up placeholder

- **WHEN** images are loading
- **THEN** LQIP (Low Quality Image Placeholder) displays with blur effect
- **AND** transitions smoothly to full-resolution image on load
- **AND** maintains aspect ratio during transition

#### Scenario: Lazy loading

- **WHEN** images are below the fold
- **THEN** they use `loading="lazy"` attribute
- **AND** hero images use `loading="eager"` for immediate visibility
- **AND** images load progressively as user scrolls

### Requirement: Homepage Recent Posts

The homepage SHALL display the 3 most recent blog posts in a dedicated section with consistent card styling.

#### Scenario: Recent posts display

- **WHEN** homepage loads
- **THEN** it fetches and displays 3 most recent published posts from Sanity
- **AND** each post shows title, summary, date, and tags
- **AND** uses the same ArticleCard component as blog listing
- **AND** includes "View all articles →" link to /blog

#### Scenario: Empty state

- **WHEN** no posts exist yet
- **THEN** section shows placeholder message
- **AND** encourages subscribing to RSS for updates

### Requirement: Automated Type Generation

The project SHALL automatically generate TypeScript types from Sanity schemas to maintain type safety without manual updates.

#### Scenario: Type generation from schemas

- **WHEN** running `bun run sanity:typegen`
- **THEN** sanity-codegen scans all schema files
- **AND** generates TypeScript interfaces in `src/types/sanity.generated.ts`
- **AND** includes all document types, fields, and references

#### Scenario: Type usage in queries

- **WHEN** querying Sanity content
- **THEN** GROQ results are typed with generated interfaces
- **AND** TypeScript catches field mismatches at compile time
- **AND** IDE provides autocomplete for schema fields

### Requirement: Enhanced Portable Text Blocks

The blog SHALL support rich content blocks including callouts, video embeds, image galleries, tables, tweet embeds, and dividers.

#### Scenario: Callout blocks

- **WHEN** author adds callout block
- **THEN** they can choose variant (info, warning, success, error)
- **AND** provide title and body content
- **AND** callout renders with appropriate icon and styling
- **AND** uses theme tokens for colors and spacing

#### Scenario: Video embeds

- **WHEN** author embeds YouTube or Vimeo video
- **THEN** video displays in responsive 16:9 container
- **AND** includes thumbnail preview with play button
- **AND** loads iframe only after user interaction

#### Scenario: Image galleries

- **WHEN** author adds image gallery
- **THEN** images display in grid layout
- **AND** clicking image opens lightbox with full-size view
- **AND** lightbox supports keyboard navigation (arrows, escape)
- **AND** all images optimized with Sanity CDN

#### Scenario: Tables

- **WHEN** author adds table block
- **THEN** table renders with header row and data rows
- **AND** tables scroll horizontally on mobile if too wide
- **AND** styled with theme tokens (borders, spacing, zebra striping)

#### Scenario: Tweet embeds

- **WHEN** author embeds tweet
- **THEN** tweet displays with author, content, and metadata
- **AND** uses Twitter's embed API for rich rendering
- **AND** shows fallback message if tweet is deleted

#### Scenario: Dividers

- **WHEN** author adds divider
- **THEN** they can choose style (line, dots, asterisks, space)
- **AND** divider renders with theme-appropriate styling
- **AND** provides visual separation in content flow

### Requirement: Category and Tag Archives

The blog SHALL provide dedicated archive pages for browsing posts by category or tag.

#### Scenario: Category archive pages

- **WHEN** user navigates to `/blog/category/[slug]`
- **THEN** page displays category title and description
- **AND** lists all posts in that category
- **AND** includes breadcrumbs (Home > Blog > Category Name)
- **AND** adds structured data for search engines

#### Scenario: Tag archive pages

- **WHEN** user navigates to `/blog/tag/[slug]`
- **THEN** page displays tag name and post count
- **AND** lists all posts with that tag
- **AND** includes breadcrumbs (Home > Blog > Tag Name)
- **AND** shows related tags section

#### Scenario: Enhanced filtering

- **WHEN** viewing blog listing
- **THEN** active category/tag filters are visually indicated
- **AND** category and tag chips link to archive pages
- **AND** "Clear filters" option available when filtered

### Requirement: Syntax Highlighting

Code blocks SHALL use server-side syntax highlighting with an Apple-inspired theme.

#### Scenario: Code highlighting

- **WHEN** post includes code blocks
- **THEN** code is highlighted with Shiki using SF Mono font
- **AND** supports 15+ languages (JS, TS, Python, Swift, Go, Rust, etc.)
- **AND** uses Apple-inspired color scheme
- **AND** includes line numbers aligned properly

#### Scenario: Copy functionality

- **WHEN** user hovers over code block
- **THEN** copy-to-clipboard button appears
- **AND** clicking copies code to clipboard
- **AND** shows confirmation feedback (checkmark, "Copied!")

### Requirement: Performance Optimization

The blog SHALL achieve Lighthouse scores ≥95 for all metrics through targeted optimizations.

#### Scenario: Bundle size optimization

- **WHEN** building for production
- **THEN** blog pages produce <50KB gzipped JavaScript
- **AND** visual editing code is code-split and loaded conditionally
- **AND** unused dependencies are tree-shaken

#### Scenario: Image performance

- **WHEN** measuring Core Web Vitals
- **THEN** LCP (Largest Contentful Paint) is <2.5s
- **AND** images contribute minimal to bundle size
- **AND** responsive images reduce data transfer by 60-80%

#### Scenario: Caching strategy

- **WHEN** serving static blog pages
- **THEN** appropriate Cache-Control headers are set
- **AND** ETags enable conditional requests
- **AND** CDN caching is leveraged for images

### Requirement: Enhanced SEO

The blog SHALL provide comprehensive SEO features including sitemaps, structured data, and Open Graph optimization.

#### Scenario: Sitemap generation

- **WHEN** building site
- **THEN** sitemap includes all blog posts, categories, and tags
- **AND** includes priority values (1.0 homepage, 0.8 blog, 0.6 posts, 0.4 archives)
- **AND** includes lastmod timestamps from Sanity

#### Scenario: Structured data

- **WHEN** rendering category/tag pages
- **THEN** BreadcrumbList schema is included
- **AND** CollectionPage schema describes archive
- **AND** all structured data validates with Google's testing tool

#### Scenario: Social sharing

- **WHEN** post is shared on social media
- **THEN** Open Graph image is generated from hero image
- **AND** optimized for Twitter, Facebook, LinkedIn dimensions
- **AND** includes proper meta tags for rich previews
