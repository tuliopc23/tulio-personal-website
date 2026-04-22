/**
 * Push Worker runtime secrets from .env to Cloudflare (wrangler secret bulk).
 * Only uploads keys used by the Worker: GITHUB_TOKEN, GITHUB_PERSONAL_ACCESS_TOKEN,
 * KEYSTATIC_*, and SENTRY_DSN.
 *
 * Usage (from repo root): pnpm run cf:secrets:push
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
  "KEYSTATIC_SECRET",
  "KEYSTATIC_GITHUB_CLIENT_ID",
  "KEYSTATIC_GITHUB_CLIENT_SECRET",
  "SENTRY_DSN",
  "SENTRY_RELEASE",
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
    "No worker secrets found in .env. Set at least one of GITHUB_TOKEN / GITHUB_PERSONAL_ACCESS_TOKEN, KEYSTATIC_*, or SENTRY_DSN.",
  );
  process.exit(1);
}

console.log(
  `Uploading ${Object.keys(payload).length} secret(s) to Worker: ${Object.keys(payload).join(", ")}`,
);

if (!payload.GITHUB_TOKEN && !payload.GITHUB_PERSONAL_ACCESS_TOKEN) {
  console.warn(
    "⚠️  GITHUB_TOKEN is not set in .env — /api/github.json may fail to load featured repos. Add it and run pnpm run cf:secrets:push again.",
  );
}

const tmp = join(tmpdir(), `wrangler-worker-secrets-${Date.now()}.json`);
writeFileSync(tmp, JSON.stringify(payload, null, 0), "utf8");

try {
  const r = spawnSync(
    "pnpm",
    ["exec", "wrangler", "secret", "bulk", tmp, "-c", join(root, "wrangler.jsonc")],
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
