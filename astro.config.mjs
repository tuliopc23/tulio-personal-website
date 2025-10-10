import mdx from "@astrojs/mdx";
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "");
const projectId =
  env.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? "61249gtj";
const dataset = env.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? "production";
const token = env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_READ_TOKEN;

const sanityOptions = {
  projectId: projectId ?? "",
  dataset: dataset ?? "",
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
