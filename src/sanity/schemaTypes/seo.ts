import { defineField, defineType } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      validation: (rule) => rule.max(70).warning("Keep meta titles under 70 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("Keep descriptions under 160 characters."),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      validation: (rule) => rule.uri({ allowRelative: true }),
    }),
    defineField({
      name: "socialImage",
      title: "Social image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.required().error("Social images require descriptive alt text."),
        }),
      ],
    }),
    defineField({
      name: "noIndex",
      title: "No index",
      type: "boolean",
      initialValue: false,
      description: "Set to true to exclude this post from indexing and feeds.",
    }),
    defineField({
      name: "jsonLd",
      title: "Custom JSON-LD",
      type: "code",
      options: {
        language: "json",
        withFilename: false,
      },
    }),
  ],
});
