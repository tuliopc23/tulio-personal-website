export const CACHE_TTL_MS = 60000; // 60 seconds

export interface SanityFeaturedRepo {
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
  updatedAt: string;
  isPrivate: boolean;
  repoUrl: string;
  showRepositoryLink: boolean;
  commits: GitHubCommit[];
}

import { loadQuery } from "../sanity/lib/load-query";

interface GitHubRestCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

/**
 * Fetch featured repositories from Sanity.
 */
async function fetchSanityRepos(): Promise<SanityFeaturedRepo[]> {
  const query = `
    *[_type == "featuredGithubRepo" && featured == true && visibleInProofOfWork == true] | order(order asc) {
      _id,
      repoFullName,
      displayTitle,
      description,
      category,
      featured,
      order,
      showRepositoryLink,
      showPrivate,
      visibleInProofOfWork
    }
  `;

  try {
    const { data } = await loadQuery<SanityFeaturedRepo[]>({
      query,
    });
    return data ?? [];
  } catch (err) {
    console.error("Failed to fetch Sanity repos:", err);
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
        Accept: "application/vnd.github.v3+json",
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
 * Merges Sanity editorial data with live GitHub data.
 */
export async function getMergedGitHubData(
  githubToken: string | undefined,
): Promise<NormalizedRepoCard[]> {
  const sanityRepos = await fetchSanityRepos();

  if (sanityRepos.length === 0 && import.meta.env.DEV) {
    return [{
      id: "mock-1",
      repoFullName: "tuliopc23/tulio-personal-website",
      repoName: "tulio-personal-website",
      displayTitle: "tulio-personal-website",
      description: "My personal website, integrated from Sanity and Astro.",
      category: "Personal Portfolio",
      primaryLanguage: "Astro",
      updatedAt: new Date().toISOString(),
      isPrivate: false,
      repoUrl: "https://github.com/tuliopc23/tulio-personal-website",
      showRepositoryLink: true,
      commits: [
        {
          sha: "abcdef123456",
          shortSha: "ABCDEF1",
          message: "Redesign GitHub components into editorial islands",
          url: "#",
          committedAt: "2h ago"
        },
        {
          sha: "fe3456789123",
          shortSha: "FE34567",
          message: "Refactor SolidJS out of proof of work",
          url: "#",
          committedAt: "5h ago"
        },
        {
          sha: "dd890123456",
          shortSha: "DD89012",
          message: "Add CSS modules with container queries",
          url: "#",
          committedAt: "1d ago"
        }
      ]
    }];
  }

  const normalizedRepos: NormalizedRepoCard[] = [];

  for (const sanityRepo of sanityRepos) {
    const { repoFullName } = sanityRepo;

    // Fetch live metadata
    const ghRepo = await fetchFromGitHub<GitHubRestRepo>(`/repos/${repoFullName}`, githubToken);

    // Skip if repo isn't found or if it's private but we don't have permission to show it
    if (!ghRepo) continue;
    if (ghRepo.private && !sanityRepo.showPrivate) continue;

    // Fetch recent commits (limit 5 for clean UI)
    const ghCommits = await fetchFromGitHub<GitHubRestCommit[]>(
      `/repos/${repoFullName}/commits?per_page=5`,
      githubToken,
    );

    const mappedCommits: GitHubCommit[] = (ghCommits || [])
      .filter((c) => c.commit?.message)
      .map((c) => {
        const fullMessage = c.commit.message as string;
        // Keep only the first line of the commit message (subject)
        const subject = fullMessage.split("\n")[0].trim();

        return {
          sha: c.sha,
          shortSha: c.sha.substring(0, 7).toUpperCase(), // Match design system CAPS style
          message: subject,
          committedAt: formatRelativeTime(c.commit.author.date),
          url: c.html_url,
        };
      });

    // Merge logic
    // displayTitle from Sanity overrides actual Repo Name
    const finalTitle = sanityRepo.displayTitle || ghRepo.name;

    // description from Sanity overrides GitHub description
    const finalDesc = sanityRepo.description || stripEmojis(ghRepo.description || "");

    // category from Sanity overrides generic logic
    const finalCategory =
      sanityRepo.category || Object.keys(ghRepo.language || {}).join(", ") || "Code";

    normalizedRepos.push({
      id: sanityRepo._id,
      repoFullName: ghRepo.full_name,
      repoName: ghRepo.name,
      displayTitle: finalTitle,
      description: finalDesc,
      category: finalCategory,
      primaryLanguage: ghRepo.language || "Code",
      updatedAt: ghRepo.updated_at,
      isPrivate: ghRepo.private,
      repoUrl: ghRepo.html_url,
      showRepositoryLink: sanityRepo.showRepositoryLink,
      commits: mappedCommits,
    });
  }

  return normalizedRepos;
}
