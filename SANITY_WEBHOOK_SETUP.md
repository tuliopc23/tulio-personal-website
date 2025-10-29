# Sanity Webhook Auto-Deployment Setup

This setup enables automatic website deployment when you publish or update articles in your hosted Sanity Studio, without needing local development.

## How It Works

1. **Content Creation**: You write and publish articles in your hosted Sanity Studio
2. **Webhook Trigger**: Sanity sends a GROQ-powered webhook when content changes
3. **Cloudflare Deploy Hook**: Receives POST request from Sanity
4. **Automatic Deployment**: Cloudflare Pages rebuilds and redeploys your website

## Prerequisites

### 1. Cloudflare Deploy Hook URL

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Select your project (`tulio-personal-website`)
4. Go to **Settings** → **Builds & deployments**
5. Scroll to **Deploy hooks** section
6. Click **Add deploy hook**
7. Set:
   - **Deploy hook name**: `sanity-content-update`
   - **Branch to build**: `main` (or your production branch)
8. Click **Save**
9. Copy the generated URL (looks like: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy/...`)

### 2. Sanity API Write Token

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project (`tulio-personal-website`)
3. Navigate to **API** → **Tokens**
4. Click **Add API token**
5. Set:
   - **Label**: `Cloudflare Webhook Setup`
   - **Permissions**: `Editor`
6. Copy the generated token

## Setup Instructions

### 1. Configure Environment Variables

Create or update your `.env` file:

```bash
# Copy from .env.example if you don't have one
cp .env.example .env
```

Add the required values:

```env
# Sanity Configuration
PUBLIC_SANITY_PROJECT_ID=61249gtj
PUBLIC_SANITY_DATASET=production

# Webhook Integration (required for auto-deployment)
SANITY_API_WRITE_TOKEN=your_sanity_write_token_here
CLOUDFLARE_DEPLOY_HOOK_URL=your_cloudflare_deploy_hook_url_here
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup the Webhook

Run the webhook setup script:

```bash
bun run sanity:webhook
```

This script will:
- Connect to your Sanity project
- Create a GROQ-powered webhook named "Cloudflare Pages Deploy"
- Configure it to trigger only on published posts (not drafts)
- Link it to your Cloudflare Deploy Hook URL

## Testing the Setup

### 1. Verify Webhook in Sanity

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks**
4. You should see "Cloudflare Pages Deploy" webhook
5. Check the webhook configuration:
   - Filter: `_type == "post" && !(_id in path("drafts.**"))`
   - URL: Your Cloudflare Deploy Hook URL

### 2. Test in Sanity Studio

1. Go to your hosted Sanity Studio: https://tulio-cunha-dev.sanity.studio
2. Create a new post or update an existing one
3. **Publish** the post (important: not just save as draft)

### 3. Monitor Cloudflare Deployment

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → Your project
3. Click **Deployments** tab
4. You should see a new deployment with:
   - **Source**: "Deploy Hook"
   - **Status**: Building → Success
   - Typically takes 1-3 minutes

### 4. Verify Website Update

1. Wait for deployment to complete
2. Visit your website
3. The new/updated article should be visible

## Troubleshooting

### Webhook Not Triggering

1. **Check that you published (not just saved draft)**:
   - Webhook only triggers on published documents
   - Draft saves are ignored by design

2. **Verify webhook exists**:
   - Go to Sanity Manage → API → Webhooks
   - Should see "Cloudflare Pages Deploy"

3. **Check webhook attempts log**:
   - In Sanity Manage → API → Webhooks
   - Click on "Cloudflare Pages Deploy"
   - View "Attempts log" to see if requests were sent

4. **Re-run setup**: `bun run sanity:webhook` to recreate the webhook

### Test Webhook Manually

You can trigger a deployment manually:

```bash
curl -X POST "YOUR_CLOUDFLARE_DEPLOY_HOOK_URL"
```

This should trigger a new Cloudflare Pages deployment.

### Webhook Configuration Issues

1. **Check environment variables**:
   ```bash
   # Verify your .env file has:
   SANITY_API_WRITE_TOKEN=sk...
   CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/...
   ```

2. **Check Sanity token permissions**:
   - Must have `Editor` permissions
   - Check in Sanity Manage → API → Tokens

### Deployment Taking Too Long

1. **Check Cloudflare build logs**:
   - Dashboard → Workers & Pages → Your Project → Deployments
   - Click on the deployment to see detailed logs

2. **Build failures**:
   - Review build logs in Cloudflare
   - Test locally: `bun run build`

## Webhook Configuration

The webhook is configured to trigger on:
- **Document type**: `post` (blog posts)
- **Events**: Create, update, delete
- **Filter**: `_type == "post" && !(_id in path("drafts.**"))`
- **Drafts**: Excluded (only published documents trigger webhook)

### GROQ Filter Explained

```groq
_type == "post" && !(_id in path("drafts.**"))
```

- `_type == "post"`: Only triggers for post documents
- `!(_id in path("drafts.**"))`: Excludes drafts (only published)

### Customizing the Webhook

To modify webhook behavior, edit `scripts/setup-webhook.js`:

```javascript
// Example: Only trigger on featured posts
filter: '_type == "post" && featured == true && !(_id in path("drafts.**"))',

// Example: Trigger on multiple document types
filter: '(_type == "post" || _type == "page") && !(_id in path("drafts.**"))',

// Example: Only specific categories
filter: '_type == "post" && category->slug.current == "tech" && !(_id in path("drafts.**"))',
```

### Webhook Payload

The webhook sends this data (though Cloudflare ignores it and just rebuilds):

```json
{
  "event": "content-update",
  "documentId": "_id",
  "documentType": "post",
  "title": "Article Title",
  "slug": "article-slug",
  "publishedAt": "2024-01-01T00:00:00Z",
  "operation": "created|updated|deleted"
}
```

## Deployment Flow

1. **Content Change**: You publish/update article in Sanity Studio
2. **Webhook Fires**: Sanity detects published document matching filter
3. **POST Request**: Sanity sends POST to Cloudflare Deploy Hook URL
4. **Build Triggered**: Cloudflare Pages starts new deployment
5. **Build Process**: 
   - Clone git repository
   - Install dependencies (bun install)
   - Build site (bun run build)
   - Deploy to Cloudflare network
6. **Live Update**: Website reflects new content (1-3 minutes)

## Security Notes

- **Deploy Hook URL**: Keep secret! Anyone with URL can trigger deployments
- **Sanity Write Token**: Store securely, never commit to git
- **Environment Variables**: Never commit `.env` file
- **Rate Limiting**: Cloudflare limits concurrent builds
- **Webhook Secret**: Consider adding signature verification (see Sanity docs)
- **Regularly Rotate**: Both Sanity tokens and Cloudflare hooks
- **Monitor Logs**: Check webhook attempts in Sanity for suspicious activity

## Cost Considerations

- **Sanity Webhooks**: Free (included in all plans)
- **Cloudflare Pages Builds**: 500 builds/month on free plan, 5000 on paid
- **Build Concurrency**: 1 concurrent build (queued if multiple)
- **Webhook Rate Limit**: 1 concurrent request, 30-second timeout

## Support

If you encounter issues:

1. Check Cloudflare deployment logs
2. Check Sanity webhook attempts log
3. Verify your environment variables
4. Test webhook manually with curl
5. Re-run the webhook setup script

For more information, see:
- [Sanity GROQ-powered Webhooks](https://www.sanity.io/docs/compute-and-ai/webhooks)
- [Cloudflare Pages Deploy Hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/)
- [GROQ Filter Examples](https://www.sanity.io/docs/developer-guides/filters-in-groq-powered-webhooks)
- [GROQ Projections](https://www.sanity.io/docs/developer-guides/projections-in-groq-powered-webhooks)
