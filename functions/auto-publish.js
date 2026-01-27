import { toPlainText } from "astro-portabletext";

// Convert Sanity Portable Text blocks to Markdown
function portableTextToMarkdown(blocks) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (block._type === "block") {
        let text = toPlainText([block]);

        switch (block.style) {
          case "h1":
            return `# ${text}`;
          case "h2":
            return `## ${text}`;
          case "h3":
            return `### ${text}`;
          case "h4":
            return `#### ${text}`;
          case "blockquote":
            return `> ${text}`;
          default:
            return text;
        }
      }
      return "";
    })
    .join("\n\n");
}

// Convert Sanity Portable Text to HTML (for fallback)
function portableTextToHtml(blocks) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (block._type === "block") {
        let text = toPlainText([block]);

        switch (block.style) {
          case "h1":
            return `<h1>${text}</h1>`;
          case "h2":
            return `<h2>${text}</h2>`;
          case "h3":
            return `<h3>${text}</h3>`;
          case "h4":
            return `<h4>${text}</h4>`;
          case "blockquote":
            return `<blockquote>${text}</blockquote>`;
          default:
            return `<p>${text}</p>`;
        }
      }
      return "";
    })
    .join("\n");
}

// Publish to Dev.to
async function publishToDevTo(articleData) {
  const devToApiKey = process.env.DEV_TO_API_KEY;

  if (!devToApiKey) {
    console.log("⚠️  DEV_TO_API_KEY not set - skipping Dev.to publishing");
    return { success: false, message: "DEV_TO_API_KEY not set" };
  }

  try {
    // Convert content to Markdown
    const bodyMarkdown = portableTextToMarkdown(articleData.content || []);
    const bodyHtml = portableTextToHtml(articleData.content || []);

    // Prepare article data for Dev.to
    const article = {
      article: {
        title: articleData.title,
        body_markdown: bodyMarkdown || bodyHtml, // Fallback to HTML if no markdown
        description: articleData.summary || articleData.seo?.metaDescription || "",
        tags: articleData.tags || [],
        published: true,
        canonical_url:
          articleData.seo?.canonicalUrl ||
          `https://www.tuliocunha.dev/blog/${articleData.slug}/`,
      },
    };

    console.log("📝 Publishing to Dev.to:", articleData.title);

    const response = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": devToApiKey,
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Dev.to API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Successfully published to Dev.to:", result.url);
    return { success: true, url: result.url, platform: "Dev.to" };
  } catch (error) {
    console.error("❌ Error publishing to Dev.to:", error.message);
    return { success: false, error: error.message, platform: "Dev.to" };
  }
}

// Publish to LinkedIn
async function publishToLinkedIn(articleData) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_ID;

  if (!accessToken || !personUrn) {
    console.log(
      "⚠️  LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_ID not set - skipping LinkedIn publishing"
    );
    return { success: false, message: "LinkedIn credentials not set" };
  }

  try {
    const summary = articleData.summary || articleData.seo?.metaDescription || "";
    const url =
      articleData.seo?.canonicalUrl ||
      `https://www.tuliocunha.dev/blog/${articleData.slug}/`;

    const postData = {
      author: personUrn,
      commentary: `${articleData.title}\n\n${summary}`,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        article: {
          source: url,
          title: articleData.title,
          description: summary,
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202401",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
    }

    const postId =
      response.headers.get("x-restli-id") || response.headers.get("x-linkedin-id");
    const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

    return { success: true, url: postUrl, platform: "LinkedIn" };
  } catch (error) {
    console.error("❌ Error publishing to LinkedIn:", error.message);
    return { success: false, error: error.message, platform: "LinkedIn" };
  }
}

// Publish to Hashnode using API v2 (GraphQL)
async function publishToHashnode(articleData) {
  const hashnodeToken = process.env.HASHNODE_ACCESS_TOKEN;
  const publicationId = process.env.HASHNODE_PUBLICATION_ID;

  if (!hashnodeToken || !publicationId) {
    console.log(
      "⚠️  HASHNODE_ACCESS_TOKEN or HASHNODE_PUBLICATION_ID not set - skipping Hashnode publishing"
    );
    return { success: false, message: "Hashnode credentials not set" };
  }

  const query = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          url
          slug
        }
      }
    }
  `;

  try {
    const bodyMarkdown = portableTextToMarkdown(articleData.content || []);

    const variables = {
      input: {
        title: articleData.title,
        contentMarkdown: bodyMarkdown,
        publicationId: publicationId,
        tags: (articleData.tags || []).map((tag) => ({
          name: tag,
          slug: tag.toLowerCase().replace(/\s+/g, "-"),
        })),
        originalArticleURL:
          articleData.seo?.canonicalUrl ||
          `https://www.tuliocunha.dev/blog/${articleData.slug}/`,
      },
    };

    console.log("📝 Publishing to Hashnode:", articleData.title);

    const response = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: hashnodeToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(`Hashnode API error: ${JSON.stringify(result.errors)}`);
    }

    const post = result.data.publishPost.post;
    console.log("✅ Successfully published to Hashnode:", post.url);
    return { success: true, url: post.url, platform: "Hashnode" };
  } catch (error) {
    console.error("❌ Error publishing to Hashnode:", error.message);
    return { success: false, error: error.message, platform: "Hashnode" };
  }
}

// Main handler for Vercel/Netlify functions
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const webhookData = req.body;
    const { documentId, slug, operation, title } = webhookData;

    console.log(`🚀 Processing ${operation} for article:`, title || slug);

    // Handle delete operations
    if (operation === "delete") {
      console.log("🗑️  Article deleted:", documentId);
      return res.status(200).json({ message: "Delete operation processed", operation });
    }

    // Skip if marked as no-index
    if (webhookData.seo?.noIndex) {
      console.log("⏭️  Skipping - article marked as no-index");
      return res.status(200).json({ message: "Skipped - no-index article", operation });
    }

    const results = [];

    // Publish to Dev.to
    const devToResult = await publishToDevTo(webhookData);
    results.push(devToResult);

    // Publish to LinkedIn
    const linkedInResult = await publishToLinkedIn(webhookData);
    results.push(linkedInResult);

    // Publish to Hashnode
    const hashnodeResult = await publishToHashnode(webhookData);
    results.push(hashnodeResult);

    // Check if any platforms were successfully published to
    const successfulPublishes = results.filter((r) => r.success);
    const failedPublishes = results.filter((r) => !r.success && r.error);

    console.log("\n📊 Publishing Results:");
    successfulPublishes.forEach((result) => {
      console.log(`  ✅ ${result.platform}: ${result.url}`);
    });
    failedPublishes.forEach((result) => {
      console.log(`  ❌ ${result.platform}: ${result.error}`);
    });

    return res.status(200).json({
      message: "Auto-publishing completed",
      operation,
      successful: successfulPublishes,
      failed: failedPublishes,
      totalPlatforms: results.length,
    });
  } catch (error) {
    console.error("❌ Error in auto-publish handler:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
