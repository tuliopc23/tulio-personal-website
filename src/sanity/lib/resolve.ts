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
    nowPage: defineLocations({
      select: {
        title: "heroTitle",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Now",
            href: "/now/",
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
            title: doc?.title || "Projects",
            href: "/projects/",
          },
        ],
      }),
    }),
  },
};
