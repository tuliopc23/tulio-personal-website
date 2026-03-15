import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fieldsets: [
    { name: "identity", title: "Identity", options: { collapsible: true, collapsed: false } },
    { name: "profile", title: "Profile", options: { collapsible: true, collapsed: false } },
    { name: "links", title: "Links", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      fieldset: "identity",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "identity",
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
      fieldset: "profile",
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
      fieldset: "profile",
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
      fieldset: "links",
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
