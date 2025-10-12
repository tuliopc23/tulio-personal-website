import mdx from "@astrojs/mdx";
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "");
const isDevelopment = mode === "development";
const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";

const envProjectId = env.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const envDataset = env.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const projectId = envProjectId ?? DEFAULT_PROJECT_ID;
const dataset = envDataset ?? DEFAULT_DATASET;

if (!envProjectId && isDevelopment) {
  console.info(
    `[sanity] Using default PUBLIC_SANITY_PROJECT_ID (${DEFAULT_PROJECT_ID}) for local development.`,
  );
}

if (!envDataset && isDevelopment) {
  console.info(
    `[sanity] Using default PUBLIC_SANITY_DATASET (${DEFAULT_DATASET}) for local development.`,
  );
}

const token = env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_READ_TOKEN;

const sanityOptions = {
  projectId,
  dataset,
  useCdn: true,
  apiVersion: "2025-01-01",
};

if (token) {
  sanityOptions.token = token;
}

export default defineConfig({
  site: "https://www.tuliocunha.dev",
  integrations: [mdx(), sanity(sanityOptions)],
  vite: {
    define: {
      'import.meta.env.PUBLIC_SANITY_PROJECT_ID': JSON.stringify('61249gtj'),
      'import.meta.env.PUBLIC_SANITY_DATASET': JSON.stringify('production'),
      'import.meta.env.SANITY_API_READ_TOKEN': JSON.stringify('skonmkNRCv4QcFFbUz8qpZevmOZ1nyKtLvaEVWjCus0DE7t4uWMTDvVFvCAvJYDXwJS33XZmEquiJgpFgUeomPSTwtFgPGjIPfJM1GVK5ts31YH4JtqEhacMVxTHscpauyQpPWF2bWo5GMMsc6Ny054N1L1DltLysHdkblGTAUOQuYUwWZ4n'),
    },
  },
});
