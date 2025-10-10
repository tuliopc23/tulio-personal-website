# Technical Design - Production-Ready Sanity Editorial Workflows

## Context

Sanity CMS is a headless content management system with powerful customization capabilities. The current integration works for basic content management but lacks production-grade editorial workflow features needed by content teams.

**Key Constraints:**
- Must maintain visual editing functionality
- Cannot break existing content or queries
- Must preserve Apple HIG design on frontend
- Studio must remain fast (<2s load time)
- Solution must scale to 100+ posts and 5+ authors

**Stakeholders:**
- Content editors (primary users)
- Senior editors/reviewers
- Developers (maintenance)
- End users (blog readers)

## Goals / Non-Goals

### Goals
1. ✅ **Editorial Workflow** - Implement draft → review → approve → publish pipeline
2. ✅ **Type Safety** - Fix and maintain TypeScript generation for schema and queries
3. ✅ **Scheduled Publishing** - Enable content calendar and timed releases
4. ✅ **Quality Control** - Enforce validation rules and pre-publish checks
5. ✅ **Team Collaboration** - Improve visibility and coordination
6. ✅ **Documentation** - Provide clear guidelines for content team

### Non-Goals
- ❌ **Multi-language Support** - Not implementing i18n in this phase
- ❌ **Comments System** - Not adding editorial comments/threads (use Sanity's built-in comments)
- ❌ **Custom Authentication** - Using Sanity's built-in auth
- ❌ **External CMS Migration** - Not migrating from another CMS
- ❌ **E-commerce Features** - Blog only, no product catalog

## Architecture Overview

### Workflow State Machine

```
┌──────────────────────────────────────────────────────────┐
│                   CONTENT LIFECYCLE                       │
└──────────────────────────────────────────────────────────┘

     ┌─────────┐
     │  Draft  │ ← Content created here
     └────┬────┘
          │ Submit for Review
          ↓
  ┌───────────────┐
  │  In Review    │ ← Editors review
  └───────┬───────┘
          │ Approve
          ↓
  ┌───────────────┐
  │  Approved     │ ← Ready to publish
  └───┬───────┬───┘
      │       │
      │       └─ Schedule → [Wait for scheduled time]
      │
      │ Publish
      ↓
  ┌──────────────┐
  │  Published   │ ← Live on site
  └──────┬───────┘
         │ Unpublish
         ↓
  ┌──────────────┐
  │  Archived    │ ← No longer active
  └──────────────┘
```

**State Transition Rules:**
- Draft → In Review: Available to all editors
- In Review → Draft: Available to original author (rejected)
- In Review → Approved: Available to senior editors only
- Approved → Published: Available to all editors
- Approved → Scheduled: Available to all editors
- Published → Archived: Available to all editors
- Archived → Draft: Available to administrators only

### System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      SANITY STUDIO                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Custom     │  │   Document   │  │   Structure  │    │
│  │  Dashboard   │  │   Actions    │  │     Tool     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │         Schema (Document Types)                   │    │
│  │  - Post (with workflow fields)                    │    │
│  │  - Author                                          │    │
│  │  - Category                                        │    │
│  │  - SEO                                             │    │
│  └──────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
                          │
                          │ Sanity API (GROQ)
                          ↓
┌────────────────────────────────────────────────────────────┐
│                    CONTENT LAKE                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Documents with _id, _type, _createdAt, etc.     │    │
│  │  - Drafts (drafts.post-id)                        │    │
│  │  - Published (post-id)                            │    │
│  └──────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
                          │
                          │ Client Query
                          ↓
┌────────────────────────────────────────────────────────────┐
│                    ASTRO FRONTEND                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Published   │  │   Preview    │  │    Visual    │    │
│  │   Client     │  │   Client     │  │   Editing    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │         Pages (Routes)                            │    │
│  │  - /blog (list of published posts)                │    │
│  │  - /blog/[slug] (individual post)                 │    │
│  └──────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

## Key Technical Decisions

### Decision 1: TypeScript Type Generation

**Problem:** `sanity-codegen` is failing with "types.filter is not a function" error.

**Options Considered:**

**Option A: Fix sanity-codegen**
- Pros: Minimal changes, already configured
- Cons: Unmaintained package, hard to debug

**Option B: Switch to @sanity/cli typegen (official)**
- Pros: Official Sanity support, actively maintained, better integration
- Cons: Different configuration, need to migrate

**Option C: Manual type definitions**
- Pros: Full control
- Cons: High maintenance burden, error-prone

**Decision: Option B - Switch to official Sanity CLI typegen**

**Rationale:**
- Official Sanity recommendation
- Better long-term support
- Generates types directly from schema
- Integrates with GROQ queries via `defineQuery`
- Active development and community

**Implementation:**
```bash
# Extract schema
npx sanity@latest schema extract

# Generate types
npx sanity@latest typegen generate
```

Update `package.json`:
```json
{
  "scripts": {
    "sanity:typegen": "sanity schema extract && sanity typegen generate"
  }
}
```

### Decision 2: Workflow State Storage

**Problem:** How to store and manage workflow status?

**Options Considered:**

**Option A: Use Sanity's built-in draft system**
- Pros: Native support, no extra fields
- Cons: Only binary (draft/published), can't track review states

**Option B: Add custom status field**
- Pros: Flexible, queryable, clear
- Cons: Need to enforce consistency with draft system

**Option C: Separate workflow documents**
- Pros: Separation of concerns
- Cons: Complex queries, harder to maintain

**Decision: Option B - Custom status field + leverage draft system**

**Rationale:**
- Provides granular workflow states
- Easy to query and filter
- Works with Sanity's draft system
- Simple to understand and maintain

**Implementation:**
```typescript
defineField({
  name: 'status',
  type: 'string',
  options: {
    list: [
      { title: '📝 Draft', value: 'draft' },
      { title: '👀 In Review', value: 'in-review' },
      { title: '✅ Approved', value: 'approved' },
      { title: '🚀 Published', value: 'published' },
      { title: '📦 Archived', value: 'archived' },
    ],
  },
  initialValue: 'draft',
  validation: Rule => Rule.required(),
})
```

### Decision 3: Scheduled Publishing Implementation

**Problem:** How to publish posts at scheduled times?

**Options Considered:**

**Option A: Vercel Cron Job**
- Pros: Serverless, no extra infra, integrates with Vercel deployment
- Cons: Only works on Vercel, requires API route

**Option B: GitHub Actions Workflow**
- Pros: Platform agnostic, no Vercel dependency
- Cons: More complex setup, requires GitHub secrets

**Option C: Sanity Scheduled Publishing Plugin**
- Pros: Official support, built-in UI
- Cons: Paid feature in Sanity

**Option D: Webhook + External Service**
- Pros: Flexible, works anywhere
- Cons: Requires external service (Zapier, Make.com)

**Decision: Option A - Vercel Cron Job (with fallback documentation)**

**Rationale:**
- Project already deployed on Vercel (likely)
- Simple to implement
- No extra cost
- Document alternatives for non-Vercel deploys

**Implementation:**
Create `/api/publish-scheduled.ts`:
```typescript
import { client } from '@/sanity/lib/client';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const now = new Date().toISOString();
  
  // Find posts scheduled for now or earlier
  const scheduledPosts = await client.fetch(
    `*[_type == "post" && status == "approved" && scheduledPublishAt <= $now]`,
    { now }
  );
  
  // Publish each post
  for (const post of scheduledPosts) {
    await client
      .patch(post._id)
      .set({ status: 'published', publishedAt: now })
      .commit();
  }
  
  return new Response(JSON.stringify({ published: scheduledPosts.length }));
}
```

Configure in `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/publish-scheduled",
    "schedule": "0 * * * *"
  }]
}
```

### Decision 4: Studio Structure Customization

**Problem:** How to organize Studio for editorial workflow?

**Options Considered:**

**Option A: Default Structure (auto-generated)**
- Pros: No code needed
- Cons: Not optimized for workflow

**Option B: Custom Structure with grouping**
- Pros: Better organization
- Cons: Some customization needed

**Option C: Fully custom structure with dashboard**
- Pros: Maximum control, best UX
- Cons: Most development effort

**Decision: Option C - Fully custom structure with dashboard**

**Rationale:**
- Editorial teams need workflow-specific views
- Dashboard provides visibility
- Custom structure improves efficiency
- Worth the upfront investment

**Implementation:**
```typescript
// sanity.config.ts
export default defineConfig({
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Dashboard
            S.listItem()
              .title('📊 Dashboard')
              .child(/* custom dashboard */),
            
            S.divider(),
            
            // Posts by status
            S.listItem()
              .title('📝 Drafts')
              .child(
                S.documentList()
                  .title('Drafts')
                  .filter('_type == "post" && status == "draft"')
              ),
            
            S.listItem()
              .title('👀 In Review')
              .child(/* ... */),
            
            // ... more status views
          ]),
    }),
  ],
});
```

### Decision 5: Validation Strategy

**Problem:** When and how to validate content?

**Options Considered:**

**Option A: Client-side only (Studio validation)**
- Pros: Immediate feedback
- Cons: Can be bypassed via API

**Option B: Server-side only (API validation)**
- Pros: Secure, can't bypass
- Cons: Delayed feedback

**Option C: Both client and server**
- Pros: Best of both worlds
- Cons: Duplicate validation logic

**Decision: Option C - Client-side with hooks for custom logic**

**Rationale:**
- Studio validation provides immediate UX
- Custom actions enforce workflow rules
- API writes are authenticated and logged
- Reasonable security for blog use case

**Implementation:**
```typescript
// Schema validation
defineField({
  name: 'title',
  type: 'string',
  validation: Rule => 
    Rule.required()
      .min(10).warning('Title should be at least 10 characters')
      .max(200).error('Title must be under 200 characters'),
})

// Custom publish action validation
export function publishAction(props) {
  return {
    label: 'Publish',
    onHandle: async () => {
      // Validate before publishing
      if (!props.draft.title || !props.draft.heroImage) {
        throw new Error('Post must have title and hero image');
      }
      
      // Publish
      await props.publish();
    },
  };
}
```

### Decision 6: Query Filtering Strategy

**Problem:** How to filter posts by workflow status on frontend?

**Options Considered:**

**Option A: Filter in GROQ query**
- Pros: Server-side filtering, reduced data transfer
- Cons: Need different queries per status

**Option B: Fetch all, filter client-side**
- Pros: Flexible, single query
- Cons: Transfers unnecessary data

**Option C: Parameterized queries**
- Pros: Reusable, type-safe
- Cons: Slightly more complex

**Decision: Option C - Parameterized GROQ queries with typed results**

**Rationale:**
- Type safety via TypeScript generation
- Reusable query functions
- Server-side filtering for performance
- Clear intent in code

**Implementation:**
```typescript
// src/sanity/lib/queries.ts
import { defineQuery } from 'next-sanity';

export const POSTS_BY_STATUS_QUERY = defineQuery(
  `*[_type == "post" && status == $status] | order(publishedAt desc) {
    _id,
    title,
    slug,
    status,
    publishedAt,
    author->{name, avatar},
  }`
);

// Usage
const { data: publishedPosts } = await loadQuery({
  query: POSTS_BY_STATUS_QUERY,
  params: { status: 'published' },
});
```

## Data Model

### Post Document Structure

```typescript
{
  _id: 'post-123',
  _type: 'post',
  _createdAt: '2025-10-10T10:00:00Z',
  _updatedAt: '2025-10-10T12:00:00Z',
  
  // Core content
  title: 'Building Production-Ready Editorial Workflows',
  slug: { current: 'production-ready-workflows' },
  summary: 'Learn how to implement...',
  content: [ /* portable text */ ],
  heroImage: { /* image object */ },
  
  // Metadata
  author: { _ref: 'author-456' },
  categories: [{ _ref: 'category-789' }],
  tags: ['design', 'engineering'],
  seo: { /* seo object */ },
  
  // Workflow fields (NEW)
  status: 'published',
  priority: 'high',
  featured: true,
  
  // Publishing
  publishedAt: '2025-10-10T14:00:00Z',
  scheduledPublishAt: null,
  
  // Audit trail
  lastReviewedBy: { _ref: 'author-999' },
  lastReviewedAt: '2025-10-10T11:30:00Z',
  approvedBy: { _ref: 'author-999' },
  approvedAt: '2025-10-10T11:45:00Z',
  
  // Calculated
  readingTime: 8, // minutes
}
```

### Draft vs Published

Sanity uses a document ID convention:
- Published: `post-123`
- Draft: `drafts.post-123`

Our workflow status is independent but complementary:
- `status: 'draft'` → May exist as draft only
- `status: 'published'` → Must exist without `drafts.` prefix
- Other statuses → Typically exist as drafts

## Migration Strategy

### Phase 1: Schema Addition (Non-breaking)
1. Add new fields with default values
2. Deploy schema changes
3. Existing content continues working

### Phase 2: Data Migration
1. Create migration script
2. Set all existing posts to `status: 'published'`
3. Copy `publishedAt` to `scheduledPublishAt` where appropriate
4. Verify migration in Studio

### Phase 3: Gradual Adoption
1. New content uses workflow
2. Existing content can be updated as needed
3. No forced migration of old posts

### Rollback Plan
- Keep migration script reversible
- Schema fields are optional (except status)
- Can remove custom actions if needed
- Document rollback procedure

## Performance Considerations

### Query Performance
- **Indexing**: Sanity automatically indexes common fields
- **Projections**: Only fetch needed fields to reduce payload
- **Caching**: Use CDN for published content, bypass for drafts

### Studio Performance
- **Lazy Loading**: Custom views load on-demand
- **Pagination**: Document lists paginate automatically
- **Optimistic UI**: Actions provide immediate feedback

### Type Generation Performance
- Run typegen in background during development
- Cache generated types in CI/CD
- Only regenerate when schema changes

## Security Considerations

### Authentication
- Use Sanity's built-in OAuth
- Configure CORS for allowed domains
- Use viewer tokens for preview mode

### Authorization
- Configure roles in Sanity project settings
- Document permission matrix
- Test role restrictions

### Data Protection
- Draft content requires authentication
- Published content is public
- Audit trail tracks all changes

## Testing Strategy

### Unit Tests
- Validation functions
- Reading time calculation
- Status transition logic

### Integration Tests
- Custom actions
- Document queries
- Type generation

### E2E Tests
- Complete workflow: draft → review → publish
- Scheduled publishing trigger
- Visual editing overlays

### Manual QA
- Studio usability testing
- Content team training
- Edge case exploration

## Monitoring & Observability

### Metrics to Track
- Posts by workflow status
- Average time from draft to published
- Number of scheduled posts
- Failed publish attempts
- Studio load times

### Logging
- Scheduled publish executions
- Workflow state transitions
- Validation failures

### Alerts
- Scheduled publish failures
- Studio errors in production
- Slow query warnings

## Open Questions

1. **Timezone Handling**: Should scheduled times be stored in UTC or user's timezone?
   - **Resolution**: Store in UTC, display in user's timezone, allow timezone selection in UI

2. **Notification System**: Should we notify editors when posts are submitted for review?
   - **Resolution**: Phase 2 feature - consider email notifications via webhook

3. **Image Optimization**: Should we add automatic image compression?
   - **Resolution**: Sanity CDN handles this, document best upload practices

4. **Multi-author Posts**: Should posts support multiple authors?
   - **Resolution**: Phase 2 feature - add authors array field

5. **Content Versioning**: Should we track major/minor versions?
   - **Resolution**: Use Sanity's built-in document history, sufficient for now

## Success Criteria

- ✅ TypeScript generation runs without errors
- ✅ Workflow status visible throughout Studio
- ✅ Scheduled publishing works reliably
- ✅ Content team adopts workflow within 2 weeks
- ✅ Zero accidental premature publications
- ✅ Studio performance remains <2s load time
- ✅ Editorial guide is clear and used by team

## References

- [Sanity Document Actions API](https://www.sanity.io/docs/document-actions)
- [Sanity Structure Tool](https://www.sanity.io/docs/structure-builder-reference)
- [Sanity TypeScript Generation](https://www.sanity.io/docs/sanity-typegen)
- [GROQ Query Language](https://www.sanity.io/docs/how-queries-work)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

---

**Last Updated:** 2025-10-10  
**Review Date:** After Phase 1 completion
