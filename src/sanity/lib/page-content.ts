import { loadQuery } from "./load-query";

export interface AboutPageContent {
  seoDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  sections: Array<{ _key: string; icon: string; eyebrow: string; title: string; body: string }>;
}

export interface BlogPageContent {
  pageDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLede: string;
  emptyStateTitle: string;
  emptyStateBody: string;
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
  caseStudies?: Array<{
    _key: string;
    icon: string;
    eyebrow: string;
    title: string;
    headline: string;
    lede: string;
    role: string;
    status: "live" | "maintained" | "exploration";
    href?: string | null;
    stack: string[];
    images: Array<{
      _key: string;
      alt?: string | null;
      url: string | null;
      dimensions?: {
        width?: number | null;
        height?: number | null;
      } | null;
    }>;
  }> | null;
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

export async function getBlogPageContent(): Promise<BlogPageContent | null> {
  const { data } = await loadQuery<BlogPageContent | null>({
    query: `*[_type == "blogPage"][0]{
      pageDescription,
      heroEyebrow,
      heroTitle,
      heroLede,
      emptyStateTitle,
      emptyStateBody,
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
      caseStudies[]{
        _key,
        icon,
        eyebrow,
        title,
        headline,
        lede,
        role,
        status,
        href,
        stack,
        images[]{
          _key,
          alt,
          "url": asset->url,
          "dimensions": asset->metadata.dimensions
        }
      },
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
