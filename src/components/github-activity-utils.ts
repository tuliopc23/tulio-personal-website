type GitHubCommitApi = {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
  html_url: string;
};

type GitHubRepoApi = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  size: number;
  private: boolean;
};

export type GitHubCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
};

export type GitHubRepo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  commits: GitHubCommit[];
};

export const CACHE_TTL_MS = 5 * 60 * 1000;
const repoCache = new Map<string, { timestamp: number; data: GitHubRepo[] }>();

export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  if (Number.isNaN(then)) return "recently";

  const diffMinutes = Math.floor((now - then) / 60000);
  if (diffMinutes < 60) return `${Math.max(1, diffMinutes)}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function stripEmojis(text: string): string {
  return text.replace(/[\p{Emoji}\p{Emoji_Component}]/gu, "").trim();
}

export function formatCommitMessage(message: string): string {
  const line = message.split("\n")[0]?.trim() ?? "Update";
  return line.length <= 110 ? line : `${line.slice(0, 107)}...`;
}

export async function fetchReposWithCommits(
  username: string,
  token?: string,
  limit = 8,
): Promise<GitHubRepo[]> {
  const cached = repoCache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data.slice(0, limit);
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos?sort=pushed&per_page=12`,
    { headers },
  );

  if (!reposResponse.ok) {
    throw new Error(`GitHub API error ${reposResponse.status}`);
  }

  const repos = (await reposResponse.json()) as GitHubRepoApi[];
  const filtered = repos
    .filter((repo) => !repo.private && repo.size > 0)
    .slice(0, Math.max(limit, 8));

  const mapped = await Promise.all(
    filtered.map(async (repo) => {
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?per_page=3`,
          { headers },
        );

        if (!commitsResponse.ok) {
          return null;
        }

        const commitsApi = (await commitsResponse.json()) as GitHubCommitApi[];
        const commits: GitHubCommit[] = commitsApi.map((commit) => ({
          sha: commit.sha.slice(0, 7),
          message: formatCommitMessage(commit.commit.message),
          date: formatRelativeTime(commit.commit.author.date),
          url: commit.html_url,
        }));

        if (commits.length === 0) {
          return null;
        }

        return {
          name: repo.name,
          url: repo.html_url,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          commits,
        } as GitHubRepo;
      } catch {
        return null;
      }
    }),
  );

  const data = mapped.filter((repo): repo is GitHubRepo => Boolean(repo));
  repoCache.set(username, { timestamp: Date.now(), data });
  return data.slice(0, limit);
}

export function resetGitHubRepoCache(): void {
  repoCache.clear();
}
