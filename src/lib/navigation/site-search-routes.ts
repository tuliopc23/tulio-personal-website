import { SITE_PRIMARY_ROUTES } from "./site-nav-routes";

export type SiteSearchRoute = {
  title: string;
  href: string;
  description: string;
  keywords: string;
};

export const siteSearchRoutes: readonly SiteSearchRoute[] = [
  {
    title: SITE_PRIMARY_ROUTES.home.label,
    href: SITE_PRIMARY_ROUTES.home.href,
    description: "The starting point. Stack, tools, and overview.",
    keywords: "homepage landing featured overview stack tools",
  },
  {
    title: SITE_PRIMARY_ROUTES.blog.label,
    href: SITE_PRIMARY_ROUTES.blog.href,
    description: "Long-form notes on code, platforms, and systems.",
    keywords: "articles writing essays notes programming blog",
  },
  {
    title: SITE_PRIMARY_ROUTES.cases.label,
    href: SITE_PRIMARY_ROUTES.cases.href,
    description: "Client work and indie projects.",
    keywords: "work case studies builds portfolio apps clients projects",
  },
  {
    title: SITE_PRIMARY_ROUTES.about.label,
    href: SITE_PRIMARY_ROUTES.about.href,
    description: "How I think about software, craft, and platforms.",
    keywords: "profile bio background approach about",
  },
] as const;

export function filterSiteSearchRoutes(query: string): SiteSearchRoute[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [...siteSearchRoutes];
  }

  return siteSearchRoutes.filter((route) => {
    const haystack = `${route.title} ${route.description} ${route.keywords}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function routeSearchHaystack(route: SiteSearchRoute): string {
  return `${route.title} ${route.description} ${route.keywords}`.toLowerCase();
}
