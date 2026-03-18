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
    route: "/auto-publish",
    runtime: "sanity-blueprints",
    kind: "status-endpoint",
    automationTrigger: "sanity blueprint document function",
    note:
      "This HTTP route exists for production diagnostics. Actual cross-posting is driven by Sanity document events, not direct GET requests.",
  });
}

export async function onRequestPost() {
  return json({
    ok: true,
    route: "/auto-publish",
    runtime: "sanity-blueprints",
    kind: "status-endpoint",
    automationTrigger: "sanity blueprint document function",
    note:
      "This endpoint is reachable in production, but the real publishing workflow runs from Sanity document events.",
  });
}

// Basic Portable Text to Markdown conversion for cross-posting
function portableTextToMarkdown(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (block._type === "block") {
        const text = (block.children || [])
          .map((child: any) => {
            let chunk = child.text || "";
            if (child.marks?.includes("strong")) chunk = `**${chunk}**`;
            if (child.marks?.includes("em")) chunk = `*${chunk}*`;
            if (child.marks?.includes("code")) chunk = `\`${chunk}\``;
            return chunk;
          })
          .join("");

        switch (block.style) {
          case "h1": return `# ${text}`;
          case "h2": return `## ${text}`;
          case "h3": return `### ${text}`;
          case "h4": return `#### ${text}`;
          case "blockquote": return `> ${text}`;
          default: return text;
        }
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export const handler = documentEventHandler(async ({ context, event }) => {
  const client = createClient({
    ...context.clientOptions,
    apiVersion: "2025-02-19",
    useCdn: false,
  });

  const { data: post } = event;
  const { local } = context;

  if (post.status !== "published") {
    console.log(
      `⏭️  Auto-publish skipped: "${post.title || "Untitled"}" is in status "${post.status || "unknown"}".`,
    );
    return;
  }

  // Configuration check
  const crossposting = post.crossposting || {};
  const devtoEnabled = crossposting.devto?.enabled;
  const hashnodeEnabled = crossposting.hashnode?.enabled;
  const linkedinEnabled = crossposting.linkedin?.enabled;

  if (crossposting.manualTriggerAt) {
    console.log(
      `🔁 Cross-post retry requested at ${crossposting.manualTriggerAt} for "${post.title || "Untitled"}".`,
    );
  }

  if (!devtoEnabled && !hashnodeEnabled && !linkedinEnabled) {
    console.log("⏭️  Auto-publish skipped: no platforms enabled in crossposting settings.");
    return;
  }

  const title = post.title;
  const summary = post.summary || post.seo?.metaDescription || "";
  const distributionPackage = post.distributionPackage || {};
  const slug = post.slug;
  const tags = post.tags || [];
  const content = post.content || [];
  const canonicalUrl = post.seo?.canonicalUrl || `https://www.tuliocunha.dev/blog/${slug}/`;
  const markdownContent = portableTextToMarkdown(content);
  const shortSocialPost = distributionPackage.shortSocialPost || `${title}\n\n${summary}`;
  const longSocialPost = distributionPackage.longSocialPost || shortSocialPost;

  console.log(`🚀 Starting auto-publish for: "${title}"`);

  // 1. Dev.to Publishing
  if (devtoEnabled && !crossposting.devto?.articleId) {
    const devToApiKey = context.env?.DEV_TO_API_KEY;
    if (devToApiKey) {
      try {
        const response = await fetch("https://dev.to/api/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": devToApiKey,
          },
          body: JSON.stringify({
            article: {
              title,
              body_markdown: markdownContent,
              description: summary,
              tags: tags.slice(0, 4), // Dev.to limit
              published: true,
              canonical_url: canonicalUrl,
            },
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("✅ Published to Dev.to:", result.url);
          
          if (!local) {
            await client.patch(post._id).set({
              "crossposting.devto.articleId": result.id,
              "crossposting.devto.url": result.url,
              "crossposting.devto.lastSyncedAt": new Date().toISOString(),
              "crossposting.devto.status": "published",
              "crossposting.devto.lastResultMessage": "Published successfully to Dev.to."
            }).commit();
          }
        } else {
          console.error("❌ Dev.to error:", await response.text());
          if (!local) {
            await client.patch(post._id).set({
              "crossposting.devto.status": "failed",
              "crossposting.devto.lastResultMessage": "Dev.to publish failed. See function logs for details."
            }).commit();
          }
        }
      } catch (err) {
        console.error("❌ Dev.to exception:", err);
        if (!local) {
          await client.patch(post._id).set({
            "crossposting.devto.status": "failed",
            "crossposting.devto.lastResultMessage": "Dev.to publish threw an exception."
          }).commit();
        }
      }
    } else {
      console.warn("⚠️ DEV_TO_API_KEY missing from Sanity Function environment.");
    }
  }

  // 2. Hashnode Publishing
  if (hashnodeEnabled && !crossposting.hashnode?.postId) {
    const hashnodeToken = context.env?.HASHNODE_ACCESS_TOKEN;
    const publicationId = crossposting.hashnode?.publicationId || context.env?.HASHNODE_PUBLICATION_ID;
    
    if (hashnodeToken && publicationId) {
      try {
        const query = `
          mutation PublishPost($input: PublishPostInput!) {
            publishPost(input: $input) {
              post { id url }
            }
          }
        `;
        const response = await fetch("https://gql.hashnode.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: hashnodeToken,
          },
          body: JSON.stringify({
            query,
            variables: {
              input: {
                title,
                contentMarkdown: markdownContent,
                publicationId,
                tags: tags.map((t: string) => ({ name: t, slug: t.toLowerCase().replace(/\s+/g, "-") })),
                originalArticleURL: canonicalUrl,
              }
            }
          }),
        });

        const result = await response.json();
        if (result.data?.publishPost?.post) {
          const hashPost = result.data.publishPost.post;
          console.log("✅ Published to Hashnode:", hashPost.url);
          
          if (!local) {
            await client.patch(post._id).set({
              "crossposting.hashnode.postId": hashPost.id,
              "crossposting.hashnode.url": hashPost.url,
              "crossposting.hashnode.lastSyncedAt": new Date().toISOString(),
              "crossposting.hashnode.status": "published",
              "crossposting.hashnode.lastResultMessage": "Published successfully to Hashnode."
            }).commit();
          }
        } else {
          console.error("❌ Hashnode error:", JSON.stringify(result.errors));
          if (!local) {
            await client.patch(post._id).set({
              "crossposting.hashnode.status": "failed",
              "crossposting.hashnode.lastResultMessage": "Hashnode publish failed. See function logs for details."
            }).commit();
          }
        }
      } catch (err) {
        console.error("❌ Hashnode exception:", err);
        if (!local) {
          await client.patch(post._id).set({
            "crossposting.hashnode.status": "failed",
            "crossposting.hashnode.lastResultMessage": "Hashnode publish threw an exception."
          }).commit();
        }
      }
    } else {
      console.warn("⚠️ Hashnode credentials missing.");
    }
  }

  // 3. LinkedIn Publishing
  if (linkedinEnabled && !crossposting.linkedin?.postId) {
    const accessToken = context.env?.LINKEDIN_ACCESS_TOKEN;
    const personUrn = context.env?.LINKEDIN_PERSON_ID;
    
    if (accessToken && personUrn) {
      try {
        const response = await fetch("https://api.linkedin.com/rest/posts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
            "LinkedIn-Version": "202401",
          },
          body: JSON.stringify({
            author: personUrn,
            commentary: longSocialPost,
            visibility: "PUBLIC",
            distribution: { feedDistribution: "MAIN_FEED" },
            content: {
              article: {
                source: canonicalUrl,
                title: title,
                description: summary,
              }
            },
            lifecycleState: "PUBLISHED"
          }),
        });

        if (response.ok) {
          const postId = response.headers.get("x-restli-id") || response.headers.get("x-linkedin-id");
          const postUrl = `https://www.linkedin.com/feed/update/${postId}`;
          console.log("✅ Published to LinkedIn:", postUrl);
          
          if (!local) {
            await client.patch(post._id).set({
              "crossposting.linkedin.postId": postId,
              "crossposting.linkedin.url": postUrl,
              "crossposting.linkedin.lastSyncedAt": new Date().toISOString(),
              "crossposting.linkedin.status": "published",
              "crossposting.linkedin.lastResultMessage": "Published successfully to LinkedIn."
            }).commit();
          }
        } else {
          console.error("❌ LinkedIn error:", await response.text());
          if (!local) {
            await client.patch(post._id).set({
              "crossposting.linkedin.status": "failed",
              "crossposting.linkedin.lastResultMessage": "LinkedIn publish failed. See function logs for details."
            }).commit();
          }
        }
      } catch (err) {
        console.error("❌ LinkedIn exception:", err);
        if (!local) {
          await client.patch(post._id).set({
            "crossposting.linkedin.status": "failed",
            "crossposting.linkedin.lastResultMessage": "LinkedIn publish threw an exception."
          }).commit();
        }
      }
    } else {
      console.warn("⚠️ LinkedIn credentials missing.");
    }
  }
});
