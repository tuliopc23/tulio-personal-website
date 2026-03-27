import dotenv from "dotenv";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

dotenv.config();

const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";
const DEFAULT_STACK = "cloudflare-workers-rebuild";
const DEFAULT_OWNER = "tuliopc23";
const DEFAULT_REPO = "tulio-personal-website";
const BLUEPRINT_DIR = "sanity-blueprints/rebuild-webhook";
const BLUEPRINT_CONFIG_PATH = path.join(BLUEPRINT_DIR, ".sanity", "blueprint.config.json");
const SANITY_BIN = path.resolve("node_modules", ".bin", "sanity");

function getProjectId() {
  return process.env.PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
}

function getDataset() {
  return process.env.PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
}

function getStackName() {
  return process.env.SANITY_BLUEPRINT_STACK || DEFAULT_STACK;
}

function getDispatchToken() {
  return (
    process.env.GITHUB_REPOSITORY_DISPATCH_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN
  );
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

function inferRepoFromGitRemote() {
  try {
    const remote = execFileSync("git", ["config", "--get", "remote.origin.url"], {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();

    const match =
      remote.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i) ||
      remote.match(/github\.com[:/]([^/]+)\/([^/]+)\.git$/i);

    if (!match) return null;

    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}

function getDispatchTarget() {
  const inferred = inferRepoFromGitRemote();
  const owner = process.env.GITHUB_REPOSITORY_OWNER || inferred?.owner || DEFAULT_OWNER;
  const repo = process.env.GITHUB_REPOSITORY_NAME || inferred?.repo || DEFAULT_REPO;

  return {
    owner,
    repo,
    url: `https://api.github.com/repos/${owner}/${repo}/dispatches`,
  };
}

function ensureRequiredEnv() {
  if (!getDispatchToken()) {
    console.error(
      "❌ Error: Set GITHUB_REPOSITORY_DISPATCH_TOKEN or GITHUB_TOKEN / GITHUB_PERSONAL_ACCESS_TOKEN.",
    );
    process.exit(1);
  }
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

  const target = getDispatchTarget();

  console.log("🚀 Configuring Sanity rebuild webhook via Blueprints...\n");
  console.log("🔑 Rebuild Integration:");
  console.log(`  Sanity project: ${getProjectId()}/${getDataset()}`);
  console.log(`  Blueprint dir: ${BLUEPRINT_DIR}`);
  console.log(`  Blueprint stack: ${getStackName()}`);
  console.log(`  GitHub dispatch target: ${target.owner}/${target.repo}`);
  console.log("  Event type: sanity-rebuild");
  console.log(
    "  Strategy: Sanity document webhook -> GitHub repository_dispatch -> GitHub Actions -> wrangler deploy",
  );

  initBlueprintIfNeeded();

  console.log("\n🧪 Previewing Blueprint changes...");
  runSanity(["blueprints", "plan"]);

  console.log("\n📦 Deploying Blueprint...");
  runSanity(["blueprints", "deploy"]);

  console.log("\n✅ Blueprint deployment finished.");
  console.log(
    "   The rebuild webhook is now managed by sanity-blueprints/rebuild-webhook/sanity.blueprint.ts.",
  );
}

main();
