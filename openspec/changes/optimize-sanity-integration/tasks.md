# Implementation Tasks - Production-Ready Sanity Editorial Workflows

## Phase 1: Foundation (Critical - Week 1)

### 1.1 Fix TypeScript Generation
- [ ] 1.1.1 Diagnose why `sanity-codegen` is failing (`types.filter is not a function`)
- [ ] 1.1.2 Check `sanity-codegen.config.ts` configuration
- [ ] 1.1.3 Try official Sanity typegen: `npx sanity@latest schema extract`
- [ ] 1.1.4 Try official Sanity typegen: `npx sanity@latest typegen generate`
- [ ] 1.1.5 Update `package.json` script to use working typegen command
- [ ] 1.1.6 Generate `sanity.types.ts` successfully
- [ ] 1.1.7 Create typed query helpers in `src/sanity/lib/queries.ts`
- [ ] 1.1.8 Update existing queries to use generated types
- [ ] 1.1.9 Run `bun run typecheck` to verify all types are correct
- [ ] 1.1.10 Add typegen to CI/CD pipeline

### 1.2 Create Workflow Schema Types
- [ ] 1.2.1 Create `src/sanity/schemaTypes/workflowStatus.ts`:
  ```typescript
  export const workflowStatusType = defineType({
    name: 'workflowStatus',
    title: 'Workflow Status',
    type: 'string',
    options: {
      list: [
        { title: 'Draft', value: 'draft' },
        { title: 'In Review', value: 'in-review' },
        { title: 'Approved', value: 'approved' },
        { title: 'Published', value: 'published' },
        { title: 'Archived', value: 'archived' },
      ],
      layout: 'radio',
    },
  });
  ```
- [ ] 1.2.2 Add workflow fields to `post.ts`:
  - [ ] Add `status` field (workflowStatus type, default: 'draft')
  - [ ] Add `scheduledPublishAt` field (datetime, optional)
  - [ ] Add `lastReviewedBy` field (reference to author, optional)
  - [ ] Add `lastReviewedAt` field (datetime, optional)
  - [ ] Add `approvedBy` field (reference to author, optional)
  - [ ] Add `approvedAt` field (datetime, optional)
  - [ ] Add `priority` field (string enum: high/medium/low, default: 'medium')
  - [ ] Add `featured` field (boolean, default: false)
  - [ ] Add `readingTime` field (number, calculated)
- [ ] 1.2.3 Update `schemaTypes/index.ts` to export `workflowStatusType`
- [ ] 1.2.4 Test schema loads in Studio without errors
- [ ] 1.2.5 Verify existing posts still load (with default values)

### 1.3 Add Data Migration Script
- [ ] 1.3.1 Create `scripts/migrate-workflow-fields.ts`
- [ ] 1.3.2 Set all existing posts to status: 'published'
- [ ] 1.3.3 Set scheduledPublishAt to publishedAt for existing posts
- [ ] 1.3.4 Run migration on production dataset
- [ ] 1.3.5 Verify migration success
- [ ] 1.3.6 Document migration process

### 1.4 Enhance Validation
- [ ] 1.4.1 Add pre-publish validation function to post schema
- [ ] 1.4.2 Prevent publishing if required fields missing:
  - [ ] Title must be 10-200 characters
  - [ ] Summary must be 100-280 characters
  - [ ] Hero image must be present with alt text
  - [ ] SEO meta title and description must be filled
  - [ ] Content must have at least 3 blocks
  - [ ] At least one category must be selected
- [ ] 1.4.3 Add validation messages that guide editors
- [ ] 1.4.4 Test validation prevents incomplete publishing
- [ ] 1.4.5 Document validation rules in EDITORIAL_GUIDE.md

## Phase 2: Editorial Workflow (High Priority - Week 1-2)

### 2.1 Create Custom Document Actions

#### 2.1.1 Submit for Review Action
- [ ] Create `src/sanity/actions/submitForReview.ts`
- [ ] Action only available when status is 'draft'
- [ ] Changes status to 'in-review'
- [ ] Sets lastReviewedAt to current time
- [ ] Shows confirmation toast
- [ ] Test action in Studio

#### 2.1.2 Approve and Publish Action
- [ ] Create `src/sanity/actions/approveAndPublish.ts`
- [ ] Action only available when status is 'in-review'
- [ ] Changes status to 'approved'
- [ ] Sets approvedBy to current user
- [ ] Sets approvedAt to current time
- [ ] Publishes document immediately
- [ ] Shows success notification
- [ ] Test action with different users

#### 2.1.3 Schedule Publish Action
- [ ] Create `src/sanity/actions/schedulePublish.ts`
- [ ] Opens dialog to select date/time
- [ ] Sets scheduledPublishAt field
- [ ] Changes status to 'approved'
- [ ] Shows "Scheduled for [date]" confirmation
- [ ] Add timezone selector
- [ ] Test scheduling various dates
- [ ] Document timezone behavior

