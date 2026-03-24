/**
 * Sync .env to Cloudflare using the REST API (no Wrangler).
 *
 * 1) Worker runtime secrets — PUT /accounts/{id}/workers/scripts/{name}/secrets (per key)
 * 2) Workers Builds — PATCH .../builds/triggers/{uuid}/environment_variables (per trigger)
 * 3) Workers Builds trigger commands — PATCH .../builds/triggers/{uuid} (build_command, deploy_command from workers-builds.json)
 *
 * Docs:
 * - https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/secrets/methods/update/
 * - https://developers.cloudflare.com/api/resources/workers_builds/subresources/triggers/subresources/environment_variables/methods/upsert/
 * - https://developers.cloudflare.com/api/resources/workers_builds/subresources/triggers/methods/update/
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... pnpm run cf:api:sync
 *   pnpm run cf:api:sync -- --worker-secrets-only
 *   pnpm run cf:api:sync -- --build-env-only
 *   pnpm run cf:api:sync -- --sync-trigger-commands
 *   pnpm run cf:api:sync -- --trigger-commands-only
 *   pnpm run cf:api:sync -- --dry-run
 *
 * Optional .env:
 *   CLOUDFLARE_TRIGGER_UUID — skip auto-detect (production trigger)
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(root, ".env") });

const API = "https://api.cloudflare.com/client/v4";

const WORKER_SECRET_KEYS = [
  "GITHUB_TOKEN",
  "GITHUB_PERSONAL_ACCESS_TOKEN",
  "SANITY_API_READ_TOKEN",
  "SENTRY_DSN",
];

/** Astro / CI build vars for Workers Builds (key -> is_secret for PATCH body). */
const BUILD_ENV_KEYS = {
  PUBLIC_SANITY_PROJECT_ID: false,
  PUBLIC_SANITY_DATASET: false,
  SANITY_STUDIO_PREVIEW_URL: false,
  PUBLIC_SANITY_STUDIO_URL: false,
  PUBLIC_SANITY_PREVIEW_URL: false,
  PUBLIC_SANITY_VISUAL_EDITING_ENABLED: false,
  SANITY_API_READ_TOKEN: true,
  SANITY_ALLOW_BUILD_FALLBACK: false,
  GITHUB_TOKEN: true,
  GITHUB_PERSONAL_ACCESS_TOKEN: true,
  PUBLIC_SENTRY_DSN: false,
  SENTRY_ORG: false,
  SENTRY_PROJECT: false,
  SENTRY_AUTH_TOKEN: true,
  PUBLIC_CLOUDFLARE_IMAGE_BASE: false,
};

function parseArgs() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`Usage: pnpm run cf:api:sync [options]

Sync .env to Cloudflare via REST (Worker secrets + Workers Builds trigger env).
Optionally PATCH Workers Builds build/deploy commands from workers-builds.json.

Environment:
  CLOUDFLARE_API_TOKEN     Required for real sync (Workers Scripts Write + Workers CI Write)
  CLOUDFLARE_ACCOUNT_ID    Optional; defaults to first account from /accounts
  CLOUDFLARE_TRIGGER_UUID  Optional; defaults to trigger whose branch_includes contains "main"

  --dry-run                  Print actions without calling the API (token optional if CLOUDFLARE_ACCOUNT_ID is set)
  --sync-trigger-commands  Also PATCH trigger build_command / deploy_command from workers-builds.json
  --trigger-commands-only  Only PATCH trigger commands (no secrets, no build env)
`);
    process.exit(0);
  }
  return {
    dryRun: argv.includes("--dry-run"),
    workerSecretsOnly: argv.includes("--worker-secrets-only"),
    buildEnvOnly: argv.includes("--build-env-only"),
    syncTriggerCommands: argv.includes("--sync-trigger-commands"),
    triggerCommandsOnly: argv.includes("--trigger-commands-only"),
    all:
      !argv.includes("--worker-secrets-only") &&
      !argv.includes("--build-env-only") &&
      !argv.includes("--trigger-commands-only"),
  };
}

