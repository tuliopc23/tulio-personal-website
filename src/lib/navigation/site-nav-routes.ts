/** Shared primary site routes for mobile tabs and search. */
export const SITE_PRIMARY_ROUTES = {
  home: { href: "/", label: "Home", shortLabel: "Home" },
  blog: { href: "/blog/", label: "Blog", shortLabel: "Blog" },
  cases: { href: "/projects/", label: "Case Studies", shortLabel: "Cases" },
  about: { href: "/about/", label: "About", shortLabel: "About" },
} as const;
