import { codeInput } from "@sanity/code-input";
import {
  CalendarIcon,
  CheckmarkCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ProjectsIcon,
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
  submitForReviewAction,
  unpublishAction,
} from "./src/sanity/actions";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = "61249gtj";
const dataset = "production";
const previewUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  process.env.PUBLIC_SANITY_PREVIEW_URL ||
  "https://www.tuliocunha.dev";

const SINGLETONS = ["blogPage", "projectsPage", "aboutPage", "nowPage"] as const;
const MANAGED_TYPES = ["post", "project", "category", "author", ...SINGLETONS] as const;

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
              .title("Blog Page")
              .icon(DocumentTextIcon)
              .child(S.document().schemaType("blogPage").documentId("blogPage")),

            S.listItem()
              .title("In Review")
              .icon(ClockIcon)
              .child(
                S.documentList()
                  .title("In Review")
                  .filter('_type == "post" && status == "in-review"'),
              ),

            S.listItem()
              .title("Scheduled Drafts")
              .icon(CalendarIcon)
              .child(
                S.documentList()
                  .title("Scheduled Drafts")
                  .filter(
                    '_type == "system.release" && metadata.releaseType == "scheduled" && state == "scheduled"',
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
              .title("Projects")
              .icon(ProjectsIcon)
              .child(S.documentTypeList("project").title("Projects")),

            S.listItem()
              .title("Projects Page")
              .icon(ProjectsIcon)
              .child(S.document().schemaType("projectsPage").documentId("projectsPage")),

            S.listItem()
              .title("About Page")
              .icon(UserIcon)
              .child(S.document().schemaType("aboutPage").documentId("aboutPage")),

            S.listItem()
              .title("Now Page")
              .icon(CalendarIcon)
              .child(S.document().schemaType("nowPage").documentId("nowPage")),

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

            S.divider(),

            ...S.documentTypeListItems().filter((listItem) => {
              const id = listItem.getId();
              return !MANAGED_TYPES.includes(id as (typeof MANAGED_TYPES)[number]);
            }),
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
  releases: {
    enabled: true,
  },
  scheduledDrafts: {
    enabled: true,
  },
  document: {
    actions: (prev, context) => {
      // Only add custom actions for post documents
      if (context.schemaType === "post") {
        return [
          ...prev,
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