function loadWranglerName() {
  const raw = readFileSync(join(root, "wrangler.jsonc"), "utf8");
  const m = /"name"\s*:\s*"([^"]+)"/.exec(raw);
  return m ? m[1] : "tulio-personal-website";
}

async function cfFetch(token, path, init = {}) {
  const method = init.method ?? "GET";
  const headers = {
    Authorization: `Bearer ${token}`,
    ...init.headers,
  };
  if (method !== "GET" && init.body) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const msg = json.errors?.map((e) => e.message).join("; ") || res.statusText;
    throw new Error(`${method} ${path} → ${res.status}: ${msg}`);
  }
  return json;
}

async function resolveAccountId(token, dryRun) {
  const fromEnv = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  if (fromEnv) return fromEnv;
  if (dryRun && !token) {
    console.warn(
      "Dry-run: no CLOUDFLARE_ACCOUNT_ID — using placeholder account id for log paths only.",
    );
    return "dry-run-account-id";
  }
  if (!token) {
    throw new Error("Set CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN to resolve account.");
  }
  const j = await cfFetch(token, "/accounts");
  const accounts = j.result;
  if (!accounts?.length)
    throw new Error("No Cloudflare accounts returned. Set CLOUDFLARE_ACCOUNT_ID in .env.");
  if (accounts.length > 1) {
    console.warn(
      `Multiple accounts (${accounts.length}); using first: ${accounts[0].name}. Set CLOUDFLARE_ACCOUNT_ID to pick another.`,
    );
  }
  return accounts[0].id;
}

async function putWorkerSecrets(token, accountId, scriptName, dryRun) {
  const payload = {};
  for (const key of WORKER_SECRET_KEYS) {
    const v = process.env[key];
    if (v && String(v).trim()) payload[key] = v;
  }
  if (Object.keys(payload).length === 0) {
    console.warn(
      "Skipping Worker secrets: no GITHUB_*, SANITY_API_READ_TOKEN, or SENTRY_DSN in .env.",
    );
    return;
  }

  console.log(`Worker secrets (REST): ${Object.keys(payload).join(", ")}`);

  for (const [name, text] of Object.entries(payload)) {
    const path = `/accounts/${accountId}/workers/scripts/${encodeURIComponent(scriptName)}/secrets`;
    const body = JSON.stringify({ name, text, type: "secret_text" });
    if (dryRun) {
      console.log(`[dry-run] PUT ${path} name=${name}`);
      continue;
    }
    await cfFetch(token, path, { method: "PUT", body });
    console.log(`  OK ${name}`);
  }

  if (!payload.SANITY_API_READ_TOKEN) {
    console.warn(
      "⚠️  SANITY_API_READ_TOKEN missing — /api/github.json may not load Sanity featured repos.",
    );
  }
}

async function pickTriggerUuid(token, accountId, externalScriptId, dryRun) {
  const preset = process.env.CLOUDFLARE_TRIGGER_UUID?.trim();
  if (preset) {
    console.log(`Using CLOUDFLARE_TRIGGER_UUID=${preset}`);
    return preset;
  }
  const path = `/accounts/${accountId}/builds/workers/${encodeURIComponent(externalScriptId)}/triggers`;
  if (dryRun && !token) {
    console.log(`[dry-run] GET ${path} (would pick trigger with branch_includes: main)`);
    return "00000000-0000-0000-0000-000000000001";
  }
  if (dryRun) {
    console.log(`[dry-run] GET ${path} (to pick trigger)`);
    return "00000000-0000-0000-0000-000000000000";
  }
  const j = await cfFetch(token, path);
  const triggers = j.result ?? [];
  if (!triggers.length) {
    throw new Error(
      `No Workers Builds triggers for script "${externalScriptId}". Connect Git in the dashboard or set CLOUDFLARE_TRIGGER_UUID.`,
    );
  }
  const main =
    triggers.find((t) => Array.isArray(t.branch_includes) && t.branch_includes.includes("main")) ??
    triggers[0];
  console.log(`Using trigger "${main.trigger_name}" (${main.trigger_uuid})`);
  return main.trigger_uuid;
}

