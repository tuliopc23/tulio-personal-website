# Scheduled Publishing Setup Guide

This document explains how to set up automated scheduled publishing for blog posts.

## Overview

Posts can be scheduled for future publication using the "Schedule Publish" action in Sanity Studio. A cron job automatically publishes scheduled posts at their designated time.

## Prerequisites

1. **Sanity Write Token** - Required to update post status
2. **Deployment Platform** - Vercel (configured) or similar with cron support
3. **Environment Variables** - Properly configured

## Setup Steps

### 1. Create Sanity Write Token

1. Go to [Sanity Manage](https://sanity.io/manage)
2. Select your project (`61249gtj`)
3. Navigate to **API** → **Tokens**
4. Click **Add API Token**
5. Settings:
   - **Name**: `Scheduled Publishing`
   - **Permissions**: **Editor** (or Administrator)
6. **Copy the token** (you'll only see it once!)

### 2. Add Environment Variables

Add to your `.env.local` (development) and deployment environment (production):

```bash
# Required for scheduled publishing
SANITY_API_WRITE_TOKEN=your_token_here

# Optional: Secure the cron endpoint
CRON_SECRET=your_random_secret_here
```

**Generate a secure CRON_SECRET:**
```bash
openssl rand -hex 32
```

### 3. Deploy to Vercel

Scheduled publishing only works in production (Vercel cron jobs don't run locally).

1. **Add environment variables** in Vercel dashboard:
   - Project Settings → Environment Variables
   - Add `SANITY_API_WRITE_TOKEN`
   - Add `CRON_SECRET`

2. **Deploy:**
   ```bash
   git push origin main
   ```

3. **Verify cron configuration:**
   - Vercel Dashboard → Settings → Cron Jobs
   - Should show: `/api/publish-scheduled` runs hourly

### 4. Test Scheduled Publishing

#### In Studio:
1. Create or open a post
2. Click "Schedule Publish" action
3. Post status changes to "approved"
4. `scheduledPublishAt` field is set

#### Manual Test (after deployment):
```bash
# Call the API endpoint directly (requires CRON_SECRET)
curl -X GET https://your-domain.com/api/publish-scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected response:**
```json
{
  "success": true,
  "published": 1,
  "failed": 0,
  "results": [
    {
      "id": "post-id",
      "title": "Post Title",
      "slug": "post-slug",
      "success": true
    }
  ],
  "timestamp": "2025-10-10T15:00:00.000Z"
}
```

## How It Works

### Workflow

1. **Editor schedules post:**
   - Post status: `approved`
   - `scheduledPublishAt` set to future date/time

2. **Cron job runs hourly:**
   - Checks for posts where `status == "approved"` and `scheduledPublishAt <= now()`
   - Updates matching posts to `status: "published"`
   - Sets `publishedAt` to current time
   - Clears `scheduledPublishAt` field

3. **Post appears on site:**
   - Frontend queries filter by `status == "published"`
   - Scheduled post now appears in blog list

### Cron Schedule

Configured in `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/publish-scheduled",
    "schedule": "0 * * * *"
  }]
}
```

**Schedule:** Every hour at minute 0 (00:00, 01:00, 02:00, etc.)

**Cron syntax:** `minute hour day month weekday`
- `0 * * * *` - Every hour
- `0 */6 * * *` - Every 6 hours
- `0 0 * * *` - Daily at midnight
- `*/15 * * * *` - Every 15 minutes

### API Endpoint: `/api/publish-scheduled`

**Authentication:**
- Requires `Authorization: Bearer CRON_SECRET` header
- Returns 401 if unauthorized

**Success Response (200):**
```json
{
  "success": true,
  "published": 2,
  "failed": 0,
  "results": [...],
  "timestamp": "2025-10-10T15:00:00.000Z"
}
```

**No Scheduled Posts (200):**
```json
{
  "success": true,
  "published": 0,
  "message": "No posts scheduled for publication"
}
```

**Error Response (500):**
```json
{
  "error": "Internal server error",
  "message": "Error details..."
}
```

## Troubleshooting

### Posts Not Publishing

**Check 1: Environment variables set?**
```bash
# In Vercel dashboard, verify:
SANITY_API_WRITE_TOKEN=sk_...
CRON_SECRET=...
```

**Check 2: Token has correct permissions?**
- Token must be **Editor** or **Administrator**
- Viewer tokens cannot write

**Check 3: Cron job running?**
- Vercel Dashboard → Deployments → Functions
- Check cron execution logs

**Check 4: Post status correct?**
- In Studio, post must be status `approved`
- `scheduledPublishAt` must be in the past

**Check 5: Time zone issues?**
- All times are stored in UTC
- `scheduledPublishAt` compared to server time

### Manual Trigger

If cron fails, manually trigger publishing:

```bash
# SSH into deployment or use Vercel CLI
vercel env pull .env.production
curl -X GET https://your-site.com/api/publish-scheduled \
  -H "Authorization: Bearer $(cat .env.production | grep CRON_SECRET | cut -d= -f2)"
