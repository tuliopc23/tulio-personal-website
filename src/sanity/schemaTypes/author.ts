import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [],
          },
        },
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({
          name: "github",
          title: "GitHub",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["https"] }),
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["https"] }),
        }),
        defineField({
          name: "twitter",
          title: "Twitter / X",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["https"] }),
        }),
        defineField({
          name: "website",
          title: "Website",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "avatar",
    },
  },
});
