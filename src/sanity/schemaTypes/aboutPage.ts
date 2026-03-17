import { SparkleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: SparkleIcon,
  fieldsets: [
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    { name: "manifesto", title: "Manifesto", options: { collapsible: true, collapsed: false } },
    { name: "principles", title: "Principles", options: { collapsible: true, collapsed: false } },
    { name: "timeline", title: "Timeline", options: { collapsible: true, collapsed: false } },
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
      name: "manifestoLabel",
      title: "Manifesto Label",
      type: "string",
      fieldset: "manifesto",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "manifestoTitle",
      title: "Manifesto Title",
      type: "string",
      fieldset: "manifesto",
      validation: (rule) => rule.required().min(10).max(140),
    }),
    defineField({
      name: "manifestoCopy",
      title: "Manifesto Copy",
      type: "text",
      fieldset: "manifesto",
      rows: 4,
      validation: (rule) => rule.required().min(60).max(500),
    }),
    defineField({
      name: "proofBullets",
      title: "Proof Bullets",
      type: "array",
      fieldset: "manifesto",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2).max(6),
    }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "array",
      fieldset: "principles",
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
              name: "body",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "body" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(8),
    }),
    defineField({
      name: "timelineHeading",
      title: "Timeline Heading",
      type: "string",
      fieldset: "timeline",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timelineLede",
      title: "Timeline Lede",
      type: "text",
      fieldset: "timeline",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timelineItems",
      title: "Timeline Items",
      type: "array",
      fieldset: "timeline",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "year",
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
          preview: {
            select: { title: "title", subtitle: "year" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(10),
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
