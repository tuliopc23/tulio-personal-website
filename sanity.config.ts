import { codeInput } from "@sanity/code-input";
import {
  CalendarIcon,
  CheckmarkCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  TagIcon,
  UserIcon,
} from "@sanity/icons";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { type StructureBuilder, structureTool } from "sanity/structure";
import { markdownSchema } from "sanity-plugin-markdown";
import {
  approveAndPublishAction,
  crosspostAction,
  scheduleAction,
  submitForReviewAction,
  unpublishAction,
} from "./src/sanity/actions";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = "61249gtj";
const dataset = "production";
const previewUrl = "https://tulio-cunha-dev.vercel.app";

export default defineConfig({
  name: "tulio-personal-website",
  title: "Tulio's Blog",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Articles")
              .icon(DocumentTextIcon)
              .child(S.documentTypeList("post").title("All Articles")),

            S.listItem()
              .title("In Review")
              .icon(ClockIcon)
              .child(
                S.documentList()
                  .title("In Review")
                  .filter('_type == "post" && status == "in-review"'),
              ),

            S.listItem()
              .title("Scheduled")
              .icon(CalendarIcon)
              .child(
                S.documentList()
                  .title("Scheduled")
                  .filter(
                    '_type == "post" && defined(scheduledPublishAt) && dateTime(scheduledPublishAt) > dateTime(now())',
                  ),
              ),

            S.divider(),

            S.listItem()
              .title("Featured Articles")
              .icon(CheckmarkCircleIcon)
              .child(
                S.documentList()
                  .title("Featured Articles")
                  .filter('_type == "post" && featured == true'),
              ),

            S.divider(),

            S.listItem()
              .title("Categories")
              .icon(TagIcon)
              .schemaType("category")
              .child(S.documentTypeList("category").title("Categories")),

            S.listItem()
              .title("Author")
              .icon(UserIcon)
              .schemaType("author")
              .child(S.documentTypeList("author").title("Author")),
          ]),
    }),
    presentationTool({
      resolve,
      previewUrl,
    }),
    codeInput(),
    markdownSchema(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      // Only add custom actions for post documents
      if (context.schemaType === "post") {
        return [
          ...prev,
          scheduleAction,
          crosspostAction,
          submitForReviewAction,
          approveAndPublishAction,
          unpublishAction,
        ];
      }
      return prev;
    },
  },
});
