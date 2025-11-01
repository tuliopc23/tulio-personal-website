import dotenv from "dotenv";
import { toPlainText } from "astro-portabletext";
import { loadQuery } from "../src/sanity/lib/load-query.js";

dotenv.config();

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
    return;
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
    return result;
  } catch (error) {
    console.error("❌ Error publishing to Dev.to:", error.message);
  }
}

// Get full article data from Sanity
async function getFullArticle(slug) {
  const { data } = await loadQuery({
    query: `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      summary,
      "slug": slug.current,
      publishedAt,
      tags,
      content[]{
        ...,
        _type == "image" => {
          ...,
          "url": asset->url,
          "alt": coalesce(alt, asset->altText),
          caption,
        }
      },
      seo{
        metaTitle,
        metaDescription,
        canonicalUrl,
        "noIndex": coalesce(noIndex, false)
      }
    }`,
    params: { slug },
  });

  return data;
}

// Main function to handle webhook
async function handleSanityWebhook(webhookData) {
  const { documentId, slug, operation } = webhookData;

  if (operation === "delete") {
    console.log("🗑️  Article deleted:", documentId);
    return;
  }

  if (!slug) {
    console.log("⚠️  No slug in webhook data");
    return;
  }

  console.log(`📋 Processing ${operation} for article:`, slug);

  try {
    // Get full article data
    const article = await getFullArticle(slug);

    if (!article) {
      console.log("⚠️  Article not found in Sanity:", slug);
      return;
    }

    // Skip if marked as no-index
    if (article.seo?.noIndex) {
      console.log("⏭️  Skipping - article marked as no-index");
      return;
    }

    // Publish to Dev.to
    await publishToDevTo(article);
  } catch (error) {
    console.error("❌ Error processing article:", error);
  }
}

// CLI usage: node script.js <webhook_data_json>
if (process.argv.length > 2) {
  try {
    const webhookData = JSON.parse(process.argv[2]);
    handleSanityWebhook(webhookData);
  } catch (error) {
    console.error("❌ Error parsing webhook data:", error.message);
  }
}

// Export for use in other scripts
export { handleSanityWebhook, publishToDevTo };
