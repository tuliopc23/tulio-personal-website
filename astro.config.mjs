import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import sanity from "@sanity/astro";
import sentry from "@sentry/astro";
import "dotenv/config";
import { defineConfig } from "astro/config";
import { shouldIncludeInSitemap } from "./src/lib/seo.js";

const DEFAULT_PROJECT_ID = "61249gtj";
const DEFAULT_DATASET = "production";

const sanityOptions = {
  projectId: DEFAULT_PROJECT_ID,
  dataset: DEFAULT_DATASET,
  useCdn: true,
  apiVersion: "2025-02-19",
  studioBasePath: process.env.NODE_ENV === "development" ? "/studio" : undefined,
};

export default defineConfig({
  site: "https://www.tuliocunha.dev",
  image: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "apicdn.sanity.io" },
      { protocol: "https", hostname: "**.sanity.io" },
    ],
  },
  integrations: [
    mdx(),
    sitemap({
      filter: shouldIncludeInSitemap,
    }),
    sanity(sanityOptions),
    react({ include: ["**/react/**", "**/remotion/**", "**/HeroPlayer*"] }),
    solidJs({ include: ["**/solid/**", "**/GitHubLiveSection*"] }),
    sentry({
      project: "personal-website",
      org: "tuliocunha",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: ["/@id/sanity:studio"],
      },
    },
    resolve: {
      noExternal: ["easymde", "react-simplemde-editor"],
    },
    ssr: {
      noExternal: ["easymde", "react-simplemde-editor"],
    },
  },
});
