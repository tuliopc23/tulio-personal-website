import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Portable Text block content schema
 * This defines the rich text editing capabilities for blog posts
 */
export default defineType({
  name: "blockContent",
  title: "Block content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
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
          { title: "Strikethrough", value: "strike-through" },
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
                  rule.required().uri({
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
              defineField({
                name: "openInNewTab",
                title: "Open in new tab",
                type: "boolean",
                initialValue: false,
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
            rule.required().error("Alt text is required for accessibility"),
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
        language: "javascript",
        languageAlternatives: [
          { title: "JavaScript", value: "javascript" },
          { title: "TypeScript", value: "typescript" },
          { title: "JSX", value: "jsx" },
          { title: "TSX", value: "tsx" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "SCSS", value: "scss" },
          { title: "JSON", value: "json" },
          { title: "Markdown", value: "markdown" },
          { title: "YAML", value: "yaml" },
          { title: "Bash", value: "bash" },
          { title: "Shell", value: "sh" },
          { title: "Python", value: "python" },
          { title: "Swift", value: "swift" },
          { title: "Go", value: "go" },
          { title: "Rust", value: "rust" },
          { title: "SQL", value: "sql" },
          { title: "GraphQL", value: "graphql" },
          { title: "GROQ", value: "groq" },
        ],
        withFilename: true,
      },
    }),
    defineArrayMember({
      type: "callout",
    }),
    defineArrayMember({
      type: "videoEmbed",
    }),
    defineArrayMember({
      type: "divider",
    }),
  ],
});
