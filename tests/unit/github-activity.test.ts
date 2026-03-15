import {
  fetchReposWithCommits,
  formatCommitMessage,
  formatRelativeTime,
  resetGitHubRepoCache,
  stripEmojis,
} from "../../src/components/github-activity-utils";

describe("GitHubActivity helpers", () => {
  test("formats relative times and commit messages", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-14T12:00:00Z"));

    expect(formatRelativeTime("2026-03-14T11:59:00Z")).toBe("1m ago");
    expect(formatRelativeTime("2026-03-14T10:00:00Z")).toBe("2h ago");
    expect(formatRelativeTime("2026-03-10T12:00:00Z")).toBe("4d ago");
    expect(formatRelativeTime("invalid-date")).toBe("recently");
    expect(stripEmojis("Ship stuff rocket 🚀")).toBe("Ship stuff rocket");
    expect(formatCommitMessage(`line 1\n\nline 2`)).toBe("line 1");
    expect(formatCommitMessage("x".repeat(130))).toHaveLength(110);
  });

  test("fetches repositories, maps commits, and caches results", async () => {
    resetGitHubRepoCache();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-14T12:00:00Z"));

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            name: "repo-one",
            full_name: "tuliopc23/repo-one",
            html_url: "https://github.com/tuliopc23/repo-one",
            description: "Ship stuff 🚀",
            language: "TypeScript",
            stargazers_count: 3,
            size: 10,
            private: false,
          },
          {
            name: "private-repo",
            full_name: "tuliopc23/private-repo",
            html_url: "https://github.com/tuliopc23/private-repo",
            description: null,
            language: null,
            stargazers_count: 0,
            size: 10,
            private: true,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            sha: "1234567890",
            html_url: "https://github.com/tuliopc23/repo-one/commit/1234567",
            commit: {
              message: "Add homepage tests\n\nDetails",
              author: { date: "2026-03-14T11:59:00Z" },
            },
          },
        ],
      });

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchReposWithCommits("tuliopc23", "token", 1);
    expect(result).toEqual([
      {
        name: "repo-one",
        url: "https://github.com/tuliopc23/repo-one",
        description: "Ship stuff 🚀",
        language: "TypeScript",
        stars: 3,
        commits: [
          {
            sha: "1234567",
            message: "Add homepage tests",
            date: "1m ago",
            url: "https://github.com/tuliopc23/repo-one/commit/1234567",
          },
        ],
      },
    ]);

    const cached = await fetchReposWithCommits("tuliopc23", "token", 1);
    expect(cached).toEqual(result);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("throws on GitHub API failures", async () => {
    resetGitHubRepoCache();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      })
    );

    await expect(fetchReposWithCommits("tuliopc23", undefined, 1)).rejects.toThrow(
      "GitHub API error 403"
    );
  });
});
