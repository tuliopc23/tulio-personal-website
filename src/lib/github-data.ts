export const CACHE_TTL_MS = 60000; // 60 seconds

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

export interface GitHubRestRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  updated_at: string;
  private: boolean;
}

export interface GitHubCommit {
  sha: string;
  shortSha: string;
  message: string;
  committedAt: string;
  url: string;
}

export interface NormalizedRepoCard {
  id: string;
  repoFullName: string;
  repoName: string;
  displayTitle: string;
  description: string;
  category: string;
  primaryLanguage: string;
  primaryLanguageIcon: string | null;
  updatedAt: string;
  isPrivate: boolean;
  repoUrl: string;
  showRepositoryLink: boolean;
  commits: GitHubCommit[];
}

import { parse as parseYaml } from "yaml";
import featuredGithubYaml from "../content/site/featured-github/index.yaml?raw";

interface GitHubRestCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

const curatedLanguageOverrides: Record<string, string> = {
  "tuliopc23/tulio-personal-website": "TypeScript",
};

const languageIconMap: Record<string, string> = {
  astro: "astro",
  javascript: "javascript",
  swift: "swift",
  typescript: "typescript",
};

function resolvePrimaryLanguage(repoFullName: string, githubLanguage: string | null): string {
  return curatedLanguageOverrides[repoFullName] || githubLanguage || "Code";
}

function resolveLanguageIcon(language: string): string | null {
  return languageIconMap[language.trim().toLowerCase()] ?? null;
}

/** Featured repos curated in-repo (`src/content/site/featured-github/index.yaml`). */
async function fetchFeaturedRepos(): Promise<FeaturedRepo[]> {
  try {
    const doc = parseYaml(featuredGithubYaml) as { repos?: Array<Record<string, unknown>> };
    const repos = (doc.repos ?? [])
      .map((r) => {
        const id = (r._id as string) || (r.id as string) || "";
        return { ...r, _id: id } as FeaturedRepo;
      })
      .filter((r) => r._id);
    return repos.filter((r) => r.featured && r.visibleInProofOfWork);
  } catch (err) {
    console.error("Failed to load featured-github/index.yaml:", err);
    return [];
  }
}

async function fetchFromGitHub<T>(endpoint: string, token: string | undefined): Promise<T | null> {
  if (!token) {
    console.error("GitHub token is missing.");
    return null;
  }

  try {
    const res = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "tulio-personal-website-build",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching from GitHub (${endpoint}):`, error);
    return null;
  }
}

/**
 * Strips common emojis from text. Often used for GitHub descriptions.
 */
export function stripEmojis(str: string): string {
  if (!str) return "";
  return str
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    )
    .trim();
}

/**
 * Formats a date relatively (e.g., "2 hours ago").
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "recently";
  }
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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

/**
 * Merges curated repo data with live GitHub data.
 */
export async function getMergedGitHubData(
  githubToken: string | undefined,
): Promise<NormalizedRepoCard[]> {
  const featuredRepos = await fetchFeaturedRepos();
  const normalizedRepos = await Promise.all(
    featuredRepos.map(async (repo) => {
      const { repoFullName } = repo;
      const [ghRepo, ghCommits] = await Promise.all([
        fetchFromGitHub<GitHubRestRepo>(`/repos/${repoFullName}`, githubToken),
        fetchFromGitHub<GitHubRestCommit[]>(
          `/repos/${repoFullName}/commits?per_page=5`,
          githubToken,
        ),
      ]);

      if (!ghRepo) return null;
      if (ghRepo.private && !repo.showPrivate) return null;

      const mappedCommits: GitHubCommit[] = (ghCommits || [])
        .filter((c) => c.commit?.message)
        .map((c) => {
          const fullMessage = c.commit.message as string;
          const subject = fullMessage.split("\n")[0].trim();

          return {
            sha: c.sha,
            shortSha: c.sha.substring(0, 7).toUpperCase(),
            message: subject,
            committedAt: formatRelativeTime(c.commit.author.date),
            url: c.html_url,
          };
        });

      const finalTitle = repo.displayTitle || ghRepo.name;
      const finalDesc = repo.description || stripEmojis(ghRepo.description || "");
      const finalCategory = repo.category || ghRepo.language || "Code";
      const finalLanguage = resolvePrimaryLanguage(ghRepo.full_name, ghRepo.language);

      return {
        id: repo._id,
        repoFullName: ghRepo.full_name,
        repoName: ghRepo.name,
        displayTitle: finalTitle,
        description: finalDesc,
        category: finalCategory,
        primaryLanguage: finalLanguage,
        primaryLanguageIcon: resolveLanguageIcon(finalLanguage),
        updatedAt: ghRepo.updated_at,
        isPrivate: ghRepo.private,
        repoUrl: ghRepo.html_url,
        showRepositoryLink: repo.showRepositoryLink,
        commits: mappedCommits,
      } satisfies NormalizedRepoCard;
    }),
  );

  return normalizedRepos.filter((repo): repo is NormalizedRepoCard => repo !== null);
}
