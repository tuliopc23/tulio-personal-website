# Sanity CMS Specification - Editorial Workflows

## ADDED Requirements

### Requirement: Editorial Workflow States
The system SHALL provide a multi-stage editorial workflow for content management with distinct status states.

#### Scenario: Create draft post
- **WHEN** an editor creates a new post
- **THEN** the post status SHALL default to "draft"
- **AND** the post SHALL only be visible in the Studio, not on the public site
- **AND** the editor SHALL be able to save work-in-progress without publishing

#### Scenario: Submit post for review
- **WHEN** an editor submits a draft post for review
- **THEN** the post status SHALL change to "in-review"
- **AND** the system SHALL record the submission time
- **AND** the post SHALL appear in the "In Review" section of the Studio
- **AND** reviewers SHALL be notified (if notification system enabled)

#### Scenario: Approve reviewed post
- **WHEN** a senior editor approves a post in review
- **THEN** the post status SHALL change to "approved"
- **AND** the system SHALL record who approved it and when
- **AND** the post SHALL be ready to publish or schedule

#### Scenario: Publish approved post
- **WHEN** an editor publishes an approved post
- **THEN** the post status SHALL change to "published"
- **AND** the post SHALL appear on the public site
- **AND** the publishedAt field SHALL be set to current time

#### Scenario: Archive published post
- **WHEN** an editor unpublishes a post
- **THEN** the post status SHALL change to "archived"
- **AND** the post SHALL no longer appear on the public site
- **AND** the original publishedAt date SHALL be preserved for reference

#### Scenario: Query published posts only
- **WHEN** the frontend queries for blog posts
- **THEN** only posts with status "published" SHALL be returned
- **AND** draft, in-review, approved, and archived posts SHALL be excluded

### Requirement: Scheduled Publishing
The system SHALL support scheduling posts for future publication at specific dates and times.

#### Scenario: Schedule post for future
- **WHEN** an editor schedules an approved post for future publication
- **THEN** the scheduledPublishAt field SHALL be set to the chosen datetime
- **AND** the post SHALL remain in "approved" status until scheduled time
- **AND** the post SHALL appear in the "Scheduled Posts" view

#### Scenario: Automatic scheduled publish
- **WHEN** the scheduled publish time arrives
- **THEN** the system SHALL automatically change the post status to "published"
- **AND** the publishedAt field SHALL be set to the scheduled time
- **AND** the post SHALL appear on the public site

#### Scenario: Reschedule post
- **WHEN** an editor changes the scheduledPublishAt time
- **THEN** the new time SHALL replace the old time
- **AND** the post SHALL publish at the new scheduled time

#### Scenario: Cancel scheduled publish
- **WHEN** an editor clears the scheduledPublishAt field
- **THEN** the post SHALL remain in "approved" status
- **AND** the post SHALL not auto-publish
- **AND** the post SHALL be removed from scheduled posts view

### Requirement: TypeScript Type Generation
The system SHALL generate TypeScript types from Sanity schema for type-safe queries and data handling.

#### Scenario: Generate types from schema
- **WHEN** the typegen command is run
- **THEN** the system SHALL extract the current schema
- **AND** generate TypeScript types in sanity.types.ts
- **AND** the generation SHALL complete without errors

#### Scenario: Use typed queries
- **WHEN** a developer writes a GROQ query with defineQuery
- **THEN** TypeScript SHALL provide autocomplete for document fields
- **AND** TypeScript SHALL catch type errors at compile time
- **AND** the query result SHALL have correct TypeScript types

#### Scenario: Schema changes trigger type update
- **WHEN** the schema is modified
- **THEN** the typegen command SHALL regenerate types
- **AND** any queries using old fields SHALL show TypeScript errors
- **AND** developers SHALL be able to fix type errors before deployment

### Requirement: Content Validation
The system SHALL enforce validation rules to ensure content quality before publishing.

#### Scenario: Validate required fields
- **WHEN** an editor attempts to publish a post
- **THEN** the system SHALL validate all required fields are filled
- **AND** prevent publishing if any required field is missing
- **AND** display clear error messages for each missing field

