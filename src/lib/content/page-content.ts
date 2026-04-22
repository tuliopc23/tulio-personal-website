import fs from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";

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

async function readYaml<T>(relativePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), relativePath), "utf8");
    return parseYaml(raw) as T;
  } catch {
    return null;
  }
}

export async function getAboutPageContent(): Promise<AboutPageContent | null> {
  const raw = await readYaml<
    Omit<AboutPageContent, "sections"> & {
      sections?: Array<{ icon?: string; eyebrow?: string; title?: string; body?: string }>;
    }
  >("src/content/site/about-page/index.yaml");
  if (!raw) return null;
  return {
    seoDescription: raw.seoDescription,
    heroEyebrow: raw.heroEyebrow,
    heroTitle: raw.heroTitle,
    heroLede: raw.heroLede,
    sections: (raw.sections ?? []).map((s, index) => ({
      _key: `section-${index}`,
      icon: s.icon ?? "",
      eyebrow: s.eyebrow ?? "",
      title: s.title ?? "",
      body: s.body ?? "",
    })),
  };
}

export async function getBlogPageContent(): Promise<BlogPageContent | null> {
  const raw = await readYaml<BlogPageContent>("src/content/site/blog-page/index.yaml");
  return raw;
}

export async function getProjectsPageContent(): Promise<ProjectsPageContent | null> {
  type RawStudy = NonNullable<ProjectsPageContent["caseStudies"]>[number];
  const raw = await readYaml<
    Omit<ProjectsPageContent, "caseStudies"> & {
      caseStudies?: Array<
        Omit<RawStudy, "_key" | "href" | "stack" | "images"> & {
          href?: string | null;
          stack?: string[];
          images?: Array<{ alt?: string; url?: string | null }>;
          _key?: string;
        }
      >;
    }
  >("src/content/site/projects-page/index.yaml");
  if (!raw) return null;

  const caseStudies =
    raw.caseStudies?.map((cs, index) => ({
      _key: cs._key ?? `case-${index}-${cs.title ?? ""}`,
      icon: cs.icon,
      eyebrow: cs.eyebrow,
      title: cs.title,
      headline: cs.headline,
      lede: cs.lede,
      role: cs.role,
      status: cs.status as RawStudy["status"],
      href: cs.href ?? null,
      stack: (cs.stack ?? []).filter((s): s is string => Boolean(s && String(s).trim())),
      images: (cs.images ?? []).map((img, i) => ({
        _key: `img-${index}-${i}`,
        alt: img.alt ?? null,
        url: img.url ?? null,
        dimensions: null,
      })),
    })) ?? [];

  return {
    description: raw.description,
    heroEyebrow: raw.heroEyebrow,
    heroTitle: raw.heroTitle,
    heroLede: raw.heroLede,
    filterEmptyTitle: raw.filterEmptyTitle,
    filterEmptyBody: raw.filterEmptyBody,
    pageEmptyTitle: raw.pageEmptyTitle,
    pageEmptyBody: raw.pageEmptyBody,
    contactEmail: raw.contactEmail,
    caseStudies,
  };
}
