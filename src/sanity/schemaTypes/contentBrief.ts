import { ComposeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { EditorialTextAreaInput } from "../components/EditorialTextInput";

export default defineType({
  name: "contentBrief",
  title: "Content Brief",
  type: "document",
  icon: ComposeIcon,
  groups: [
    { name: "strategy", title: "Strategy", default: true },
    { name: "production", title: "Production" },
    { name: "links", title: "Linked Content" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Working Title",
      type: "string",
      group: "strategy",
      validation: (rule) => rule.required().min(10).max(120),
    }),
    defineField({
      name: "status",
      title: "Brief Status",
      type: "string",
      group: "production",
      initialValue: "idea",
      options: {
        layout: "radio",
        list: [
          { title: "Idea", value: "idea" },
          { title: "Briefed", value: "briefed" },
          { title: "Drafting", value: "drafting" },
          { title: "In Review", value: "in-review" },
          { title: "Ready To Ship", value: "ready" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
      },
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      group: "strategy",
      description: "Who this piece is for and what they likely care about.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "intent",
      title: "Intent",
      type: "string",
      group: "strategy",
      description:
        "The job this content should do: teach, persuade, document, announce, or compare.",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "thesis",
      title: "Thesis",
      type: "text",
      rows: 4,
      group: "strategy",
      description: "The sharpest version of the central argument or promise.",
      components: {
        input: EditorialTextAreaInput,
      },
      validation: (rule) => rule.required().min(40).max(480),
    }),
    defineField({
      name: "targetKeyword",
      title: "Target Keyword",
      type: "string",
      group: "strategy",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "distributionGoals",
      title: "Distribution Goals",
      type: "array",
      group: "production",
      of: [defineArrayMember({ type: "string" })],
      description: "Where this should travel after publishing.",
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "dueDate",
      title: "Due Date",
      type: "date",
      group: "production",
    }),
    defineField({
      name: "notes",
      title: "Editorial Notes",
      type: "text",
      rows: 6,
      group: "production",
    }),
    defineField({
      name: "linkedPost",
      title: "Linked Post",
      type: "reference",
      group: "links",
      to: [{ type: "post" }],
    }),
    defineField({
      name: "linkedProject",
      title: "Linked Project",
      type: "reference",
      group: "links",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "linkedPage",
      title: "Linked Page",
      type: "reference",
      group: "links",
      to: [
        { type: "blogPage" },
        { type: "aboutPage" },
        { type: "nowPage" },
        { type: "projectsPage" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "status",
    },
    prepare(selection) {
      return {
        title: selection.title ?? "Untitled brief",
        subtitle: selection.subtitle ? `Status: ${selection.subtitle}` : "No status set",
      };
    },
  },
});
