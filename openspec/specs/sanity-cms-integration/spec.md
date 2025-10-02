# sanity-cms-integration Specification

## Purpose

Provide a headless CMS foundation using Sanity v4 that enables structured content management for blog posts, future marketplace services, and other content types, while maintaining the site's custom Apple-inspired design system and ensuring visual editing capabilities for content preview.

## Requirements

### Requirement: Sanity Project Configuration

The project SHALL integrate Sanity v4 with proper environment configuration, project authentication, and dataset management to enable secure content operations.

#### Scenario: Environment setup

- **GIVEN** a fresh development environment
- **WHEN** the developer configures Sanity integration
- **THEN** environment variables are set for `PUBLIC_SANITY_PROJECT_ID` (61249gtj), `PUBLIC_SANITY_DATASET` (production), `SANITY_API_READ_TOKEN`, and `PUBLIC_SANITY_STUDIO_URL`
- **AND** the configuration validates on startup with appropriate error messages if credentials are missing

#### Scenario: Dataset access control

- **GIVEN** the production dataset is configured as public
- **WHEN** the application queries published content
- **THEN** it can retrieve content without authentication
- **AND** draft/preview content requires valid `SANITY_API_READ_TOKEN`

### Requirement: Embedded Sanity Studio

The project SHALL embed Sanity Studio at the `/admin` route during development with full schema management, visual content editing, and deployment capabilities.

#### Scenario: Local studio access

- **GIVEN** the developer runs `bun run dev`
- **WHEN** they navigate to `/admin`
- **THEN** Sanity Studio loads with authentication
- **AND** all content types are available for editing

#### Scenario: Studio deployment

- **GIVEN** studio changes are ready for production
- **WHEN** the developer runs `bunx sanity@latest deploy`
- **THEN** the studio is deployed to `PUBLIC_SANITY_STUDIO_URL`
- **AND** the hosted studio maintains the same schema and functionality

### Requirement: Content Schema Foundation

The CMS SHALL provide extensible content schemas starting with blog post support and designed for future marketplace service integration.

#### Scenario: Blog post schema

- **WHEN** a content editor creates a blog post
- **THEN** they can define title (required), slug (unique), summary, publishedAt date, author reference, category references, tags array, hero image with alt text, and body content as Portable Text
- **AND** all fields validate according to schema rules

#### Scenario: Author schema

- **WHEN** managing blog authors
- **THEN** the system provides name, slug, bio (Portable Text), avatar image, and social links fields
- **AND** authors can be referenced from blog posts

#### Scenario: Category schema

- **WHEN** organizing content
- **THEN** categories include title, slug, and description fields
- **AND** posts can reference multiple categories

#### Scenario: Future marketplace extensibility

- **GIVEN** marketplace features are planned
- **WHEN** designing schemas
- **THEN** the structure supports future service, pricing, and transaction content types
- **AND** schema design follows consistent patterns for extension

### Requirement: GROQ Query Integration

The application SHALL use GROQ (Graph-Relational Object Queries) to fetch structured content from Sanity with proper filtering, projection, and reference resolution.

#### Scenario: Basic content queries

- **WHEN** fetching blog posts
- **THEN** queries use `*[_type == "post"]` syntax with filters for published status
- **AND** results include projected fields to minimize payload size

#### Scenario: Reference resolution

- **WHEN** queries include references (author, categories)
- **THEN** GROQ uses `->` operator to resolve referenced documents
- **AND** nested projections return only required fields

#### Scenario: Parameterized queries

- **WHEN** queries need dynamic values (e.g., slug lookup)
- **THEN** GROQ uses `$parameter` syntax with type-safe parameters
- **AND** queries protect against injection through parameter binding

#### Scenario: Sorting and pagination

- **WHEN** listing content
- **THEN** queries use `| order(publishedAt desc)` for sorting
- **AND** implement `[start...end]` range syntax for pagination

