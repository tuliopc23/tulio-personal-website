import { defineField, defineType } from "sanity";

export default defineType({
  name: "divider",
  title: "Divider",
  type: "object",
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Line", value: "line" },
          { title: "Dots", value: "dots" },
          { title: "Asterisks", value: "asterisks" },
          { title: "Space", value: "space" },
        ],
        layout: "radio",
      },
      initialValue: "line",
    }),
  ],
  preview: {
    select: {
      style: "style",
    },
    prepare(selection) {
      const { style } = selection;
      const symbols = {
        line: "─",
        dots: "•••",
        asterisks: "* * *",
        space: "⎵",
      };
      return {
        title: `Divider: ${symbols[style as keyof typeof symbols] || style}`,
      };
    },
  },
});
