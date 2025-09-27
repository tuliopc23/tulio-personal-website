import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "");
const projectId =
  env.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? "61249gtj";
const dataset =
  env.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? "production";
const token = env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_READ_TOKEN;
const hostedStudioUrl =
  env.PUBLIC_SANITY_STUDIO_URL ?? process.env.PUBLIC_SANITY_STUDIO_URL ?? "/studio";
const visualEditingEnabled =
  (env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED ??
    process.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED) === "true";
const isDev = mode !== "production";

const sanityOptions = {
  projectId: projectId ?? "",
  dataset: dataset ?? "",
  useCdn: false,
  apiVersion: "2025-01-01",
};

if (token) {
  sanityOptions.token = token;
}

if (isDev) {
  sanityOptions.studioBasePath = "/studio";
}

if (visualEditingEnabled || isDev) {
  sanityOptions.stega = {
    studioUrl: hostedStudioUrl,
  };
}

// https://docs.astro.build
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), react(), sanity(sanityOptions)],
  vite: {
    css: { devSourcemap: true },
    resolve: {
      alias: {
        "styled-components$": fileURLToPath(
          new URL("./src/utils/styled-components-shim.ts", import.meta.url)
        ),
      },
    },
    ssr: {
      noExternal: ["@sanity/code-input", "styled-components"],
      resolve: {
        alias: {
          "styled-components$": fileURLToPath(
            new URL("./src/utils/styled-components-shim.ts", import.meta.url)
          ),
        },
      },
    },
  },
});
