import "dotenv/config";
import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";

const env = typeof process !== "undefined" && process?.env ? process.env : {};

const defaultPreviewUrl =
  env.SANITY_STUDIO_PREVIEW_URL ?? env.PUBLIC_SANITY_PREVIEW_URL ?? "http://localhost:4321";

const projectId = env.SANITY_STUDIO_PROJECT_ID ?? env.PUBLIC_SANITY_PROJECT_ID ?? "61249gtj";
const dataset = env.SANITY_STUDIO_DATASET ?? env.PUBLIC_SANITY_DATASET ?? "production";

if (!projectId || !dataset) {
  console.warn(
    "Sanity environment variables PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET are not set. Studio may fail to load.",
  );
}

export default defineConfig({
  name: "tulio-personal-website",
  title: "Tulio Personal Website Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Posts")
              .schemaType("post")
              .child(S.documentTypeList("post").title("Posts")),
            S.divider(),
            S.listItem()
              .title("Authors")
              .schemaType("author")
              .child(S.documentTypeList("author").title("Authors")),
            S.listItem()
              .title("Categories")
              .schemaType("category")
              .child(S.documentTypeList("category").title("Categories")),
          ]),
    }),
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
