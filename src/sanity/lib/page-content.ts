import { loadQuery } from "./load-query";

export interface AboutPageContent {
  seoDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  sections: Array<{ _key: string; icon: string; eyebrow: string; title: string; body: string }>;
}

export interface NowPageContent {
  seoDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  lastUpdated: string;
  nowItems: string[];
  nextItems: string[];
  laterItems: string[];
  signalsHeading: string;
  signalsLede: string;
  executionSignals: Array<{ _key: string; title: string; body: string }>;
  githubHeading?: string | null;
  githubLede?: string | null;
}

export interface BlogPageContent {
  pageDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  emptyStateTitle: string;
  emptyStateBody: string;
  editorialDirectionHeading: string;
  editorialDirectionLede: string;
  pillars: Array<{ _key: string; icon: string; title: string; body: string }>;
  archiveHeading?: string | null;
  archiveLede?: string | null;
  allArticlesLabel: string;
  loadOlderLabel: string;
  filterEmptyState: string;
  spotlightTags?: string[] | null;
  placeholderCards?: Array<{
    _key: string;
    title: string;
    summary: string;
    href: string;
    tags?: string[] | null;
  }> | null;
}

export interface ProjectsPageContent {
  description: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  filterEmptyTitle: string;
  filterEmptyBody: string;
  pageEmptyTitle: string;
  pageEmptyBody: string;
  contactEmail: string;
}

export async function getAboutPageContent(): Promise<AboutPageContent | null> {
  const { data } = await loadQuery<AboutPageContent | null>({
    query: `*[_type == "aboutPage"][0]{
      seoDescription,
      heroEyebrow,
      heroTitle,
      heroLede,
      sections[]{_key,icon,eyebrow,title,body}
    }`,
    queryLabel: "about page content",
  });

  return data ?? null;
}

export async function getNowPageContent(): Promise<NowPageContent | null> {
  const { data } = await loadQuery<NowPageContent | null>({
    query: `*[_type == "nowPage"][0]{
      seoDescription,
      heroEyebrow,
      heroTitle,
      heroLede,
      lastUpdated,
      nowItems,
      nextItems,
      laterItems,
      signalsHeading,
      signalsLede,
      executionSignals[]{_key,title,body},
      githubHeading,
      githubLede
    }`,
    queryLabel: "now page content",
  });

  return data ?? null;
}

export async function getBlogPageContent(): Promise<BlogPageContent | null> {
  const { data } = await loadQuery<BlogPageContent | null>({
    query: `*[_type == "blogPage"][0]{
      pageDescription,
      heroEyebrow,
      heroTitle,
      heroLede,
      emptyStateTitle,
      emptyStateBody,
      editorialDirectionHeading,
      editorialDirectionLede,
      pillars[]{_key,icon,title,body},
      archiveHeading,
      archiveLede,
      allArticlesLabel,
      loadOlderLabel,
      filterEmptyState,
      spotlightTags,
      placeholderCards[]{_key,title,summary,href,tags}
    }`,
    queryLabel: "blog page content",
  });

  return data ?? null;
}

export async function getProjectsPageContent(): Promise<ProjectsPageContent | null> {
  const { data } = await loadQuery<ProjectsPageContent | null>({
    query: `*[_type == "projectsPage"][0]{
      description,
      heroEyebrow,
      heroTitle,
      heroLede,
      filterEmptyTitle,
      filterEmptyBody,
      pageEmptyTitle,
      pageEmptyBody,
      contactEmail
    }`,
    queryLabel: "projects page content",
  });

  return data ?? null;
}
