import dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config();

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-01-01",
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

  // Check for publishing platform credentials
  const hasDevToKey = !!process.env.DEV_TO_API_KEY;
  const hasMediumKey = !!process.env.MEDIUM_ACCESS_TOKEN;

  console.log("\n🔑 Available Integrations:");
  console.log(`  Dev.to: ${hasDevToKey ? "✅ Configured" : "❌ Not set (optional)"}`);
  console.log(`  Medium: ${hasMediumKey ? "✅ Configured" : "❌ Not set (optional)"}`);

  // GitHub integration (for site rebuild)
  const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const githubRepo = process.env.GITHUB_REPOSITORY || "tuliopc23/tulio-personal-website";

  if (!githubToken) {
    console.log("\n⚠️  GITHUB_PERSONAL_ACCESS_TOKEN not set");
    console.log("   Site rebuilds will not be triggered automatically");
  }

  try {
    // Check existing webhooks
    const existingHooks = await client.request({
      method: "GET",
      uri: "/hooks",
    });

    // 1. Create/Update GitHub webhook for site rebuild
    if (githubToken) {
      const existingGitHubHook = existingHooks.find(
        (hook) => hook.name === "GitHub Actions Deploy"
      );

      if (existingGitHubHook) {
        console.log("🗑️  Deleting existing GitHub webhook...");
        await client.request({
          method: "DELETE",
          uri: `/hooks/${existingGitHubHook.id}`,
        });
      }

      const githubWebhookUrl = `https://api.github.com/repos/${githubRepo}/dispatches`;

      const githubWebhook = await client.request({
        method: "POST",
        uri: "/hooks",
        body: {
          name: "GitHub Actions Deploy",
          description:
            "Triggers GitHub Actions to rebuild site when articles are published",
          url: githubWebhookUrl,
          httpMethod: "POST",
          filter: '_type == "post" && !(_id in path("drafts.**"))',
          projection: `{
            "event_type": "sanity-content-update",
            "client_payload": {
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
            }
          }`,
          on: ["create", "update", "delete"],
          includeDrafts: false,
          apiVersion: "2024-01-01",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "X-Sanity-Webhook": "github-deploy",
          },
        },
      });

      console.log("✅ GitHub webhook created successfully!");
      console.log(`    ID: ${githubWebhook.id}`);
      console.log(`    URL: ${githubWebhook.url}`);
    }

    // 2. Create auto-publishing webhook if any publishing platform is configured
    if (hasDevToKey || hasMediumKey) {
      const existingAutoPublishHook = existingHooks.find(
        (hook) => hook.name === "Auto-Publish to Platforms"
      );

      if (existingAutoPublishHook) {
        console.log("🗑️  Deleting existing auto-publishing webhook...");
        await client.request({
          method: "DELETE",
          uri: `/hooks/${existingAutoPublishHook.id}`,
        });
      }

      // Create webhook that triggers on publishing platform or GitHub webhook endpoint
      const webhookBaseUrl =
        process.env.WEBHOOK_BASE_URL || "https://your-deployed-function-url.vercel.app";

      await client.request({
        method: "POST",
        uri: "/hooks",
        body: {
          name: "Auto-Publish to Platforms",
          description: "Auto-publish articles to Dev.to, Medium and other platforms",
          url: `${webhookBaseUrl}/api/auto-publish`,
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
          apiVersion: "2024-01-01",
          headers: {
            "Content-Type": "application/json",
            "X-Sanity-Webhook": "auto-publish",
          },
        },
      });

      console.log("✅ Auto-publishing webhook created successfully!");
    }

    console.log("\n🎉 Webhook setup complete!");
    console.log("\n📋 Summary:");

    if (githubToken) {
      console.log("  ✅ Site rebuild webhook configured");
    }

    if (hasDevToKey || hasMediumKey) {
      console.log("  ✅ Auto-publishing webhook configured");
      console.log("     This will trigger when you publish articles in Sanity");
    }

    if (!githubToken && !hasDevToKey && !hasMediumKey) {
      console.log("  ⚠️  No integrations configured");
      console.log("     Set up at least one platform to get started");
    }

    console.log("\n🚀 Next steps:");

    if (hasDevToKey || hasMediumKey) {
      console.log("  1. Deploy the auto-publishing function");
      console.log("  2. Test by publishing an article in Sanity Studio");
    }

    if (githubToken) {
      console.log("  3. Site rebuilds will trigger automatically");
    }

    console.log("\n💡 Environment variables you can set:");
    console.log("  DEV_TO_API_KEY=<your-devto-api-key>");
    console.log("  MEDIUM_ACCESS_TOKEN=<your-medium-token>");
    console.log("  WEBHOOK_BASE_URL=<your-deployed-function-url>");
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
