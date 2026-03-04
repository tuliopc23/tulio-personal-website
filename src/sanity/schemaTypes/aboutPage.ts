import { SparkleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: SparkleIcon,
  fields: [
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(30).max(220),
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
      validation: (rule) => rule.required().min(12).max(120),
    }),
    defineField({
      name: "heroLede",
      title: "Hero Lede",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(40).max(320),
    }),
    defineField({
      name: "manifestoLabel",
      title: "Manifesto Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "manifestoTitle",
      title: "Manifesto Title",
      type: "string",
      validation: (rule) => rule.required().min(10).max(140),
    }),
    defineField({
      name: "manifestoCopy",
      title: "Manifesto Copy",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(60).max(500),
    }),
    defineField({
      name: "proofBullets",
      title: "Proof Bullets",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2).max(6),
    }),
    defineField({
      name: "principles",
      title: "Principles",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timelineLede",
      title: "Timeline Lede",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timelineItems",
      title: "Timeline Items",
      type: "array",
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
  ],
  preview: {
    select: {
      title: "heroTitle",
      subtitle: "seoDescription",
    },
  },
});
