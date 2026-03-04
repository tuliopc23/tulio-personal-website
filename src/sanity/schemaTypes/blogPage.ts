import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "pageDescription",
      title: "Page Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(40).max(220),
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroLede",
      title: "Hero Lede",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emptyStateTitle",
      title: "Empty State Title",
      type: "string",
      initialValue: "No posts yet",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emptyStateBody",
      title: "Empty State Body",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialDirectionHeading",
      title: "Editorial Direction Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialDirectionLede",
      title: "Editorial Direction Lede",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pillars",
      title: "Editorial Pillars",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(6),
    }),
    defineField({
      name: "archiveHeading",
      title: "Archive Heading",
      type: "string",
      initialValue: "Archive Overview",
    }),
    defineField({
      name: "archiveLede",
      title: "Archive Lede",
      type: "text",
      rows: 2,
      initialValue: "A year-by-year snapshot of published articles and output cadence.",
    }),
    defineField({
      name: "allArticlesLabel",
      title: "All Articles Filter Label",
      type: "string",
      initialValue: "All articles",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "loadOlderLabel",
      title: "Load Older Label",
      type: "string",
      initialValue: "Load older articles",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "filterEmptyState",
      title: "Filter Empty State",
      type: "string",
      initialValue: "No articles match this filter yet. Try another tag or check back soon.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "spotlightTags",
      title: "Spotlight Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: "placeholderCards",
      title: "Placeholder Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "summary",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              type: "string",
              initialValue: "/blog/",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tags",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.max(4),
            }),
          ],
          preview: { select: { title: "title", subtitle: "summary" } },
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { title: "heroTitle", subtitle: "pageDescription" },
  },
});