#### Scenario: Validate field length constraints
- **WHEN** an editor fills in content fields
- **THEN** the title SHALL be between 10-200 characters
- **AND** the summary SHALL be between 100-280 characters
- **AND** the system SHALL show warnings when approaching limits

#### Scenario: Validate SEO metadata
- **WHEN** an editor attempts to publish a post
- **THEN** the SEO meta title SHALL be required and 50-60 characters
- **AND** the SEO meta description SHALL be required and 120-160 characters
- **AND** publishing SHALL be blocked if SEO fields are incomplete

#### Scenario: Validate image requirements
- **WHEN** an editor attempts to publish a post
- **THEN** a hero image SHALL be required
- **AND** all images SHALL have alt text for accessibility
- **AND** the system SHALL block publishing if images lack alt text

#### Scenario: Validate content completeness
- **WHEN** an editor attempts to publish a post
- **THEN** the content body SHALL have at least 3 blocks
- **AND** at least one category SHALL be selected
- **AND** the author field SHALL be filled

### Requirement: Audit Trail
The system SHALL maintain an audit trail of workflow actions and content changes.

#### Scenario: Record review actions
- **WHEN** a post is submitted for review
- **THEN** the system SHALL record the lastReviewedAt timestamp
- **AND** optionally record the lastReviewedBy user reference

#### Scenario: Record approval actions
- **WHEN** a post is approved
- **THEN** the system SHALL record the approvedBy user reference
- **AND** the system SHALL record the approvedAt timestamp
- **AND** this information SHALL be visible in the Studio

#### Scenario: View document history
- **WHEN** an editor opens a post in the Studio
- **THEN** the document history SHALL be accessible
- **AND** the history SHALL show all revisions
- **AND** the history SHALL show who made each change and when

#### Scenario: Revert to previous version
- **WHEN** an editor views document history
- **THEN** the editor SHALL be able to revert to any previous version
- **AND** the reversion SHALL create a new revision
- **AND** the reversion SHALL be recorded in the audit trail

### Requirement: Studio Structure Customization
The system SHALL provide a customized Studio structure optimized for editorial workflows.

#### Scenario: View editorial dashboard
- **WHEN** an editor opens the Studio
- **THEN** a dashboard SHALL be the first view
- **AND** the dashboard SHALL show post counts by status
- **AND** the dashboard SHALL show recent activity
- **AND** the dashboard SHALL show upcoming scheduled posts

#### Scenario: View posts by workflow status
- **WHEN** an editor navigates the Studio sidebar
- **THEN** posts SHALL be grouped by workflow status
- **AND** each status group SHALL show a count badge
- **AND** clicking a status group SHALL filter to those posts

#### Scenario: View content pipeline
- **WHEN** an editor opens the content pipeline view
- **THEN** posts SHALL be displayed in columns by status
- **AND** the editor SHALL see post cards with key information
- **AND** the editor SHALL be able to filter by category, author, or priority

#### Scenario: View scheduled posts calendar
- **WHEN** an editor opens the scheduled posts view
- **THEN** a calendar SHALL display scheduled publication dates
- **AND** clicking a date SHALL show posts scheduled for that day
- **AND** the editor SHALL be able to reschedule or publish immediately

### Requirement: Custom Document Actions
The system SHALL provide custom document actions for workflow transitions.

#### Scenario: Submit for review action
- **WHEN** an editor views a draft post
- **THEN** a "Submit for Review" action SHALL be available
- **AND** clicking the action SHALL change status to "in-review"
- **AND** the action SHALL record the submission time
- **AND** a success notification SHALL appear

#### Scenario: Approve and publish action
- **WHEN** a senior editor views a post in review
- **THEN** an "Approve and Publish" action SHALL be available
- **AND** clicking the action SHALL change status to "approved" then "published"
- **AND** the action SHALL record who approved and when
- **AND** the post SHALL immediately appear on the site

#### Scenario: Schedule publish action
- **WHEN** an editor views an approved post
- **THEN** a "Schedule Publish" action SHALL be available
- **AND** clicking the action SHALL open a datetime picker
- **AND** selecting a datetime SHALL set scheduledPublishAt
- **AND** a confirmation message SHALL show the scheduled time

