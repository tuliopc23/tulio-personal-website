import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { EditorialStringInput, EditorialTextAreaInput } from "../components/EditorialTextInput";

const TAG_OPTIONS = [
  { title: "Design", value: "Design" },
  { title: "Engineering", value: "Engineering" },
  { title: "Tooling", value: "Tooling" },
  { title: "Accessibility", value: "Accessibility" },
  { title: "Swift", value: "Swift" },
  { title: "Frontend", value: "Frontend" },
  { title: "Writing", value: "Writing" },
];

const crosspostingPlatformFields = [
  defineField({
    name: "status",
    title: "Status",
    type: "string",
    readOnly: true,
  }),
  defineField({
    name: "lastResultMessage",
    title: "Last Result Message",
    type: "text",
    rows: 2,
    readOnly: true,
  }),
  defineField({
    name: "lastSyncedAt",
    title: "Last Synced",
    type: "datetime",
    readOnly: true,
  }),
];

export default defineType({
  name: "post",
  title: "Article",
  icon: DocumentTextIcon,
  type: "document",
  groups: [
    { name: "strategy", title: "Strategy", default: true },
    { name: "draft", title: "Draft" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
    { name: "distribution", title: "Distribution" },
    { name: "workflow", title: "Workflow" },
    { name: "performance", title: "Performance" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: ["strategy", "draft", "seo", "distribution"],
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
      group: "strategy",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brief",
      title: "Content Brief",
      type: "reference",
      group: "strategy",
      description: "Optional planning artifact that shaped this article before drafting.",
      to: [{ type: "contentBrief" }],
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      group: "strategy",
      description: "Who this piece is for.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "intent",
      title: "Intent",
      type: "string",
      group: "strategy",
      description: "The job this article should do once it reaches a reader.",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "targetKeyword",
      title: "Target Keyword",
      type: "string",
      group: "strategy",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      group: "strategy",
      description: "Strategic topics that go beyond the day-to-day category taxonomy.",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "relatedSeries",
      title: "Series",
      type: "array",
      group: "strategy",
      of: [{ type: "reference", to: [{ type: "series" }] }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "strategy",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "strategy",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "strategy",
      of: [{ type: "string" }],
      options: {
        list: TAG_OPTIONS,
      },
      description:
        "AI will suggest tags from your content. Use the Refresh Tags action when you want to rerun the tag function explicitly.",
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "featured",
      title: "Featured Article",
      type: "boolean",
      group: "strategy",
      initialValue: false,
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      group: ["draft", "seo", "distribution"],
      rows: 3,
      description: "Card lede and SEO fallback. Aim for one concise, high-signal paragraph.",
      components: {
        input: EditorialTextAreaInput,
      },
      validation: (rule) =>
        rule
          .required()
          .min(80)
          .max(280)
          .warning("Keep summaries between 100-220 chars for better card rhythm."),
    }),
    defineField({
      name: "keyTakeaways",
      title: "Key Takeaways",
      type: "array",
      group: "draft",
      description:
        "Recommended for approved and published posts. Use 2-4 concise bullets that capture what the reader should leave with.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.max(180),
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "sourceReferences",
      title: "Source References",
      type: "array",
      group: "draft",
      description:
        "Structured references that support the claims, examples, or quotes in this piece.",
      of: [{ type: "reference", to: [{ type: "sourceReference" }] }],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: "pullQuotes",
      title: "Pull Quotes",
      type: "array",
      group: "draft",
      description: "High-signal excerpts you can reuse across cards, promos, and page treatments.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().min(20).max(220),
            }),
            defineField({
              name: "attribution",
              title: "Attribution",
              type: "string",
              validation: (rule) => rule.max(100),
            }),
            defineField({
              name: "sourceUrl",
              title: "Source URL",
              type: "url",
              validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: {
              title: "quote",
              subtitle: "attribution",
            },
          },
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "furtherReading",
      title: "Further Reading",
      type: "array",
      group: "draft",
      description:
        "Optional references, follow-up links, or next steps shown near the end of the article.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required().max(120),
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "note",
              title: "Note",
              type: "string",
              validation: (rule) => rule.max(180),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "href",
            },
          },
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "markdownContent",
      title: "Markdown Content (Legacy Fallback)",
      type: "markdown",
      group: "draft",
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
      group: "draft",
      description:
        "Canonical article body. Supports Portable Text blocks, images, code blocks, callouts, video embeds, and dividers.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const richTextContent = Array.isArray(value) ? value : [];
          const doc = context.document as { markdownContent?: string };
          const markdownContent = doc?.markdownContent;

          if (!markdownContent && richTextContent.length === 0) {
            return "Either Markdown Content or Content is required";
          }

          return true;
        }),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "media",
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
      name: "heroCreativeNotes",
      title: "Hero Creative Notes",
      type: "text",
      rows: 3,
      group: "media",
      description: "Visual direction for imagery, framing, or illustration concepts.",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "coverVariant",
      title: "Cover Variant",
      type: "string",
      group: "media",
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
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: "cta",
      title: "Primary CTA",
      type: "object",
      group: "distribution",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          validation: (rule) => rule.max(40),
        }),
        defineField({
          name: "href",
          title: "URL",
          type: "url",
          validation: (rule) => rule.uri({ allowRelative: true }),
        }),
        defineField({
          name: "intent",
          title: "Intent",
          type: "string",
          validation: (rule) => rule.max(80),
        }),
      ],
    }),
    defineField({
      name: "distributionPackage",
      title: "Distribution Package",
      type: "object",
      group: "distribution",
      description: "Reusable promo copy for newsletters, social, and supporting surfaces.",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "newsletterBlurb",
          title: "Newsletter Blurb",
          type: "text",
          rows: 4,
          components: {
            input: EditorialTextAreaInput,
          },
          validation: (rule) => rule.max(320),
        }),
        defineField({
          name: "shortSocialPost",
          title: "Short Social Post",
          type: "text",
          rows: 3,
          components: {
            input: EditorialTextAreaInput,
          },
          validation: (rule) => rule.max(220),
        }),
        defineField({
          name: "longSocialPost",
          title: "Long Social Post",
          type: "text",
          rows: 5,
          components: {
            input: EditorialTextAreaInput,
          },
          validation: (rule) => rule.max(560),
        }),
        defineField({
          name: "teaserQuote",
          title: "Teaser Quote",
          type: "string",
          components: {
            input: EditorialStringInput,
          },
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: "ctaLabel",
          title: "CTA Label",
          type: "string",
          components: {
            input: EditorialStringInput,
          },
          validation: (rule) => rule.max(40),
        }),
        defineField({
          name: "generatedAt",
          title: "Generated At",
          type: "datetime",
          readOnly: true,
          hidden: ({ value }) => value === undefined,
        }),
      ],
    }),
    defineField({
      name: "crossposting",
      title: "Cross-posting Settings",
      type: "object",
      group: "distribution",
      description: "Configure automatic cross-posting to external platforms.",
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
              readOnly: true,
            }),
            ...crosspostingPlatformFields,
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
              description: "Your Hashnode publication/blog ID.",
            }),
            defineField({
              name: "postId",
              title: "Hashnode Post ID",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "url",
              title: "Hashnode URL",
              type: "url",
              readOnly: true,
            }),
            ...crosspostingPlatformFields,
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
              readOnly: true,
            }),
            defineField({
              name: "url",
              title: "LinkedIn URL",
              type: "url",
              readOnly: true,
            }),
            ...crosspostingPlatformFields,
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
    defineField({
      name: "refreshCadence",
      title: "Refresh Cadence",
      type: "string",
      group: "workflow",
      initialValue: "quarterly",
      options: {
        list: [
          { title: "Monthly", value: "monthly" },
          { title: "Quarterly", value: "quarterly" },
          { title: "Biannual", value: "biannual" },
          { title: "Annual", value: "annual" },
          { title: "Evergreen only", value: "evergreen" },
        ],
      },
    }),
    defineField({
      name: "evergreenStatus",
      title: "Evergreen Status",
      type: "string",
      group: "workflow",
      initialValue: "current",
      options: {
        layout: "radio",
        list: [
          { title: "Current", value: "current" },
          { title: "Needs Refresh", value: "needs-refresh" },
          { title: "Refreshing", value: "refreshing" },
          { title: "Timeless", value: "timeless" },
        ],
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      group: "workflow",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
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
      name: "distributionRequestedAt",
      title: "Distribution Requested",
      type: "datetime",
      group: "workflow",
      description: "Internal signal used to generate or refresh the distribution package.",
      readOnly: true,
      hidden: ({ value }) => value === undefined,
    }),
    defineField({
      name: "refreshRequestedAt",
      title: "Refresh Review Requested",
      type: "datetime",
      group: "workflow",
      description: "Internal signal used to generate refresh guidance for older content.",
      readOnly: true,
      hidden: ({ value }) => value === undefined,
    }),
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
    defineField({
      name: "analytics",
      title: "Analytics",
      type: "object",
      group: "performance",
      description: "Article performance metrics.",
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
      name: "refreshReview",
      title: "Refresh Review",
      type: "object",
      group: "performance",
      description: "AI-assisted review notes for keeping evergreen content sharp.",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "status",
          title: "Refresh Status",
          type: "string",
          options: {
            list: [
              { title: "Monitor", value: "monitor" },
              { title: "Refresh Soon", value: "refresh-soon" },
              { title: "Rewrite", value: "rewrite" },
              { title: "Archive", value: "archive" },
            ],
          },
        }),
        defineField({
          name: "summary",
          title: "Review Summary",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "recommendedChanges",
          title: "Recommended Changes",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          validation: (rule) => rule.max(6),
        }),
        defineField({
          name: "generatedAt",
          title: "Generated At",
          type: "datetime",
          readOnly: true,
          hidden: ({ value }) => value === undefined,
        }),
      ],
    }),
    defineField({
      name: "series",
      title: "Legacy Series Label",
      type: "string",
      group: "strategy",
      description:
        "Legacy fallback. Prefer the structured Series references above for new content.",
      hidden: ({ document }) =>
        Array.isArray((document as { relatedSeries?: unknown[] } | undefined)?.relatedSeries) &&
        ((document as { relatedSeries?: unknown[] }).relatedSeries?.length ?? 0) > 0,
      validation: (rule) => rule.max(80),
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
