/// <reference types="@cloudflare/workers-types" />

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

async function fetchGitHub<T>(path: string, token?: string): Promise<T | null> {
  if (!token) return null;
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

async function handleGitHubApi(env: Env): Promise<Response> {
  const githubToken = env.GITHUB_TOKEN ?? env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const sanityToken = env.SANITY_API_READ_TOKEN;

  try {
    const sanityRepos = await fetchSanityRepos(sanityToken);
    const results: unknown[] = [];

    for (const repo of sanityRepos) {
      const ghRepo = await fetchGitHub<GitHubRestRepo>(`/repos/${repo.repoFullName}`, githubToken);
      if (!ghRepo) continue;
      if (ghRepo.private && !repo.showPrivate) continue;

      const ghCommits = await fetchGitHub<GitHubRestCommit[]>(
        `/repos/${repo.repoFullName}/commits?per_page=5`,
        githubToken,
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

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "https://www.tuliocunha.dev",
      },
    });
  } catch (err) {
    console.error("[/api/github.json] Error:", err);
    return new Response(JSON.stringify({ error: "Failed to load GitHub data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ─── Worker fetch handler ────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/github.json" && request.method === "GET") {
      return handleGitHubApi(env);
    }

    // All static assets are served by the assets binding before reaching here.
    // If we get here, nothing matched — return 404.
    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
