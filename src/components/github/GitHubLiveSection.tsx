/**
 * GitHubLiveSection — Solid.js island
 * Fetches real-time GitHub data from /api/github.json on mount.
 * Uses the same CSS module classes as the Astro static components.
 */
import { createSignal, For, onMount, Show } from "solid-js";
import type { GitHubCommit, NormalizedRepoCard } from "../../lib/github-data";
import { resolveBrandGlyph } from "../brand-icon-data";
import styles from "./github-section.module.css";

// ─── Minimal inline SVGs (Phosphor icons used in this component) ───────────

const IconFolder = () => (
  <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M245,80.48A20,20,0,0,0,229.22,72H208V64a24,24,0,0,0-24-24H123.42a4,4,0,0,1-2.44-.84l-24-18.43A28.06,28.06,0,0,0,80.19,16H40A24,24,0,0,0,16,40V200a24,24,0,0,0,24,24H212.13A20,20,0,0,0,232,210.34L253,99.25A20.07,20.07,0,0,0,245,80.48Z" />
  </svg>
);

const IconCode = () => (
  <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.71-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z" />
  </svg>
);

const IconLock = () => (
  <svg width="10" height="10" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM136,176v16a8,8,0,0,1-16,0V176a24,24,0,1,1,16,0Z" />
  </svg>
);

const IconArrowUpRight = () => (
  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
  </svg>
);

const IconGitCommit = (props: { size?: number }) => (
  <svg
    width={props.size ?? 16}
    height={props.size ?? 16}
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M184,128a56,56,0,1,1-56-56A56.06,56.06,0,0,1,184,128Zm40-8H211.77a84,84,0,0,0-167.54,0H16a8,8,0,0,0,0,16H44.23a84,84,0,0,0,167.54,0H240a8,8,0,0,0,0-16Z" />
  </svg>
);

