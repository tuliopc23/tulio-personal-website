## ADDED Requirements

### Requirement: Homepage Recent Writing Highlights

The homepage SHALL include a "Latest writing" section that surfaces recent blog posts so visitors can discover new content without leaving the landing page. Each preview SHALL show the post title, summary, publish date, and link to the full article. The section SHALL provide a call-to-action that routes to the complete blog archive.

#### Scenario: Recent posts exist

- **GIVEN** at least three blog entries are published in `src/content/blog`
- **WHEN** a visitor loads the homepage
- **THEN** the "Latest writing" section lists the three most recent entries sorted by publish date descending
- **AND** each entry displays its title, summary, and a human-readable publish date and links to the corresponding blog post
- **AND** the section includes a link to view the full blog archive

#### Scenario: Fewer than three posts exist

- **GIVEN** only one or two blog entries are published in `src/content/blog`
- **WHEN** a visitor loads the homepage
- **THEN** the "Latest writing" section lists just the available entries without placeholders
- **AND** the archive call-to-action remains visible so visitors can navigate to all posts

#### Scenario: No posts exist

- **GIVEN** no blog entries are published in `src/content/blog`
- **WHEN** a visitor loads the homepage
- **THEN** the "Latest writing" section shows friendly placeholder copy explaining that articles are coming soon
- **AND** the section still provides a link to the blog index page
