# Production-Ready Sanity Editorial Workflows

**Status:** draft
**Date:** 2025-10-10
**Author:** AI Agent (Droid)

## Why

The current Sanity integration is functional but lacks production-grade editorial workflow features that content teams need. Based on Sanity best practices and editorial workflow research, the integration is missing:

**Critical Gaps:**
1. **No Workflow States** - Posts go straight from draft to published without review stages
2. **Broken TypeScript Generation** - `bun run sanity:typegen` fails, losing type safety
3. **No Scheduled Publishing** - Cannot plan content releases
4. **Limited Validation** - Basic field validation but no workflow-aware validation
5. **No Audit Trail** - Cannot track who changed what and when
6. **Missing Structure Customization** - Generic Studio layout, not optimized for editorial teams
7. **No Editorial Guidelines** - Content team lacks documented workflows
8. **Incomplete SEO Validation** - SEO object exists but validation is custom, not using Sanity best practices
9. **No Content Releases** - Cannot group related content updates
10. **No Role-Based Guidance** - Missing permissions documentation for editors vs admins

**Impact on Editorial Team:**
- Editors cannot save work-in-progress without publishing
- No way to request reviews from senior editors
- Cannot schedule posts for future publication
- No visibility into content production pipeline
- Risk of accidental publishing of incomplete content
- No collaboration features for team workflows

**Current State:**
- ✅ Visual Editing working
- ✅ Portable Text rendering
- ✅ Basic schema (post, author, category)
- ✅ Image optimization through CDN
- ❌ Editorial workflow states
- ❌ Type generation
- ❌ Scheduled publishing
- ❌ Custom publish actions
- ❌ Studio structure optimization

## What Changes

### 1. Fix TypeScript Generation (Priority: Critical)
- Fix `sanity-codegen` configuration to generate types from schema
- Switch to official `@sanity/cli` typegen if needed
- Generate `sanity.types.ts` with proper GROQ query types
- Update queries to use typed results

### 2. Add Editorial Workflow States (Priority: High)
Add workflow status field to posts with states:
- **Draft** - Work in progress, not visible to editors
- **In Review** - Ready for editorial review
- **Approved** - Reviewed and approved, ready to publish
- **Published** - Live on site
- **Archived** - No longer active but preserved

Add custom badges in Studio to show status visually.

### 3. Implement Scheduled Publishing (Priority: High)
- Add `scheduledPublishAt` datetime field
- Configure custom publish action to respect scheduling
- Add "Schedule Post" action in Studio
- Show upcoming scheduled posts in Structure tool
- Document timezone handling

### 4. Enhance Content Validation (Priority: High)
- **Pre-publish validation** - Block publishing if required fields incomplete
- **SEO validation** - Use Sanity's recommended patterns
- **Content quality checks** - Word count minimums, readability
- **Image requirements** - Enforce hero image, alt text
- **Slug uniqueness** - Prevent duplicate slugs

### 5. Add Audit Trail & Version History (Priority: Medium)
- Enable document history in Studio (built-in feature)
- Add custom fields for editorial metadata:
  - `lastReviewedBy` - Reference to author who reviewed
  - `lastReviewedAt` - Datetime of last review
  - `approvedBy` - Reference to author who approved
  - `approvedAt` - Datetime of approval
- Configure Studio to show revision history prominently

### 6. Optimize Studio Structure (Priority: Medium)
- **Custom Dashboard** - Show editorial metrics, recent activity
- **Content Pipeline View** - Kanban board showing posts by workflow state
- **Scheduled Posts Widget** - Calendar view of upcoming posts
- **Custom Document Lists** - Filter by status, author, category
- **Bulk Actions** - Change status for multiple posts
- **Custom Badges** - Visual indicators for status, scheduled, urgent

### 7. Implement Content Releases (Priority: Medium)
- Use Sanity's Content Releases feature for coordinated launches
- Group related content updates (e.g., product launch posts + category pages)
- Preview entire release before publishing
- Schedule release for specific date/time

### 8. Add Custom Publish Actions (Priority: Medium)
- **Publish Immediately** - Default behavior
- **Schedule for Later** - Opens scheduling dialog
- **Submit for Review** - Changes status to In Review
- **Approve and Publish** - For reviewers
- **Unpublish** - Move to archived state

### 9. Create Editorial Documentation (Priority: High)
Create `EDITORIAL_GUIDE.md` with:
- Workflow states and transitions
- Content creation checklist
- SEO best practices
- Image guidelines (dimensions, formats, alt text)
- Publishing schedule and deadlines
- Review process
- Common troubleshooting

### 10. Enhance Schema (Priority: Medium)
- Add `excerpt` field separate from `summary` for SEO
- Add `readingTime` calculated field
- Add `featured` boolean for homepage
- Add `status` field (enum) for workflow
- Add `priority` field (high/medium/low) for editorial planning
- Improve category schema with color/icon
- Add content warnings/flags field

