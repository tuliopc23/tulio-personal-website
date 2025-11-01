# Auto-Publishing Setup Guide

This setup enables automatic publishing of your Sanity CMS articles to developer platforms like Dev.to and Medium when you publish in Sanity Studio.

## Overview

When you publish an article in Sanity Studio, it will automatically:

1. ✅ Trigger a site rebuild (if GitHub integration is configured)
2. ✅ Publish to Dev.to (if API key is set)
3. ✅ Publish to Medium (if access token is set)

## Prerequisites

### Required (for basic setup)

- Sanity project with webhooks enabled
- Sanity API Write Token

### Optional (for publishing platforms)

- Dev.to API key
- Medium access token

## Setup Instructions

### 1. Get API Credentials

#### Dev.to API Key

1. Go to [Dev.to Settings → Account](https://dev.to/settings/account)
2. Scroll to "DEV Community API Keys"
3. Click "Generate a new API key"
4. Copy the generated key

#### Medium Access Token

1. Go to [Medium Settings → Integration tokens](https://medium.com/me/settings)
2. Generate a new token
3. Copy the generated token

### 2. Configure Environment Variables

Create or update your `.env` file:

```bash
# Sanity Configuration (required)
SANITY_API_WRITE_TOKEN=sk_your_sanity_token_here
PUBLIC_SANITY_PROJECT_ID=61249gtj
PUBLIC_SANITY_DATASET=production

# Publishing Platforms (optional)
DEV_TO_API_KEY=your_devto_api_key_here
MEDIUM_ACCESS_TOKEN=your_medium_token_here

# GitHub Integration (optional, for site rebuilds)
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
GITHUB_REPOSITORY=tuliopc23/tulio-personal-website

# Webhook URL (for deployed function)
WEBHOOK_BASE_URL=https://your-deployed-function-url.vercel.app
```

### 3. Deploy the Auto-Publish Function

The auto-publishing script needs to be deployed as a serverless function. Here are options:

#### Option A: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Copy the deployed function URL
4. Set `WEBHOOK_BASE_URL` in your environment variables

#### Option B: Netlify

1. Create `netlify.toml` in your project root:

   ```toml
   [build]
     command = "npm run build"
     functions = "functions/"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. Deploy to Netlify

#### Option C: Cloudflare Workers

1. Install Wrangler: `npm install -g wrangler`
2. Configure `wrangler.toml`
3. Deploy: `wrangler publish`

### 4. Set Up Webhooks

Run the webhook setup script:

```bash
bun run sanity:webhook
```

This will create two webhooks in your Sanity project:

1. **GitHub Actions Deploy** - Triggers site rebuilds
2. **Auto-Publish to Platforms** - Triggers publishing to Dev.to/Medium

## How It Works

### Publishing Flow

1. **Author creates/publishes article** in Sanity Studio
2. **Sanity webhook triggers** when published (not on drafts)
3. **Site rebuild webhook** → GitHub Actions → Cloudflare Pages
4. **Auto-publish webhook** → Serverless function → Publishing platforms

### Content Conversion

- **Sanity Portable Text** → **Markdown** (for Dev.to)
- **Sanity Portable Text** → **HTML** (for Medium)
- **Metadata** → Article titles, descriptions, tags, canonical URLs

### Platform-Specific Features

#### Dev.to

- ✅ Markdown content support
- ✅ Automatic tag processing
- ✅ Canonical URL linking
- ✅ SEO-friendly titles and descriptions

#### Medium

- ✅ HTML content support
- ✅ Tag system compatibility
- ✅ Public/Private publishing options
- ✅ Custom canonical URLs

## Testing the Setup

### 1. Test Webhook Configuration

```bash
# List existing webhooks
curl -X GET "https://api.sanity.io/v1/projects/61249gtj/hooks" \
  -H "Authorization: Bearer YOUR_SANITY_TOKEN"
```

### 2. Test Manual Publishing

```bash
# Test the auto-publish function manually
curl -X POST "https://your-deployed-function.vercel.app/api/auto-publish" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "test-id",
    "slug": "test-article",
    "title": "Test Article",
    "operation": "created",
    "summary": "Test summary",
    "tags": ["test", "automation"],
    "seo": { "noIndex": false }
  }'
```

### 3. Test in Sanity Studio

1. Go to [Sanity Studio](https://tulio-cunha-dev.sanity.studio)
2. Create a new post or update an existing one
3. **Publish** the post (important: not just save as draft)
4. Check your publishing platforms for the new article

## Configuration Options

### Webhook Filters

Modify the webhook filter in `scripts/setup-webhook.js`:

```groq
// Only publish featured articles
'_type == "post" && featured == true && !(_id in path("drafts.**"))'

// Only publish specific categories
'_type == "post" && category->slug.current == "tech" && !(_id in path("drafts.**"))'

// Skip articles marked as no-index
'_type == "post" && !seo.noIndex && !(_id in path("drafts.**"))'
```

### Platform-Specific Settings

Edit `functions/auto-publish.js`:

```javascript
// Set custom publishing status for Medium
publishStatus: 'public', // or 'draft' or 'unlisted'

// Modify Dev.to article settings
published: true, // or false for drafts

// Custom tag processing
tags: articleData.tags?.slice(0, 5) || [], // Limit to 5 tags
```

## Troubleshooting

### Webhooks Not Firing

1. **Check Sanity webhook logs**:
   - Go to [Sanity Manage](https://www.sanity.io/manage)
   - Navigate to API → Webhooks
   - Check "Attempts log"

2. **Verify webhook configuration**:
   - Filter should be: `_type == "post" && !(_id in path("drafts.**"))`
   - URL should point to your deployed function

### Publishing Failures

1. **Check API credentials**:
   - Verify Dev.to API key is valid
   - Check Medium token hasn't expired

2. **Check function logs**:
   - Vercel: Check function logs in dashboard
   - Netlify: Check function logs in dashboard

### Content Issues

1. **Format problems**:
   - Check Portable Text to Markdown conversion
   - Verify HTML structure for Medium

2. **Missing metadata**:
   - Ensure SEO fields are populated
   - Check canonical URL configuration

## Security Notes

- **Never commit API keys** to git
- **Use environment variables** for all secrets
- **Rotate API keys** regularly
- **Monitor webhook logs** for suspicious activity
- **Rate limiting**: Be respectful of platform APIs

## Cost Considerations

- **Sanity Webhooks**: Free (included in all plans)
- **Dev.to API**: Free with registration
- **Medium API**: Free (though limited)
- **Serverless Function**:
  - Vercel: 100GB bandwidth/month free
  - Netlify: 100GB bandwidth/month free
  - Cloudflare Workers: 100,000 requests/day free

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all environment variables are set
3. Test the setup with a simple article first
4. Check webhook and function logs for error details

For more information:

- [Sanity Webhooks Docs](https://www.sanity.io/docs/compute-and-ai/webhooks)
- [Dev.to API Docs](https://developers.forem.com/api)
- [Medium API Docs](https://github.com/Medium/medium-api-docs)
