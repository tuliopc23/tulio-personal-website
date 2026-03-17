import { createClient } from "@sanity/client";
import { documentEventHandler } from "@sanity/functions";

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
      instruction: `Review this published article for freshness.
- Decide whether it should be monitored, refreshed soon, rewritten, or archived.
- Write a concise refreshReview.summary.
- Write 3 to 5 specific recommended changes in refreshReview.recommendedChanges.
- Keep the assessment editorial and practical.`,
      target: {
        path: "refreshReview",
      },
      documentId: event.data._id,
      schemaId: "_.schemas.default",
      forcePublishedWrite: true,
    });

    if (context.local) {
      console.log("Generated refresh review (LOCAL TEST MODE):", result);
      return;
    }

    await client.patch(event.data._id).set({
      refreshRequestedAt: new Date().toISOString(),
      "refreshReview.generatedAt": new Date().toISOString(),
    }).commit();
  } catch (error) {
    console.error("Error occurred during refresh review generation:", error);
  }
});
