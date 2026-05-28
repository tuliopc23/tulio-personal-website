/**
 * Fetch latest Cloudflare Workers Builds status + log tail for tulio-personal-website.
 *
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=e328c1497ae7e9a61aea8ca119af439d \
 *     node scripts/cf-build-logs.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.cloudflare.com/client/v4";

function wranglerAccountId() {
  const raw = readFileSync(join(root, "wrangler.jsonc"), "utf8");
  const m = /"account_id"\s*:\s*"([^"]+)"/.exec(raw);
  return m?.[1];
}

function wranglerName() {
  const raw = readFileSync(join(root, "wrangler.jsonc"), "utf8");
  const m = /"name"\s*:\s*"([^"]+)"/.exec(raw);
  return m?.[1] ?? "tulio-personal-website";
}

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? wranglerAccountId();
const workerName = process.env.CLOUDFLARE_WORKER_NAME ?? wranglerName();
const tailLines = Number(process.env.CF_BUILD_LOG_LINES ?? 100);

if (!token) {
  console.error("Set CLOUDFLARE_API_TOKEN (Workers CI Read or Workers Scripts Read + Builds).");
  process.exit(1);
}
if (!accountId) {
  console.error("Set CLOUDFLARE_ACCOUNT_ID or account_id in wrangler.jsonc.");
  process.exit(1);
}

async function cf(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(`${path}: ${JSON.stringify(json.errors)}`);
  }
  return json.result;
}

const scripts = await cf(`/accounts/${accountId}/workers/scripts`);
const script = scripts.find((s) => s.id === workerName);
if (!script?.tag) {
  console.error(`Worker "${workerName}" not found on account ${accountId}.`);
  console.error("Available:", scripts.map((s) => s.id).join(", "));
  process.exit(1);
}

console.log(`Worker: ${workerName} (tag ${script.tag})`);

const builds = await cf(`/accounts/${accountId}/builds/workers/${script.tag}/builds?per_page=5`);
for (const b of builds) {
  const uuid = b.build_uuid ?? b.uuid;
  const meta = b.build_trigger_metadata ?? {};
  console.log(
    [
      uuid,
      b.status,
      b.build_outcome ?? "-",
      meta.branch,
      meta.commit_hash?.slice(0, 7),
      meta.commit_message?.replace(/\s+/g, " ").slice(0, 50),
    ].join(" | "),
  );
}

const latest = builds[0];
const uuid = latest?.build_uuid ?? latest?.uuid;
if (!uuid) process.exit(0);

console.log(`\n--- logs (${uuid}) ---\n`);
const logs = await cf(`/accounts/${accountId}/builds/builds/${uuid}/logs`);
const text =
  typeof logs === "string"
    ? logs
    : (logs?.logs ?? logs?.data ?? logs?.output ?? JSON.stringify(logs, null, 2));
const lines = String(text).split("\n");
console.log(lines.slice(-tailLines).join("\n"));