### Requirement: Portable Text Rendering

The application SHALL render Sanity's Portable Text format using custom Astro components that maintain the site's Apple-inspired typography and design tokens.

#### Scenario: Block content rendering

- **WHEN** Portable Text includes standard blocks (paragraphs, headings, lists)
- **THEN** each block type maps to custom Astro components
- **AND** components apply `src/styles/theme.css` tokens exclusively

#### Scenario: Inline formatting

- **WHEN** content includes marks (bold, italic, code, links)
- **THEN** marks render with appropriate semantic HTML
- **AND** styling uses repository CSS tokens, not Sanity defaults

#### Scenario: Custom blocks

- **WHEN** Portable Text includes images, code blocks, or callouts
- **THEN** custom components handle rendering with responsive sources
- **AND** images include alt text from Sanity metadata
- **AND** code blocks use syntax highlighting matching site theme

#### Scenario: Embedded content

- **WHEN** Portable Text references other Sanity documents
- **THEN** references are resolved and rendered as embedded components
- **AND** embedded content respects the article layout flow

### Requirement: Visual Editing with Live Preview

The CMS SHALL provide visual editing capabilities with clickable overlays that link directly to Sanity Studio fields while maintaining custom CSS styling.

#### Scenario: Visual editing mode

- **GIVEN** `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` is true
- **WHEN** an editor accesses content with preview token
- **THEN** stega-encoded overlays appear on editable fields
- **AND** clicking overlays opens corresponding fields in Sanity Studio

#### Scenario: Draft content preview

- **WHEN** viewing draft content in preview mode
- **THEN** the application uses `previewDrafts` perspective
- **AND** shows unpublished changes with visual indicators
- **AND** maintains custom template styling without Sanity visual builder classes

#### Scenario: Production visual separation

- **WHEN** visitors access published content without preview token
- **THEN** no visual editing overlays render
- **AND** the application uses `published` perspective
- **AND** performance is unaffected by preview capabilities

### Requirement: Custom Design System Integration

The blog rendering SHALL avoid all Sanity prebuilt templates and visual builder themes, instead using exclusively the repository's custom Apple-inspired CSS design system.

#### Scenario: Template independence

- **WHEN** rendering blog posts from Sanity
- **THEN** the application uses custom Astro article templates
- **AND** no Sanity visual builder CSS classes are included
- **AND** all typography, spacing, and colors come from `src/styles/theme.css`

#### Scenario: Component styling

- **WHEN** creating Portable Text component mappings
- **THEN** each component is styled with repository design tokens
- **AND** components match the Apple Developer Documentation aesthetic
- **AND** styles are component-scoped or reference shared tokens

#### Scenario: Studio vs. frontend separation

- **WHEN** editors preview content in Studio
- **THEN** the preview uses the custom article template
- **AND** Studio UI remains separate from frontend styling
- **AND** content renders identically in Studio preview and production

### Requirement: Content API and Data Fetching

The application SHALL use Sanity's content API with proper client configuration, perspective switching, and caching strategies.

#### Scenario: Client configuration

- **WHEN** initializing Sanity client
- **THEN** client uses CDN endpoint for published content
- **AND** falls back to live API for draft/preview content
- **AND** API version is pinned (e.g., `2024-01-01`)

#### Scenario: Perspective switching

- **WHEN** fetching content
- **THEN** production uses `published` perspective
- **AND** preview mode uses `previewDrafts` perspective
- **AND** perspective is determined by authentication context

#### Scenario: Build-time data fetching

- **WHEN** Astro builds static pages
- **THEN** content is fetched at build time for optimal performance
- **AND** all published posts generate static routes
- **AND** 404 pages handle missing slugs gracefully

#### Scenario: Cache strategy

- **WHEN** fetching from Sanity CDN
- **THEN** responses are cached appropriately
- **AND** cache invalidation triggers on content updates
- **AND** preview mode bypasses cache for latest drafts

