# Quick Start: Sanity Webhook Setup

Follow these 3 steps to enable automatic deployments when you publish articles in Sanity.

## Step 1: Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `Sanity Webhook`
4. Permissions: Check **"repo"** (full control)
5. **Copy the token** (starts with `ghp_...`)

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
GITHUB_PERSONAL_ACCESS_TOKEN=ghp...your-github-token...
```

Run setup:

```bash
bun run sanity:webhook
```

You should see: ✅ Webhook created successfully!

## Test It

1. Go to Sanity Studio: https://tulio-cunha-dev.sanity.studio
2. **Publish** or update an article
3. Check GitHub → Your Repo → **Actions** tab
4. You should see a workflow running: "Rebuild on Sanity Content Update"
5. Cloudflare Pages will rebuild automatically (1-3 min)

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
