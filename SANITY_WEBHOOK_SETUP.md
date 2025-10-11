# Sanity Webhook Auto-Deployment Setup

This setup enables automatic website deployment when you publish or update articles in your hosted Sanity Studio, without needing local development.

## How It Works

1. **Content Creation**: You write and publish articles in your hosted Sanity Studio
2. **Webhook Trigger**: Sanity sends a webhook when content changes
3. **GitHub Actions**: The webhook triggers a GitHub Actions workflow
4. **Automatic Deployment**: Your website rebuilds and deploys to Cloudflare Workers

## Prerequisites

### 1. Sanity API Write Token

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project (`tulio-personal-website`)
3. Navigate to **API** → **Tokens**
4. Click **Add API token**
5. Set:
   - **Label**: `Webhook Deployment Token`
   - **Permissions**: `Editor`
   - **Dataset**: `production`
6. Copy the generated token

### 2. GitHub Personal Access Token

1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Set:
   - **Note**: `Sanity Webhook Token`
   - **Expiration**: Choose your preferred duration
   - **Scopes**: Check `repo` (Full control of private repositories)
4. Copy the generated token

## Setup Instructions

### 1. Configure Environment Variables

Create or update your `.env` file:

```bash
# Copy from .env.example if you don't have one
cp .env.example .env
```

Add the required tokens:

```env
# Sanity Configuration
PUBLIC_SANITY_PROJECT_ID=61249gtj
PUBLIC_SANITY_DATASET=production

# Webhook Integration (required for auto-deployment)
SANITY_API_WRITE_TOKEN=your_sanity_write_token_here
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
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
- Create or update a webhook that triggers on post changes
- Configure the webhook to call GitHub's repository dispatch API

### 4. Verify GitHub Secrets

Make sure your GitHub repository has the required secrets:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Ensure you have:
   - `CLOUDFLARE_API_TOKEN` (for deployment)

## Testing the Setup

### 1. Test in Sanity Studio

1. Go to your hosted Sanity Studio: https://tulio-cunha-dev.sanity.studio
2. Create a new post or update an existing one
3. Publish the post (set status to "published")

### 2. Monitor GitHub Actions

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see a new workflow run triggered by `repository_dispatch`
4. The workflow will show:
   - Event type: `sanity-webhook`
   - Triggered by: `sanity`
   - Timestamp of the trigger

### 3. Verify Deployment

1. Wait for the GitHub Actions workflow to complete
2. Check your website to see the new content
3. The deployment typically takes 2-5 minutes

## Troubleshooting

### Webhook Not Triggering

1. **Check tokens**: Ensure both `SANITY_API_WRITE_TOKEN` and `GITHUB_PERSONAL_ACCESS_TOKEN` are valid
2. **Check permissions**: 
   - Sanity token needs `Editor` permissions
   - GitHub token needs `repo` scope
3. **Re-run setup**: `bun run sanity:webhook` to recreate the webhook

### GitHub Actions Not Running

1. **Check webhook payload**: Look at the webhook logs in Sanity
2. **Verify repository**: Ensure the webhook is pointing to the correct GitHub repository
3. **Check repository dispatch**: The workflow listens for `sanity-webhook` event type

### Deployment Failures

1. **Check Cloudflare token**: Ensure `CLOUDFLARE_API_TOKEN` secret is valid
2. **Review logs**: Check the GitHub Actions logs for specific error messages
3. **Build issues**: Test the build locally with `bun run build`

## Webhook Configuration

The webhook is configured to trigger on:
- **Document type**: `post` (blog posts)
- **Events**: Create, update, delete
- **Filter**: `_type == "post"`

### Customizing the Webhook

To modify webhook behavior, edit `scripts/setup-webhook.js`:

```javascript
const webhookConfig = {
  // Trigger on different document types
  filter: '_type in ["post", "page"]',
  
  // Add custom payload data
  body: JSON.stringify({
    event_type: 'sanity-webhook',
    client_payload: {
      triggered_by: 'sanity',
      document_type: '{{_type}}',
      document_id: '{{_id}}',
      timestamp: new Date().toISOString(),
    }
  }),
};
```

## Workflow Details

The GitHub Actions workflow (`deploy.yml`) handles two trigger types:

1. **Code changes**: `push` to `main` branch
2. **Content changes**: `repository_dispatch` with type `sanity-webhook`

Both triggers result in:
1. Checkout code
2. Setup Bun
3. Install dependencies
4. Build the site
5. Deploy to Cloudflare Workers

## Security Notes

- Never commit tokens to version control
- Use environment variables for all sensitive data
- Regularly rotate your API tokens
- Monitor webhook logs for suspicious activity

## Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify your environment variables
3. Test tokens independently
4. Re-run the webhook setup script

For more information, see:
- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [GitHub Repository Dispatch](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)