#### Scenario: Unpublish action
- **WHEN** an editor views a published post
- **THEN** an "Unpublish" action SHALL be available
- **AND** clicking the action SHALL show a confirmation dialog
- **AND** confirming SHALL change status to "archived"
- **AND** the post SHALL be removed from the public site

### Requirement: Visual Status Indicators
The system SHALL provide visual indicators for post status throughout the Studio.

#### Scenario: Display status badge in document list
- **WHEN** an editor views a list of posts
- **THEN** each post SHALL display a colored status badge
- **AND** draft posts SHALL show a gray badge
- **AND** in-review posts SHALL show a yellow badge
- **AND** approved posts SHALL show a blue badge
- **AND** published posts SHALL show a green badge
- **AND** archived posts SHALL show a dark gray badge

#### Scenario: Display priority indicator
- **WHEN** an editor views a list of posts
- **THEN** high-priority posts SHALL display a visual indicator
- **AND** the indicator SHALL be clearly distinguishable
- **AND** posts SHALL be sortable by priority

#### Scenario: Display scheduled time
- **WHEN** an editor views a scheduled post
- **THEN** the scheduled publication time SHALL be clearly visible
- **AND** the time SHALL display in the user's timezone
- **AND** a countdown or "in X hours" indicator SHALL be shown

### Requirement: Enhanced Schema Fields
The system SHALL extend the post schema with fields supporting editorial workflows and content management.

#### Scenario: Add workflow status field
- **WHEN** a post document is created
- **THEN** a status field SHALL exist with enum values
- **AND** the status SHALL default to "draft"
- **AND** the status SHALL be queryable in GROQ

#### Scenario: Add priority field
- **WHEN** editing a post
- **THEN** a priority field SHALL be available
- **AND** priority options SHALL be: high, medium, low
- **AND** priority SHALL default to "medium"
- **AND** priority SHALL affect sorting in content pipeline

#### Scenario: Add featured flag
- **WHEN** editing a post
- **THEN** a featured boolean field SHALL be available
- **AND** featured posts SHALL be queryable separately
- **AND** the frontend SHALL be able to display featured posts prominently

#### Scenario: Calculate reading time
- **WHEN** a post's content is updated
- **THEN** the system SHALL calculate estimated reading time
- **AND** the reading time SHALL be stored in minutes
- **AND** the reading time SHALL be displayed to readers

### Requirement: Editorial Documentation
The system SHALL provide comprehensive documentation for the editorial team.

#### Scenario: Access editorial guide
- **WHEN** a new editor joins the team
- **THEN** an EDITORIAL_GUIDE.md SHALL be available
- **AND** the guide SHALL document the complete workflow
- **AND** the guide SHALL include a content creation checklist

#### Scenario: Find SEO best practices
- **WHEN** an editor needs SEO guidance
- **THEN** the editorial guide SHALL include SEO best practices
- **AND** the practices SHALL specify optimal meta field lengths
- **AND** the practices SHALL provide examples

#### Scenario: Troubleshoot common issues
- **WHEN** an editor encounters a problem
- **THEN** the guide SHALL have a troubleshooting section
- **AND** common issues SHALL be documented with solutions
- **AND** the guide SHALL be easily searchable

### Requirement: Content Querying
The system SHALL query and retrieve content from Sanity with workflow status filtering.

#### Scenario: Query published posts for site
- **WHEN** the frontend requests blog posts
- **THEN** the query SHALL filter by status == "published"
- **AND** the query SHALL order by publishedAt descending
- **AND** the query SHALL return typed results using generated types
- **AND** draft and other non-published posts SHALL be excluded

#### Scenario: Query posts by status in Studio
- **WHEN** the Studio requests posts for a specific status view
- **THEN** the query SHALL use a parameterized status filter
- **AND** the query SHALL be type-safe with TypeScript
- **AND** the results SHALL match the requested status exactly

#### Scenario: Query scheduled posts
- **WHEN** the scheduled publishing system checks for posts to publish
- **THEN** the query SHALL filter by scheduledPublishAt <= current time
- **AND** the query SHALL filter by status == "approved"
- **AND** only posts ready to publish SHALL be returned
