import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Verifying Sanity webhook and optional content automation setup...\n");

// Check required environment variables
const requiredVars = {
  SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,
  PUBLIC_SANITY_PROJECT_ID: process.env.PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET: process.env.PUBLIC_SANITY_DATASET,
  GITHUB_REPOSITORY_DISPATCH_TOKEN:
    process.env.GITHUB_REPOSITORY_DISPATCH_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
};

console.log("📋 Required Environment Variables:");
let allRequiredPresent = true;
for (const [key, value] of Object.entries(requiredVars)) {
  const status = value ? "✅" : "❌";
  console.log(`  ${status} ${key}: ${value ? "Set" : "Missing"}`);
  if (!value) allRequiredPresent = false;
}

// Check optional environment variables for publishing platforms
const optionalVars = {
  PUBLIC_SANITY_PREVIEW_URL: process.env.PUBLIC_SANITY_PREVIEW_URL,
  SANITY_STUDIO_WEBHOOK_URL: process.env.SANITY_STUDIO_WEBHOOK_URL,
  WEBHOOK_BASE_URL: process.env.WEBHOOK_BASE_URL,
  GITHUB_REPOSITORY_OWNER: process.env.GITHUB_REPOSITORY_OWNER,
  GITHUB_REPOSITORY_NAME: process.env.GITHUB_REPOSITORY_NAME,
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
  DEV_TO_API_KEY: process.env.DEV_TO_API_KEY,
  HASHNODE_ACCESS_TOKEN: process.env.HASHNODE_ACCESS_TOKEN,
  LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN,
};

console.log("\n🔑 Optional Publishing Variables:");
let hasAutomationConfig = false;
for (const [key, value] of Object.entries(optionalVars)) {
  const status = value ? "✅" : "❌";
  console.log(`  ${status} ${key}: ${value ? "Set" : "Not set"}`);
  if (value && ["SANITY_STUDIO_WEBHOOK_URL", "WEBHOOK_BASE_URL"].includes(key)) {
    hasAutomationConfig = true;
  }
}

// Check if scripts exist
const fs = await import("fs");
const scripts = ["scripts/setup-webhook.js", "scripts/auto-publish-to-devto.js"];

console.log("\n📁 Script Files:");
let allScriptsExist = true;
for (const script of scripts) {
  const exists = fs.existsSync(script);
  const status = exists ? "✅" : "❌";
  console.log(`  ${status} ${script}`);
  if (!exists) allScriptsExist = false;
}

// Check if documentation exists
const docs = ["AUTO_PUBLISHING_SETUP.md", "SANITY_WEBHOOK_SETUP.md"];

console.log("\n📚 Documentation:");
for (const doc of docs) {
  const exists = fs.existsSync(doc);
  const status = exists ? "✅" : "❌";
  console.log(`  ${status} ${doc}`);
}

// Summary
console.log("\n📊 Setup Status:");

if (!allRequiredPresent) {
  console.log("  ❌ Missing required environment variables");
  console.log(
    "     Please set SANITY_API_WRITE_TOKEN, PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, and a GitHub dispatch token",
  );
  process.exit(1);
}

console.log("  ✅ Required environment variables configured");

if (!allScriptsExist) {
  console.log("  ❌ Missing script files");
  console.log("     Please ensure the required webhook/setup scripts are present");
  process.exit(1);
}

console.log("  ✅ All required script files present");

if (!hasAutomationConfig) {
  console.log("  ℹ️  No external content automation webhook configured");
  console.log(
    "     Set SANITY_STUDIO_WEBHOOK_URL or WEBHOOK_BASE_URL only if you use a separate automation service",
  );
} else {
  console.log("  ✅ External content automation webhook configured");
}

console.log("\n🚀 Next Steps:");
console.log("  1. Add GitHub Actions secrets: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID");
console.log("  2. Run: pnpm run sanity:webhook");
console.log("  3. Test by publishing site content in Sanity Studio");
console.log(
  "  4. If you use external automation, set SANITY_STUDIO_WEBHOOK_URL or WEBHOOK_BASE_URL",
);

if (hasAutomationConfig) {
  console.log("\n🎯 External Automation Routing Ready:");
  if (process.env.SANITY_STUDIO_WEBHOOK_URL) {
    console.log(
      "  ✅ SANITY_STUDIO_WEBHOOK_URL - Studio/manual actions will post to the configured endpoint",
    );
  }
  if (process.env.WEBHOOK_BASE_URL) {
    console.log(
      "  ✅ WEBHOOK_BASE_URL - automatic automation webhook setup can target /api/auto-publish",
    );
  }
}

if (
  process.env.DEV_TO_API_KEY ||
  process.env.HASHNODE_ACCESS_TOKEN ||
  process.env.LINKEDIN_ACCESS_TOKEN
) {
  console.log("\n🎯 Publishing Platform Credentials Present:");
  if (process.env.DEV_TO_API_KEY) {
    console.log("  ✅ Dev.to credentials present");
  }
  if (process.env.HASHNODE_ACCESS_TOKEN) {
    console.log("  ✅ Hashnode credentials present");
  }
  if (process.env.LINKEDIN_ACCESS_TOKEN) {
    console.log("  ✅ LinkedIn credentials present");
  }
}

console.log("\n📖 For detailed setup instructions, see: SANITY_WEBHOOK_SETUP.md");
