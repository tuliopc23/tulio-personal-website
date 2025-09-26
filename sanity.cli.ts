import "dotenv/config";
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj";
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  console.warn(
    "sanity.cli.ts: PUBLIC_SANITY_PROJECT_ID is not set. CLI commands will fail until it is configured in .env."
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "po4wv44gn7xji72e47ze215u",
  },
});
