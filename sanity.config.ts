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

// Use SANITY_STUDIO_ prefixed variables for hosted studio
const projectId = "61249gtj";
const dataset = "production";
const previewUrl = "https://tulio-cunha-dev.vercel.app";

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
              .title("All Posts")
              .icon(() => "📄")
              .child(S.documentTypeList("post").title("All Posts")),

            S.divider(),

            S.listItem()
              .title("📝 Drafts")
              .child(
                S.documentList()
                  .title("Draft Posts")
                  .filter('_type == "post" && status == "draft"'),
              ),

            S.listItem()
              .title("👀 In Review")
              .child(
                S.documentList()
                  .title("Posts In Review")
                  .filter('_type == "post" && status == "in-review"'),
              ),

            S.listItem()
              .title("✅ Approved")
              .child(
                S.documentList()
                  .title("Approved Posts")
                  .filter('_type == "post" && status == "approved"'),
              ),

            S.listItem()
              .title("🚀 Published")
              .child(
                S.documentList()
                  .title("Published Posts")
                  .filter('_type == "post" && status == "published"'),
              ),

            S.listItem()
              .title("📦 Archived")
              .child(
                S.documentList()
                  .title("Archived Posts")
                  .filter('_type == "post" && status == "archived"'),
              ),

            S.divider(),

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
      previewUrl,
    }),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "post") {
        return [submitForReviewAction, approveAndPublishAction, unpublishAction, ...prev];
      }
      return prev;
    },
  },
});
