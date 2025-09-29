import "dotenv/config";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { codeInput } from "@sanity/code-input";

import { schemaTypes } from "./src/sanity/schemaTypes";
import { resolve } from "./src/sanity/lib/resolve";

const env = typeof process !== "undefined" && process?.env ? process.env : {};

const defaultPreviewUrl =
  env.SANITY_STUDIO_PREVIEW_URL ??
  env.PUBLIC_SANITY_PREVIEW_URL ??
  "http://localhost:4321";

const projectId =
  env.SANITY_STUDIO_PROJECT_ID ?? env.PUBLIC_SANITY_PROJECT_ID ?? "61249gtj";
const dataset = env.SANITY_STUDIO_DATASET ?? env.PUBLIC_SANITY_DATASET ?? "production";

if (!projectId || !dataset) {
  console.warn(
    "Sanity environment variables PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET are not set. Studio may fail to load."
  );
}

export default defineConfig({
  name: "tulio-personal-website",
  title: "Tulio Personal Website Studio",
  projectId,
  dataset,
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
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  },
});