#### 2.1.4 Unpublish Action
- [ ] Create `src/sanity/actions/unpublish.ts`
- [ ] Action only available when status is 'published'
- [ ] Changes status to 'archived'
- [ ] Keeps publishedAt for reference
- [ ] Shows confirmation dialog
- [ ] Test unpublishing

#### 2.1.5 Register Actions in Studio
- [ ] Update `sanity.config.ts` to add document actions
- [ ] Import all custom actions
- [ ] Add actions to post document type
- [ ] Configure action permissions
- [ ] Test all actions appear correctly
- [ ] Verify action visibility based on status

### 2.2 Customize Studio Structure

#### 2.2.1 Create Custom Dashboard
- [ ] Create `src/sanity/structure/dashboard.tsx`
- [ ] Add metrics widgets:
  - [ ] Total posts by status (pie chart)
  - [ ] Posts published this week (number)
  - [ ] Posts in review (number)
  - [ ] Upcoming scheduled posts (list)
  - [ ] Recent activity (list)
- [ ] Style dashboard with Sanity UI components
- [ ] Make dashboard responsive
- [ ] Test dashboard loads quickly

#### 2.2.2 Create Content Pipeline View
- [ ] Create `src/sanity/structure/contentPipeline.tsx`
- [ ] Create columns for each workflow status
- [ ] Show posts as cards in their status column
- [ ] Add drag-and-drop to change status (optional)
- [ ] Add filters by category, author, priority
- [ ] Add search functionality
- [ ] Make responsive for different screen sizes
- [ ] Test with multiple posts

#### 2.2.3 Create Scheduled Posts View
- [ ] Create `src/sanity/structure/scheduledPosts.tsx`
- [ ] Show calendar view of scheduled posts
- [ ] Allow clicking date to see posts scheduled that day
- [ ] Show timezone information
- [ ] Add "Publish Now" quick action
- [ ] Add "Reschedule" quick action
- [ ] Test with various scheduled dates

#### 2.2.4 Customize Structure Tool
- [ ] Update `sanity.config.ts` structure configuration
- [ ] Add custom dashboard to structure
- [ ] Add content pipeline view
- [ ] Add scheduled posts view
- [ ] Group posts by status in sidebar:
  - [ ] Drafts (count badge)
  - [ ] In Review (count badge)
  - [ ] Approved (count badge)
  - [ ] Published (count badge)
  - [ ] Scheduled (count badge)
  - [ ] Archived
- [ ] Add filters to document lists
- [ ] Test structure navigation

### 2.3 Add Visual Status Indicators

#### 2.3.1 Create Status Badge Component
- [ ] Create `src/sanity/components/StatusBadge.tsx`
- [ ] Design badge colors:
  - [ ] Draft: gray
  - [ ] In Review: yellow
  - [ ] Approved: blue
  - [ ] Published: green
  - [ ] Archived: dark gray
- [ ] Add icons for each status
- [ ] Make badge accessible (ARIA labels)
- [ ] Test badge in different contexts

#### 2.3.2 Add Badge to Post Preview
- [ ] Update post preview configuration
- [ ] Show status badge in document list
- [ ] Show priority indicator
- [ ] Show scheduled date if applicable
- [ ] Test badge visibility and styling

#### 2.3.3 Add Workflow Visualization
- [ ] Create `src/sanity/components/WorkflowTransitions.tsx`
- [ ] Show visual flowchart of workflow states
- [ ] Highlight current state
- [ ] Show available transitions
- [ ] Add to post document sidebar
- [ ] Test workflow visualization

### 2.4 Implement Scheduled Publishing Logic
- [ ] 2.4.1 Research Sanity scheduled publishing options:
  - Option A: Serverless function that runs hourly
  - Option B: Sanity Scheduled Publishing plugin
  - Option C: CI/CD job that checks for scheduled posts
- [ ] 2.4.2 Choose and document approach
- [ ] 2.4.3 Implement chosen solution
- [ ] 2.4.4 Add error handling and logging
- [ ] 2.4.5 Test with various scheduled times
- [ ] 2.4.6 Test timezone edge cases
- [ ] 2.4.7 Document setup instructions

## Phase 3: Polish & Documentation (Medium Priority - Week 2)

### 3.1 Enhanced Studio Features

#### 3.1.1 Editorial Metrics Dashboard
- [ ] Add "Posts this month" metric
- [ ] Add "Average time to publish" metric
- [ ] Add "Most active authors" widget
- [ ] Add "Popular categories" widget
- [ ] Cache metrics for performance
- [ ] Test dashboard performance

