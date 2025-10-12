import mdx from "@astrojs/mdx";
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";

const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";

const sanityOptions = {
  projectId: DEFAULT_PROJECT_ID,
  dataset: DEFAULT_DATASET,
  useCdn: true,
  apiVersion: "2025-01-01",
};

export default defineConfig({
  site: "https://www.tuliocunha.dev",
  integrations: [mdx(), sanity(sanityOptions)],
});
