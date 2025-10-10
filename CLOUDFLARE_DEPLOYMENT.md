# Cloudflare Workers Deployment Guide

Complete guide for deploying your Astro site with Sanity CMS to Cloudflare Workers.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Setup                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌─────────────────────────┐     │
│  │  Sanity Hosted   │      │   Cloudflare Workers    │     │
│  │     Studio       │◄─────┤    Astro Hybrid         │     │
│  │                  │      │                         │     │
│  │  - Edit content  │      │  - Static pages         │     │
│  │  - Workflow UI   │      │  - API routes (SSR)     │     │
│  │  - Preview       │      │  - Scheduled publishing │     │
│  └──────────────────┘      └─────────────────────────┘     │
│         ▲                              │                    │
│         │                              │                    │
│         └──────────────────────────────┘                    │
│              Sanity Client API                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Cloudflare Cron Trigger                     │  │
│  │        (Runs hourly: 0 * * * *)                      │  │
│  │   Calls: /api/publish-scheduled                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Features

✅ **Sanity Hosted Studio** - Fully configured at `https://tulio-cunha-dev.sanity.studio`  
✅ **Cloudflare Workers** - Fast, global edge deployment  
✅ **Hybrid Rendering** - Static pages + SSR API routes  
✅ **Scheduled Publishing** - Automatic via Cloudflare Cron  
✅ **Editorial Workflow** - 5-state workflow with custom actions  
✅ **Type Safety** - Full TypeScript integration  

---

## Prerequisites

1. **Cloudflare Account** (free or paid)
2. **Wrangler CLI** installed: `npm install -g wrangler`
3. **Sanity Write Token** (created in Sanity dashboard)
4. **Domain** configured in Cloudflare (optional but recommended)

---

## Step-by-Step Deployment

### 1. Verify Sanity Studio is Deployed

Your Studio is already deployed! ✅

- **URL**: `https://tulio-cunha-dev.sanity.studio`
- **Features**: All custom actions, workflow structure, and schema
- **Access**: Log in with your Sanity account

### 2. Create Sanity Write Token

