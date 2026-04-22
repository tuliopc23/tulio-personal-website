import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { postSchema, projectSchema, taxonomySchema } from "./cms/content-schemas";

export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: "**/index.mdx", base: "src/content/posts" }),
    schema: postSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: "**/index.yaml", base: "src/content/projects" }),
    schema: projectSchema,
  }),
  taxonomyCategories: defineCollection({
    loader: glob({ pattern: "**/index.yaml", base: "src/content/taxonomy/categories" }),
    schema: taxonomySchema,
  }),
  taxonomyTopics: defineCollection({
    loader: glob({ pattern: "**/index.yaml", base: "src/content/taxonomy/topics" }),
    schema: taxonomySchema,
  }),
  taxonomySeries: defineCollection({
    loader: glob({ pattern: "**/index.yaml", base: "src/content/taxonomy/series" }),
    schema: taxonomySchema,
  }),
};
