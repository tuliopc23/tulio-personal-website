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
