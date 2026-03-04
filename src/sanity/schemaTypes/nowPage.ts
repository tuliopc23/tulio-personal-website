import { CalendarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "nowPage",
  title: "Now Page",
  type: "document",
  icon: CalendarIcon,
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
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      options: { dateFormat: "MMMM D, YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nowItems",
      title: "Now Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: "nextItems",
      title: "Next Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: "laterItems",
      title: "Later Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: "signalsHeading",
      title: "Signals Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "signalsLede",
      title: "Signals Lede",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "executionSignals",
      title: "Execution Signals",
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
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(8),
    }),
    defineField({
      name: "githubHeading",
      title: "GitHub Heading",
      type: "string",
      initialValue: "Live GitHub Stream",
    }),
    defineField({
      name: "githubLede",
      title: "GitHub Lede",
      type: "text",
      rows: 2,
      initialValue: "Real-time commit activity across active repositories.",
    }),
  ],
  preview: {
    select: { title: "heroTitle", subtitle: "lastUpdated" },
  },
});