### 11. Add Role-Based Access Documentation (Priority: Low)
Document Sanity role configuration for:
- **Viewer** - Can view content, cannot edit
- **Editor** - Can create/edit/submit for review
- **Reviewer** - Can approve content
- **Administrator** - Full access including schema changes

### 12. Setup Preview Deployments (Priority: Low)
- Configure preview URL for draft content
- Add deploy preview button in Studio
- Document Vercel/Netlify preview deployment setup

## Impact

### Affected Areas
- **Schema**: New fields for workflow, scheduling, audit trail
- **Studio**: Custom structure, actions, dashboard, badges
- **Client Queries**: Update to filter by workflow status
- **Build Process**: TypeScript generation fixed
- **Documentation**: New editorial guide

### Benefits
- ✅ **Safer Publishing** - Review process prevents premature publishing
- ✅ **Better Planning** - Scheduled publishing enables content calendar
- ✅ **Team Collaboration** - Clear workflow states and assignments
- ✅ **Quality Control** - Enhanced validation catches issues early
- ✅ **Accountability** - Audit trail tracks all changes
- ✅ **Type Safety** - Generated types catch errors at build time
- ✅ **Better UX** - Optimized Studio layout for editorial tasks
- ✅ **Scalability** - Workflow supports growing content team

### Breaking Changes
**None for existing content**, but:
- New required fields will need defaults for existing posts
- Studio layout will look different (improved organization)
- Queries may need updates to handle workflow status

### Migration Plan
1. Add new fields with defaults for existing content
2. Set all existing posts to "Published" status
3. Gradually adopt workflow for new content
4. Train content team on new features

## Alternatives Considered

### Alternative 1: Keep Current Simple Setup
**Approach:** Continue with basic Studio, no workflow states
**Pros:** 
- No additional complexity
- Faster short-term
- Less maintenance
**Cons:** 
- Scales poorly as team grows
- High risk of accidental publishing
- No content planning capabilities
**Why not chosen:** User specifically requested production-ready editorial workflows

### Alternative 2: Use External Workflow Tool
**Approach:** Use Trello/Asana/Monday for workflow, Sanity just for content
**Pros:**
- Familiar tools
- Flexible workflow customization
**Cons:**
- Context switching between tools
- No connection between workflow status and content
- Duplicate effort tracking content
- No enforcement of workflow rules
**Why not chosen:** Sanity has native workflow features that integrate seamlessly

### Alternative 3: Minimal Workflow (Just Draft/Published)
**Approach:** Add only basic draft/published states, skip review/approval
**Pros:**
- Simpler implementation
- Less training needed
**Cons:**
- No quality control step
- Doesn't support team collaboration
- Missing for most professional editorial teams
**Why not chosen:** Halfway solution that doesn't solve real editorial needs

### Alternative 4: Use Sanity's Workflows Plugin
**Approach:** Use third-party workflow plugin instead of custom implementation
**Pros:**
- Pre-built solution
- Community maintained
**Cons:**
- Less control over workflow logic
- May not fit specific needs
- Additional dependency
**Why not chosen:** Custom implementation provides better control and learns Sanity patterns

## Proposed Changes

### Files/Components Affected

#### Schema Files
- `src/sanity/schemaTypes/post.ts` - Add workflow fields
- `src/sanity/schemaTypes/author.ts` - Minor enhancements
- `src/sanity/schemaTypes/category.ts` - Add color/icon fields
- `src/sanity/schemaTypes/seo.ts` - Improve validation
- `src/sanity/schemaTypes/workflowStatus.ts` - **NEW** enum type
- `src/sanity/schemaTypes/publishSchedule.ts` - **NEW** object type

#### Studio Configuration
- `sanity.config.ts` - Add structure tool customization, document actions
- `src/sanity/structure/` - **NEW** folder for custom structure
  - `dashboard.tsx` - Custom dashboard
  - `contentPipeline.tsx` - Kanban view by status
  - `scheduledPosts.tsx` - Calendar view
- `src/sanity/actions/` - **NEW** folder for custom actions
  - `publishScheduled.ts` - Schedule publish action
  - `submitForReview.ts` - Submit for review action
  - `approveAndPublish.ts` - Approve action
- `src/sanity/components/` - **NEW** folder for Studio components
  - `StatusBadge.tsx` - Visual status indicator
  - `WorkflowTransitions.tsx` - Workflow state machine UI

#### Client Configuration
- `src/sanity/lib/client.ts` - Add typed queries
- `src/sanity/lib/queries.ts` - **NEW** typed GROQ queries
- `src/sanity/lib/validation.ts` - **NEW** custom validation rules

#### Type Generation
- `sanity.cli.ts` - Fix or replace with official typegen
- `sanity-codegen.config.ts` - **NEW** if keeping sanity-codegen
- `src/sanity/types/` - **NEW** folder for generated types

#### Documentation
- `EDITORIAL_GUIDE.md` - **NEW** complete editorial workflow guide
- `SANITY_ROLES.md` - **NEW** role-based access guide
- `openspec/project.md` - Update with new Sanity patterns

## Implementation Plan

