import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "");
const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const isDev = mode !== "production";

const sanityOptions = {
  projectId: projectId ?? "",
  dataset: dataset ?? "",
  useCdn: false,
  apiVersion: "2025-01-01",
};

if (isDev) {
  sanityOptions.studioBasePath = "/studio";
  sanityOptions.stega = {
    studioUrl: "/studio",
  };
}

// https://docs.astro.build
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), react(), sanity(sanityOptions)],
  vite: {
    css: { devSourcemap: true },
  },
});