### Requirement: Content Source Maps

The application SHALL enable Content Source Maps to power field-level editing in visual editing mode.

#### Scenario: Source map enablement

- **WHEN** visual editing is active
- **THEN** queries use `encodeSourceMap` helper
- **AND** responses include stega-encoded metadata
- **AND** metadata maps rendered content to Studio fields

#### Scenario: Field-level precision

- **WHEN** an editor clicks on rendered text
- **THEN** the overlay identifies the exact Sanity field
- **AND** Studio opens to that specific field for editing
- **AND** changes sync back to preview immediately

### Requirement: Image Optimization

The application SHALL optimize images from Sanity using built-in image pipeline with responsive sources, modern formats, and lazy loading.

#### Scenario: Image transformation

- **WHEN** rendering images from Sanity
- **THEN** images use Sanity's image URL API with transform parameters
- **AND** multiple sizes are generated for responsive srcset
- **AND** WebP/AVIF formats are served to supporting browsers

#### Scenario: Performance optimization

- **WHEN** images load on pages
- **THEN** images use `loading="lazy"` by default
- **AND** hero images use `loading="eager"` with priority
- **AND** dimensions are specified to prevent layout shift

#### Scenario: Alt text requirement

- **WHEN** editors upload images
- **THEN** alt text field is required in schema
- **AND** missing alt text triggers validation errors
- **AND** decorative images use empty alt text explicitly

### Requirement: SEO and Metadata Integration

Content from Sanity SHALL populate page metadata, Open Graph tags, structured data, and RSS feeds for optimal discoverability.

#### Scenario: Page metadata

- **WHEN** rendering blog posts
- **THEN** title, description, and canonical URL come from Sanity
- **AND** Open Graph and Twitter Card metadata are generated
- **AND** publish date and author metadata are included

#### Scenario: Structured data

- **WHEN** search engines crawl blog posts
- **THEN** JSON-LD Article schema is included with author, publish date, and headline
- **AND** structured data validates against schema.org specifications

#### Scenario: Feed generation

- **WHEN** building the site
- **THEN** RSS and Atom feeds are generated from Sanity posts
- **AND** feeds include title, summary, author, publish date, and link
- **AND** feed links are added to page headers

### Requirement: Type Safety and TypeScript Integration

The application SHALL use TypeScript types generated from Sanity schemas for type-safe content queries and rendering.

#### Scenario: Schema type generation

- **WHEN** Sanity schemas are defined
- **THEN** types are generated using `@sanity/types` or `sanity-codegen`
- **AND** types are imported in Astro components
- **AND** TypeScript catches schema mismatches at build time

#### Scenario: GROQ type safety

- **WHEN** writing GROQ queries
- **THEN** query results are typed based on projection
- **AND** TypeScript validates field access
- **AND** optional fields are properly typed as nullable

### Requirement: Error Handling and Resilience

The application SHALL handle Sanity API errors gracefully with appropriate fallbacks and user-facing error messages.

#### Scenario: API failure handling

- **WHEN** Sanity API is unavailable
- **THEN** the application logs errors with context
- **AND** shows user-friendly error pages
- **AND** retries transient failures with exponential backoff

#### Scenario: Content not found

- **WHEN** a requested slug doesn't exist
- **THEN** the application returns 404 with styled error page
- **AND** suggests related content or navigation options
- **AND** logs the missing slug for monitoring

#### Scenario: Draft access control

- **WHEN** unauthenticated users request draft content
- **THEN** the application returns published version or 404
- **AND** does not expose draft existence
- **AND** logs unauthorized access attempts

### Requirement: Development and Production Workflows

The project SHALL support streamlined workflows for content creation, preview, and publishing across development and production environments.

#### Scenario: Local development

- **WHEN** developers run `bun run dev`
- **THEN** local Studio is available at `/admin`
- **AND** content changes are immediately visible
- **AND** visual editing overlays work in preview mode