#### 3.1.2 Bulk Actions
- [ ] Add bulk status change action
- [ ] Add bulk category assignment
- [ ] Add bulk author assignment
- [ ] Add bulk delete (with confirmation)
- [ ] Test bulk actions with 10+ posts
- [ ] Add undo functionality

#### 3.1.3 Preview Configuration
- [ ] Update preview client for draft viewing
- [ ] Configure preview URLs for each status
- [ ] Test preview mode in Presentation tool
- [ ] Add preview button to Studio
- [ ] Document preview setup

### 3.2 Create Editorial Documentation

#### 3.2.1 Write EDITORIAL_GUIDE.md
- [ ] Document workflow overview with diagram
- [ ] Describe each workflow state
- [ ] List state transition rules
- [ ] Create content creation checklist:
  - [ ] Research and outline
  - [ ] Write draft
  - [ ] Add images with alt text
  - [ ] Fill SEO fields
  - [ ] Proofread
  - [ ] Submit for review
  - [ ] Address reviewer feedback
  - [ ] Publish or schedule
- [ ] Document SEO best practices:
  - [ ] Meta title length (50-60 chars)
  - [ ] Meta description length (120-160 chars)
  - [ ] Keyword placement
  - [ ] Image optimization
- [ ] Image guidelines:
  - [ ] Hero image dimensions (1200x630px)
  - [ ] Supported formats (WEBP, JPG, PNG)
  - [ ] Alt text requirements
  - [ ] Caption best practices
- [ ] Publishing schedule and deadlines
- [ ] Review process expectations:
  - [ ] Review SLA (24-48 hours)
  - [ ] Reviewer responsibilities
  - [ ] Feedback format
- [ ] Common troubleshooting:
  - [ ] Cannot publish (validation errors)
  - [ ] Scheduled post didn't publish
  - [ ] Image not appearing
  - [ ] Preview not loading

#### 3.2.2 Create Quick Reference Cards
- [ ] Workflow states cheat sheet
- [ ] Keyboard shortcuts
- [ ] Validation rules quick ref
- [ ] SEO checklist card

#### 3.2.3 Add In-Studio Help
- [ ] Add help text to all custom fields
- [ ] Add tooltips for workflow actions
- [ ] Link to full documentation from Studio
- [ ] Test help text is clear

### 3.3 Schema Enhancements

#### 3.3.1 Add Featured Posts Support
- [ ] Add `featured` boolean to post schema
- [ ] Add featured posts filter to structure
- [ ] Create featured posts query
- [ ] Add featured badge to preview
- [ ] Update frontend to show featured posts
- [ ] Test featured posts display

#### 3.3.2 Add Reading Time Calculation
- [ ] Create reading time calculation function
- [ ] Add as computed field to post
- [ ] Show reading time in post preview
- [ ] Display reading time on frontend
- [ ] Test calculation accuracy

#### 3.3.3 Add Priority Field
- [ ] Already added in Phase 1.2.2
- [ ] Add priority filtering to structure
- [ ] Show priority badge in preview
- [ ] Sort by priority in content pipeline
- [ ] Test priority functionality

#### 3.3.4 Enhance Category Schema
- [ ] Add `color` field (string) for tag color
- [ ] Add `icon` field (string) for emoji/icon
- [ ] Add `order` field (number) for sorting
- [ ] Update category preview to show color/icon
- [ ] Test category enhancements

#### 3.3.5 Add Content Warnings
- [ ] Create `contentWarnings` array field
- [ ] Add predefined warning options
- [ ] Show warnings in post preview
- [ ] Display warnings on frontend
- [ ] Test warning functionality

### 3.4 Query Optimization
- [ ] 3.4.1 Create typed queries in `src/sanity/lib/queries.ts`:
  - [ ] `POSTS_QUERY` - All published posts
  - [ ] `POST_BY_SLUG_QUERY` - Single post by slug
  - [ ] `POSTS_BY_STATUS_QUERY` - Posts filtered by status
  - [ ] `SCHEDULED_POSTS_QUERY` - Posts scheduled for future
  - [ ] `FEATURED_POSTS_QUERY` - Featured posts only
  - [ ] `POSTS_BY_CATEGORY_QUERY` - Posts in category
  - [ ] `POSTS_BY_AUTHOR_QUERY` - Posts by author
- [ ] 3.4.2 Add proper projections to reduce response size
- [ ] 3.4.3 Test query performance
- [ ] 3.4.4 Add query caching strategy
- [ ] 3.4.5 Document query usage

## Phase 4: Advanced Features (Optional - Week 3+)

### 4.1 Content Releases

#### 4.1.1 Configure Content Releases
- [ ] Research Sanity Content Releases feature
- [ ] Enable in Studio configuration
- [ ] Create first test release
- [ ] Document release creation process
- [ ] Test coordinated publishing

#### 4.1.2 Release Workflow Integration
- [ ] Add posts to releases
- [ ] Schedule release publication
- [ ] Preview entire release
- [ ] Test release publishing
- [ ] Document release workflow

