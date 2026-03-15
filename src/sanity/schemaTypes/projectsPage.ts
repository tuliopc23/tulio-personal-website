import { ProjectsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "projectsPage",
  title: "Projects Page",
  type: "document",
  icon: ProjectsIcon,
  fieldsets: [
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    { name: "empty", title: "Empty States", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "description",
      title: "SEO Description",
      type: "text",
      fieldset: "hero",
      rows: 3,
      validation: (rule) => rule.required().min(30).max(220),
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      fieldset: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      fieldset: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroLede",
      title: "Hero Lede",
      type: "text",
      fieldset: "hero",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "filterEmptyTitle",
      title: "Filter Empty Title",
      type: "string",
      fieldset: "empty",
      initialValue: "No projects in this slice yet",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "filterEmptyBody",
      title: "Filter Empty Body",
      type: "text",
      fieldset: "empty",
      rows: 3,
      initialValue:
        "Try another track, or email if you want technical context on work that is not written up here:",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageEmptyTitle",
      title: "Page Empty Title",
      type: "string",
      fieldset: "empty",
      initialValue: "Project notes are being prepared",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageEmptyBody",
      title: "Page Empty Body",
      type: "text",
      fieldset: "empty",
      rows: 3,
      initialValue:
        "The work exists. The write-ups are catching up. Email if you want implementation details:",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      fieldset: "empty",
      initialValue: "contact@tuliocunha.dev",
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    select: { title: "heroTitle", subtitle: "description" },
  },
});