```

### Check Logs

**Vercel:**
1. Dashboard → Project → Deployments
2. Click latest deployment
3. Functions tab → `api/publish-scheduled.func`
4. View invocation logs

**Look for:**
- `Published X posts`
- Error messages
- Unauthorized attempts

## Security Considerations

### 1. Token Security
- **Never commit** `SANITY_API_WRITE_TOKEN` to git
- Store in environment variables only
- Rotate tokens periodically
- Use minimum required permissions (Editor, not Admin)

### 2. Endpoint Protection
- `CRON_SECRET` prevents unauthorized publishing
- Only Vercel cron and authenticated requests can trigger
- Returns 401 for invalid auth

### 3. Rate Limiting
- Cron runs hourly (not too frequent)
- Batch processes all scheduled posts
- No user-triggered endpoint (admin only)

## Alternative Platforms

### Netlify

Update `netlify.toml`:
```toml
[functions."publish-scheduled"]
  schedule = "@hourly"
```

### AWS Lambda / CloudWatch

Create EventBridge rule:
```
Rate: cron(0 * * * ? *)
Target: Lambda function
```

### Custom Cron

Use any cron service (cron-job.org, etc.):
```bash
0 * * * * curl -X GET https://your-site.com/api/publish-scheduled \
  -H "Authorization: Bearer $CRON_SECRET"
```

## FAQ

**Q: Can I schedule to the minute?**
A: The cron runs hourly. For minute-precision, change the cron schedule (e.g., `*/5 * * * *` for every 5 minutes).

**Q: What timezone is used?**
A: All times are UTC. The scheduled time is stored in UTC and compared to server time in UTC.

**Q: Can I cancel a scheduled post?**
A: Yes, in Studio:
1. Open the post
2. Change status back to "draft" or clear `scheduledPublishAt` field
3. The cron will skip posts without the approved status

**Q: What happens if the cron fails?**
A: The next run will catch any missed posts. Posts scheduled before "now" will publish on the next successful run.

**Q: Can I see which posts are scheduled?**
A: Yes, in Studio:
- Navigate to "📅 Scheduled" in the sidebar
- Shows all posts with future `scheduledPublishAt` dates

## Monitoring

### Set Up Monitoring

**Option 1: Vercel Integration**
- Add monitoring service (Sentry, DataDog)
- Configure alerts for failed cron runs

**Option 2: Custom Webhook**
- Modify API route to POST to monitoring service
- Track published count, failures

**Option 3: Email Notifications**
- Add email service (SendGrid, Resend)
- Send summary on each run

### Health Check

Add to your monitoring:
```bash
# Daily health check
curl https://your-site.com/api/publish-scheduled \
  -H "Authorization: Bearer $CRON_SECRET"
```

Expected: 200 status with valid JSON

---

**Last Updated:** 2025-10-10
**Version:** 1.0
