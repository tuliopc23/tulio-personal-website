import { EarthGlobeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { EditorialStringInput, EditorialTextAreaInput } from "../components/EditorialTextInput";

export default defineType({
  name: "seo",
  title: "SEO",
  icon: EarthGlobeIcon,
  type: "object",
  description: "Search and social metadata presented across cards, feeds, and article pages.",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      components: {
        input: EditorialStringInput,
      },
      description:
        "Search title shown in results and social previews. Strongest when it adds search context without losing tone.",
      validation: (rule) => rule.max(70).warning("Keep meta titles under 70 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      components: {
        input: EditorialTextAreaInput,
      },
      description:
        "Search description used in previews. One compact sentence with a clear reader promise.",
      validation: (rule) => rule.max(160).warning("Keep descriptions under 160 characters."),
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
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
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
