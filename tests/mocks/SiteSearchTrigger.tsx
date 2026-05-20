import { createElement } from "react";

/** Stub for Astro container tests (avoids cmdk/react JSX in Vite import-analysis). */
export default function SiteSearchTrigger() {
  return createElement("span", { "data-site-search-trigger": "", hidden: true });
}
