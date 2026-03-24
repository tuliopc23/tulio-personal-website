import dotenv from "dotenv";
import { toPlainText } from "astro-portabletext";
import { loadQuery } from "../src/sanity/lib/load-query.js";

dotenv.config();

// Convert Sanity Portable Text blocks to Markdown (Hashnode prefers Markdown)
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

// Publish to Hashnode using API v2 (GraphQL)
async function publishToHashnode(articleData) {
  const hashnodeToken = process.env.HASHNODE_ACCESS_TOKEN;
  const publicationId = process.env.HASHNODE_PUBLICATION_ID;

  if (!hashnodeToken || !publicationId) {
    console.log(
      "⚠️  HASHNODE_ACCESS_TOKEN or HASHNODE_PUBLICATION_ID not set - skipping Hashnode publishing",
    );
    return;
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
          articleData.seo?.canonicalUrl || `https://www.tuliocunha.dev/blog/${articleData.slug}/`,
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
    return post;
  } catch (error) {
    console.error("❌ Error publishing to Hashnode:", error.message);
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
    const article = await getFullArticle(slug);

    if (!article) {
      console.log("⚠️  Article not found in Sanity:", slug);
      return;
    }

    if (article.seo?.noIndex) {
      console.log("⏭️  Skipping - article marked as no-index");
      return;
    }

    await publishToHashnode(article);
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

export { handleSanityWebhook, publishToHashnode };
