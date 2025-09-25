## ADDED Requirements

### Requirement: Card-Based Blog Hub Powered by Sanity

The blog SHALL use Sanity as the CMS for all post content and render a `/blog` landing page that matches the site’s card/tile aesthetic. Posts SHALL be retrieved via Sanity’s content API and displayed as cards with title, summary, tags, and publish date.

#### Scenario: Blog listing

- **WHEN** a visitor loads `/blog`
- **THEN** the page fetches published posts from Sanity sorted by publish date descending and renders them as responsive cards with consistent spacing/tokens
- **AND** the hero area highlights the newest post with an expanded card or banner

#### Scenario: Tag exploration

- **WHEN** a visitor selects a tag filter
- **THEN** the list updates client-side or server-side to show only posts containing that tag and the active filter is clearly indicated

#### Scenario: Post detail

- **WHEN** a visitor opens a blog post URL
- **THEN** the page fetches the Sanity content, renders it using the site typography system (including code blocks and callouts), and displays related posts at the footer using the same card style

### Requirement: Custom CSS Article Template for Sanity Content

The blog SHALL render post detail content through a reusable Astro template that applies the site’s Apple-inspired typography and custom CSS tokens while avoiding Sanity’s prebuilt visual builder components.

#### Scenario: Custom rendering pipeline

- **WHEN** Sanity returns Portable Text blocks for a post
- **THEN** the system maps each block to Astro components styled exclusively with repository CSS tokens, maintaining the Apple-inspired typographic scale and spacing

#### Scenario: Visual builder independence

- **WHEN** editors update content in Sanity Studio
- **THEN** the published view ignores Sanity visual builder theme classes and relies solely on the custom article template so the front-end remains visually consistent

### Requirement: Feeds and SEO for Blog Platform

The blog SHALL expose machine-readable feeds and SEO enhancements so readers can subscribe and search engines can index posts effectively.

#### Scenario: Feed generation

- **WHEN** the build runs
- **THEN** RSS (`/blog/feed.xml`) and Atom (`/blog/atom.xml`) feeds are generated from Sanity data including title, summary, author, publish date, and canonical link for each post
- **AND** `<link rel="alternate" type="application/rss+xml">` and Atom equivalents are added to the blog pages

#### Scenario: SEO metadata

- **WHEN** search engines crawl blog listing or detail pages
- **THEN** each page includes descriptive titles, meta descriptions, canonical URLs, Open Graph/Twitter metadata, and JSON-LD Article structured data referencing Sanity fields

#### Scenario: Draft handling

- **WHEN** a post is marked as draft in Sanity
- **THEN** it is excluded from production builds and feeds while still available via preview tokens for authenticated review

### Requirement: Embedded Sanity Studio with Stable Tooling

The project SHALL embed Sanity Studio within the Astro app using the latest stable `sanity` and `@sanity/astro` packages, while keeping the custom front-end style system independent from Studio styling.

#### Scenario: Studio access

- **WHEN** a maintainer runs `bun run dev`
- **THEN** the Sanity Studio is available on the designated route (e.g., `/studio`) with environment variables configured for project ID, dataset, and viewer token

#### Scenario: Presentation previews respect custom template

- **WHEN** an editor previews a draft via Sanity Presentation or live preview tools
- **THEN** the rendered page uses the same reusable article template and CSS tokens as production, ensuring design parity without relying on Sanity visual builder styles