1. Go to [Sanity Manage](https://sanity.io/manage)
2. Select project: `tulio-personal-website` (ID: `61249gtj`)
3. Navigate to **API** → **Tokens**
4. Click **Add API Token**
5. Configure:
   - **Name**: `Scheduled Publishing - Production`
   - **Permissions**: **Editor** or **Administrator**
6. **Copy the token** (you'll only see it once!)

### 3. Generate CRON_SECRET

```bash
openssl rand -hex 32
```

Save this secret - you'll need it for environment configuration.

### 4. Configure Environment Variables

Create `.env` (for local development):

```bash
# Sanity Configuration
PUBLIC_SANITY_PROJECT_ID=61249gtj
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_STUDIO_URL=https://tulio-cunha-dev.sanity.studio
PUBLIC_SANITY_PREVIEW_URL=http://localhost:4321

# Scheduled Publishing
SANITY_API_WRITE_TOKEN=your_token_here
CRON_SECRET=your_secret_here
```

### 5. Test Build Locally

```bash
# Install dependencies
bun install

# Build for production
bun run build

# Preview production build
bunx wrangler pages dev dist
```

Verify:
- ✅ Build succeeds
- ✅ All routes work
- ✅ API routes respond (test `/api/publish-scheduled` with curl)

### 6. Deploy to Cloudflare Workers

#### Option A: Deploy via Wrangler (Recommended)

```bash
# Login to Cloudflare
npx wrangler login

# Deploy
npx wrangler deploy

# Add secrets
npx wrangler secret put SANITY_API_WRITE_TOKEN
# Paste your token when prompted

npx wrangler secret put CRON_SECRET
# Paste your secret when prompted
```

#### Option B: Deploy via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → Create → Pages → Connect to Git
3. Select your repository
4. Configure build:
   - **Build command**: `bun run build`
   - **Build output directory**: `dist`
5. Add environment variables:
   - `SANITY_API_WRITE_TOKEN`
   - `CRON_SECRET`
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET`
   - `PUBLIC_SANITY_STUDIO_URL`
6. Deploy

### 7. Verify Deployment

1. **Check site loads:**
   ```bash
   curl https://www.tuliocunha.dev
   ```

2. **Test scheduled publishing endpoint:**
   ```bash
   curl -X GET https://www.tuliocunha.dev/api/publish-scheduled \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

   Expected response:
   ```json
   {
     "success": true,
     "publishedCount": 0,
     "results": []
   }
   ```

3. **Verify Studio access:**
   - Open `https://tulio-cunha-dev.sanity.studio`
   - Log in with Sanity
   - Verify all custom actions appear
   - Check workflow structure (9 views)

### 8. Configure Cron Trigger

**Cloudflare Cron (Automatic):**

The `wrangler.toml` already configures hourly cron:

```toml
[triggers]
crons = ["0 * * * *"]  # Every hour
```

No additional setup needed! Cloudflare automatically calls your scheduled handler.

**Monitor Cron Execution:**
- Cloudflare Dashboard → Workers & Pages → Your Worker → Logs
- Real-time logs show cron executions

---

## Testing Scheduled Publishing

### 1. Schedule a Post in Studio

1. Open Studio: `https://tulio-cunha-dev.sanity.studio`
2. Create or open a post
3. Click "Schedule Publish" action
4. Post status changes to "approved"
5. `scheduledPublishAt` is set to +24 hours

### 2. Test Manual Trigger

```bash
# Call the API directly
curl -X GET https://www.tuliocunha.dev/api/publish-scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

### 3. Wait for Automatic Publishing

- Cron runs every hour at minute 0
- Posts with `scheduledPublishAt` in the past are published
- Check Cloudflare logs for execution details

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module '@astrojs/cloudflare'"**
```bash
bun add -D @astrojs/cloudflare
```

**Error: "output must be 'server' or 'hybrid'"**
- Check `astro.config.mjs` has `output: "hybrid"`

### API Route Not Working

**Error: 404 on `/api/publish-scheduled`**
- Verify file exists: `src/pages/api/publish-scheduled.ts`
- Check it exports `GET` function
- Rebuild and redeploy

**Error: 401 Unauthorized**
- Verify `CRON_SECRET` matches in environment and curl command
- Check Authorization header format: `Bearer YOUR_SECRET`

### Scheduled Publishing Not Working

**Posts not publishing automatically:**
1. Check cron is configured in `wrangler.toml`
2. Verify `SANITY_API_WRITE_TOKEN` has write permissions
3. Check Cloudflare logs for errors
4. Manually test the API endpoint

**Error: "SANITY_API_WRITE_TOKEN not configured"**
- Add token via: `npx wrangler secret put SANITY_API_WRITE_TOKEN`
- Or add in Cloudflare Dashboard

### Studio Not Loading

**Error: 404 on Studio URL**
- Studio is hosted at `https://tulio-cunha-dev.sanity.studio` (not on your site)
- Redeploy: `bunx sanity deploy`

---

## Environment Variables Reference

### Required for Production

| Variable | Description | Where to Set |
|----------|-------------|--------------|
| `SANITY_API_WRITE_TOKEN` | Write token for publishing | Cloudflare Dashboard or Wrangler |
| `CRON_SECRET` | Secret to secure cron endpoint | Cloudflare Dashboard or Wrangler |
| `PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (61249gtj) | Build env vars |
| `PUBLIC_SANITY_DATASET` | Dataset (production) | Build env vars |
| `PUBLIC_SANITY_STUDIO_URL` | Hosted Studio URL | Build env vars |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` | Enable visual editing | `false` |
| `SANITY_API_READ_TOKEN` | Read token for preview | Not required |

---

## Monitoring & Maintenance

### Check Cloudflare Logs

```bash
# Real-time logs
npx wrangler tail

# Or in Cloudflare Dashboard:
# Workers & Pages → Your Worker → Logs
```

### Monitor Scheduled Publishing

1. **Cloudflare Logs** - Real-time execution logs
2. **Studio** - Check "Scheduled" view for pending posts
3. **API Test** - Manually call endpoint to verify
4. **Site** - Verify published posts appear

### Update Studio

When you change schema or actions:

```bash
# Rebuild and redeploy Studio
bunx sanity deploy

# Studio updates automatically
```

### Update Site

```bash
# Build and deploy
bun run build
npx wrangler deploy
```

---

## Performance & Costs

### Cloudflare Workers Pricing

**Free Tier:**
- 100,000 requests/day
- Included: Cron triggers
- Bundle limit: 1 MB (we're well under)

**Paid Tier ($5/mo):**
- Unlimited requests
- Bundle limit: 10 MB
- Better limits for large sites

### Expected Costs

For a personal blog:
- **Free tier** - Likely sufficient
- **Paid tier** - Only if traffic exceeds 100k requests/day

### Sanity Pricing

**Free Tier:**
- Includes hosted Studio
- 10,000 documents
- 2 users
- Sufficient for personal blogs

---

## Next Steps

1. ✅ **Verify deployment works**
2. ✅ **Test scheduled publishing**
3. ✅ **Monitor for 24-48 hours**
4. 🎯 **Start creating content!**

---

## Support & Resources

- **Cloudflare Docs**: https://developers.cloudflare.com/workers/
- **Astro Cloudflare**: https://docs.astro.build/en/guides/deploy/cloudflare/
- **Sanity Docs**: https://www.sanity.io/docs
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

---

**Questions?** Check the troubleshooting section or Cloudflare logs for detailed error messages.
