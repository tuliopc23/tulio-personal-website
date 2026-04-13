import type { PostDetail, PostSummary } from "../../src/sanity/lib/posts";
import type { SanityProject } from "../../src/sanity/lib/projects";

export const richPostSummary: PostSummary = {
  _id: "post-1",
  title: "Building Better Astro Sites",
  summary: "A practical look at route design, performance, and testing.",
  slug: "building-better-astro-sites",
  publishedAt: "2026-03-10T12:00:00.000Z",
  tags: ["astro", "testing"],
  keyTakeaways: ["Keep the server thin", "Test route branches"],
  coverVariant: "cinematic",
  series: "Astro Notes",
  heroImage: {
    url: "https://cdn.sanity.io/images/demo/hero.png",
    alt: "Astro dashboard",
    width: 1200,
    height: 630,
  },
  author: {
    _id: "author-1",
    name: "Tulio Cunha",
    slug: "tulio-cunha",
  },
  categories: [
    {
      _id: "category-1",
      title: "Astro",
      slug: "astro",
      description: "Astro articles",
    },
  ],
  readingTimeMinutes: 4,
  seo: {
    metaTitle: "Building Better Astro Sites",
    metaDescription: "A practical look at route design, performance, and testing.",
    canonicalUrl: "https://www.tuliocunha.dev/blog/building-better-astro-sites/",
    noIndex: false,
    jsonLd: null,
    socialImage: {
      url: "https://cdn.sanity.io/images/demo/social.png",
      alt: "Social card",
      width: 1200,
      height: 630,
    },
  },
  featured: true,
};

export const richPostDetail: PostDetail = {
  ...richPostSummary,
  updatedAt: "2026-03-15T08:00:00.000Z",
  readingTimeMinutes: 4,
  content: [
    {
      _key: "block-1",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: "child-1",
          _type: "span",
          marks: [],
          text: "Astro makes it easy to keep most of the page static.",
        },
      ],
    },
  ],
  markdownContent: null,
};

export const markdownFallbackPost: PostDetail = {
  ...richPostSummary,
  slug: "markdown-fallback",
  updatedAt: "2026-03-12T10:00:00.000Z",
  readingTimeMinutes: 3,
  content: [],
  markdownContent: "# Heading\n\nFallback markdown content",
};

export const sampleProject: SanityProject = {
  _id: "project-1",
  title: "Project Atlas",
  slug: "project-atlas",
  role: "Lead engineer",
  summary: "A shipping product across Apple apps and backend services.",
  status: "Live",
  href: "https://example.com/project-atlas",
  cta: "View project",
  releaseDate: "2025-12-01",
  categories: ["native", "web"],
  coverImage: {
    alt: "Project cover",
    url: "https://cdn.sanity.io/images/demo/project.png",
    lqip: null,
    dimensions: { width: 1600, height: 900 },
  },
};
