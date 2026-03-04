import { isProjectCategory, type ProjectCategory } from "../project-categories";
import { loadQuery } from "./load-query";

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

const PROJECT_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  role,
  summary,
  status,
  href,
  cta,
  releaseDate,
  categories,
  coverImage {
    alt,
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions
  }
}`;

export async function getAllProjects(): Promise<SanityProject[]> {
  const { data } = await loadQuery<SanityProject[]>({
    query: `*[_type == "project"] | order(coalesce(order, 9999) asc, releaseDate desc)${PROJECT_PROJECTION}`,
  });

  return (data ?? []).map((project) => ({
    ...project,
    categories: (project.categories ?? []).filter(isProjectCategory),
  }));
}
