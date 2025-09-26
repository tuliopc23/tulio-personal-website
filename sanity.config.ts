import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";

import { schemaTypes } from "./src/sanity/schemaTypes";
import { resolve } from "./src/sanity/lib/resolve";

const defaultPreviewUrl =
  process.env.PUBLIC_SANITY_PREVIEW_URL ?? "http://localhost:4321";

if (!process.env.PUBLIC_SANITY_PROJECT_ID || !process.env.PUBLIC_SANITY_DATASET) {
  console.warn(
    "Sanity environment variables PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET are not set. Studio may fail to load."
  );
}

export default defineConfig({
  name: "tulio-personal-website",
  title: "Tulio Personal Website Studio",
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.PUBLIC_SANITY_DATASET ?? "",
  basePath: "/studio",
  plugins: [
    structureTool(),
    presentationTool({
      resolve,
      previewUrl:
        typeof window === "undefined" || typeof location === "undefined"
          ? defaultPreviewUrl
          : location.origin,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
