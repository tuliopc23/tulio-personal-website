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

const sentryRelease = process.env.SENTRY_RELEASE || undefined;

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
      project: process.env.SENTRY_PROJECT ?? "personal-website",
      org: process.env.SENTRY_ORG ?? "tuliocunha",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: sentryRelease,
      telemetry: false,
      sourcemaps: {
        assets: [
          "dist/_astro/**/*.js",
          "dist/_astro/**/*.js.map",
          "dist/.prerender/chunks/**/*.mjs",
          "dist/.prerender/chunks/**/*.mjs.map",
        ],
        filesToDeleteAfterUpload: ["dist/**/*.map"],
      },
    }),
  ],
  vite: {
    define: {
      "import.meta.env.PUBLIC_SENTRY_RELEASE": JSON.stringify(sentryRelease ?? ""),
      "import.meta.env.SENTRY_RELEASE": JSON.stringify(sentryRelease ?? ""),
    },
    build: {
      sourcemap: "hidden",
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
