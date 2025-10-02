import { defineField, defineType } from "sanity";

export default defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Warning", value: "warning" },
          { title: "Success", value: "success" },
          { title: "Error", value: "error" },
        ],
        layout: "radio",
      },
      initialValue: "info",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
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
                  {
                    name: "href",
                    type: "url",
                    validation: (rule) =>
                      rule.required().uri({ scheme: ["http", "https"] }),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      variant: "variant",
      body: "body",
    },
    prepare(selection) {
      const { title, variant, body } = selection;
      const icons = {
        info: "ℹ️",
        warning: "⚠️",
        success: "✅",
        error: "❌",
      } as const;
      const icon = icons[variant as keyof typeof icons];

      return {
        title: title || `${icon} ${variant} callout`,
        subtitle: body ? "With content" : "No content",
      };
    },
  },
});
