import { defineCliConfig } from "sanity/cli";

const projectId = "61249gtj";
const dataset = "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "kbe07yngwqvbwgdo48my3i7q",
  },
  typegen: {
    enabled: true,
    path: "./src/**/*.{ts,tsx,astro}",
    schema: "schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});
