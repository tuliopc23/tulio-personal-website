import { formatRelativeTime, stripEmojis } from "../lib/github-data";

export interface GitHubActivityCommit {
  sha: string;
  message: string;
  date: string;
  url: string;
}

export interface GitHubActivityRepo {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  commits: GitHubActivityCommit[];
}

const CACHE_TTL_MS = 60_000;

let cacheKey: string | null = null;
let cacheValue: GitHubActivityRepo[] | null = null;
let cacheTimestamp = 0;

export function resetGitHubRepoCache() {
  cacheKey = null;
  cacheValue = null;
  cacheTimestamp = 0;
}

export { formatRelativeTime, stripEmojis };

export function formatCommitMessage(message: string): string {
  const firstLine = message.split("\n")[0].trim();
  if (firstLine.length <= 110) return firstLine;
  return `${firstLine.slice(0, 107)}...`;
}

interface GitHubRestRepoLite {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  size: number;
  private: boolean;
}

interface GitHubRestCommitLite {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

export async function fetchReposWithCommits(
  username: string,
  token: string | undefined,
  limit: number,
): Promise<GitHubActivityRepo[]> {
  const key = JSON.stringify([username, limit]);
  const now = Date.now();

  if (cacheKey === key && cacheValue && now - cacheTimestamp < CACHE_TTL_MS) {
    return cacheValue;
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=${limit}`,
    { headers },
  );

  if (!reposRes.ok) {
    throw new Error(`GitHub API error ${reposRes.status}`);
  }

  const reposJson = (await reposRes.json()) as GitHubRestRepoLite[];

  const publicRepos = reposJson.filter((repo) => !repo.private).slice(0, limit);

  const results: GitHubActivityRepo[] = [];

  for (const repo of publicRepos) {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${repo.full_name}/commits?per_page=5`,
      { headers },
    );

    if (!commitsRes.ok) {
      throw new Error(`GitHub API error ${commitsRes.status}`);
    }

    const commitsJson = (await commitsRes.json()) as GitHubRestCommitLite[];

    const commits: GitHubActivityCommit[] = commitsJson.map((commit) => ({
      sha: commit.sha.slice(0, 7),
      message: formatCommitMessage(commit.commit.message),
      date: formatRelativeTime(commit.commit.author.date),
      url: commit.html_url,
    }));

    results.push({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      commits,
    });
  }

  cacheKey = key;
  cacheValue = results;
  cacheTimestamp = now;

  return results;
}

