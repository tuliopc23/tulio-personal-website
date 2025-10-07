import type { PresentationPluginOptions } from "sanity/presentation";
import { defineLocations } from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    post: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: doc?.slug ? `/blog/${doc.slug}/` : "/blog/",
          },
        ],
      }),
    }),
  },
};
