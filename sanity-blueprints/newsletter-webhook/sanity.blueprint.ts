import { defineBlueprint, defineDocumentWebhook } from "@sanity/blueprints";

const DEFAULT_DATASET = "production";

function getWorkerWebhookUrl() {
  const url = process.env.NEWSLETTER_WEBHOOK_URL || process.env.PUBLIC_NEWSLETTER_WEBHOOK_URL;
  if (!url) {
    throw new Error(
      "Missing NEWSLETTER_WEBHOOK_URL. Set it to `https://www.tuliocunha.dev/api/newsletter/post-published` (or your preview/staging URL) before deploying the Blueprint.",
    );
  }
  return url;
}

function getWebhookSecret() {
  const secret = process.env.NEWSLETTER_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      "Missing NEWSLETTER_WEBHOOK_SECRET. Set it to match the Cloudflare Worker secret used to validate publish webhooks.",
    );
  }
  return secret;
}

const webhookUrl = getWorkerWebhookUrl();
const webhookSecret = getWebhookSecret();

export default defineBlueprint({
  resources: [
    defineDocumentWebhook({
      name: "newsletter-post-published",
      displayName: "Newsletter: post published",
      description: "Calls the website Worker to email subscribers whenever a post is published.",
      url: webhookUrl,
      on: ["create", "update"],
      dataset: process.env.PUBLIC_SANITY_DATASET || DEFAULT_DATASET,
      apiVersion: "v2025-02-19",
      filter:
        '_type == "post" && status == "published" && publishedAt <= now() && !(_id in path("drafts.**")) && !(_id in path("versions.**"))',
      projection: `{
        "postId": _id,
        "slug": select(defined(slug.current) => slug.current, null),
        "title": title,
        "summary": summary,
        "hero_image_url": select(defined(heroImage.asset) => heroImage.asset->url, null),
        "publishedAt": publishedAt
      }`,
      status: "enabled",
      httpMethod: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Newsletter-Secret": webhookSecret,
        "X-Sanity-Webhook": "newsletter-post-published",
      },
      includeDrafts: false,
      includeAllVersions: false,
    }),
  ],
});
