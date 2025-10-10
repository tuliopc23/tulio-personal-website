import "dotenv/config";
import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";
import {
  submitForReviewAction,
  approveAndPublishAction,
  schedulePublishAction,
  unpublishAction,
} from "./src/sanity/actions";

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
                  .filter('_type == "post" && status == "draft"')
              ),
            
            S.listItem()
              .title("👀 In Review")
              .icon(() => "👀")
              .child(
                S.documentList()
                  .title("Posts In Review")
                  .filter('_type == "post" && status == "in-review"')
              ),
            
            S.listItem()
              .title("✅ Approved")
              .icon(() => "✅")
              .child(
                S.documentList()
                  .title("Approved Posts")
                  .filter('_type == "post" && status == "approved"')
              ),
            
            S.listItem()
              .title("🚀 Published")
              .icon(() => "🚀")
              .child(
                S.documentList()
                  .title("Published Posts")
                  .filter('_type == "post" && status == "published"')
              ),
            
            S.listItem()
              .title("📅 Scheduled")
              .icon(() => "📅")
              .child(
                S.documentList()
                  .title("Scheduled Posts")
                  .filter('_type == "post" && defined(scheduledPublishAt) && scheduledPublishAt > now()')
              ),
            
            S.listItem()
              .title("📦 Archived")
              .icon(() => "📦")
              .child(
                S.documentList()
                  .title("Archived Posts")
                  .filter('_type == "post" && status == "archived"')
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
        return [
          submitForReviewAction,
          approveAndPublishAction,
          schedulePublishAction,
          unpublishAction,
          ...prev,
        ];
      }
      return prev;
    },
  },
});
