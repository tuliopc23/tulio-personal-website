# Sanity Webhook Rebuild Setup

This repo uses build-time Sanity content. Published changes appear on the live Cloudflare Worker only after a new build and deploy.

## Current flow

1. Publish content in hosted Sanity Studio.
2. Sanity sends an outgoing webhook to the GitHub repository dispatch API.
3. GitHub Actions runs the rebuild workflow.
4. The workflow runs `pnpm run deploy:preflight` and `wrangler deploy`.
5. The Worker serves the newly built static assets.

This matches the current Cloudflare Workers guidance for external CI/CD when you need deploys from non-Git events, and the current Sanity webhook model of sending authenticated HTTP requests to your chosen endpoint.

## Why this replaced the old setup

- This repo is on **Cloudflare Workers**, not Cloudflare Pages.
- Workers Builds automatically deploy on **Git push**, not on Sanity publish.
- The old Pages deploy-hook flow was stale and did not cover singleton/page-content updates.
- Production `/studio` is not an embedded live Studio; it links to the hosted Sanity Studio.

## Required local environment

```env
PUBLIC_SANITY_PROJECT_ID=61249gtj
PUBLIC_SANITY_DATASET=production
GITHUB_REPOSITORY_DISPATCH_TOKEN=...
```

Optional:

```env
GITHUB_REPOSITORY_OWNER=tuliopc23
GITHUB_REPOSITORY_NAME=tulio-personal-website
```

`GITHUB_REPOSITORY_DISPATCH_TOKEN` should be a GitHub token allowed to call the repository dispatch API for this repo.

## Required GitHub repository secrets

Add these in GitHub repository settings:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `SANITY_API_READ_TOKEN`
- `GITHUB_TOKEN` or `GITHUB_PERSONAL_ACCESS_TOKEN` if your build needs GitHub-backed data at build time
- Optional Sentry build secrets if you use source map upload:
  `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `PUBLIC_SENTRY_DSN`, `SENTRY_DSN`

## Setup

Run:

```bash
pnpm run sanity:webhook
```

This will:

- initialize the local Blueprint stack binding if this repo has not been linked yet
- preview the Blueprint plan
- deploy the Blueprint-defined rebuild webhook from `sanity-blueprints/rebuild-webhook/sanity.blueprint.ts`
- keep the rebuild webhook managed as code instead of ad-hoc dashboard state

## Webhook filter

The rebuild webhook covers these Sanity types:

- `aboutPage`
- `author`
- `blogPage`
- `category`
- `featuredGithubRepo`
- `post`
- `project`
- `projectsPage`
- `series`
- `topic`

Drafts and versions are excluded.

## Validation

1. Run `pnpm run sanity:verify`
2. Run `pnpm run sanity:webhook`
3. In Sanity Manage, confirm the Blueprint-managed rebuild hook is present for site deploys
4. Publish a change to a page singleton like `projectsPage`
5. Confirm a GitHub Actions run starts from `repository_dispatch`
6. Confirm the new Worker deployment becomes active

## Debugging

- Use the **Sanity webhook attempts log** first. Sanity documents this as the primary delivery-debugging surface.
- If Sanity shows a 2xx response, move to the GitHub Actions run history.
- If GitHub Actions does not start, verify the webhook token and repository target.
- If GitHub Actions starts but deploy fails, inspect the workflow logs and Cloudflare auth secrets.

## Notes

- The static Astro pages do not refetch Sanity content on every request.
- `worker/index.ts` handles runtime APIs only; it does not render Sanity page content dynamically.
- `https://tuliocunha.dev/api/auto-publish` is not part of the static-site rebuild path.
