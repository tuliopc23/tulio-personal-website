export type SiteSearchRoute = {
  title: string;
  href: string;
  description: string;
  keywords: string;
};

export const siteSearchRoutes: readonly SiteSearchRoute[] = [
  {
    title: "Home",
    href: "/",
    description: "The starting point. Stack, tools, and overview.",
    keywords: "homepage landing featured overview stack tools",
  },
  {
    title: "Blog",
    href: "/blog/",
    description: "Long-form notes on code, platforms, and systems.",
    keywords: "articles writing essays notes programming blog",
  },
  {
    title: "Case Studies",
    href: "/projects/",
    description: "Client work and indie projects.",
    keywords: "work case studies builds portfolio apps clients projects",
  },
  {
    title: "About",
    href: "/about/",
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
