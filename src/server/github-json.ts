/**
 * `/api/github.json` — merges curated repo list from site YAML with live GitHub REST data.
 * Shared by the Astro API route (SSR on Cloudflare). Logic adapted from legacy `worker-archive/index.ts`.
 */
import { parse as parseYaml } from "yaml";

export interface FeaturedRepo {
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

export interface WorkerEnvSubset {
  GITHUB_TOKEN?: string;
  GITHUB_PERSONAL_ACCESS_TOKEN?: string;
  CACHE: KVNamespace;
}

const LANGUAGE_OVERRIDES: Record<string, string> = {
  "tuliopc23/tulio-personal-website": "TypeScript",
};

/** Origins allowed to call `/api/github.json` from the browser (www + apex). */
const CORS_ALLOWED_ORIGINS = new Set(["https://www.tuliocunha.dev", "https://tuliocunha.dev"]);

export function accessControlAllowOrigin(request: Request): string | undefined {
  const origin = request.headers.get("Origin");
  if (!origin) return "https://www.tuliocunha.dev";
  return CORS_ALLOWED_ORIGINS.has(origin) ? origin : undefined;
}

export function withCors(
  request: Request,
  headers: Record<string, string>,
): Record<string, string> {
  const allow = accessControlAllowOrigin(request);
  if (allow) {
    return { ...headers, "Access-Control-Allow-Origin": allow };
  }
  return { ...headers };
}

export function json(request: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: withCors(request, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    }),
  });
}

function parseFeaturedReposFromYaml(raw: string): FeaturedRepo[] {
  const doc = parseYaml(raw) as { repos?: Array<Record<string, unknown>> };
  const repos = (doc.repos ?? [])
    .map((r) => {
      const id = typeof r.id === "string" ? r.id : typeof r._id === "string" ? r._id : "";
      const repoFullName = typeof r.repoFullName === "string" ? r.repoFullName : "";
      return {
        _id: id,
        repoFullName,
        displayTitle: typeof r.displayTitle === "string" ? r.displayTitle : undefined,
        description: typeof r.description === "string" ? r.description : undefined,
        category: typeof r.category === "string" ? r.category : undefined,
        featured: Boolean(r.featured),
        order: typeof r.order === "number" ? r.order : 0,
        showRepositoryLink: typeof r.showRepositoryLink === "boolean" ? r.showRepositoryLink : true,
        showPrivate: typeof r.showPrivate === "boolean" ? r.showPrivate : false,
        visibleInProofOfWork:
          typeof r.visibleInProofOfWork === "boolean" ? r.visibleInProofOfWork : true,
      };
    })
    .filter((r) => r._id && r.repoFullName);

  return repos.filter((r) => r.featured && r.visibleInProofOfWork);
}

/** Bundled at build time — Keystatic/git updates require redeploy for API to reflect curation edits. */
export function featuredReposFromSiteYaml(siteYamlRaw: string): FeaturedRepo[] {
  try {
    return parseFeaturedReposFromYaml(siteYamlRaw);
  } catch {
    return [];
  }
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

async function fetchGitHub<T>(path: string, tokens: string[]): Promise<T | null> {
  if (tokens.length === 0) return null;
  let lastFailureStatus: number | null = null;

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

    lastFailureStatus = res.status;
    console.warn(`[github] ${path} failed with ${res.status}; trying next token if available`);
  }

  if (lastFailureStatus !== null) {
    throw new Error(
      `GitHub request failed for ${path} after exhausting configured tokens (last status: ${lastFailureStatus})`,
    );
  }

  return null;
}

const GITHUB_CACHE_KEY = "github:api:v1";
const GITHUB_CACHE_TTL = 300;

export async function handleGitHubApi(
  request: Request,
  env: WorkerEnvSubset,
  siteYamlRaw: string,
): Promise<Response> {
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

  try {
    const featuredRepos = featuredReposFromSiteYaml(siteYamlRaw);
    const results = (
      await Promise.all(
        featuredRepos.map(async (repo) => {
          const [ghRepo, ghCommits] = await Promise.all([
            fetchGitHub<GitHubRestRepo>(`/repos/${repo.repoFullName}`, githubTokens),
            fetchGitHub<GitHubRestCommit[]>(
              `/repos/${repo.repoFullName}/commits?per_page=5`,
              githubTokens,
            ),
          ]);

          if (!ghRepo) return null;
          if (ghRepo.private && !repo.showPrivate) return null;

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

          return {
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
          };
        }),
      )
    ).filter((repo): repo is NonNullable<typeof repo> => repo !== null);

    const body = JSON.stringify(results);
    await env.CACHE.put(GITHUB_CACHE_KEY, body, {
      expirationTtl: GITHUB_CACHE_TTL,
    });

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

    try {
      const stale = await env.CACHE.get(GITHUB_CACHE_KEY);
      if (stale) {
        return new Response(stale, {
          status: 200,
          headers: withCors(request, {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=30, stale-while-revalidate=600",
            "X-Cache": "STALE",
            "X-Stale-Reason": "upstream-error",
          }),
        });
      }
    } catch {
      // fall through
    }

    return new Response(JSON.stringify({ error: "Failed to load GitHub data" }), {
      status: 500,
      headers: withCors(request, { "Content-Type": "application/json" }),
    });
  }
}