### Phase 1: Foundation (Week 1) - Critical
1. **Fix TypeScript Generation**
   - Diagnose `sanity-codegen` issue
   - Switch to `@sanity/cli` typegen if needed
   - Generate types successfully
   - Update queries to use types

2. **Add Workflow Schema Fields**
   - Create `workflowStatus` enum type
   - Add status field to post schema
   - Add scheduling fields
   - Add audit trail fields
   - Set defaults for existing content

3. **Basic Validation Enhancement**
   - Strengthen required field validation
   - Add pre-publish validation function
   - Prevent publishing incomplete content

### Phase 2: Editorial Workflow (Week 1-2) - High Priority
1. **Custom Publish Actions**
   - Create submit for review action
   - Create schedule publish action
   - Create approve and publish action
   - Add action permissions logic

2. **Studio Structure Customization**
   - Create custom dashboard
   - Add content pipeline view (basic)
   - Add status filters to document lists
   - Add visual status badges

3. **Scheduled Publishing**
   - Add scheduling UI
   - Create scheduled publish logic
   - Add upcoming posts view
   - Test timezone handling

### Phase 3: Polish & Documentation (Week 2) - Medium Priority
1. **Enhanced Studio Features**
   - Add calendar view for scheduled posts
   - Create editorial metrics dashboard
   - Add bulk actions for status changes
   - Improve preview configuration

2. **Documentation**
   - Write EDITORIAL_GUIDE.md
   - Document workflow transitions
   - Create content checklist
   - Add troubleshooting guide

3. **Schema Enhancements**
   - Add featured flag
   - Add priority field
   - Add reading time calculation
   - Enhance category schema

### Phase 4: Advanced Features (Optional - Week 3+)
1. **Content Releases**
   - Configure Content Releases feature
   - Document release workflow
   - Test coordinated launches

2. **Role Documentation**
   - Document Sanity roles configuration
   - Create permission matrix
   - Add team onboarding guide

3. **Preview Deployments**
   - Configure preview URLs
   - Add deploy preview button
   - Document deployment workflow

## Testing Strategy

### Schema Testing
- [ ] All existing content loads without errors
- [ ] New workflow fields have proper defaults
- [ ] Validation rules work as expected
- [ ] TypeScript types generate successfully

### Studio Testing
- [ ] Custom dashboard loads and shows correct data
- [ ] Workflow state transitions work correctly
- [ ] Scheduled publishing UI functions
- [ ] Status badges display properly
- [ ] Document actions appear in correct contexts
- [ ] Bulk actions work on multiple documents

### Integration Testing
- [ ] Published content appears on site
- [ ] Draft content does not appear on site
- [ ] Scheduled posts publish at correct time
- [ ] Visual editing works with new fields
- [ ] Queries filter by status correctly

### User Acceptance Testing
- [ ] Content editors can follow workflow
- [ ] Review process is clear
- [ ] Scheduling is intuitive
- [ ] Dashboard provides useful information
- [ ] Documentation is clear and complete

### Performance Testing
- [ ] Studio loads quickly with new features
- [ ] Queries with status filters are fast
- [ ] Type generation completes in reasonable time

## Risks & Considerations

### Technical Risks
- **TypeScript Generation** - May require switching tools if `sanity-codegen` unfixable
- **Custom Actions Complexity** - Workflow logic can become complex, need clear state machine
- **Query Performance** - Filtering by workflow status needs proper indexing

### Editorial Team Risks
- **Learning Curve** - New workflow requires training
- **Change Resistance** - Team may prefer simpler current setup
- **Process Overhead** - Review step adds time to publishing

### Mitigation Strategies
- Gradual rollout with training sessions
- Clear documentation with screenshots
- Optional workflow adoption (can still quick-publish if needed)
- Regular feedback loops with content team

## Success Metrics

- ✅ TypeScript generation runs successfully
- ✅ All posts have workflow status
- ✅ Zero accidental premature publications
- ✅ 90%+ adoption of workflow by content team
- ✅ Scheduled publishing used for at least 30% of posts
- ✅ Content team reports improved collaboration
- ✅ Studio load time remains under 2 seconds
- ✅ Editorial guide is complete and accessible

## Dependencies

- `@sanity/cli` (for typegen, already installed)
- Potentially `@sanity/dashboard` (for custom dashboard)
- No new external dependencies required
- All features use Sanity's native capabilities

## Resources & References

- [Sanity Editorial Workflows Best Practices](https://www.sanity.io/glossary/drafts--publishing-workflow)
- [Principles of Effective Editorial Experiences](https://www.sanity.io/blog/principles-effective-editorial-experiences)
- [Custom Editorial Workflows in Sanity](https://www.represent.no/short-stories/custom-editorial-workflows-in-sanity)
- [Sanity Presentation Tool](https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool)
- [Sanity Document Actions](https://www.sanity.io/docs/document-actions)
- [Content Releases](https://www.sanity.io/docs/content-releases)

---

**Estimated Implementation Time:** 2-3 weeks
**Priority:** High
**Breaking Changes:** None (additive only)
**Testing Complexity:** Medium
