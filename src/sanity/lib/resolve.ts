import type {
  DocumentLocationResolverObject,
  DocumentLocationsState,
  PresentationPluginOptions,
} from "sanity/presentation";

// `defineLocations()` is a type-level identity helper in Sanity. Keeping a
// local identity function avoids importing the full presentation runtime in
// test environments that only need the resolver shape.
function defineLocations<K extends string>(
  resolver: DocumentLocationResolverObject<K> | DocumentLocationsState,
) {
  return resolver;
}

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
          {
            title: "Blog Index",
            href: "/blog/",
          },
        ],
      }),
    }),
    category: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Category",
            href: doc?.slug ? `/blog/category/${doc.slug}/` : "/blog/",
          },
          {
            title: "Blog Index",
            href: "/blog/",
          },
        ],
      }),
    }),
    topic: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Topic",
            href: doc?.slug ? `/blog/topic/${doc.slug}/` : "/blog/",
          },
          {
            title: "Blog Index",
            href: "/blog/",
          },
        ],
      }),
    }),
    series: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Series",
            href: doc?.slug ? `/blog/series/${doc.slug}/` : "/blog/",
          },
          {
            title: "Blog Index",
            href: "/blog/",
          },
        ],
      }),
    }),
    project: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Project",
            href: "/projects/",
          },
        ],
      }),
    }),
    aboutPage: defineLocations({
      select: {
        title: "heroTitle",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "About",
            href: "/about/",
          },
        ],
      }),
    }),
    blogPage: defineLocations({
      select: {
        title: "heroTitle",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Blog",
            href: "/blog/",
          },
        ],
      }),
    }),
    projectsPage: defineLocations({
      select: {
        title: "heroTitle",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Case Studies",
            href: "/projects/",
          },
        ],
      }),
    }),
  },
};
