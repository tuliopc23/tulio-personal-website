import { createClient } from "@sanity/client";
import { documentEventHandler } from "@sanity/functions";

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function onRequestGet() {
  return json({
    ok: true,
    route: "/auto-tag",
    runtime: "sanity-blueprints",
    kind: "status-endpoint",
    automationTrigger: "sanity blueprint document function",
    note:
      "This HTTP route exists for production diagnostics. Tag generation is driven by Sanity document events.",
  });
}

export async function onRequestPost() {
  return json({
    ok: true,
    route: "/auto-tag",
    runtime: "sanity-blueprints",
    kind: "status-endpoint",
    automationTrigger: "sanity blueprint document function",
    note:
      "This endpoint is reachable in production, but the real tag automation runs from Sanity document events.",
  });
}

export const handler = documentEventHandler(async ({ context, event }) => {
  const client = createClient({
    ...context.clientOptions,
    apiVersion: "2025-02-19",
    useCdn: false,
  });

  const { data } = event;
  const { local } = context; // local is true when running locally

  try {
    const result = await client.agent.action.generate({
      noWrite: local ? true : false, // if local is true, we don't write to the document, just return the result for logging
      instructionParams: {
        title: {
          type: "field",
          path: "title",
        },
        summary: {
          type: "field",
          path: "summary",
        },
        hook: {
          type: "field",
          path: "hook",
        },
        content: {
          type: "field",
          path: "content",
        },
        categories: {
          type: "field",
          path: "categories",
        },
        topics: {
          type: "field",
          path: "topics",
        },
        tagsUsedInOtherPosts: {
          type: "groq",
          query:
            "array::unique(*[_type == 'post' && _id != $id && defined(tags)].tags[])",
          params: {
            id: data._id,
          },
        },
      },
      instruction: `Based on the $title, $summary, $hook, $content, $categories, and $topics, create 3 relevant tags. Attempt to use $tagsUsedInOtherPosts first if they fit the context. Tags should be simple single words or compact compounds (e.g., "Design", "Engineering", "Frontend") and no brackets or special characters.`,
      target: {
        path: "tags",
      },
      documentId: data._id,
      schemaId: "_.schemas.default",
      forcePublishedWrite: true,
    });

    console.log(
      local
        ? "Generated tags (LOCAL TEST MODE - Content Lake not updated):"
        : "Generated tags:",
      result.tags
    );
  } catch (error) {
    console.error("Error occurred during tag generation:", error);
  }
});
