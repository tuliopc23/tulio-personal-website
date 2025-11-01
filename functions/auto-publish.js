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

// Publish to Medium
async function publishToMedium(articleData) {
  const mediumAccessToken = process.env.MEDIUM_ACCESS_TOKEN;

  if (!mediumAccessToken) {
    console.log("⚠️  MEDIUM_ACCESS_TOKEN not set - skipping Medium publishing");
    return { success: false, message: "MEDIUM_ACCESS_TOKEN not set" };
  }

  try {
    // Get Medium user ID first
    const userResponse = await fetch("https://api.medium.com/v1/me", {
      headers: {
        Authorization: `Bearer ${mediumAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Medium user API error (${userResponse.status})`);
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Convert content to HTML
    const bodyHtml = portableTextToHtml(articleData.content || []);

    // Prepare article data for Medium
    const article = {
      title: articleData.title,
      contentFormat: "html",
      content: bodyHtml,
      publishStatus: "public",
      canonicalUrl:
        articleData.seo?.canonicalUrl ||
        `https://www.tuliocunha.dev/blog/${articleData.slug}/`,
      tags: articleData.tags || [],
    };

    console.log("📝 Publishing to Medium:", articleData.title);

    const response = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mediumAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Medium API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Successfully published to Medium:", result.data.url);
    return { success: true, url: result.data.url, platform: "Medium" };
  } catch (error) {
    console.error("❌ Error publishing to Medium:", error.message);
    return { success: false, error: error.message, platform: "Medium" };
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

    // Publish to Medium
    const mediumResult = await publishToMedium(webhookData);
    results.push(mediumResult);

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
