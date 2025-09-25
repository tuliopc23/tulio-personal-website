import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sanity from "@sanity/astro";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;

// https://docs.astro.build
export default defineConfig({
  site: "https://example.com",
  integrations: [
    mdx(),
    react(),
    sanity({
      projectId: projectId ?? "",
      dataset: dataset ?? "",
      useCdn: false,
      apiVersion: "2025-01-01",
      studioBasePath: "/studio",
      stega: {
        studioUrl: "/studio",
      },
    }),
  ],
  vite: {
    css: { devSourcemap: true },
  },
});
