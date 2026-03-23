/**
 * Push Worker runtime secrets from .env to Cloudflare (wrangler secret bulk).
 * Only uploads keys used by worker/index.ts: GITHUB_TOKEN, GITHUB_PERSONAL_ACCESS_TOKEN,
 * SANITY_API_READ_TOKEN, and SENTRY_DSN.
 *
 * Usage (from repo root): bun run cf:secrets:push
 * Requires: wrangler login, and a .env with the values you want uploaded.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(root, ".env") });

const WORKER_SECRET_KEYS = [
  "GITHUB_TOKEN",
  "GITHUB_PERSONAL_ACCESS_TOKEN",
  "SANITY_API_READ_TOKEN",
  "SENTRY_DSN",
];

const payload = {};
for (const key of WORKER_SECRET_KEYS) {
  const v = process.env[key];
  if (v && String(v).trim()) {
    payload[key] = v;
  }
}

if (Object.keys(payload).length === 0) {
  console.error(
    "No worker secrets found in .env. Set at least one of GITHUB_TOKEN / GITHUB_PERSONAL_ACCESS_TOKEN, SANITY_API_READ_TOKEN, or SENTRY_DSN.",
  );
  process.exit(1);
}

console.log(`Uploading ${Object.keys(payload).length} secret(s) to Worker: ${Object.keys(payload).join(", ")}`);

if (!payload.SANITY_API_READ_TOKEN) {
  console.warn(
    "⚠️  SANITY_API_READ_TOKEN is not set in .env — /api/github.json may fail to load featured repos from Sanity. Add it and run bun run cf:secrets:push again.",
  );
}

const tmp = join(tmpdir(), `wrangler-worker-secrets-${Date.now()}.json`);
writeFileSync(tmp, JSON.stringify(payload, null, 0), "utf8");

try {
  const r = spawnSync(
    "bunx",
    ["wrangler", "secret", "bulk", tmp, "-c", join(root, "wrangler.jsonc")],
    {
      stdio: "inherit",
      cwd: root,
      shell: false,
    },
  );
  process.exit(r.status === null ? 1 : r.status);
} finally {
  try {
    unlinkSync(tmp);
  } catch {
    // ignore
  }
}
