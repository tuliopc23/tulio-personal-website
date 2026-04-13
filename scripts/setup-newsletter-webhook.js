import dotenv from "dotenv";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

dotenv.config();

const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";
const DEFAULT_STACK = "newsletter-webhook";
const BLUEPRINT_DIR = "sanity-blueprints/newsletter-webhook";
const BLUEPRINT_CONFIG_PATH = path.join(BLUEPRINT_DIR, ".sanity", "blueprint.config.json");
const SANITY_BIN = path.resolve("node_modules", ".bin", "sanity");

function getProjectId() {
  return process.env.PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
}

function getDataset() {
  return process.env.PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
}

function getStackName() {
  return process.env.SANITY_NEWSLETTER_BLUEPRINT_STACK || DEFAULT_STACK;
}

function getWebhookUrl() {
  return process.env.NEWSLETTER_WEBHOOK_URL || process.env.PUBLIC_NEWSLETTER_WEBHOOK_URL;
}

function getWebhookSecret() {
  return process.env.NEWSLETTER_WEBHOOK_SECRET;
}

function ensureRequiredEnv() {
  const missing = [];
  if (!getWebhookUrl()) missing.push("NEWSLETTER_WEBHOOK_URL");
  if (!getWebhookSecret()) missing.push("NEWSLETTER_WEBHOOK_SECRET");

  if (missing.length > 0) {
    console.error(`❌ Error: Missing required env var(s): ${missing.join(", ")}`);
    console.error(
      "   Tip: set NEWSLETTER_WEBHOOK_URL to `https://www.tuliocunha.dev/api/newsletter/post-published`.",
    );
    process.exit(1);
  }
}

function runSanity(args) {
  execFileSync(SANITY_BIN, args, {
    stdio: "inherit",
    env: process.env,
    cwd: BLUEPRINT_DIR,
  });
}

function runSanityFromRoot(args) {
  execFileSync(SANITY_BIN, args, {
    stdio: "inherit",
    env: process.env,
  });
}

function blueprintNeedsInit() {
  return !existsSync(BLUEPRINT_CONFIG_PATH);
}

function initBlueprintIfNeeded() {
  if (!blueprintNeedsInit()) return;

  console.log("\n🧭 Initializing Blueprint stack configuration...");
  runSanityFromRoot([
    "blueprints",
    "init",
    BLUEPRINT_DIR,
    "--project-id",
    getProjectId(),
    "--stack-name",
    getStackName(),
  ]);
}

function main() {
  ensureRequiredEnv();

  console.log("🚀 Configuring Sanity newsletter webhook via Blueprints...\n");
  console.log("🔑 Newsletter Integration:");
  console.log(`  Sanity project: ${getProjectId()}/${getDataset()}`);
  console.log(`  Blueprint dir: ${BLUEPRINT_DIR}`);
  console.log(`  Blueprint stack: ${getStackName()}`);
  console.log(`  Worker webhook URL: ${getWebhookUrl()}`);

  initBlueprintIfNeeded();

  console.log("\n🧪 Previewing Blueprint changes...");
  runSanity(["blueprints", "plan"]);

  console.log("\n📦 Deploying Blueprint...");
  runSanity(["blueprints", "deploy"]);

  console.log("\n✅ Blueprint deployment finished.");
  console.log(
    "   The newsletter webhook is now managed by sanity-blueprints/newsletter-webhook/sanity.blueprint.ts.",
  );
}

main();
