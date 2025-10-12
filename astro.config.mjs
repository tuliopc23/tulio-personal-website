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
const projectId = envProjectId ?? (isDevelopment ? DEFAULT_PROJECT_ID : undefined);
const dataset = envDataset ?? (isDevelopment ? DEFAULT_DATASET : undefined);

if (!projectId || !dataset) {
  throw new Error(
    "Sanity environment variables PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET must be set. Local development falls back to defaults, but non-development builds require explicit values. See README.md#environment-configuration.",
  );
}

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
});
