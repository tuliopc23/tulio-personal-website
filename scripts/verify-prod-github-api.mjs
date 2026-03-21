/**
 * Smoke-check production GET /api/github.json (Worker + secrets).
 * Usage: bun run verify:prod-github-api
 */
const URL = "https://tuliocunha.dev/api/github.json";

let res;
try {
  res = await fetch(URL, {
    headers: { Accept: "application/json" },
  });
} catch (err) {
  console.error(`❌ Failed to reach ${URL}`);
  console.error(err);
  process.exit(1);
}

const body = await res.text();
let parsed;
try {
  parsed = JSON.parse(body);
} catch {
  parsed = null;
}

if (!res.ok) {
  console.error(`❌ ${URL} → HTTP ${res.status}`);
  console.error(body.slice(0, 500));
  process.exit(1);
}

if (!Array.isArray(parsed)) {
  console.error("❌ Expected JSON array from /api/github.json");
  console.error(body.slice(0, 500));
  process.exit(1);
}

if (parsed.length === 0) {
  console.error(`❌ ${URL} returned an empty repo list`);
  process.exit(1);
}

console.log(`✅ ${URL} → HTTP ${res.status}, ${parsed.length} repo(s)`);
process.exit(0);
