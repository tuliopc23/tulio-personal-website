# Cloudflare Workers Deployment Setup

Quick reference for deploying to Cloudflare Pages/Workers.

## 📦 Repository Information

- **Repository**: https://github.com/tuliopc23/tulio-personal-website
- **Branch**: main
- **Latest Commit**: 3d5bea68 - chore: update dependencies lockfile

## 🔧 Build Configuration

Copy these settings in Cloudflare Dashboard:

```yaml
Framework preset: Astro
Build command: bun run build
Build output directory: dist
Root directory: /
Node version: 18 (or latest)
```

## 🌍 Environment Variables

### Build-time (Public)
Add these in "Environment Variables" → "Production":

```bash
PUBLIC_SANITY_PROJECT_ID=61249gtj
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_STUDIO_URL=https://tulio-cunha-dev.sanity.studio
```

### Runtime (Secrets)
Add these as "Encrypted" variables:

```bash
SANITY_API_WRITE_TOKEN=[Get from Sanity Dashboard]
CRON_SECRET=[Generate with: openssl rand -hex 32]
```

## 📝 How to Get Secrets

### 1. Sanity Write Token

```bash
# 1. Go to: https://sanity.io/manage
# 2. Select: tulio-personal-website project
# 3. Navigate: API → Tokens → Add API Token
# 4. Name: "Cloudflare Production"
# 5. Permissions: Editor
# 6. Copy token (shown once only!)
```

### 2. Cron Secret

```bash
# Generate random secret:
openssl rand -hex 32

# Example output:
# 8f7d9e6c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7
```

## 🚀 Deployment Steps

### Initial Setup (One-time)

1. **Connect Repository**
   - Dashboard → Workers & Pages → Create → Pages
   - Connect to Git → Select repository

2. **Configure Build**
   - Use settings above
   - Add public environment variables

3. **First Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (~2-3 minutes)

4. **Add Secrets**
   - Settings → Environment Variables
   - Add SANITY_API_WRITE_TOKEN (encrypted)
   - Add CRON_SECRET (encrypted)

5. **Redeploy**
   - Deployments → Retry deployment
   - Or push new commit to trigger auto-deploy

### Ongoing Deploys

Every `git push origin main` automatically deploys!

```bash
# Make changes
git add .
git commit -m "your changes"
git push origin main

# Cloudflare auto-deploys in ~2-3 minutes
```

## 🔍 Verify Deployment

After deployment completes:

### 1. Check Site Works
```bash
# Visit your Cloudflare Pages URL (shown in dashboard)
# Example: https://tulio-personal-website.pages.dev
```

### 2. Test API Endpoint
```bash
curl -X GET https://your-site.pages.dev/api/publish-scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Expected: {"success":true,"publishedCount":0,"results":[]}
```

### 3. Test Studio Access
```bash
# Open: https://tulio-cunha-dev.sanity.studio
# Login with your Sanity account
# Verify all custom actions appear
```

### 4. Verify Cron Trigger
```bash
# In Cloudflare Dashboard:
# Workers & Pages → Your Project → Settings → Functions

# Check if cron trigger is active:
# Schedule: 0 * * * * (hourly)
```

## 🎯 Custom Domain (Optional)

### Add Your Domain

1. **In Cloudflare Dashboard:**
   - Your project → Custom domains
   - Click "Set up a custom domain"

2. **Add Domain:**
   - Enter: `www.tuliocunha.dev`
   - Cloudflare auto-configures DNS

3. **Wait for SSL:**
   - SSL certificate auto-provisions
   - Usually takes 5-10 minutes

4. **Verify:**
   - Visit: https://www.tuliocunha.dev
   - Should show your site with SSL

## 📊 Monitor Deployments

### Deployment Logs
```bash
# View in Dashboard:
Workers & Pages → Your Project → Deployments → [Latest] → View details

# Check build logs
# Check function logs (for API routes)
```

### Production Logs
```bash
# Real-time logs:
Workers & Pages → Your Project → Logs

# Filter by:
# - Status (200, 404, 500)
# - Date/time
# - Search text
```

## 🔧 Troubleshooting

### Build Fails

**Error: "Command not found: bun"**
```yaml
# In Cloudflare settings, ensure:
Build command: bun run build
# If fails, try:
Build command: npm run build
```

**Error: "Cannot find module"**
```bash
# Check package.json dependencies are committed
git add package.json bun.lock
git commit -m "fix: update dependencies"
git push origin main
```

### API Routes Not Working

**404 on /api/publish-scheduled**
```bash
# Verify in wrangler.toml:
[build]
command = "bun run build"

# Ensure astro.config.mjs has:
output: "server"
adapter: cloudflare({ mode: "directory" })
```

**401 Unauthorized**
```bash
# Check environment variables are set:
# SANITY_API_WRITE_TOKEN - Set correctly
# CRON_SECRET - Matches your request header
```

### Cron Not Running

**Scheduled posts not publishing**
```bash
# Option 1: Verify Cloudflare Cron is active
# Dashboard → Settings → Functions → Cron triggers

# Option 2: Use GitHub Actions instead
# The workflow is already in .github/workflows/publish-scheduled.yml
# Just add secrets in GitHub repo:
# - SITE_URL: https://your-site.pages.dev
# - CRON_SECRET: [your secret]
```

## 🎊 Success Checklist

- [ ] Repository connected to Cloudflare
- [ ] Build configuration correct
- [ ] Public environment variables added
- [ ] Secrets added (SANITY_API_WRITE_TOKEN, CRON_SECRET)
- [ ] First deployment successful
- [ ] Site accessible at Cloudflare URL
- [ ] API endpoint responds correctly
- [ ] Studio accessible and functional
- [ ] Cron trigger configured (or GitHub Actions)
- [ ] Custom domain added (optional)

## 📚 Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Astro Cloudflare Guide**: https://docs.astro.build/en/guides/deploy/cloudflare/
- **Your GitHub Repo**: https://github.com/tuliopc23/tulio-personal-website
- **Your Studio**: https://tulio-cunha-dev.sanity.studio

---

**Questions?** Check the troubleshooting section or Cloudflare deployment logs.
