# Quick Start: Sanity → Cloudflare Pages Webhook Setup

Follow these 3 steps to enable automatic Cloudflare Pages rebuilds when you publish articles in Sanity.

## Step 1: Create a Cloudflare Pages Deploy Hook

1. Go to https://dash.cloudflare.com
2. Open **Workers & Pages** → your Pages project
3. Go to **Settings** → **Builds & deployments**
4. Create a deploy hook for your production branch
5. **Copy the deploy hook URL**

## Step 2: Create Sanity API Token

1. Go to https://www.sanity.io/manage
2. Select your project → **API** → **Tokens**
3. Click **Add API token**
4. Label: `Webhook Setup`, Permissions: **`Editor`**
5. **Copy the token** (starts with `sk...`)

## Step 3: Add to .env and Run Setup

Edit `.env` file:

```bash
SANITY_API_WRITE_TOKEN=sk...your-sanity-token...
CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/webhooks/deploy/...
```

Run setup:

```bash
pnpm run sanity:webhook
```

You should see: ✅ Webhook created successfully!

## Test It

1. Go to Sanity Studio: https://tulio-cunha-dev.sanity.studio
2. **Publish** or update an article
3. Check Cloudflare Pages → **Deployments**
4. You should see a new build triggered by the deploy hook
5. Your Pages site should rebuild automatically (1-3 min)

## Troubleshooting

**Webhook not triggering?**

- Make sure you **published** (not just saved draft)
- Check Sanity Manage → API → Webhooks → Attempts log

## What Happens Now

- ✅ Publish article in Sanity → Automatic deployment
- ✅ Update article → Automatic deployment
- ✅ Delete article → Automatic deployment
- ❌ Save as draft → No deployment (by design)

No more manual builds! 🎉

See `SANITY_WEBHOOK_SETUP.md` for detailed documentation.
