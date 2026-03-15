import {
  CalendarIcon,
  CheckmarkCircleIcon,
  ClockIcon,
  CogIcon,
  DocumentTextIcon,
  FolderIcon,
  ProjectsIcon,
  TagIcon,
  UserIcon,
} from "@sanity/icons";
import type { StructureBuilder } from "sanity/structure";

const SINGLETONS = ["blogPage", "projectsPage", "aboutPage", "nowPage"] as const;
const MANAGED_TYPES = [
  "post",
  "project",
  "category",
  "author",
  "blockContent",
  "callout",
  "divider",
  "seo",
  "videoEmbed",
  "workflowStatus",
  ...SINGLETONS,
] as const;

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Editorial group
      S.listItem()
        .title("Editorial")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Editorial")
            .items([
              S.listItem()
                .title("All Articles")
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList("post")
                    .title("All Articles")
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("In Review")
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title("In Review")
                    .filter('_type == "post" && status == "in-review"'),
                ),
              S.listItem()
                .title("Featured Articles")
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title("Featured Articles")
                    .filter('_type == "post" && featured == true'),
                ),
              S.listItem()
                .title("Posts by Category")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("category")
                    .title("Categories")
                    .child((categoryId) =>
                      S.documentList()
                        .title("Posts")
                        .filter('_type == "post" && $categoryId in categories[]._ref')
                        .params({ categoryId }),
                    ),
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
                .title("Blog Page")
                .icon(DocumentTextIcon)
                .child(S.document().schemaType("blogPage").documentId("blogPage")),
            ]),
        ),

      S.divider(),

      // Portfolio group
      S.listItem()
        .title("Portfolio")
        .icon(ProjectsIcon)
        .child(
          S.list()
            .title("Portfolio")
            .items([
              S.listItem()
                .title("Projects")
                .icon(ProjectsIcon)
                .child(
                  S.documentTypeList("project")
                    .title("Projects")
                    .defaultOrdering([
                      { field: "order", direction: "asc" },
                      { field: "releaseDate", direction: "desc" },
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title("Projects Page")
                .icon(ProjectsIcon)
                .child(S.document().schemaType("projectsPage").documentId("projectsPage")),
            ]),
        ),

      S.divider(),

      // Pages group
      S.listItem()
        .title("Pages")
        .icon(FolderIcon)
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("About Page")
                .icon(UserIcon)
                .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
              S.listItem()
                .title("Now Page")
                .icon(CalendarIcon)
                .child(S.document().schemaType("nowPage").documentId("nowPage")),
            ]),
        ),

      S.divider(),

      // Taxonomy & Settings
      S.listItem()
        .title("Taxonomy & Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Taxonomy & Settings")
            .items([
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
        ),

      S.divider(),

      // Fallback for unmanaged types
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return !MANAGED_TYPES.includes(id as (typeof MANAGED_TYPES)[number]);
      }),
    ]);
