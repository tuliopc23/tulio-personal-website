import { ProjectsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const CASE_STUDY_ICONS = [
  { title: "Desktop Tower", value: "desktop-tower" },
  { title: "Soccer Ball", value: "soccer-ball" },
  { title: "Chart Line Up", value: "chart-line-up" },
  { title: "Compass", value: "compass" },
  { title: "Code", value: "code" },
  { title: "Rocket Launch", value: "rocket-launch" },
  { title: "Briefcase", value: "briefcase" },
];

const CASE_STUDY_STATUS_OPTIONS = [
  { title: "Live", value: "live" },
  { title: "Maintained", value: "maintained" },
  { title: "Exploration", value: "exploration" },
];

export default defineType({
  name: "projectsPage",
  title: "Projects Page",
  type: "document",
  icon: ProjectsIcon,
  fieldsets: [
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    {
      name: "featured",
      title: "Featured Case Studies",
      options: { collapsible: true, collapsed: false },
    },
    { name: "empty", title: "Empty States", options: { collapsible: true, collapsed: true } },
    { name: "ops", title: "Editorial Ops", options: { collapsible: true, collapsed: true } },
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
      name: "caseStudies",
      title: "Featured Case Studies",
      type: "array",
      fieldset: "featured",
      description: "Editorial slides shown in the featured carousel at the top of the page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "caseStudy",
          title: "Case Study",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: { list: CASE_STUDY_ICONS },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: "headline",
              title: "Headline",
              type: "string",
              validation: (rule) => rule.required().max(180),
            }),
            defineField({
              name: "lede",
              title: "Lede",
              type: "text",
              rows: 5,
              validation: (rule) => rule.required().max(700),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: CASE_STUDY_STATUS_OPTIONS,
                layout: "radio",
              },
              initialValue: "live",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "External URL",
              type: "url",
            }),
            defineField({
              name: "stack",
              title: "Tech Stack",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1).max(8),
            }),
            defineField({
              name: "images",
              title: "Gallery Images",
              type: "array",
              description: "Used in the two-up showcase inside each carousel slide.",
              of: [
                defineArrayMember({
                  type: "image",
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
              ],
              validation: (rule) => rule.required().min(1).max(4),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow",
              media: "images.0",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title ?? "Untitled case study",
                subtitle: subtitle ?? "Featured case study",
                media,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.max(8),
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
    defineField({
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
      fieldset: "ops",
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "pageIntent",
      title: "Page Intent",
      type: "text",
      rows: 3,
      fieldset: "ops",
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "changeNotes",
      title: "Change Notes",
      type: "text",
      rows: 4,
      fieldset: "ops",
      validation: (rule) => rule.max(480),
    }),
  ],
  preview: {
    select: { title: "heroTitle", subtitle: "description" },
  },
});
