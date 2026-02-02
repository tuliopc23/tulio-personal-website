import type { APIRoute } from "astro";
import { toPlainText } from "astro-portabletext";

// --- Helper Functions ---

function portableTextToMarkdown(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (block._type === "block") {
        const text = toPlainText([block]);
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
    .join("\n\n");
}

async function publishToDevTo(articleData: any) {
  const apiKey = import.meta.env.DEV_TO_API_KEY;
  if (!apiKey) return { success: false, message: "DEV_TO_API_KEY missing" };

  try {
    const body = portableTextToMarkdown(articleData.content || []);
    const article = {
      article: {
        title: articleData.title,
        body_markdown: body,
        description: articleData.summary || "",
        tags: articleData.tags || [],
        published: true,
        canonical_url: `https://tuliocunha.dev/blog/${articleData.slug}/`,
      },
    };

    const response = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify(article),
    });

    if (!response.ok) throw new Error(await response.text());
    const result = await response.json();
    return { success: true, url: result.url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function triggerGitHubRebuild(title: string) {
  const token = import.meta.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const repo = import.meta.env.GITHUB_REPOSITORY || "tuliopc23/tulio-personal-website";
  
  if (!token) return { success: false, message: "GITHUB_PERSONAL_ACCESS_TOKEN missing" };

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "sanity-content-update",
        client_payload: { title },
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- API Route Handler ---

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: "active",
      message: "The auto-publish endpoint is live. Use POST for webhooks.",
    }),
    { status: 200 }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { title, operation, crossposting } = data;

    console.log(`[Webhook] Received ${operation} for: ${title}`);

    // 1. Handle Auto-publishing to Dev.to
    let devToResult = null;
    if (operation !== "delete" && crossposting?.devto?.enabled) {
      devToResult = await publishToDevTo(data);
    }

    // 2. Trigger Site Rebuild (GitHub Actions)
    const githubResult = await triggerGitHubRebuild(title);

    return new Response(
      JSON.stringify({
        message: "Webhook processed",
        devTo: devToResult,
        rebuildTriggered: githubResult.success,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
