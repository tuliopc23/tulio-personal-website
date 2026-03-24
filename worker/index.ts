/// <reference types="@cloudflare/workers-types" />
import * as Sentry from "@sentry/cloudflare";

/**
 * Cloudflare Worker entry point.
 *
 * Static assets (Astro build output in ./dist) are served automatically
 * by the assets binding. This Worker only handles dynamic API routes.
 */

interface Env {
  GITHUB_TOKEN?: string;
  GITHUB_PERSONAL_ACCESS_TOKEN?: string;
  SANITY_API_READ_TOKEN?: string;
  SENTRY_DSN?: string;
  CACHE: KVNamespace;
}

// ─── GitHub API handler ──────────────────────────────────────────────────────

interface SanityFeaturedRepo {
  _id: string;
  repoFullName: string;
  displayTitle?: string;
  description?: string;
  category?: string;
  featured: boolean;
  order: number;
  showRepositoryLink: boolean;
  showPrivate: boolean;
  visibleInProofOfWork: boolean;
}

interface GitHubRestRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  updated_at: string;
  private: boolean;
}

interface GitHubRestCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

const SANITY_PROJECT_ID = "61249gtj";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-02-19";

const LANGUAGE_OVERRIDES: Record<string, string> = {
  "tuliopc23/tulio-personal-website": "TypeScript",
};

/** Origins allowed to call /api/github.json from the browser (www + apex). */
const CORS_ALLOWED_ORIGINS = new Set(["https://www.tuliocunha.dev", "https://tuliocunha.dev"]);

function accessControlAllowOrigin(request: Request): string | undefined {
  const origin = request.headers.get("Origin");
  if (!origin) return "https://www.tuliocunha.dev";
  return CORS_ALLOWED_ORIGINS.has(origin) ? origin : undefined;
}

function withCors(request: Request, headers: Record<string, string>): Record<string, string> {
  const allow = accessControlAllowOrigin(request);
  if (allow) {
    return { ...headers, "Access-Control-Allow-Origin": allow };
  }
  return { ...headers };
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "recently";
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  return `${Math.floor(diffInMonths / 12)}y ago`;
}

function stripEmojis(str: string): string {
  return (str ?? "")
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    )
    .trim();
}

async function fetchSanityRepos(readToken?: string): Promise<SanityFeaturedRepo[]> {
  const query = encodeURIComponent(
    `*[_type == "featuredGithubRepo" && featured == true && visibleInProofOfWork == true] | order(order asc) { _id, repoFullName, displayTitle, description, category, featured, order, showRepositoryLink, showPrivate, visibleInProofOfWork }`,
  );
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (readToken) headers.Authorization = `Bearer ${readToken}`;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const json = (await res.json()) as { result: SanityFeaturedRepo[] };
  return json.result ?? [];
}

async function fetchGitHub<T>(path: string, tokens: string[]): Promise<T | null> {
  if (tokens.length === 0) return null;

  for (const token of tokens) {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "tulio-personal-website-worker",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (res.ok) {
      return res.json() as Promise<T>;
    }

    if (res.status === 404) {
      return null;
    }

    console.warn(`[github] ${path} failed with ${res.status}; trying next token if available`);
  }

  return null;
}

const GITHUB_CACHE_KEY = "github:api:v1";
const GITHUB_CACHE_TTL = 300; // 5 minutes

async function handleGitHubApi(request: Request, env: Env): Promise<Response> {
  // Serve from KV cache if available
  const cached = await env.CACHE.get(GITHUB_CACHE_KEY);
  if (cached) {
    return new Response(cached, {
      status: 200,
      headers: withCors(request, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "X-Cache": "HIT",
      }),
    });
  }

  const githubTokens = [env.GITHUB_PERSONAL_ACCESS_TOKEN, env.GITHUB_TOKEN].filter(
    (value): value is string => Boolean(value?.trim()),
  );
  const sanityToken = env.SANITY_API_READ_TOKEN;

  try {
    const sanityRepos = await fetchSanityRepos(sanityToken);
    const results: unknown[] = [];

    for (const repo of sanityRepos) {
      const ghRepo = await fetchGitHub<GitHubRestRepo>(`/repos/${repo.repoFullName}`, githubTokens);
      if (!ghRepo) continue;
      if (ghRepo.private && !repo.showPrivate) continue;

      const ghCommits = await fetchGitHub<GitHubRestCommit[]>(
        `/repos/${repo.repoFullName}/commits?per_page=5`,
        githubTokens,
      );

      const commits = (ghCommits ?? [])
        .filter((c) => c.commit?.message)
        .map((c) => ({
          sha: c.sha,
          shortSha: c.sha.substring(0, 7).toUpperCase(),
          message: c.commit.message.split("\n")[0].trim(),
          committedAt: formatRelativeTime(c.commit.author.date),
          url: c.html_url,
        }));

      const primaryLanguage = LANGUAGE_OVERRIDES[ghRepo.full_name] ?? ghRepo.language ?? "Code";

      results.push({
        id: repo._id,
        repoFullName: ghRepo.full_name,
        repoName: ghRepo.name,
        displayTitle: repo.displayTitle ?? ghRepo.name,
        description: repo.description ?? stripEmojis(ghRepo.description ?? ""),
        category: repo.category ?? "Code",
        primaryLanguage,
        primaryLanguageIcon:
          primaryLanguage.toLowerCase() in { astro: 1, javascript: 1, swift: 1, typescript: 1 }
            ? primaryLanguage.toLowerCase()
            : null,
        updatedAt: ghRepo.updated_at,
        isPrivate: ghRepo.private,
        repoUrl: ghRepo.html_url,
        showRepositoryLink: repo.showRepositoryLink,
        commits,
      });
    }

    const body = JSON.stringify(results);
    await env.CACHE.put(GITHUB_CACHE_KEY, body, { expirationTtl: GITHUB_CACHE_TTL });

    return new Response(body, {
      status: 200,
      headers: withCors(request, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "X-Cache": "MISS",
      }),
    });
  } catch (err) {
    console.error("[/api/github.json] Error:", err);
    return new Response(JSON.stringify({ error: "Failed to load GitHub data" }), {
      status: 500,
      headers: withCors(request, { "Content-Type": "application/json" }),
    });
  }
}

// ─── Worker fetch handler ────────────────────────────────────────────────────

export default Sentry.withSentry(
  (env: Env) => ({
    dsn: env.SENTRY_DSN ?? undefined,
    enabled: Boolean(env.SENTRY_DSN),
    tracesSampleRate: 1.0,
    environment: "production",
  }),
  {
    async fetch(request: Request, env: Env): Promise<Response> {
      const url = new URL(request.url);

      if (url.pathname === "/api/github.json" && request.method === "GET") {
        return handleGitHubApi(request, env);
      }

      // All static assets are served by the assets binding before reaching here.
      // If we get here, nothing matched — return 404.
      return new Response("Not Found", { status: 404 });
    },
  } satisfies ExportedHandler<Env>,
);
