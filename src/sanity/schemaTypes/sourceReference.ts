import { LinkIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "sourceReference",
  title: "Source Reference",
  type: "document",
  icon: LinkIcon,
  groups: [
    { name: "source", title: "Source", default: true },
    { name: "capture", title: "Captured Material" },
    { name: "links", title: "Connected Content" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "source",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      group: "source",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "sourceType",
      title: "Source Type",
      type: "string",
      group: "source",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "Documentation", value: "documentation" },
          { title: "Video", value: "video" },
          { title: "Paper", value: "paper" },
          { title: "Talk", value: "talk" },
          { title: "Repository", value: "repository" },
          { title: "Interview", value: "interview" },
          { title: "Dataset", value: "dataset" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author / Creator",
      type: "string",
      group: "source",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "reliability",
      title: "Reliability",
      type: "string",
      group: "source",
      options: {
        layout: "radio",
        list: [
          { title: "High", value: "high" },
          { title: "Medium", value: "medium" },
          { title: "Low", value: "low" },
        ],
      },
      initialValue: "medium",
    }),
    defineField({
      name: "confidenceNotes",
      title: "Confidence Notes",
      type: "text",
      rows: 3,
      group: "source",
    }),
    defineField({
      name: "capturedExcerpt",
      title: "Captured Excerpt",
      type: "text",
      rows: 8,
      group: "capture",
      description:
        "The key quote, excerpt, or distilled note you want close at hand while drafting.",
    }),
    defineField({
      name: "notes",
      title: "Editorial Notes",
      type: "array",
      group: "capture",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      group: "links",
      of: [defineArrayMember({ type: "reference", to: [{ type: "post" }] })],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "relatedBriefs",
      title: "Related Briefs",
      type: "array",
      group: "links",
      of: [defineArrayMember({ type: "reference", to: [{ type: "contentBrief" }] })],
      validation: (rule) => rule.max(8),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "sourceType",
    },
    prepare(selection) {
      const subtitle =
        typeof selection.subtitle === "string"
          ? selection.subtitle[0].toUpperCase() + selection.subtitle.slice(1)
          : "Reference";

      return {
        title: selection.title ?? "Untitled source",
        subtitle,
      };
    },
  },
});