### 4.2 Role-Based Access Documentation

#### 4.2.1 Create SANITY_ROLES.md
- [ ] Document Sanity's built-in roles
- [ ] Create custom role definitions:
  - [ ] Contributor (can create drafts)
  - [ ] Editor (can publish own posts)
  - [ ] Senior Editor (can approve others' posts)
  - [ ] Administrator (full access)
- [ ] Create permission matrix
- [ ] Document role assignment process
- [ ] Link from EDITORIAL_GUIDE.md

#### 4.2.2 Configure Roles in Sanity
- [ ] Set up roles in project settings
- [ ] Assign team members to roles
- [ ] Test permissions work correctly
- [ ] Document troubleshooting

### 4.3 Preview Deployments

#### 4.3.1 Configure Preview URLs
- [ ] Set up preview deployment environment
- [ ] Configure preview URL in Studio
- [ ] Add draft filtering to preview
- [ ] Test preview shows draft content
- [ ] Document preview setup

#### 4.3.2 Add Deploy Preview Button
- [ ] Create custom action for deploy preview
- [ ] Trigger preview build from Studio
- [ ] Show preview URL after build
- [ ] Test preview deployment
- [ ] Document deployment workflow

### 4.4 Advanced Validation

#### 4.4.1 Content Quality Checks
- [ ] Add word count validation (min 300 words)
- [ ] Add readability score (optional)
- [ ] Add heading structure validation
- [ ] Add internal link suggestions
- [ ] Test quality checks

#### 4.4.2 SEO Score
- [ ] Calculate SEO score based on:
  - [ ] Meta fields filled
  - [ ] Keyword in title
  - [ ] Keyword in summary
  - [ ] Image alt text
  - [ ] Content length
- [ ] Show SEO score in post preview
- [ ] Add SEO tips in Studio
- [ ] Test SEO scoring

## Testing & Quality Assurance

### 5.1 Schema Testing
- [ ] All existing content loads without errors
- [ ] New fields have proper defaults
- [ ] Validation rules work as expected
- [ ] TypeScript types generate successfully
- [ ] No console errors in Studio

### 5.2 Studio Testing
- [ ] Custom dashboard loads and shows correct data
- [ ] Workflow state transitions work correctly
- [ ] Scheduled publishing UI functions
- [ ] Status badges display properly
- [ ] Document actions appear in correct contexts
- [ ] Bulk actions work on multiple documents
- [ ] Preview mode works
- [ ] Studio is responsive on mobile

### 5.3 Integration Testing
- [ ] Published content appears on site
- [ ] Draft content does not appear on site
- [ ] Scheduled posts publish at correct time
- [ ] Visual editing works with new fields
- [ ] Queries filter by status correctly
- [ ] Preview client shows drafts

### 5.4 Performance Testing
- [ ] Studio loads in under 2 seconds
- [ ] Dashboard loads in under 1 second
- [ ] Content pipeline view handles 100+ posts
- [ ] Queries complete in under 500ms
- [ ] Type generation completes in under 10 seconds

### 5.5 User Acceptance Testing
- [ ] Content editors can follow workflow
- [ ] Review process is clear and intuitive
- [ ] Scheduling is intuitive
- [ ] Dashboard provides useful information
- [ ] Documentation is clear and complete
- [ ] Team reports improved collaboration

### 5.6 Accessibility Testing
- [ ] All custom components have ARIA labels
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

## Documentation & Deployment

### 6.1 Update Project Documentation
- [ ] Update `openspec/project.md` with new Sanity patterns
- [ ] Update `README.md` with editorial workflow info
- [ ] Update `SANITY_DOCUMENTATION.md` with new features
- [ ] Add troubleshooting section
- [ ] Document all environment variables

### 6.2 Create Training Materials
- [ ] Record video tutorial of workflow
- [ ] Create screenshot-based walkthrough
- [ ] Prepare training session slides
- [ ] Schedule training with content team

### 6.3 Deployment Checklist
- [ ] Run all tests
- [ ] Generate TypeScript types
- [ ] Build production bundle
- [ ] Deploy Studio changes
- [ ] Run data migration
- [ ] Verify all features work in production
- [ ] Monitor for errors
- [ ] Collect feedback from team

### 6.4 Post-Launch
- [ ] Schedule 1-week check-in with content team
- [ ] Monitor Studio usage analytics
- [ ] Collect feedback on workflow
- [ ] Iterate on pain points
- [ ] Celebrate successful launch! 🎉

---

**Total Estimated Tasks:** 200+
**Priority Distribution:**
- Critical: 26 tasks
- High: 45 tasks  
- Medium: 75 tasks
- Optional: 54+ tasks

**Completion Tracking:** 0/200+ tasks completed
