import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import "../styles/github-activity-widget.css";

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

type GitHubCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
};

type GitHubRepo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  commits: GitHubCommit[];
};

type Props = {
  username: string;
  token?: string;
  limit?: number;
  live?: boolean;
  large?: boolean;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const repoCache = new Map<string, { timestamp: number; data: GitHubRepo[] }>();

function formatRelativeTime(dateString: string): string {
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

function stripEmojis(text: string): string {
  return text.replace(/[\p{Emoji}\p{Emoji_Component}]/gu, "").trim();
}

function formatCommitMessage(message: string): string {
  const line = message.split("\n")[0]?.trim() ?? "Update";
  return line.length <= 110 ? line : `${line.slice(0, 107)}...`;
}

async function fetchReposWithCommits(
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

export default function GitHubActivity(props: Props) {
  const [repos, setRepos] = createSignal<GitHubRepo[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [showScrollHint, setShowScrollHint] = createSignal(true);

  const limit = () => Math.max(1, props.limit ?? 8);
  const classes = createMemo(() => {
    const classList = ["github-widget"];
    if (props.large) classList.push("github-widget--large");
    return classList.join(" ");
  });

  onMount(() => {
    let unmounted = false;

    const getToken = () =>
      props.token || (typeof window !== "undefined" ? window.PUBLIC_GITHUB_TOKEN : undefined);

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchReposWithCommits(props.username, getToken(), limit());
        if (!unmounted) {
          setRepos(data);
          setActiveIndex(0);
        }
      } catch (err) {
        if (!unmounted) {
          setError(err instanceof Error ? err.message : "Failed to load GitHub activity");
        }
      } finally {
        if (!unmounted) {
          setLoading(false);
        }
      }
    };

    load();

    const hintSeen = localStorage.getItem("github-widget-scroll-hint-seen") === "true";
    if (hintSeen) {
      setShowScrollHint(false);
    }

    const interval = props.live !== false ? window.setInterval(load, CACHE_TTL_MS) : null;

    const track = document.querySelector<HTMLElement>("[data-github-track]");
    const onScroll = () => {
      if (!track) return;
      const card = track.querySelector<HTMLElement>(".github-repo-card");
      if (!card) return;
      const step = card.clientWidth + 16;
      const nextIndex = Math.max(0, Math.round(track.scrollLeft / Math.max(step, 1)));
      setActiveIndex(nextIndex);

      if (showScrollHint() && track.scrollLeft > 8) {
        setShowScrollHint(false);
        localStorage.setItem("github-widget-scroll-hint-seen", "true");
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!track || repos().length < 2) return;
      const cards = track.querySelectorAll<HTMLElement>(".github-repo-card");
      const current = activeIndex();

      if (event.key === "ArrowLeft" && current > 0) {
        event.preventDefault();
        cards[current - 1]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }

      if (event.key === "ArrowRight" && current < cards.length - 1) {
        event.preventDefault();
        cards[current + 1]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    };

    track?.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      unmounted = true;
      if (interval !== null) {
        window.clearInterval(interval);
      }
      track?.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  return (
    <section class={classes()} data-github-widget>
      <Show
        when={!loading()}
        fallback={
          <div class="github-widget__loading">
            <div class="github-commit-skeleton"></div>
          </div>
        }
      >
        <Show
          when={!error()}
          fallback={
            <div class="github-widget__error">
              <p>{error()}</p>
            </div>
          }
        >
          <Show
            when={repos().length > 0}
            fallback={<p class="github-widget__empty">No recent repository activity.</p>}
          >
            <div class="github-repo-carousel">
              <Show when={showScrollHint() && repos().length > 1}>
                <p class="github-scroll-cta" aria-live="polite">
                  <span>Scroll for more</span>
                </p>
              </Show>

              <div class="github-repo-carousel__track" data-github-track>
                <For each={repos()}>
                  {(repo) => (
                    <article class="github-repo-card" data-parallax-card>
                      <header class="github-repo-card__header">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="github-repo-card__title"
                        >
                          {repo.name}
                        </a>
                        <Show when={repo.description}>
                          <p class="github-repo-card__description">
                            {stripEmojis(repo.description ?? "")}
                          </p>
                        </Show>
                        <p class="github-repo-card__meta">
                          <span class="github-repo-card__language">{repo.language ?? "Code"}</span>
                          <Show when={repo.stars > 0}>
                            <span class="github-repo-card__stars">{repo.stars} stars</span>
                          </Show>
                        </p>
                      </header>

                      <ul class="github-commit-list" aria-label={`Recent commits for ${repo.name}`}>
                        <For each={repo.commits}>
                          {(commit) => (
                            <li>
                              <a
                                href={commit.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="github-commit-list-item"
                                aria-label={`View commit ${commit.sha} in ${repo.name}`}
                              >
                                <div class="github-commit-list-item__content">
                                  <p class="github-commit-list-item__message">{commit.message}</p>
                                  <div class="github-commit-list-item__meta">
                                    <span class="github-commit-list-item__chip">{commit.date}</span>
                                    <span class="github-commit-list-item__chip github-commit-list-item__chip--mono">
                                      {commit.sha}
                                    </span>
                                  </div>
                                </div>
                                <span class="github-commit-list-item__icon" aria-hidden="true">
                                  ↗
                                </span>
                              </a>
                            </li>
                          )}
                        </For>
                      </ul>
                    </article>
                  )}
                </For>
              </div>

              <div class="github-progress-bar">
                <div
                  class="github-progress-bar__track"
                  role="tablist"
                  aria-label="Repository pages"
                >
                  <For each={repos()}>
                    {(_, index) => {
                      const current = () => activeIndex();
                      const isActive = () => index() === current();
                      const isPassed = () => index() < current();
                      return (
                        <button
                          type="button"
                          role="tab"
                          aria-selected={isActive()}
                          classList={{
                            "github-progress-bar__segment": true,
                            "github-progress-bar__segment--active": isActive(),
                            "github-progress-bar__segment--passed": isPassed(),
                          }}
                          onClick={() => {
                            const track =
                              document.querySelector<HTMLElement>("[data-github-track]");
                            const cards = track?.querySelectorAll<HTMLElement>(".github-repo-card");
                            cards?.[index()]?.scrollIntoView({
                              behavior: "smooth",
                              block: "nearest",
                              inline: "center",
                            });
                            setActiveIndex(index());
                          }}
                        />
                      );
                    }}
                  </For>
                </div>
                <p class="github-progress-bar__label">
                  {Math.min(activeIndex() + 1, repos().length)} / {repos().length}
                </p>
              </div>
            </div>
          </Show>
        </Show>
      </Show>
    </section>
  );
}
