import { DocumentTextIcon } from "@sanity/icons";
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
  icon: DocumentTextIcon,
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "publication", title: "Publication" },
    { name: "seo", title: "SEO & Distribution" },
    { name: "workflow", title: "Workflow" },
    { name: "analytics", title: "Analytics" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "Clear promise-led headline, ideally 40-90 characters.",
      validation: (rule) =>
        rule
          .required()
          .min(18)
          .max(110)
          .warning("Target 40-90 chars for strong card and reader fit."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
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
      group: "content",
      rows: 3,
      description: "Card lede and SEO fallback. Aim for one concise, high-signal paragraph.",
      validation: (rule) =>
        rule
          .required()
          .min(80)
          .max(280)
          .warning("Keep summaries between 100-220 chars for better card rhythm."),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "publication",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "publication",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "publication",
      of: [{ type: "string" }],
      options: {
        list: TAG_OPTIONS,
      },
      description:
        "AI will suggest tags from your content. Use the Refresh Tags action when you want to rerun the tag function explicitly.",
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the key visual + intent. Avoid generic labels like 'image'.",
          validation: (rule) =>
            rule
              .required()
              .min(12)
              .warning("Use at least 12 chars for accessible, descriptive hero alt text."),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      group: "publication",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured Article",
      type: "boolean",
      group: "publication",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Workflow Status",
      type: "workflowStatus",
      group: "workflow",
      initialValue: "draft",
      description: "The editorial path is draft → in review → approved → published → archived.",
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Last Reviewed",
      type: "datetime",
      group: "workflow",
      readOnly: true,
    }),
    defineField({
      name: "approvedAt",
      title: "Approved At",
      type: "datetime",
      group: "workflow",
      readOnly: true,
    }),
    defineField({
      name: "tagRefreshRequestedAt",
      title: "Tag Refresh Requested",
      type: "datetime",
      group: "workflow",
      description: "Internal signal used to trigger the tag generation function.",
      readOnly: true,
      hidden: ({ value }) => value === undefined,
    }),
    defineField({
      name: "keyTakeaways",
      title: "Key Takeaways",
      type: "array",
      group: "content",
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
      group: "content",
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
      group: "content",
      description: "Optional series name for grouped editorial publishing.",
      validation: (rule) => rule.max(80),
    }),

    // Scheduling & Publishing Options
    defineField({
      name: "scheduledPublishAt",
      title: "Schedule Publish",
      type: "datetime",
      group: "workflow",
      description: "Deprecated. Use Sanity Scheduled Drafts or Content Releases for scheduling.",
      readOnly: true,
      hidden: ({ value }) => value === undefined,
      deprecated: {
        reason: "Use Scheduled Drafts/Releases instead of custom scheduledPublishAt workflow.",
      },
      initialValue: undefined,
    }),

    // Cross-posting Configuration
    defineField({
      name: "crossposting",
      title: "Cross-posting Settings",
      type: "object",
      group: "seo",
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
        defineField({
          name: "manualTriggerAt",
          title: "Manual Retry Requested",
          type: "datetime",
          description: "Internal signal used to retry cross-posting through the Sanity function.",
          readOnly: true,
          hidden: ({ value }) => value === undefined,
        }),
      ],
    }),

    // Analytics
    defineField({
      name: "analytics",
      title: "Analytics",
      type: "object",
      group: "analytics",
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
      title: "Markdown Content (Legacy Fallback)",
      type: "markdown",
      group: "content",
      description:
        "Legacy Markdown input for imported posts. Frontmatter here does not populate title, summary, SEO, or other dedicated Sanity fields.",
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
            return "Either Markdown Content or Content is required";
          }

          return true;
        }),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
      group: "content",
      description:
        "Canonical article body. Supports Portable Text blocks, images, code blocks, callouts, video embeds, and dividers.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const richTextContent = Array.isArray(value) ? value : [];
          const doc = context.document as { markdownContent?: string };
          const markdownContent = doc?.markdownContent;

          // If neither field has content, return error
          if (!markdownContent && richTextContent.length === 0) {
            return "Either Markdown Content or Content is required";
          }

          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "heroImage",
      date: "publishedAt",
      featured: "featured",
      status: "status",
    },
    prepare(selection) {
      const { title, media, date, featured, status } = selection;
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

      return {
        title: `${featured ? "★ " : ""}${title ?? "Untitled"}`,
        subtitle: date ? `${new Date(date).toLocaleDateString()} · ${statusLabel}` : statusLabel,
        media,
      };
    },
  },
});
