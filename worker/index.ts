interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  PUBLIC_SANITY_PROJECT_ID?: string;
  PUBLIC_SANITY_DATASET?: string;
  SANITY_API_WRITE_TOKEN?: string;
  SANITY_WEBHOOK_SECRET?: string;
  DEV_TO_API_KEY?: string;
  GITHUB_PERSONAL_ACCESS_TOKEN?: string;
  GITHUB_REPOSITORY?: string;
}

interface WebhookArticle {
  title?: string;
  summary?: string;
  slug?: string;
  tags?: string[];
  content?: Array<{ _type: string; style?: string; children?: Array<{ text?: string }> }>;
  operation?: string;
  crossposting?: {
    devto?: {
      enabled?: boolean;
    };
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function extractPortableText(blocks: WebhookArticle["content"]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (block?._type !== "block") return "";
      const text = (block.children ?? [])
        .map((child) => child.text ?? "")
        .join("")
        .trim();
      if (!text) return "";
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
    })
    .filter(Boolean)
    .join("\n\n");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function extractSha256Signature(rawSignature: string): string | null {
  const match = rawSignature.match(/[a-f0-9]{64}/i);
  return match ? match[0].toLowerCase() : null;
}

async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
) {
  const expected = extractSha256Signature(signatureHeader);
  if (!expected) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const actual = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return timingSafeEqual(actual, expected);
}

async function publishToDevTo(payload: WebhookArticle, apiKey: string) {
  const slug = payload.slug ?? "";
  const body = extractPortableText(payload.content);

  const article = {
    article: {
      title: payload.title ?? "Untitled",
      body_markdown: body,
      description: payload.summary ?? "",
      tags: payload.tags ?? [],
      published: true,
      canonical_url: `https://www.tuliocunha.dev/blog/${slug}/`,
    },
  };

  const response = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(article),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Dev.to publish failed (${response.status}): ${error}`);
  }
}

async function triggerGitHubDispatch(title: string, operation: string, env: Env) {
  if (!env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    return { success: false, reason: "missing_github_token" };
  }

  const repository = env.GITHUB_REPOSITORY || "tuliopc23/tulio-personal-website";
  const response = await fetch(`https://api.github.com/repos/${repository}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      Accept: "application/vnd.github+json",
      "content-type": "application/json",
      "User-Agent": "tulio-personal-website-webhook",
    },
    body: JSON.stringify({
      event_type: "sanity-content-update",
      client_payload: { title, operation },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub dispatch failed (${response.status}): ${error}`);
  }

  return { success: true };
}

async function handleAutoPublish(request: Request, env: Env): Promise<Response> {
  if (request.method === "GET") {
    return json({ status: "active", message: "Use POST for Sanity webhook events." });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const rawBody = await request.text();
  const signature =
    request.headers.get("x-sanity-signature") ??
    request.headers.get("sanity-webhook-signature") ??
    "";

  if (env.SANITY_WEBHOOK_SECRET && signature) {
    const validSignature = await verifyWebhookSignature(
      rawBody,
      signature,
      env.SANITY_WEBHOOK_SECRET
    );
    if (!validSignature) {
      return json({ error: "Invalid webhook signature" }, 401);
    }
  }

  let payload: WebhookArticle;
  try {
    payload = JSON.parse(rawBody) as WebhookArticle;
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const operation = payload.operation ?? "update";
  const title = payload.title ?? "Untitled";

  let devToPublished = false;
  if (
    operation !== "delete" &&
    payload.crossposting?.devto?.enabled &&
    env.DEV_TO_API_KEY
  ) {
    await publishToDevTo(payload, env.DEV_TO_API_KEY);
    devToPublished = true;
  }

  const dispatch = await triggerGitHubDispatch(title, operation, env);

  return json({
    ok: true,
    operation,
    title,
    devToPublished,
    rebuildTriggered: dispatch.success,
    rebuildReason: dispatch.success ? undefined : dispatch.reason,
  });
}

async function fetchScheduledPosts(env: Env) {
  if (
    !env.SANITY_API_WRITE_TOKEN ||
    !env.PUBLIC_SANITY_PROJECT_ID ||
    !env.PUBLIC_SANITY_DATASET
  ) {
    return [] as Array<{ _id: string; title: string }>;
  }

  const now = new Date().toISOString();
  const query = encodeURIComponent(
    `*[_type == "post" && defined(scheduledPublishAt) && scheduledPublishAt <= "${now}"]{_id,title}`
  );

  const response = await fetch(
    `https://${env.PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${env.PUBLIC_SANITY_DATASET}?query=${query}`,
    {
      headers: { Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Scheduled query failed (${response.status})`);
  }

  const data = (await response.json()) as {
    result?: Array<{ _id: string; title: string }>;
  };
  return data.result ?? [];
}

async function publishScheduledPost(postId: string, env: Env) {
  const response = await fetch(
    `https://${env.PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2025-02-19/data/mutate/${env.PUBLIC_SANITY_DATASET}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${env.SANITY_API_WRITE_TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            patch: {
              id: postId,
              set: { publishedAt: new Date().toISOString() },
              unset: ["scheduledPublishAt"],
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Scheduled publish failed (${response.status}): ${error}`);
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/auto-publish") {
      try {
        return await handleAutoPublish(request, env);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected webhook error";
        return json({ error: message }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },

  async scheduled(_controller, env): Promise<void> {
    try {
      const posts = await fetchScheduledPosts(env);
      for (const post of posts) {
        await publishScheduledPost(post._id, env);
        console.log(`Published scheduled post: ${post.title}`);
      }
    } catch (error) {
      console.error("Scheduled publish check failed:", error);
    }
  },
};
