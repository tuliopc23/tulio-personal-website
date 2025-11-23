# Publishing, Cross-posting, and Analytics Setup

This document explains how to use the new scheduling, cross-posting, and analytics features for your blog.

## Features Overview

### 1. Scheduled Publishing ⏰

Schedule articles to be automatically published at a specific date and time.

### 2. Cross-posting 🔄

Automatically publish your articles to Dev.to and Hashnode when they're published.

### 3. Analytics 📊

Track views, unique visitors, read time, and social shares for your articles.

---

## Setup Instructions

### Prerequisites

1. **Sanity Write Token** (required for scheduled publishing)
   - Go to https://www.sanity.io/manage
   - Select your project → API → Tokens
   - Create new token with "Editor" permissions
   - Add to your `.env` file or Cloudflare secrets

2. **Dev.to API Key** (optional, for Dev.to cross-posting)
   - Go to https://dev.to/settings/extensions
   - Generate an API key
   - Add to your `.env` file or Cloudflare secrets

3. **Hashnode API Key** (optional, for Hashnode cross-posting)
   - Go to https://hashnode.com/settings/developer
   - Generate a Personal Access Token
   - Get your Publication ID from your Hashnode blog settings
   - Add to your `.env` file or Cloudflare secrets

### Environment Variables

Add these to your `.env` file (local development) and Cloudflare dashboard (production):

```bash
# Required for scheduled publishing
SANITY_API_WRITE_TOKEN=your_write_token_here

# Optional: Cross-posting
DEV_TO_API_KEY=your_devto_api_key
HASHNODE_API_KEY=your_hashnode_token
```

### Cloudflare Configuration

The scheduled publishing worker is configured in `wrangler.toml` to run every 15 minutes.

To deploy the worker:

```bash
# Deploy to Cloudflare
wrangler deploy

# Set environment variables (secrets)
wrangler secret put SANITY_API_WRITE_TOKEN
wrangler secret put DEV_TO_API_KEY
wrangler secret put HASHNODE_API_KEY
```

---

## How to Use

### Scheduling a Post

**Option 1: In Sanity Studio**

1. Create or edit an article
2. Set the "Schedule Publish" field to your desired date/time
3. Save the document
4. The Cloudflare Worker will automatically publish it when the time comes

**Option 2: Quick Schedule Action**

1. Open any article in Sanity Studio
2. Click "Schedule (+1 hour)" in the action menu
3. The post will be scheduled to publish 1 hour from now

### Cross-posting

**Setup Cross-posting for an Article:**

1. Open an article in Sanity Studio
2. Expand "Cross-posting Settings"
3. Enable the platforms you want:
   - **Dev.to**: Toggle "Enable Dev.to Publishing"
   - **Hashnode**: Toggle "Enable Hashnode Publishing" and enter your Publication ID
4. Save the document

**Automatic Cross-posting:**

- When you publish an article (or when it's auto-published), it will automatically cross-post to enabled platforms
- The article URL and sync time will be recorded in the document

**Manual Cross-posting:**

1. Open a published article
2. Click "Cross-post to Platforms" in the action menu
3. The article will be sent to all enabled platforms

### Analytics

**Viewing Analytics:**

1. Open any published article in Sanity Studio
2. Expand the "Analytics" section
3. View:
   - Page Views
   - Unique Visitors
   - Average Read Time
   - Social Shares (Twitter, LinkedIn, Facebook)

**Note:** Analytics are currently read-only fields. To populate them, you'll need to:

- Integrate with your analytics provider (Google Analytics, Plausible, etc.)
- Create an API endpoint to update these fields
- Use the Sanity API to patch documents with analytics data

---

## Architecture

### Scheduled Publishing Flow

```
┌─────────────────┐
│  Sanity Studio  │ User sets scheduledPublishAt
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cloudflare     │ Runs every 15 minutes (cron)
│  Worker         │
└────────┬────────┘
         │
         ├─► Query posts with scheduledPublishAt <= now
         │
         ├─► Set publishedAt, clear scheduledPublishAt
         │
         └─► Trigger cross-posting (if enabled)
                 │
                 ├─► Dev.to API
                 └─► Hashnode GraphQL API
```

### Files Overview

**Schema:**

- `src/sanity/schemaTypes/post.ts` - Post schema with new fields

**Cloudflare Worker:**

- `functions/scheduled-publish/index.ts` - Scheduled publishing logic
- `wrangler.toml` - Cron trigger configuration

**Sanity Actions:**

- `src/sanity/actions/schedule.ts` - Quick schedule action
- `src/sanity/actions/crosspost.ts` - Manual cross-posting action

**Configuration:**

- `sanity.config.ts` - Sanity Studio config with document actions

---

## Customization

### Adjust Cron Schedule

Edit `wrangler.toml`:

```toml
[triggers]
crons = ["*/15 * * * *"]  # Every 15 minutes
# crons = ["0 * * * *"]   # Every hour
# crons = ["0 9 * * *"]   # Every day at 9am UTC
```

### Custom Schedule Times

Edit `src/sanity/actions/schedule.ts` to add a custom time picker:

```typescript
// Current: schedules for 1 hour from now
const scheduledDate = new Date();
scheduledDate.setHours(scheduledDate.getHours() + 1);

// Customize as needed
```

### Analytics Integration

To populate analytics automatically, create an API endpoint:

```typescript
// Example: /api/analytics/update
import { getClient } from "@sanity/client";

export async function POST(request) {
  const { postId, views, uniqueVisitors, readTime } = await request.json();

  const client = getClient();
  await client
    .patch(postId)
    .set({
      "analytics.views": views,
      "analytics.uniqueVisitors": uniqueVisitors,
      "analytics.averageReadTime": readTime,
      "analytics.lastUpdatedAt": new Date().toISOString(),
    })
    .commit();

  return new Response("OK");
}
```

---

## Troubleshooting

### Scheduled posts not publishing

1. Check Cloudflare Worker logs: `wrangler tail`
2. Verify environment variables are set: `wrangler secret list`
3. Ensure `SANITY_API_WRITE_TOKEN` has Editor permissions
4. Check that `scheduledPublishAt` is in the past

### Cross-posting not working

1. Verify API keys are valid
2. Check Dev.to/Hashnode API status
3. Ensure article has required fields (title, content, etc.)
4. Check worker logs for error messages

### Analytics not updating

Analytics fields are read-only in Sanity Studio. You need to:

1. Create an API endpoint to update them
2. Integrate with your analytics provider
3. Use the Sanity API to patch documents

---

## API References

- **Dev.to API**: https://developers.forem.com/api/v1
- **Hashnode API**: https://apidocs.hashnode.com/
- **Sanity API**: https://www.sanity.io/docs/http-api
- **Cloudflare Cron Triggers**: https://developers.cloudflare.com/workers/configuration/cron-triggers/

---

## Next Steps

1. **Test Scheduled Publishing**
   - Create a test post
   - Set `scheduledPublishAt` to 5 minutes from now
   - Wait and verify it publishes automatically

2. **Set Up Cross-posting**
   - Get your API keys
   - Add them to Cloudflare secrets
   - Test with a sample post

3. **Integrate Analytics**
   - Choose your analytics provider
   - Create API endpoint to update Sanity
   - Set up automatic syncing

---

For questions or issues, check the implementation files or consult the API documentation linked above.
