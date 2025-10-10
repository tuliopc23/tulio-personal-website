import type { APIRoute } from "astro";
import { createClient } from "@sanity/client";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
const token = import.meta.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.warn("SANITY_API_WRITE_TOKEN not configured - scheduled publishing disabled");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

export const GET: APIRoute = async ({ request }) => {
  // Basic auth check - only allow authorized requests
  const authHeader = request.headers.get("authorization");
  const expectedAuth = import.meta.env.CRON_SECRET;
  
  if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!token) {
    return new Response(
      JSON.stringify({ 
        error: "Scheduled publishing not configured",
        message: "SANITY_API_WRITE_TOKEN environment variable required" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const now = new Date().toISOString();

    // Find posts that are approved and scheduled for now or earlier
    const scheduledPosts = await client.fetch(
      `*[_type == "post" && status == "approved" && defined(scheduledPublishAt) && scheduledPublishAt <= $now]{
        _id,
        title,
        "slug": slug.current,
        scheduledPublishAt
      }`,
      { now }
    );

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          published: 0,
          message: "No posts scheduled for publication",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Publish each scheduled post
    const results = await Promise.all(
      scheduledPosts.map(async (post: any) => {
        try {
          await client
            .patch(post._id)
            .set({
              status: "published",
              publishedAt: now,
            })
            .unset(["scheduledPublishAt"]) // Clear the scheduled time
            .commit();

          return {
            id: post._id,
            title: post.title,
            slug: post.slug,
            success: true,
          };
        } catch (error) {
          console.error(`Failed to publish post ${post._id}:`, error);
          return {
            id: post._id,
            title: post.title,
            slug: post.slug,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        published: successCount,
        failed: failureCount,
        results,
        timestamp: now,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Scheduled publishing error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