#### Scenario: Staging/preview deployments

- **WHEN** deploying to staging
- **THEN** draft content is accessible with preview tokens
- **AND** visual editing is enabled for content review
- **AND** analytics and tracking are disabled or sandboxed

#### Scenario: Production deployment

- **WHEN** deploying to production
- **THEN** only published content is built and served
- **AND** visual editing is disabled for public visitors
- **AND** Studio is accessible at hosted URL for editors

### Requirement: Future Marketplace Foundation

The schema design SHALL support future marketplace service integration without requiring architectural changes.

#### Scenario: Extensible schema patterns

- **WHEN** adding marketplace content types
- **THEN** new schemas follow established patterns for blog content
- **AND** relationships use references consistently
- **AND** pricing and service data use appropriate field types

#### Scenario: Payment integration readiness

- **WHEN** planning marketplace features
- **THEN** content models support service descriptions, pricing tiers, and availability
- **AND** schema design accommodates transaction history references
- **AND** no Shopify or third-party commerce platform is required

#### Scenario: Service catalog structure

- **WHEN** defining marketplace services
- **THEN** schemas include service title, description (Portable Text), pricing options, delivery details, and terms
- **AND** services can be categorized and tagged like blog posts
- **AND** client testimonials and portfolio links are supported

### Requirement: Performance and Optimization

The Sanity integration SHALL maintain fast static builds and optimal runtime performance without compromising the site's Lighthouse scores.

#### Scenario: Build performance

- **WHEN** running `bun run build`
- **THEN** Sanity content is fetched efficiently with minimal API calls
- **AND** parallel queries are used where possible
- **AND** build completes in under 60 seconds for <100 posts

#### Scenario: Bundle size

- **WHEN** analyzing production bundle
- **THEN** Sanity client code is tree-shaken for static builds
- **AND** visual editing code is code-split and loaded conditionally
- **AND** total JavaScript for blog pages remains under 50KB gzipped

#### Scenario: Runtime performance

- **WHEN** visitors load blog pages
- **THEN** content is served from static HTML
- **AND** no client-side Sanity API calls occur for published content
- **AND** Time to Interactive remains under 2 seconds on 3G

### Requirement: Accessibility and Standards Compliance

Content rendered from Sanity SHALL meet WCAG AA accessibility standards and follow semantic HTML practices.

#### Scenario: Semantic structure

- **WHEN** rendering Portable Text
- **THEN** heading levels follow logical hierarchy (h1 > h2 > h3)
- **AND** lists use proper `<ul>`, `<ol>`, `<li>` markup
- **AND** landmarks use appropriate ARIA roles

#### Scenario: Keyboard navigation

- **WHEN** users navigate with keyboard
- **THEN** all interactive elements are reachable with tab
- **AND** focus indicators are visible with site styling
- **AND** skip links are provided for long content

#### Scenario: Screen reader support

- **WHEN** content is accessed with screen readers
- **THEN** images have descriptive alt text
- **AND** links have clear labels
- **AND** article structure is properly announced
- **AND** decorative elements use `aria-hidden="true"`

### Requirement: Documentation and Maintainability

The Sanity integration SHALL be documented comprehensively for future development and content editor onboarding.

#### Scenario: Technical documentation

- **WHEN** developers need to understand Sanity integration
- **THEN** `SANITY_DOCUMENTATION.md` provides complete reference
- **AND** schema definitions are commented with field purposes
- **AND** GROQ query patterns are documented with examples

#### Scenario: Editor documentation

- **WHEN** content editors join the project
- **THEN** Studio includes help text for each field
- **AND** validation messages are clear and actionable
- **AND** onboarding guide covers content creation workflows

#### Scenario: Schema evolution

- **WHEN** schemas need updates
- **THEN** migration patterns are documented
- **AND** breaking changes are communicated clearly
- **AND** backward compatibility is maintained where possible
