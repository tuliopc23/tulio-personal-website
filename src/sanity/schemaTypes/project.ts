import { ProjectsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { PROJECT_CATEGORIES } from "../project-categories";

const STATUS_OPTIONS = [
  { title: "Live", value: "Live" },
  { title: "Maintained", value: "Maintained" },
  { title: "Exploration", value: "Exploration" },
];

export default defineType({
  name: "project",
  title: "Project",
  icon: ProjectsIcon,
  type: "document",
  fieldsets: [
    {
      name: "meta",
      title: "Project Info",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "media",
      title: "Media",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "taxonomy",
      title: "Taxonomy",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "technical",
      title: "Technical (Studio Reference)",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      fieldset: "meta",

      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "meta",

      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      fieldset: "meta",

      description: 'Your role on this project, e.g. "Creator & UI Engineer"',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      fieldset: "meta",

      rows: 3,
      description: "Card lede — aim for 1–2 sentences, max 160 characters.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      fieldset: "meta",

      options: {
        list: STATUS_OPTIONS,
        layout: "radio",
      },
      initialValue: "Live",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "External URL",
      type: "url",
      fieldset: "meta",

      description: "Link to the live project, GitHub repo, or case study.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cta",
      title: "CTA Label",
      type: "string",
      fieldset: "meta",

      description: 'Call-to-action text, e.g. "Explore LiqUIdify"',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
      fieldset: "meta",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      fieldset: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required().min(8),
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      fieldset: "taxonomy",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      options: {
        list: PROJECT_CATEGORIES.map(({ title, value }) => ({ title, value })),
      },
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({
      name: "stack",
      title: "Tech Stack",
      type: "array",
      fieldset: "technical",
      description: "Technologies used — shown as tags on the public case study card.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      fieldset: "technical",
      description: "Lower numbers appear first. Leave empty to sort by release date.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "role",
      media: "coverImage",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title: title ?? "Untitled project",
        subtitle: [subtitle, status].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
