# Optional Content Automation Setup

This repo is intentionally **Cloudflare Pages-first** and **static-site-first**.

## Supported architecture

1. **Site rebuilds** happen through `Sanity webhook -> Cloudflare Pages deploy hook`
2. The Astro frontend does **not** host `/api/auto-publish`
3. Any cross-posting or secondary automation runs in a **separate automation service** or **Sanity Functions**

## If you want cross-posting

Use one of these approaches:

1. **Preferred:** move the logic into Sanity Functions / Blueprints
2. **Alternative:** deploy a separate automation endpoint that receives Sanity webhook payloads

If you choose the separate-service route, configure either:

```env
SANITY_STUDIO_WEBHOOK_URL=https://automation.example.com/api/auto-publish
```

or:

```env
WEBHOOK_BASE_URL=https://automation.example.com
```

The Studio cross-post action and optional webhook setup both support those variables.

## What changed

Older versions of this repo described:

- GitHub Actions as the rebuild relay
- Worker/serverless-hosted `/api/auto-publish`
- frontend deploy and content automation sharing one runtime path

That is no longer the supported deployment strategy.

## What remains in this repo

- `bun run sanity:webhook` to configure the direct Pages rebuild webhook
- `scripts/auto-publish-to-devto.js` as a one-off/manual helper
- optional Studio actions that can call an **external** automation endpoint

## Minimal checklist

1. Configure `CLOUDFLARE_DEPLOY_HOOK_URL`
2. Run `bun run sanity:webhook`
3. Publish a post and confirm Cloudflare Pages rebuilds
4. If needed, deploy a separate automation service
5. Set `SANITY_STUDIO_WEBHOOK_URL` or `WEBHOOK_BASE_URL`
6. Test optional automation independently from the site rebuild

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
