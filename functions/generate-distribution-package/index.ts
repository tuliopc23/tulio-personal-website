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
    route: "/generate-distribution-package",
    runtime: "cloudflare-pages",
    kind: "status-endpoint",
    automationTrigger: "sanity blueprint document function",
    note:
      "This HTTP route exists for production diagnostics. Distribution package generation is driven by Sanity document events.",
  });
}

export async function onRequestPost() {
  return json({
    ok: true,
    route: "/generate-distribution-package",
    runtime: "cloudflare-pages",
    kind: "status-endpoint",
    automationTrigger: "sanity blueprint document function",
    note:
      "This endpoint is reachable in production, but the real distribution package automation runs from Sanity document events.",
  });
}

export const handler = documentEventHandler(async ({ context, event }) => {
  const client = createClient({
    ...context.clientOptions,
    apiVersion: "2025-02-19",
    useCdn: false,
  });

  try {
    const result = await client.agent.action.generate({
      noWrite: context.local ? true : false,
      instructionParams: {
        doc: {
          type: "document",
        },
      },
      instruction: `Create a reusable distribution package for this article.
- Fill distributionPackage.newsletterBlurb with 2 or 3 compact editorial sentences.
- Fill distributionPackage.shortSocialPost with one compact social post.
- Fill distributionPackage.longSocialPost with a longer, skimmable social post.
- Fill distributionPackage.teaserQuote with one quotable teaser line.
- Fill distributionPackage.ctaLabel with a 2 to 5 word CTA.
- Preserve the publication's editorial tone and avoid generic marketing language.`,
      target: {
        path: "distributionPackage",
      },
      documentId: event.data._id,
      schemaId: "_.schemas.default",
      forcePublishedWrite: true,
    });

    if (context.local) {
      console.log("Generated distribution package (LOCAL TEST MODE):", result);
      return;
    }

    await client.patch(event.data._id).set({
      distributionRequestedAt: new Date().toISOString(),
      "distributionPackage.generatedAt": new Date().toISOString(),
    }).commit();
  } catch (error) {
    console.error("Error occurred during distribution package generation:", error);
  }
});
