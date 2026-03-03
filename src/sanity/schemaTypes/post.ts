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
  fieldsets: [
    {
      name: "editorial",
      title: "Editorial Framing",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "publication",
      title: "Publication",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "workflow",
      title: "Workflow",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "distribution",
      title: "Distribution",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "metrics",
      title: "Performance Metrics",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      fieldset: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "editorial",
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
      fieldset: "editorial",
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "hook",
      title: "Card Hook",
      type: "string",
      fieldset: "editorial",
      description:
        "Optional short teaser line used in editorial cards and featured sections.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      fieldset: "publication",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      fieldset: "publication",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      fieldset: "publication",
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
      fieldset: "editorial",
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
      fieldset: "distribution",
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      fieldset: "publication",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured Article",
      type: "boolean",
      fieldset: "publication",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Workflow Status",
      type: "workflowStatus",
      fieldset: "workflow",
      initialValue: "draft",
      description: "Used by custom Studio actions to manage review and publishing flow.",
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Last Reviewed",
      type: "datetime",
      fieldset: "workflow",
      readOnly: true,
    }),
    defineField({
      name: "approvedAt",
      title: "Approved At",
      type: "datetime",
      fieldset: "workflow",
      readOnly: true,
    }),
    defineField({
      name: "keyTakeaways",
      title: "Key Takeaways",
      type: "array",
      fieldset: "editorial",
      description: "Optional key bullets highlighted at the top of the article.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.max(180),
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "coverVariant",
      title: "Cover Variant",
      type: "string",
      fieldset: "editorial",
      initialValue: "default",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Cinematic", value: "cinematic" },
          { title: "Minimal", value: "minimal" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "series",
      title: "Series",
      type: "string",
      fieldset: "editorial",
      description: "Optional series name for grouped editorial publishing.",
      validation: (rule) => rule.max(80),
    }),

    // Scheduling & Publishing Options
    defineField({
      name: "scheduledPublishAt",
      title: "Schedule Publish",
      type: "datetime",
      fieldset: "workflow",
      description:
        "Optional: Schedule this article to be published at a specific date/time. Leave empty to publish immediately.",
    }),

    // Cross-posting Configuration
    defineField({
      name: "crossposting",
      title: "Cross-posting Settings",
      type: "object",
      fieldset: "distribution",
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
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "object",
          fields: [
            defineField({
              name: "enabled",
              title: "Enable LinkedIn Publishing",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "postId",
              title: "LinkedIn Post ID",
              type: "string",
              description: "Automatically set after first publish. Do not edit manually.",
              readOnly: true,
            }),
            defineField({
              name: "url",
              title: "LinkedIn URL",
              type: "url",
              description: "Link to published article on LinkedIn",
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
      fieldset: "metrics",
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
      fieldset: "editorial",
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
      fieldset: "editorial",
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
      status: "status",
      series: "series",
      coverVariant: "coverVariant",
    },
    prepare(selection) {
      const { title, subtitle, media, date, featured, status, series, coverVariant } = selection;
      const featuredEmoji = featured ? "⭐ " : "";
      const statusLabel =
        status === "in-review"
          ? "In review"
          : status === "approved"
            ? "Approved"
            : status === "published"
              ? "Published"
              : status === "archived"
                ? "Archived"
                : "Draft";
      const seriesLabel = series ? `Series: ${series}` : null;
      const variantLabel =
        coverVariant && coverVariant !== "default"
          ? `Cover: ${coverVariant}`
          : null;
      const meta = [statusLabel, seriesLabel, variantLabel].filter(Boolean).join(" · ");

      return {
        title: `${featuredEmoji}${title ?? "Untitled"}`,
        subtitle: date
          ? `${new Date(date).toLocaleDateString()} · ${meta}${subtitle ? ` — ${subtitle}` : ""}`
          : `${meta}${subtitle ? ` — ${subtitle}` : ""}`,
        media,
      };
    },
  },
});
