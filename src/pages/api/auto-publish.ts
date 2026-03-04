import type { APIRoute } from "astro";
import { toPlainText } from "astro-portabletext";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function extractSignature(rawSignature: string): string | null {
  const match = rawSignature.match(/[a-f0-9]{64}/i);
  return match ? match[0].toLowerCase() : null;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifySanityWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
) {
  const expected = extractSignature(signatureHeader);
  if (!expected) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const calculated = toHex(mac);
  return constantTimeEqual(calculated, expected);
}

// --- Helper Functions ---

interface PortableTextBlock {
  _type: string;
  style?: string;
  [key: string]: unknown;
}

function portableTextToMarkdown(blocks: PortableTextBlock[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (block._type === "block") {
        const text = toPlainText(block as unknown as Parameters<typeof toPlainText>[0]);
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

interface ArticleData {
  title: string;
  summary?: string;
  slug: string;
  tags?: string[];
  content?: PortableTextBlock[];
  [key: string]: unknown;
}

async function publishToDevTo(articleData: ArticleData) {
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
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
        "User-Agent": "tulio-personal-website-webhook",
      },
      body: JSON.stringify({
        event_type: "sanity-content-update",
        client_payload: { title },
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// --- API Route Handler ---

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: "active",
      message: "The auto-publish endpoint is live. Use POST for webhooks.",
    }),
    { status: 200 },
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const webhookSecret = import.meta.env.SANITY_WEBHOOK_SECRET;
    const signatureHeader =
      request.headers.get("x-sanity-signature") ??
      request.headers.get("sanity-webhook-signature") ??
      "";
    const rawBody = await request.text();

    if (!webhookSecret) {
      return new Response(
        JSON.stringify({ error: "Missing SANITY_WEBHOOK_SECRET server configuration" }),
        { status: 500 },
      );
    }

    const isValid = await verifySanityWebhookSignature(rawBody, signatureHeader, webhookSecret);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401,
      });
    }

    const data = JSON.parse(rawBody) as ArticleData & {
      operation?: string;
      crossposting?: { devto?: { enabled?: boolean } };
    };
    const title = (data.title || "Untitled").toString();
    const operation = (data.operation || "update").toString();
    const crossposting = data.crossposting as { devto?: { enabled?: boolean } } | undefined;

    console.log(`[Webhook] Received ${operation} for: ${title}`);

    // 1. Handle Auto-publishing to Dev.to
    let devToResult = null;
    if (operation !== "delete" && crossposting?.devto?.enabled) {
      devToResult = await publishToDevTo(data as ArticleData);
    }

    // 2. Trigger Site Rebuild (GitHub Actions)
    const githubResult = await triggerGitHubRebuild(title);

    return new Response(
      JSON.stringify({
        message: "Webhook processed",
        devTo: devToResult,
        rebuildTriggered: githubResult.success,
      }),
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
