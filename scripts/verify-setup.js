import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Verifying Auto-Publishing Setup...\n");

// Check required environment variables
const requiredVars = {
  SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,
  PUBLIC_SANITY_PROJECT_ID: process.env.PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET: process.env.PUBLIC_SANITY_DATASET,
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
  DEV_TO_API_KEY: process.env.DEV_TO_API_KEY,
  MEDIUM_ACCESS_TOKEN: process.env.MEDIUM_ACCESS_TOKEN,
  GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  WEBHOOK_BASE_URL: process.env.WEBHOOK_BASE_URL,
};

console.log("\n🔑 Optional Publishing Variables:");
let hasAnyPublishKey = false;
for (const [key, value] of Object.entries(optionalVars)) {
  const status = value ? "✅" : "❌";
  console.log(`  ${status} ${key}: ${value ? "Set" : "Not set"}`);
  if (value && (key === "DEV_TO_API_KEY" || key === "MEDIUM_ACCESS_TOKEN")) {
    hasAnyPublishKey = true;
  }
}

// Check if scripts exist
const fs = await import("fs");
const scripts = [
  "scripts/setup-webhook.js",
  "scripts/auto-publish-to-devto.js",
  "functions/auto-publish.js",
];

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
    "     Please set SANITY_API_WRITE_TOKEN, PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET"
  );
  process.exit(1);
}

console.log("  ✅ Required environment variables configured");

if (!allScriptsExist) {
  console.log("  ❌ Missing script files");
  console.log("     Please ensure all auto-publishing scripts are present");
  process.exit(1);
}

console.log("  ✅ All required script files present");

if (!hasAnyPublishKey) {
  console.log("  ⚠️  No publishing platform API keys configured");
  console.log("     Set DEV_TO_API_KEY or MEDIUM_ACCESS_TOKEN to enable auto-publishing");
} else {
  console.log("  ✅ At least one publishing platform configured");
}

console.log("\n🚀 Next Steps:");
console.log("  1. Configure API keys for publishing platforms (optional)");
console.log("  2. Deploy the auto-publish function to Vercel/Netlify");
console.log("  3. Set WEBHOOK_BASE_URL environment variable");
console.log("  4. Run: bun run sanity:webhook");
console.log("  5. Test by publishing an article in Sanity Studio");

if (hasAnyPublishKey) {
  console.log("\n🎯 Publishing Platforms Ready:");
  if (process.env.DEV_TO_API_KEY) {
    console.log("  ✅ Dev.to - Automatic publishing enabled");
  }
  if (process.env.MEDIUM_ACCESS_TOKEN) {
    console.log("  ✅ Medium - Automatic publishing enabled");
  }
}

console.log("\n📖 For detailed setup instructions, see: AUTO_PUBLISHING_SETUP.md");
