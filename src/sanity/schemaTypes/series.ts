import { StackCompactIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "series",
  title: "Series",
  type: "document",
  icon: StackCompactIcon,
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "positioning", title: "Positioning" },
    { name: "links", title: "Connected Posts" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required().max(120),
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
      name: "positioning",
      title: "Positioning",
      type: "string",
      group: "positioning",
      description: "How this series should feel and what makes it distinct.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "positioning",
      validation: (rule) => rule.required().min(50).max(420),
    }),
    defineField({
      name: "order",
      title: "Series Order",
      type: "number",
      group: "positioning",
      description: "Lower numbers sort first in admin lists.",
    }),
    defineField({
      name: "canonicalCta",
      title: "Canonical CTA",
      type: "string",
      group: "positioning",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      group: "links",
      of: [defineArrayMember({ type: "reference", to: [{ type: "post" }] })],
      validation: (rule) => rule.max(20),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "positioning",
    },
  },
});