function BrandGlyphIcon(props: { name: string; size?: number }) {
  const glyph = resolveBrandGlyph(props.name);

  if (!glyph) {
    return <IconCode />;
  }

  return (
    <svg
      width={props.size ?? 14}
      height={props.size ?? 14}
      viewBox={`0 0 ${glyph.width} ${glyph.height}`}
      fill="currentColor"
      aria-hidden="true"
      innerHTML={glyph.body}
    />
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function CommitList(props: { commits: GitHubCommit[]; repoName: string }) {
  return (
    <ul class={styles.commitList} aria-label={`Recent commits for ${props.repoName}`}>
      <For each={props.commits}>
        {(commit) => (
          <li class={styles.commitItem}>
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              class={styles.commitLink}
              aria-label={`View commit ${commit.shortSha} in ${props.repoName}`}
            >
              <div class={styles.commitIcon} aria-hidden="true">
                <IconGitCommit size={16} />
              </div>
              <div class={styles.commitContent}>
                <p class={styles.commitMessage}>{commit.message}</p>
                <div class={styles.commitMeta}>
                  <span class={styles.commitTime}>{commit.committedAt}</span>
                  <span class={styles.commitHash}>{commit.shortSha}</span>
                </div>
              </div>
              <div class={styles.commitArrow} aria-hidden="true">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  role="img"
                  aria-label="Open commit"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </a>
          </li>
        )}
      </For>
    </ul>
  );
}

function RepoCard(props: { repo: NormalizedRepoCard }) {
  const { repo } = props;
  return (
    <article class={styles.repoCard}>
      <div class={styles.repoCardEditorial}>
        <div class={styles.editorialContent}>
          <span class={styles.repoEyebrow}>
            <IconFolder />
            {repo.category}
          </span>

          {repo.primaryLanguage && (
            <span class={styles.repoLanguageEyebrow}>
              <span class={styles.repoLanguageIcon} aria-hidden="true">
                {repo.primaryLanguageIcon ? (
                  <BrandGlyphIcon name={repo.primaryLanguageIcon} size={14} />
                ) : (
                  <IconCode />
                )}
              </span>
              {repo.primaryLanguage}
            </span>
          )}

          <h3 class={styles.repoTitle}>
            {repo.showRepositoryLink ? (
              <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer">
                {repo.displayTitle}
              </a>
            ) : (
              repo.displayTitle
            )}
          </h3>

          {repo.description && <p class={styles.repoDescription}>{repo.description}</p>}
        </div>

        <div class={styles.repoMeta}>
          {repo.isPrivate && (
            <span class={styles.metaTag}>
              <IconLock />
              Private
            </span>
          )}
          {repo.showRepositoryLink && (
            <a
              href={repo.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              class={`cta-pill cta-pill--accent motion-cta-pill ${styles.repoCta}`}
            >
              <span>View repository</span>
              <IconArrowUpRight />
            </a>
          )}
        </div>
      </div>

      <div class={styles.repoCardActivity}>
        <div class={styles.activityHeader}>
          <h4 class={styles.activityLabel}>
            <IconGitCommit size={13} />
            Recent commits
          </h4>
          {repo.commits.length > 0 && (
            <span class={styles.activityBadge}>
              <span class={styles.activityBadgeDot} />
              Active
            </span>
          )}
        </div>
        <CommitList commits={repo.commits} repoName={repo.repoName} />
      </div>
    </article>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div class="ghLiveSkeleton__rail">
      <For each={[0, 1]}>
        {(i) => (
          <div class="ghLiveSkeleton__card" style={`animation-delay:${i * 120}ms`}>
            <div class="ghLiveSkeleton__editorial">
              <div class="ghLiveSkeleton__line ghLiveSkeleton__line--eyebrow" />
              <div class="ghLiveSkeleton__line ghLiveSkeleton__line--title" />
              <div class="ghLiveSkeleton__line ghLiveSkeleton__line--desc" />
              <div class="ghLiveSkeleton__line ghLiveSkeleton__line--desc ghLiveSkeleton__line--short" />
            </div>
            <div class="ghLiveSkeleton__activity">
              <div class="ghLiveSkeleton__line ghLiveSkeleton__line--eyebrow" />
              <For each={[0, 1, 2, 3]}>
                {() => (
                  <div class="ghLiveSkeleton__commit">
                    <div class="ghLiveSkeleton__commitDot" />
                    <div class="ghLiveSkeleton__commitLines">
                      <div class="ghLiveSkeleton__line ghLiveSkeleton__line--commit" />
                      <div class="ghLiveSkeleton__line ghLiveSkeleton__line--meta" />
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

// ─── Rail with scroll progress ───────────────────────────────────────────────

function RepoRail(props: { repos: NormalizedRepoCard[] }) {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [hasInteracted, setHasInteracted] = createSignal(false);
  let trackRef: HTMLDivElement | undefined;

  const resolveLeftForCard = (index: number) => {
    if (!trackRef) return 0;
    const cards = trackRef.querySelectorAll<HTMLElement>("article");
    const card = cards[index];
    if (!card) return 0;
    const limit = Math.max(0, trackRef.scrollWidth - trackRef.clientWidth);
    return Math.min(
      Math.max(card.offsetLeft - (trackRef.clientWidth - card.offsetWidth) / 2, 0),
      limit,
    );
  };

  const scrollToIndex = (index: number) => {
    if (!trackRef) return;
    const clamped = Math.min(Math.max(index, 0), props.repos.length - 1);
    trackRef.scrollTo({
      left: resolveLeftForCard(clamped),
      behavior: "smooth",
    });
    setCurrentIndex(clamped);
    setHasInteracted(true);
  };

  const onScroll = () => {
    if (!trackRef) return;
    const cards = trackRef.querySelectorAll<HTMLElement>("article");
    if (!cards.length) return;
    const viewportCenter = trackRef.scrollLeft + trackRef.clientWidth / 2;
    let nextIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - viewportCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        nextIndex = index;
      }
    });

    setCurrentIndex(nextIndex);
    if (trackRef.scrollLeft > 8) {
      setHasInteracted(true);
    }
  };

  return (
    <div class={styles.railContainer}>
      <div class={styles.scrollHint} aria-hidden="true" data-visible={!hasInteracted()}>
        <div class={styles.scrollHintBadge}>Scroll for more</div>
      </div>
      <div class={styles.railTrack} data-repo-rail ref={trackRef} onScroll={onScroll}>
        <For each={props.repos}>{(repo) => <RepoCard repo={repo} />}</For>
      </div>
      <div
        class={styles.mobileCue}
        data-visible={!hasInteracted()}
        aria-hidden={hasInteracted() ? "true" : "false"}
      >
        <span class={styles.mobileCueLabel}>Swipe to explore more repositories</span>
        <span class={styles.mobileCueGlyph}>↔</span>
      </div>
      <div class={styles.railControls}>
        <div class={styles.mobileNav}>
          <button
            type="button"
            class={`cta-pill cta-pill--accent motion-cta-pill ${styles.mobileNavButton}`}
            onClick={() => scrollToIndex(currentIndex() - 1)}
            disabled={currentIndex() === 0}
            aria-label="Show previous repository"
          >
            Prev
          </button>
          <button
            type="button"
            class={`cta-pill cta-pill--accent motion-cta-pill ${styles.mobileNavButton}`}
            onClick={() => scrollToIndex(currentIndex() + 1)}
            disabled={currentIndex() >= props.repos.length - 1}
            aria-label="Show next repository"
          >
            Next
          </button>
        </div>
        <div class={styles.progressBar}>
          <For each={props.repos}>
            {(_, i) => (
              <div
                class={styles.progressSegment}
                data-active={i() === currentIndex() ? "true" : undefined}
              />
            )}
          </For>
        </div>
        <div class={styles.progressCount}>
          <span>{currentIndex() + 1}</span> / {props.repos.length}
        </div>
      </div>
    </div>
  );
}

// ─── Root island ─────────────────────────────────────────────────────────────

async function fetchGitHubRepos(): Promise<NormalizedRepoCard[]> {
  const res = await fetch("/api/github.json");
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
  return res.json();
}

export default function GitHubLiveSection(props: {
  initialData?: NormalizedRepoCard[];
}) {
  const [repos, setRepos] = createSignal<NormalizedRepoCard[] | null>(
    props.initialData?.length ? props.initialData : null,
  );
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    // If we already have build-time data, skip the client fetch
    if (!repos()) {
      try {
        setRepos(await fetchGitHubRepos());
      } catch (err) {
        console.error("Failed to load GitHub activity.", err);
        setError("Failed to load GitHub activity.");
      }
    }

    // Signal the motion system that this island's DOM is ready.
    document.dispatchEvent(new CustomEvent("motion:island-ready", { detail: { id: "github" } }));
  });

  return (
    <section class={styles.githubSection} id="section-github">
      <Show when={repos() === null && !error()}>
        <Skeleton />
      </Show>
      <Show when={error()}>
        <div class={styles.errorState}>
          <p>{error()}</p>
        </div>
      </Show>
      <Show when={repos()}>
        {(data) =>
          data().length === 0 ? (
            <div class={styles.emptyState}>
              <p>No recent repository activity found.</p>
            </div>
          ) : (
            <RepoRail repos={data()} />
          )
        }
      </Show>
    </section>
  );
}
