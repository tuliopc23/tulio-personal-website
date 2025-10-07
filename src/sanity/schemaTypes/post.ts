import { defineArrayMember, defineField, defineType } from "sanity";

const TAG_OPTIONS = [
  { title: "Design", value: "Design" },
  { title: "Engineering", value: "Engineering" },
  { title: "Tooling", value: "Tooling" },
  { title: "Accessibility", value: "Accessibility" },
  { title: "Swift", value: "Swift" },
  { title: "Frontend", value: "Frontend" },
  { title: "Writing", value: "Writing" },
];

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(4).warning("Keep titles descriptive."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[\s\u2014]+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-{2,}/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.required().max(280).warning("Keep summaries concise (≤ 280 characters)."),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.unique().max(3).warning("Use up to 3 categories."),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
        list: TAG_OPTIONS,
      },
      validation: (rule) => rule.unique().max(6).warning("Use up to 6 tags."),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required().max(160),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
      validation: (rule) => rule.required().error("Hero image is required."),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      options: {
        collapsible: true,
        collapsed: true,
      },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value || typeof value !== "object") {
            return "Populate SEO metadata before publishing.";
          }

          const metaTitle = (value as { metaTitle?: unknown }).metaTitle;
          if (typeof metaTitle !== "string" || metaTitle.trim().length === 0) {
            return "Meta title is required.";
          }

          const metaDescription = (value as { metaDescription?: unknown }).metaDescription;
          if (typeof metaDescription !== "string" || metaDescription.trim().length === 0) {
            return "Meta description is required.";
          }

          return true;
        }),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule.required().uri({ scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) =>
                rule.required().error("Accessibility requires descriptive alt text."),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
        defineArrayMember({
          type: "code",
          options: {
            withFilename: true,
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "summary",
      media: "heroImage",
      date: "publishedAt",
    },
    prepare(selection) {
      const { title, subtitle, media, date } = selection;
      return {
        title: title ?? "Untitled post",
        subtitle: date
          ? `${new Date(date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })} — ${subtitle ?? ""}`
          : subtitle,
        media,
      };
    },
  },
});
