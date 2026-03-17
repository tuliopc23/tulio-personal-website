import { TagIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fieldsets: [
    { name: "identity", title: "Identity", options: { collapsible: true, collapsed: false } },
    {
      name: "editorial",
      title: "Editorial Positioning",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      fieldset: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "identity",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      fieldset: "editorial",
      rows: 3,
    }),
    defineField({
      name: "positioning",
      title: "Positioning",
      type: "text",
      fieldset: "editorial",
      rows: 3,
      validation: (rule) => rule.max(260),
    }),
    defineField({
      name: "canonicalTags",
      title: "Canonical Tags",
      type: "array",
      fieldset: "editorial",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "archiveIntro",
      title: "Archive Intro",
      type: "text",
      fieldset: "editorial",
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
