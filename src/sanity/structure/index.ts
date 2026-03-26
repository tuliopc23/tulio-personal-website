import {
  CalendarIcon,
  CheckmarkCircleIcon,
  ClockIcon,
  CogIcon,
  ComposeIcon,
  DocumentTextIcon,
  FolderIcon,
  ProjectsIcon,
  SearchIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
} from "@sanity/icons";
import type { StructureBuilder } from "sanity/structure";

const SINGLETONS = ["blogPage", "projectsPage", "aboutPage", "nowPage"] as const;
const MANAGED_TYPES = [
  "post",
  "contentBrief",
  "sourceReference",
  "series",
  "topic",
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
                .title("Planning & Pipeline")
                .icon(ComposeIcon)
                .child(
                  S.list()
                    .title("Planning & Pipeline")
                    .items([
                      S.listItem()
                        .title("Content Briefs")
                        .icon(ComposeIcon)
                        .child(
                          S.documentTypeList("contentBrief")
                            .title("Content Briefs")
                            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                        ),
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
                        .title("Approved")
                        .icon(CheckmarkCircleIcon)
                        .child(
                          S.documentList()
                            .title("Approved")
                            .filter('_type == "post" && status == "approved"'),
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
                        .title("Archived")
                        .icon(FolderIcon)
                        .child(
                          S.documentList()
                            .title("Archived")
                            .filter('_type == "post" && status == "archived"'),
                        ),
                    ]),
                ),
              S.listItem()
                .title("Editorial Checks")
                .icon(SparklesIcon)
                .child(
                  S.list()
                    .title("Editorial Checks")
                    .items([
                      S.listItem()
                        .title("Ready To Publish")
                        .icon(CheckmarkCircleIcon)
                        .child(
                          S.documentList()
                            .title("Ready To Publish")
                            .filter(
                              '_type == "post" && status in ["approved", "published"] && defined(summary)&& defined(heroImage.asset) && defined(heroImage.alt) && defined(seo.metaTitle) && defined(seo.metaDescription) && defined(seo.socialImage.asset)',
                            ),
                        ),
                      S.listItem()
                        .title("Needs SEO")
                        .icon(CogIcon)
                        .child(
                          S.documentList()
                            .title("Needs SEO")
                            .filter(
                              '_type == "post" && status != "archived" && (!defined(seo.metaTitle) || !defined(seo.metaDescription) || !defined(seo.socialImage.asset))',
                            ),
                        ),
                      S.listItem()
                        .title("Needs Hero Media")
                        .icon(DocumentTextIcon)
                        .child(
                          S.documentList()
                            .title("Needs Hero Media")
                            .filter(
                              '_type == "post" && status != "archived" && (!defined(heroImage.asset) || !defined(heroImage.alt))',
                            ),
                        ),
                      S.listItem()
                        .title("Needs Summary")
                        .icon(DocumentTextIcon)
                        .child(
                          S.documentList()
                            .title("Needs Summary")
                            .filter('_type == "post" && status != "archived" && !defined(summary)'),
                        ),
                      S.listItem()
                        .title("Needs Takeaways")
                        .icon(DocumentTextIcon)
                        .child(
                          S.documentList()
                            .title("Needs Takeaways")
                            .filter(
                              '_type == "post" && status in ["in-review", "approved", "published"] && (!defined(keyTakeaways) || count(keyTakeaways) == 0)',
                            ),
                        ),
                      S.listItem()
                        .title("Needs Distribution")
                        .icon(SparklesIcon)
                        .child(
                          S.documentList()
                            .title("Needs Distribution")
                            .filter(
                              '_type == "post" && status in ["approved", "published"] && (!defined(distributionPackage.newsletterBlurb) || !defined(distributionPackage.shortSocialPost) || !defined(distributionPackage.ctaLabel))',
                            ),
                        ),
                      S.listItem()
                        .title("Refresh Candidates")
                        .icon(SearchIcon)
                        .child(
                          S.documentList()
                            .title("Refresh Candidates")
                            .filter(
                              '_type == "post" && status == "published" && dateTime(publishedAt) < dateTime(now()) - 60*60*24*180',
                            ),
                        ),
                    ]),
                ),
              S.listItem()
                .title("Editorial Library")
                .icon(TagIcon)
                .child(
                  S.list()
                    .title("Editorial Library")
                    .items([
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
                        .title("Posts by Topic")
                        .icon(TagIcon)
                        .child(
                          S.documentTypeList("topic")
                            .title("Topics")
                            .child((topicId) =>
                              S.documentList()
                                .title("Posts")
                                .filter('_type == "post" && $topicId in topics[]._ref')
                                .params({ topicId }),
                            ),
                        ),
                      S.listItem()
                        .title("Source References")
                        .icon(DocumentTextIcon)
                        .child(
                          S.documentTypeList("sourceReference")
                            .title("Source References")
                            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                        ),
                    ]),
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
        .title("Case Studies")
        .icon(ProjectsIcon)
        .child(
          S.list()
            .title("Case Studies")
            .items([
              S.listItem()
                .title("Case Studies")
                .icon(ProjectsIcon)
                .child(
                  S.documentTypeList("project")
                    .title("Case Studies")
                    .defaultOrdering([
                      { field: "order", direction: "asc" },
                      { field: "releaseDate", direction: "desc" },
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title("Case Studies Page")
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
                .title("Series")
                .icon(DocumentTextIcon)
                .schemaType("series")
                .child(S.documentTypeList("series").title("Series")),
              S.listItem()
                .title("Topics")
                .icon(TagIcon)
                .schemaType("topic")
                .child(S.documentTypeList("topic").title("Topics")),
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
