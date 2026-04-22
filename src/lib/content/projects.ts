import type { ProjectCategory } from "../project-categories";

export interface Project {
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

/** Projects collection removed — content migrated to case studies in the projectsPage singleton. */
export async function getAllProjects(): Promise<Project[]> {
  return [];
}
