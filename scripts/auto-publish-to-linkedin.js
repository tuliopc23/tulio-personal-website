import dotenv from "dotenv";
import { loadQuery } from "../src/sanity/lib/load-query.js";

dotenv.config();

/**
 * Publish to LinkedIn using the Versioned Posts API
 * Requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_ID (the 'urn:li:person:ID')
 */
async function publishToLinkedIn(articleData) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_ID; // Format: urn:li:person:abcdef

  if (!accessToken || !personUrn) {
    console.log(
      "⚠️  LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_ID not set - skipping LinkedIn publishing",
    );
    return { success: false, message: "LinkedIn credentials not set" };
  }

  try {
    const summary = articleData.summary || articleData.seo?.metaDescription || "";
    const url =
      articleData.seo?.canonicalUrl || `https://www.tuliocunha.dev/blog/${articleData.slug}/`;

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

    console.log("📝 Publishing to LinkedIn:", articleData.title);

    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202401", // Use a recent version
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
    }

    // LinkedIn returns the post URN in the 'x-linkedin-id' or 'location' header
    const postId = response.headers.get("x-restli-id") || response.headers.get("x-linkedin-id");
    const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

    console.log("✅ Successfully published to LinkedIn:", postUrl);
    return { success: true, url: postUrl, id: postId, platform: "LinkedIn" };
  } catch (error) {
    console.error("❌ Error publishing to LinkedIn:", error.message);
    return { success: false, error: error.message, platform: "LinkedIn" };
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
  const { slug, operation } = webhookData;

  if (operation === "delete") return;
  if (!slug) return;

  try {
    const article = await getFullArticle(slug);
    if (!article || article.seo?.noIndex) return;

    await publishToLinkedIn(article);
  } catch (error) {
    console.error("❌ Error processing article:", error);
  }
}

if (process.argv.length > 2) {
  try {
    const webhookData = JSON.parse(process.argv[2]);
    handleSanityWebhook(webhookData);
  } catch (error) {
    console.error("❌ Error parsing webhook data:", error.message);
  }
}

export { handleSanityWebhook, publishToLinkedIn };
