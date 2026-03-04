import { defineCliConfig } from "sanity/cli";

const projectId = "61249gtj";
const dataset = "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "qbnqb39xqbiz33sj64t4z6sj",
    autoUpdates: true,
  },
  typegen: {
    enabled: true,
    path: "./src/**/*.{ts,tsx,astro}",
    schema: "schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});
