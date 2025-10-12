import "dotenv/config";
import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import {
  approveAndPublishAction,
  submitForReviewAction,
  unpublishAction,
} from "./src/sanity/actions";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";

const env = typeof process !== "undefined" && process?.env ? process.env : {};
const isStudioDev = env.NODE_ENV !== "production";
const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";

const defaultPreviewUrl =
  env.SANITY_STUDIO_PREVIEW_URL ?? env.PUBLIC_SANITY_PREVIEW_URL ?? "http://localhost:4321";

const projectIdFromEnv = env.SANITY_STUDIO_PROJECT_ID ?? env.PUBLIC_SANITY_PROJECT_ID;
const datasetFromEnv = env.SANITY_STUDIO_DATASET ?? env.PUBLIC_SANITY_DATASET;

const projectId = projectIdFromEnv ?? (isStudioDev ? DEFAULT_PROJECT_ID : undefined);
const dataset = datasetFromEnv ?? (isStudioDev ? DEFAULT_DATASET : undefined);
const missingEnvMessage =
  "Sanity environment variables PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET are required. Set them (or SANITY_STUDIO_* overrides) and see README.md#environment-configuration for details.";

if (!projectIdFromEnv || !datasetFromEnv) {
  if (isStudioDev) {
    console.warn(
      `[sanity] ${missingEnvMessage} Falling back to defaults (${DEFAULT_PROJECT_ID}/${DEFAULT_DATASET}) for local Studio development.`,
    );
  } else {
    throw new Error(`[sanity] ${missingEnvMessage}`);
  }
}

if (!projectId || !dataset) {
  throw new Error(`[sanity] ${missingEnvMessage}`);
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
            // All Posts
            S.listItem()
              .title("All Posts")
              .icon(() => "📄")
              .child(S.documentTypeList("post").title("All Posts")),

            S.divider(),

            // Posts by Workflow Status
            S.listItem()
              .title("📝 Drafts")
              .icon(() => "📝")
              .child(
                S.documentList()
                  .title("Draft Posts")
                  .filter('_type == "post" && status == "draft"'),
              ),

            S.listItem()
              .title("👀 In Review")
              .icon(() => "👀")
              .child(
                S.documentList()
                  .title("Posts In Review")
                  .filter('_type == "post" && status == "in-review"'),
              ),

            S.listItem()
              .title("✅ Approved")
              .icon(() => "✅")
              .child(
                S.documentList()
                  .title("Approved Posts")
                  .filter('_type == "post" && status == "approved"'),
              ),

            S.listItem()
              .title("🚀 Published")
              .icon(() => "🚀")
              .child(
                S.documentList()
                  .title("Published Posts")
                  .filter('_type == "post" && status == "published"'),
              ),

            S.listItem()
              .title("📦 Archived")
              .icon(() => "📦")
              .child(
                S.documentList()
                  .title("Archived Posts")
                  .filter('_type == "post" && status == "archived"'),
              ),

            S.divider(),

            // Authors & Categories
            S.listItem()
              .title("Authors")
              .icon(() => "👤")
              .schemaType("author")
              .child(S.documentTypeList("author").title("Authors")),

            S.listItem()
              .title("Categories")
              .icon(() => "🏷️")
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
  document: {
    actions: (prev, context) => {
      // Only add custom actions for post documents
      if (context.schemaType === "post") {
        return [submitForReviewAction, approveAndPublishAction, unpublishAction, ...prev];
      }
      return prev;
    },
  },
});
