import { defineField, defineType } from "sanity";

export default defineType({
  name: "videoEmbed",
  title: "Video Embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description: "YouTube or Vimeo video URL",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom((url) => {
            if (!url) return true;
            const isYouTube =
              url.includes("youtube.com/watch") || url.includes("youtu.be/");
            const isVimeo = url.includes("vimeo.com/");
            return isYouTube || isVimeo ? true : "URL must be from YouTube or Vimeo";
          }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption for the video",
    }),
  ],
  preview: {
    select: {
      url: "url",
      caption: "caption",
    },
    prepare(selection) {
      const { url, caption } = selection;
      const platform = url?.includes("youtube") ? "YouTube" : "Vimeo";
      return {
        title: caption || `${platform} video`,
        subtitle: url,
      };
    },
  },
});
