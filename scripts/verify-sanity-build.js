import dotenv from "dotenv";

dotenv.config();

const apiVersion = "2025-02-19";
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_READ_TOKEN;
const visualEditingEnabled = process.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function logOk(message) {
  console.log(`✅ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function createQueryUrl({ host, query, perspective = "published" }) {
  const url = new URL(`https://${projectId}.${host}.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", perspective);
  return url;
}

async function runQuery({ host, query, perspective = "published", authToken }) {
  const url = createQueryUrl({ host, query, perspective });
  const response = await fetch(url, {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { response, payload };
}

async function main() {
  console.log("🔍 Verifying Sanity build readiness...\n");

  if (!projectId) {
    fail("PUBLIC_SANITY_PROJECT_ID is required.");
  }

  if (!dataset) {
    fail("PUBLIC_SANITY_DATASET is required.");
  }

  logOk(`Sanity project configured (${projectId}/${dataset})`);

  if (visualEditingEnabled && !token) {
    fail(
      "PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true requires SANITY_API_READ_TOKEN for draft and visual editing access.",
    );
  }

  if (visualEditingEnabled) {
    logOk("Visual editing token requirement satisfied");
  } else {
    logInfo("Visual editing is disabled; draft-token validation is optional");
  }

  const anonymousQuery = `{
    "postCount": count(*[_type == "post"]),
    "blogPageCount": count(*[_type == "blogPage"]),
    "aboutPageCount": count(*[_type == "aboutPage"]),
    "nowPageCount": count(*[_type == "nowPage"]),
    "projectsPageCount": count(*[_type == "projectsPage"])
  }`;

  const anonymousResult = await runQuery({
    host: "apicdn",
    query: anonymousQuery,
  });

  if (!anonymousResult.response.ok) {
    const status = anonymousResult.response.status;
    const statusText = anonymousResult.response.statusText;

    if ((status === 401 || status === 403) && !token) {
      fail(
        `Anonymous published-content access failed with ${status} ${statusText}. Configure SANITY_API_READ_TOKEN or make published data readable to the build.`,
      );
    }

    fail(`Published-content sanity check failed with ${status} ${statusText}.`);
  }

  logOk("Anonymous published-content query succeeded");

  const requiredSingletons = [
    ["blogPage", anonymousResult.payload?.result?.blogPageCount],
    ["aboutPage", anonymousResult.payload?.result?.aboutPageCount],
    ["nowPage", anonymousResult.payload?.result?.nowPageCount],
    ["projectsPage", anonymousResult.payload?.result?.projectsPageCount],
  ];

  const missingSingletons = requiredSingletons
    .filter(([, count]) => Number(count ?? 0) < 1)
    .map(([type]) => type);

  if (missingSingletons.length > 0) {
    fail(
      `Missing required singleton documents in Sanity: ${missingSingletons.join(", ")}. These routes cannot safely build for production.`,
    );
  }

  logOk("Required singleton documents are present");

  if (token) {
    const draftResult = await runQuery({
      host: "api",
      query: `count(*[_type == "post"])`,
      perspective: "drafts",
      authToken: token,
    });

    if (!draftResult.response.ok) {
      fail(
        `Token-backed Sanity access failed with ${draftResult.response.status} ${draftResult.response.statusText}. Check SANITY_API_READ_TOKEN permissions.`,
      );
    }

    logOk("Token-backed draft access succeeded");
  } else {
    logInfo("SANITY_API_READ_TOKEN is not set; skipping token-backed draft access check");
  }

  console.log("\n🚀 Sanity build readiness looks good.");
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  fail(`Sanity build readiness check failed: ${message}`);
}
