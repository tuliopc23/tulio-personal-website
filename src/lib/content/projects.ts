import { getCollection } from "astro:content";

import { isProjectCategory, type ProjectCategory } from "../project-categories";

export interface SanityProject {
  _id: string;
  title: string;
  slug: string;
  role: string;
  summary: string;
  status: "Live" | "Maintained" | "Exploration";
  href: string;
  cta: string;
  releaseDate?: string | null;
  categories: ProjectCategory[];
  stack?: string[] | null;
  coverImage?: {
    alt?: string | null;
    url: string | null;
    lqip?: string | null;
    dimensions?: {
      width?: number | null;
      height?: number | null;
    } | null;
  } | null;
}

export async function getAllProjects(): Promise<SanityProject[]> {
  const entries = await getCollection("projects");
  const sorted = [...entries].sort((a, b) => {
    const oa = a.data.order ?? 9999;
    const ob = b.data.order ?? 9999;
    if (oa !== ob) return oa - ob;
    const da = a.data.releaseDate ? new Date(a.data.releaseDate).getTime() : 0;
    const db = b.data.releaseDate ? new Date(b.data.releaseDate).getTime() : 0;
    return db - da;
  });

  return sorted.map((entry) => {
    const d = entry.data;
    const categories = (d.categories ?? []).filter(isProjectCategory);
    return {
      _id: entry.id,
      title: d.title,
      slug: d.slug,
      role: d.role,
      summary: d.summary,
      status: d.status,
      href: d.href,
      cta: d.cta,
      releaseDate: d.releaseDate ? new Date(d.releaseDate).toISOString() : undefined,
      categories,
      stack: d.stack ?? [],
      coverImage:
        typeof d.coverImageUrl === "string" && d.coverImageUrl.trim().length > 0
          ? {
              url: d.coverImageUrl,
              alt: d.coverImageAlt ?? null,
              lqip: null,
              dimensions: null,
            }
          : null,
    };
  });
}