function loadWorkersBuildsCommands() {
  const path = join(root, "workers-builds.json");
  const raw = readFileSync(path, "utf8");
  const config = JSON.parse(raw);
  const body = {};
  if (typeof config.build_command === "string" && config.build_command.trim()) {
    body.build_command = config.build_command.trim();
  }
  if (typeof config.deploy_command === "string" && config.deploy_command.trim()) {
    body.deploy_command = config.deploy_command.trim();
  }
  if (Object.keys(body).length === 0) {
    throw new Error(
      `workers-builds.json must set at least one of build_command, deploy_command (${path})`,
    );
  }
  return body;
}

async function patchTriggerCommands(token, accountId, triggerUuid, dryRun) {
  const body = loadWorkersBuildsCommands();
  console.log(`Workers Builds trigger commands (REST): ${Object.keys(body).join(", ")}`);
  const path = `/accounts/${accountId}/builds/triggers/${triggerUuid}`;
  if (dryRun) {
    console.log(`[dry-run] PATCH ${path}`);
    console.log(JSON.stringify(body, null, 2));
    return;
  }
  await cfFetch(token, path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  console.log("  OK trigger build/deploy commands updated");
}

async function patchBuildEnv(token, accountId, triggerUuid, dryRun) {
  const bodyObj = {};
  for (const [key, isSecret] of Object.entries(BUILD_ENV_KEYS)) {
    const v = process.env[key];
    if (v === undefined || v === null || String(v).trim() === "") continue;
    bodyObj[key] = { is_secret: isSecret, value: v };
  }
  if (Object.keys(bodyObj).length === 0) {
    console.warn(
      "Skipping build env: no matching keys in .env (see BUILD_ENV_KEYS in cloudflare-api-sync.mjs).",
    );
    return;
  }

  console.log(`Workers Builds env (REST): ${Object.keys(bodyObj).join(", ")}`);

  const path = `/accounts/${accountId}/builds/triggers/${triggerUuid}/environment_variables`;
  if (dryRun) {
    console.log(`[dry-run] PATCH ${path}`);
    const redacted = Object.fromEntries(
      Object.entries(bodyObj).map(([k, v]) => [
        k,
        v.is_secret ? { ...v, value: `*** (${String(v.value).length} chars)` } : v,
      ]),
    );
    console.log(JSON.stringify(redacted, null, 2));
    return;
  }
  await cfFetch(token, path, {
    method: "PATCH",
    body: JSON.stringify(bodyObj),
  });
  console.log("  OK build environment variables upserted");
}

async function main() {
  const { dryRun, workerSecretsOnly, buildEnvOnly, all, syncTriggerCommands, triggerCommandsOnly } =
    parseArgs();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();

  if (!token && !dryRun) {
    console.error(
      "Set CLOUDFLARE_API_TOKEN (Workers Scripts Write + Workers CI Write permissions), or use --dry-run.",
    );
    process.exit(1);
  }

  const scriptName = loadWranglerName();
  const accountId = await resolveAccountId(token, dryRun);
  console.log(`Account ${accountId}, Worker script "${scriptName}"${dryRun ? " (dry-run)" : ""}`);

  const doWorker = all || workerSecretsOnly;
  const doBuild = all || buildEnvOnly;
  const doTriggerCommands = triggerCommandsOnly || syncTriggerCommands;

  if (triggerCommandsOnly) {
    const triggerUuid = await pickTriggerUuid(token, accountId, scriptName, dryRun);
    await patchTriggerCommands(token, accountId, triggerUuid, dryRun);
    return;
  }

  if (doWorker) {
    await putWorkerSecrets(token, accountId, scriptName, dryRun);
  }
  if (doBuild) {
    const triggerUuid = await pickTriggerUuid(token, accountId, scriptName, dryRun);
    if (doTriggerCommands) {
      await patchTriggerCommands(token, accountId, triggerUuid, dryRun);
    }
    await patchBuildEnv(token, accountId, triggerUuid, dryRun);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
