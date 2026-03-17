import { TagIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "topic",
  title: "Topic",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "positioning", title: "Positioning" },
    { name: "archive", title: "Archive Presentation" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "identity",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      group: "positioning",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "positioning",
      title: "Positioning",
      type: "text",
      rows: 3,
      group: "positioning",
      validation: (rule) => rule.max(320),
    }),
    defineField({
      name: "seoFraming",
      title: "SEO Framing",
      type: "string",
      group: "positioning",
      description: "The search-oriented framing for this topic cluster.",
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "archive",
      validation: (rule) => rule.required().min(40).max(420),
    }),
    defineField({
      name: "archiveIntro",
      title: "Archive Intro",
      type: "text",
      rows: 4,
      group: "archive",
      validation: (rule) => rule.max(320),
    }),
    defineField({
      name: "canonicalTags",
      title: "Canonical Tags",
      type: "array",
      group: "archive",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: "accentImage",
      title: "Accent Image",
      type: "image",
      group: "archive",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.max(140),
        }),
      ],
    }),
    defineField({
      name: "featuredPostRules",
      title: "Featured Post Rules",
      type: "text",
      rows: 3,
      group: "archive",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "relatedTopics",
      title: "Related Topics",
      type: "array",
      group: "archive",
      of: [defineArrayMember({ type: "reference", to: [{ type: "topic" }] })],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "seoFraming",
      media: "accentImage",
    },
  },
});
