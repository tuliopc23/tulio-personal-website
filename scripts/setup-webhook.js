import dotenv from "dotenv";
import { createClient } from "@sanity/client";
import { execSync } from "node:child_process";

dotenv.config();

const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";
const DEFAULT_OWNER = "tuliopc23";
const DEFAULT_REPO = "tulio-personal-website";
const WEBHOOK_NAME = "Cloudflare Workers Rebuild";
const WEBHOOK_DESCRIPTION =
  "Triggers a GitHub Actions rebuild/deploy for the Cloudflare Worker when published site content changes.";
const DELETE_HOOK_NAMES = new Set([
  "Cloudflare Pages Deploy",
  "Content Automation",
  "Auto publish",
  "Blog Article Sanity to Cloudflare",
  WEBHOOK_NAME,
]);
const SITE_REBUILD_FILTER =
  '_type in ["aboutPage","author","blogPage","category","featuredGithubRepo","post","project","projectsPage","series","topic"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))';
const SITE_REBUILD_PROJECTION = `{
  "event_type": "sanity-rebuild",
  "client_payload": {
    "source": "sanity",
    "documentId": _id,
    "documentType": _type,
    "slug": select(defined(slug.current) => slug.current, null),
    "operation": select(
      delta::operation() == "create" => "created",
      delta::operation() == "update" => "updated",
      delta::operation() == "delete" => "deleted"
    ),
    "dataset": sanity::dataset(),
    "projectId": sanity::projectId()
  }
}`;

function getProjectId() {
  return process.env.PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
}

function getDataset() {
  return process.env.PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
}

function getDispatchToken() {
  return (
    process.env.GITHUB_REPOSITORY_DISPATCH_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN
  );
}

function inferRepoFromGitRemote() {
  try {
    const remote = execSync("git config --get remote.origin.url", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

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

const client = createClient({
  projectId: getProjectId(),
  dataset: getDataset(),
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-02-19",
  useCdn: false,
});

async function listExistingHooks() {
  return client.request({
    method: "GET",
    uri: "/hooks",
  });
}

async function deleteHook(id) {
  await client.request({
    method: "DELETE",
    uri: `/hooks/${id}`,
  });
}

async function createHook({ url, token }) {
  return client.request({
    method: "POST",
    uri: "/hooks",
    body: {
      name: WEBHOOK_NAME,
      description: WEBHOOK_DESCRIPTION,
      url,
      httpMethod: "POST",
      filter: SITE_REBUILD_FILTER,
      projection: SITE_REBUILD_PROJECTION,
      on: ["create", "update", "delete"],
      includeDrafts: false,
      apiVersion: "2025-02-19",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "X-Sanity-Webhook": "cloudflare-workers-rebuild",
      },
    },
  });
}

async function setupWebhook() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("❌ Error: SANITY_API_WRITE_TOKEN is not set in your environment");
    process.exit(1);
  }

  const dispatchToken = getDispatchToken();
  if (!dispatchToken) {
    console.error(
      "❌ Error: Set GITHUB_REPOSITORY_DISPATCH_TOKEN or GITHUB_TOKEN / GITHUB_PERSONAL_ACCESS_TOKEN.",
    );
    process.exit(1);
  }

  const target = getDispatchTarget();

  console.log("\n🔑 Rebuild Integration:");
  console.log(`  Sanity project: ${getProjectId()}/${getDataset()}`);
  console.log(`  GitHub dispatch target: ${target.owner}/${target.repo}`);
  console.log("  Event type: sanity-rebuild");
  console.log(
    "  Strategy: Sanity webhook -> GitHub repository_dispatch -> GitHub Actions -> wrangler deploy",
  );

  try {
    const existingHooks = await listExistingHooks();
    const staleHooks = existingHooks.filter(
      (hook) => DELETE_HOOK_NAMES.has(hook.name) || hook.url === target.url,
    );

    for (const hook of staleHooks) {
      console.log(`🗑️  Deleting stale webhook: ${hook.name} -> ${hook.url}`);
      await deleteHook(hook.id);
    }

    const webhook = await createHook({ url: target.url, token: dispatchToken });

    console.log("\n✅ Sanity rebuild webhook configured successfully!");
    console.log(`   Name: ${webhook.name}`);
    console.log(`   URL: ${webhook.url}`);
    console.log(`   Filter: ${SITE_REBUILD_FILTER}`);
    console.log("\n📋 Covered content types:");
    console.log(
      "   aboutPage, author, blogPage, category, featuredGithubRepo, post, project, projectsPage, series, topic",
    );
    console.log("\n🚀 Next steps:");
    console.log("   1. Add GitHub Actions secrets: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID");
    console.log("   2. Commit the new workflow in .github/workflows/sanity-rebuild.yml");
    console.log("   3. Publish a change in Sanity Studio and watch the GitHub Actions run");
    console.log("   4. Use Sanity webhook attempts log if a publish does not trigger a run");
  } catch (error) {
    console.error("❌ Error creating webhook:", error);
    process.exit(1);
  }
}

console.log("🚀 Setting up Sanity rebuild webhook for Cloudflare Workers...\n");
setupWebhook();
