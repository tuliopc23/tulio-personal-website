import dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config();

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-02-19",
  useCdn: false,
});

async function setupWebhook() {
  // Check for required Sanity credentials
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("❌ Error: SANITY_API_WRITE_TOKEN is not set in your environment");
    console.log("\n📋 Setup Instructions:");
    console.log("1. Go to https://www.sanity.io/manage");
    console.log("2. Select your project → API → Tokens");
    console.log('3. Create new token with "Editor" permissions');
    console.log("4. Add to .env: SANITY_API_WRITE_TOKEN=<your-token>");
    process.exit(1);
  }

  const deployHookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL;
  const automationBaseUrl = process.env.WEBHOOK_BASE_URL?.replace(/\/$/, "");
  const automationWebhookUrl =
    process.env.SANITY_STUDIO_WEBHOOK_URL ||
    (automationBaseUrl ? `${automationBaseUrl}/api/auto-publish` : undefined);

  console.log("\n🔑 Available Integrations:");
  console.log(
    `  Cloudflare Pages deploy hook: ${deployHookUrl ? "✅ Configured" : "❌ Missing"}`
  );
  console.log(
    `  External content automation webhook: ${automationWebhookUrl ? "✅ Configured" : "❌ Not set (optional)"}`
  );

  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

  if (!deployHookUrl) {
    console.log("\n⚠️  CLOUDFLARE_DEPLOY_HOOK_URL not set");
    console.log("   Automatic Pages rebuilds will not be configured");
  }

  try {
    // Check existing webhooks
    const existingHooks = await client.request({
      method: "GET",
      uri: "/hooks",
    });

    // 1. Create/Update direct Cloudflare Pages deploy webhook
    if (deployHookUrl) {
      const existingPagesHook = existingHooks.find(
        (hook) => hook.name === "Cloudflare Pages Deploy"
      );

      if (existingPagesHook) {
        console.log("🗑️  Deleting existing Cloudflare Pages deploy webhook...");
        await client.request({
          method: "DELETE",
          uri: `/hooks/${existingPagesHook.id}`,
        });
      }

      const pagesWebhook = await client.request({
        method: "POST",
        uri: "/hooks",
        body: {
          name: "Cloudflare Pages Deploy",
          description: "Triggers a direct Cloudflare Pages rebuild when published content changes",
          url: deployHookUrl,
          httpMethod: "POST",
          filter: '_type == "post" && !(_id in path("drafts.**"))',
          projection: `{
            "documentId": _id,
            "documentType": _type,
            "title": title,
            "slug": slug.current,
            "publishedAt": publishedAt,
            "operation": select(
              delta::operation() == "create" => "created",
              delta::operation() == "update" => "updated",
              delta::operation() == "delete" => "deleted"
            )
          }`,
          on: ["create", "update", "delete"],
          includeDrafts: false,
          apiVersion: "2025-02-19",
          headers: {
            "Content-Type": "application/json",
            "X-Sanity-Webhook": "cloudflare-pages-deploy",
          },
        },
      });

      console.log("✅ Cloudflare Pages deploy webhook created successfully!");
      console.log(`    ID: ${pagesWebhook.id}`);
      console.log(`    URL: ${pagesWebhook.url}`);
    }

    // 2. Optional: create/update external automation webhook
    if (automationWebhookUrl) {
      const existingAutoPublishHook = existingHooks.find(
        (hook) => hook.name === "Content Automation"
      );

      if (existingAutoPublishHook) {
        console.log("🗑️  Deleting existing content automation webhook...");
        await client.request({
          method: "DELETE",
          uri: `/hooks/${existingAutoPublishHook.id}`,
        });
      }

      await client.request({
        method: "POST",
        uri: "/hooks",
        body: {
          name: "Content Automation",
          description: "Optional external automation for cross-posting or other content-side workflows",
          url: automationWebhookUrl,
          httpMethod: "POST",
          filter: '_type == "post" && !(_id in path("drafts.**"))',
          projection: `{
            "documentId": _id,
            "documentType": _type,
            "title": title,
            "summary": summary,
            "slug": slug.current,
            "publishedAt": publishedAt,
            "tags": tags,
            "featured": featured,
            "heroImage": heroImage{
              "url": asset->url,
              "alt": alt,
              "caption": caption
            },
            "seo": seo{
              metaTitle,
              metaDescription,
              canonicalUrl,
              "noIndex": coalesce(noIndex, false)
            },
            "operation": select(
              delta::operation() == "create" => "created",
              delta::operation() == "update" => "updated",
              delta::operation() == "delete" => "deleted"
            )
          }`,
          on: ["create", "update", "delete"],
          includeDrafts: false,
          apiVersion: "2025-02-19",
          ...(webhookSecret ? { secret: webhookSecret } : {}),
          headers: {
            "Content-Type": "application/json",
            "X-Sanity-Webhook": "auto-publish",
          },
        },
      });

      console.log("✅ Content automation webhook created successfully!");
    }

    console.log("\n🎉 Webhook setup complete!");
    console.log("\n📋 Summary:");

    if (deployHookUrl) {
      console.log("  ✅ Direct Cloudflare Pages rebuild webhook configured");
    }

    if (automationWebhookUrl) {
      console.log("  ✅ Optional content automation webhook configured");
      console.log("     This will forward published post payloads to your external automation service");
    }

    if (!deployHookUrl && !automationWebhookUrl) {
      console.log("  ⚠️  No webhooks configured");
      console.log("     Set CLOUDFLARE_DEPLOY_HOOK_URL to enable direct Pages rebuilds");
    }

    console.log("\n🚀 Next steps:");

    if (deployHookUrl) {
      console.log("  1. Publish or update a post in Sanity Studio");
      console.log("  2. Confirm Cloudflare Pages receives a deploy-hook build");
    }

    if (automationWebhookUrl) {
      console.log("  3. Test your external content automation endpoint with a published post");
    }

    console.log("\n💡 Environment variables you can set:");
    console.log("  CLOUDFLARE_DEPLOY_HOOK_URL=<your-pages-deploy-hook-url>");
    console.log("  SANITY_STUDIO_WEBHOOK_URL=<full external automation webhook URL>");
    console.log("  WEBHOOK_BASE_URL=<base URL for an external /api/auto-publish service>");
  } catch (error) {
    console.error("❌ Error creating webhook:", error);

    if (error.statusCode === 401) {
      console.log("\n⚠️  Authentication failed. Check your SANITY_API_WRITE_TOKEN");
    } else if (error.statusCode === 404) {
      console.log("\n⚠️  Project not found. Check your PUBLIC_SANITY_PROJECT_ID");
    } else {
      console.log("\n⚠️  Full error:", JSON.stringify(error, null, 2));
    }

    process.exit(1);
  }
}

// Run the setup
console.log("🚀 Setting up Sanity webhooks for auto-publishing...\n");
setupWebhook();
