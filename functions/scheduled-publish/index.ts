/**
 * Cloudflare Worker - Scheduled Publishing
 *
 * This worker runs on a cron schedule to:
 * 1. Check for articles with scheduledPublishAt <= now
 * 2. Publish them (set publishedAt, clear scheduledPublishAt)
 * 3. Optionally trigger cross-posting to Dev.to and Hashnode
 */

interface Env {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_WRITE_TOKEN: string;
  DEV_TO_API_KEY?: string;
  HASHNODE_API_KEY?: string;
}

interface ScheduledPost {
  _id: string;
  title: string;
  slug: { current: string };
  scheduledPublishAt: string;
  crossposting?: {
    devto?: { enabled: boolean };
    hashnode?: { enabled: boolean; publicationId?: string };
  };
}

/**
 * Publish a post in Sanity by setting publishedAt and clearing scheduledPublishAt
 */
async function publishPostInSanity(postId: string, env: Env): Promise<void> {
  const mutations = [
    {
      patch: {
        id: postId,
        set: {
          publishedAt: new Date().toISOString(),
        },
        unset: ["scheduledPublishAt"],
      },
    },
  ];

  const response = await fetch(
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${env.SANITY_DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to publish post in Sanity: ${error}`);
  }
}

/**
 * Get full post data from Sanity for cross-posting
 */
async function getFullPost(postId: string, env: Env) {
  const query = encodeURIComponent(`*[_id == "${postId}"][0]{
    _id,
    title,
    summary,
    "slug": slug.current,
    tags,
    markdownContent,
    content,
    seo,
    crossposting
  }`);

  const response = await fetch(
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${env.SANITY_DATASET}?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch post from Sanity`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * Cross-post to Dev.to
 */
async function crosspostToDevTo(post: any, env: Env): Promise<number | null> {
  if (!env.DEV_TO_API_KEY) {
    console.log("Dev.to API key not configured");
    return null;
  }

  // Convert content to markdown (simplified - you may want to enhance this)
  const bodyMarkdown = post.markdownContent || "Article content";

  const article = {
    article: {
      title: post.title,
      body_markdown: bodyMarkdown,
      description: post.summary || post.seo?.metaDescription || "",
      tags: post.tags || [],
      published: true,
      canonical_url: `https://www.tuliocunha.dev/blog/${post.slug}/`,
    },
  };

  const response = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.DEV_TO_API_KEY,
    },
    body: JSON.stringify(article),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to publish to Dev.to: ${error}`);
    return null;
  }

  const result = await response.json();
  return result.id;
}

/**
 * Cross-post to Hashnode
 */
async function crosspostToHashnode(
  post: any,
  publicationId: string,
  env: Env
): Promise<string | null> {
  if (!env.HASHNODE_API_KEY) {
    console.log("Hashnode API key not configured");
    return null;
  }

  const mutation = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      title: post.title,
      contentMarkdown: post.markdownContent || "Article content",
      tags: post.tags?.map((tag: string) => ({ name: tag })) || [],
      publicationId: publicationId,
      metaTags: {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.summary,
      },
    },
  };

  const response = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: env.HASHNODE_API_KEY,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to publish to Hashnode: ${error}`);
    return null;
  }

  const result = await response.json();
  return result.data?.publishPost?.post?.id || null;
}

/**
 * Update post with cross-posting metadata
 */
async function updateCrosspostingMetadata(
  postId: string,
  platform: "devto" | "hashnode",
  articleId: number | string,
  url: string,
  env: Env
): Promise<void> {
  const mutations = [
    {
      patch: {
        id: postId,
        set: {
          [`crossposting.${platform}.articleId`]: articleId,
          [`crossposting.${platform}.url`]: url,
          [`crossposting.${platform}.lastSyncedAt`]: new Date().toISOString(),
        },
      },
    },
  ];

  await fetch(
    `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${env.SANITY_DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
}

export default {
  async scheduled(_event: unknown, env: Env, _ctx: unknown): Promise<void> {
    console.log("🕒 Running scheduled publishing check...");

    try {
      // Query for posts that should be published now
      const now = new Date().toISOString();
      const query =
        encodeURIComponent(`*[_type == "post" && defined(scheduledPublishAt) && scheduledPublishAt <= "${now}"]{
        _id,
        title,
        "slug": slug.current,
        scheduledPublishAt,
        crossposting
      }`);

      const response = await fetch(
        `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${env.SANITY_DATASET}?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to query scheduled posts");
      }

      const data = await response.json();
      const posts: ScheduledPost[] = data.result || [];

      console.log(`📋 Found ${posts.length} posts ready to publish`);

      // Process each post
      for (const post of posts) {
        console.log(`📝 Publishing: ${post.title}`);

        // 1. Publish in Sanity
        await publishPostInSanity(post._id, env);

        // 2. Handle cross-posting if enabled
        if (post.crossposting?.devto?.enabled || post.crossposting?.hashnode?.enabled) {
          const fullPost = await getFullPost(post._id, env);

          // Dev.to
          if (post.crossposting?.devto?.enabled) {
            console.log(`  → Cross-posting to Dev.to...`);
            const devtoId = await crosspostToDevTo(fullPost, env);
            if (devtoId) {
              await updateCrosspostingMetadata(
                post._id,
                "devto",
                devtoId,
                `https://dev.to/tuliopinheiro/${post.slug.current}`,
                env
              );
            }
          }

          // Hashnode
          if (
            post.crossposting?.hashnode?.enabled &&
            post.crossposting?.hashnode?.publicationId
          ) {
            console.log(`  → Cross-posting to Hashnode...`);
            const hashnodeId = await crosspostToHashnode(
              fullPost,
              post.crossposting.hashnode.publicationId,
              env
            );
            if (hashnodeId) {
              await updateCrosspostingMetadata(
                post._id,
                "hashnode",
                hashnodeId,
                `https://hashnode.com/@tuliopinheiro/${post.slug.current}`,
                env
              );
            }
          }
        }

        console.log(`✅ Published: ${post.title}`);
      }

      console.log("✨ Scheduled publishing complete");
    } catch (error) {
      console.error("❌ Error in scheduled publishing:", error);
      throw error;
    }
  },
};
