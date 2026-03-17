import { defineBlueprint, defineDocumentFunction } from "@sanity/blueprints";

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      type: "sanity.function.document",
      name: "auto-tag",
      src: "./functions/auto-tag",
      memory: 2,
      timeout: 30,
      event: {
        on: ["create", "update"],
        filter:
          "_type == 'post' && delta::changedAny(['title', 'summary', 'hook', 'content', 'topics', 'categories', 'tagRefreshRequestedAt'])",
        projection: "{_id}",
      },
    }),
    defineDocumentFunction({
      type: "sanity.function.document",
      name: "generate-distribution-package",
      src: "./functions/generate-distribution-package",
      memory: 2,
      timeout: 30,
      event: {
        on: ["create", "update"],
        filter:
          "_type == 'post' && delta::changedAny(['title', 'summary', 'hook', 'content', 'distributionRequestedAt'])",
        projection: "{_id}",
      },
    }),
    defineDocumentFunction({
      type: "sanity.function.document",
      name: "stale-content-review",
      src: "./functions/stale-content-review",
      memory: 2,
      timeout: 30,
      event: {
        on: ["create", "update"],
        filter:
          "_type == 'post' && delta::changedAny(['title', 'summary', 'hook', 'content', 'refreshRequestedAt'])",
        projection: "{_id}",
      },
    }),
    defineDocumentFunction({
      type: "sanity.function.document",
      name: "auto-publish",
      src: "./functions/auto-publish",
      memory: 2,
      timeout: 60,
      event: {
        on: ["create", "update"],
        filter:
          '_type == "post" && !(_id in path("drafts.**")) && status == "published" && delta::changedAny(["status", "title", "summary", "content", "seo", "crossposting"])',
        projection:
          "{_id, title, summary, hook, status, 'slug': slug.current, tags, content, seo, distributionPackage, crossposting}",
      },
    }),
  ],
});
