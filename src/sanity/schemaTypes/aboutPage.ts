import { SparkleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: SparkleIcon,
  fieldsets: [
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    {
      name: "sections",
      title: "Editorial Sections",
      options: { collapsible: true, collapsed: false },
    },
    { name: "ops", title: "Editorial Ops", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      fieldset: "hero",
      rows: 3,
      validation: (rule) => rule.required().min(30).max(220),
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      fieldset: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      fieldset: "hero",
      validation: (rule) => rule.required().min(12).max(120),
    }),
    defineField({
      name: "heroLede",
      title: "Hero Lede",
      type: "text",
      fieldset: "hero",
      rows: 3,
      validation: (rule) => rule.required().min(40).max(320),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      description:
        "Editorial sections displayed as stacked stage-intro headings with image showcases.",
      type: "array",
      fieldset: "sections",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              description: "Phosphor icon name (e.g. sparkle, code, wrench, terminal)",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required().min(10).max(140),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required().min(40).max(600),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "eyebrow" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(8),
    }),
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
      fieldset: "ops",
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "pageIntent",
      title: "Page Intent",
      type: "text",
      rows: 3,
      fieldset: "ops",
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "changeNotes",
      title: "Change Notes",
      type: "text",
      rows: 4,
      fieldset: "ops",
      validation: (rule) => rule.max(480),
    }),
  ],
  preview: {
    select: {
      title: "heroTitle",
      subtitle: "seoDescription",
    },
  },
});
