import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";

const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";

const sanityOptions = {
  projectId: DEFAULT_PROJECT_ID,
  dataset: DEFAULT_DATASET,
  useCdn: true,
  apiVersion: "2025-02-19",
};

export default defineConfig({
  site: "https://www.tuliocunha.dev",
  image: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "apicdn.sanity.io" },
      { protocol: "https", hostname: "**.sanity.io" },
    ],
  },
  integrations: [mdx(), sanity(sanityOptions), solidJs()],
});
