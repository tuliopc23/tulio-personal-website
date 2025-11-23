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
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(280),
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
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: TAG_OPTIONS,
      },
      description:
        "Tags will be automatically generated based on your article content when you create or update this post.",
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured Article",
      type: "boolean",
      initialValue: false,
    }),

    // Scheduling & Publishing Options
    defineField({
      name: "scheduledPublishAt",
      title: "Schedule Publish",
      type: "datetime",
      description:
        "Optional: Schedule this article to be published at a specific date/time. Leave empty to publish immediately.",
    }),

    // Cross-posting Configuration
    defineField({
      name: "crossposting",
      title: "Cross-posting Settings",
      type: "object",
      description: "Configure automatic cross-posting to external platforms",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "devto",
          title: "Dev.to",
          type: "object",
          fields: [
            defineField({
              name: "enabled",
              title: "Enable Dev.to Publishing",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "articleId",
              title: "Dev.to Article ID",
              type: "number",
              description: "Automatically set after first publish. Do not edit manually.",
              readOnly: true,
            }),
            defineField({
              name: "url",
              title: "Dev.to URL",
              type: "url",
              description: "Link to published article on Dev.to",
              readOnly: true,
            }),
            defineField({
              name: "lastSyncedAt",
              title: "Last Synced",
              type: "datetime",
              readOnly: true,
            }),
          ],
        }),
        defineField({
          name: "hashnode",
          title: "Hashnode",
          type: "object",
          fields: [
            defineField({
              name: "enabled",
              title: "Enable Hashnode Publishing",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "publicationId",
              title: "Hashnode Publication ID",
              type: "string",
              description: "Your Hashnode publication/blog ID",
            }),
            defineField({
              name: "postId",
              title: "Hashnode Post ID",
              type: "string",
              description: "Automatically set after first publish. Do not edit manually.",
              readOnly: true,
            }),
            defineField({
              name: "url",
              title: "Hashnode URL",
              type: "url",
              description: "Link to published article on Hashnode",
              readOnly: true,
            }),
            defineField({
              name: "lastSyncedAt",
              title: "Last Synced",
              type: "datetime",
              readOnly: true,
            }),
          ],
        }),
      ],
    }),

    // Analytics
    defineField({
      name: "analytics",
      title: "Analytics",
      type: "object",
      description: "Article performance metrics",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "views",
          title: "Page Views",
          type: "number",
          initialValue: 0,
          readOnly: true,
        }),
        defineField({
          name: "uniqueVisitors",
          title: "Unique Visitors",
          type: "number",
          initialValue: 0,
          readOnly: true,
        }),
        defineField({
          name: "averageReadTime",
          title: "Average Read Time (seconds)",
          type: "number",
          readOnly: true,
        }),
        defineField({
          name: "shares",
          title: "Social Shares",
          type: "object",
          fields: [
            defineField({
              name: "twitter",
              title: "Twitter/X",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "linkedin",
              title: "LinkedIn",
              type: "number",
              initialValue: 0,
            }),
            defineField({
              name: "facebook",
              title: "Facebook",
              type: "number",
              initialValue: 0,
            }),
          ],
        }),
        defineField({
          name: "lastUpdatedAt",
          title: "Analytics Last Updated",
          type: "datetime",
          readOnly: true,
        }),
      ],
    }),

    defineField({
      name: "markdownContent",
      title: "Markdown Content (Alternative)",
      type: "markdown",
      description:
        "Write your article in Markdown. This is an alternative to the rich text editor below.",
      options: {
        imageUrl: (imageAsset) => `${imageAsset.url}?w=800&fit=max`,
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const markdownContent = value;
          const doc = context.document as { content?: unknown[] };
          const richTextContent = doc?.content;

          // If neither field has content, return error
          if (!markdownContent && (!richTextContent || richTextContent.length === 0)) {
            return "Either Markdown Content or Rich Text Content is required";
          }

          return true;
        }),
    }),
    defineField({
      name: "content",
      title: "Content (Rich Text)",
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
                    validation: (rule) => rule.required(),
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
              validation: (rule) => rule.required(),
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
      validation: (rule) =>
        rule.custom((value, context) => {
          const richTextContent = value;
          const doc = context.document as { markdownContent?: string };
          const markdownContent = doc?.markdownContent;

          // If neither field has content, return error
          if (!markdownContent && (!richTextContent || richTextContent.length === 0)) {
            return "Either Markdown Content or Rich Text Content is required";
          }

          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "summary",
      media: "heroImage",
      date: "publishedAt",
      featured: "featured",
    },
    prepare(selection) {
      const { title, subtitle, media, date, featured } = selection;
      const featuredEmoji = featured ? "⭐ " : "";

      return {
        title: `${featuredEmoji}${title ?? "Untitled"}`,
        subtitle: date ? `${new Date(date).toLocaleDateString()} — ${subtitle ?? ""}` : subtitle,
        media,
      };
    },
  },
});
