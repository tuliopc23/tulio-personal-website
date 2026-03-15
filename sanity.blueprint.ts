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
          "_type == 'post' && delta::changedAny(['title', 'summary', 'content'])",
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
        filter: '_type == "post" && !(_id in path("drafts.**"))',
        projection: "{_id, title, summary, 'slug': slug.current, tags, content, seo, crossposting}",
      },
    }),
  ],
});
