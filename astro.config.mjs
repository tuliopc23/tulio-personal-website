import cloudflare from "@astrojs/cloudflare";
import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import keystatic from "@keystatic/astro";
import sentry from "@sentry/astro";
import "dotenv/config";
import { defineConfig } from "astro/config";
import { shouldIncludeInSitemap } from "./src/lib/seo.js";

const sentryRelease = process.env.SENTRY_RELEASE || undefined;
const isVitest = process.env.VITEST === "true";

/** Keystatic admin loads React from its own deps — include both app React and keystatic bundles. */
const reactIntegration = react({
  include: [
    "**/react/**",
    "**/remotion/**",
    "**/HeroPlayer*",
    "**/keystatic/**",
    "**/node_modules/@keystatic/core/**/*.js",
    "**/node_modules/@keystatic/astro/**/*.js",
  ],
});

export default defineConfig({
  site: "https://www.tuliocunha.dev",
  trailingSlash: "always",
  /** Vitest + getViteConfig() cannot use the Cloudflare Vite plugin (node `resolve.external` conflict). */
  adapter: isVitest
    ? undefined
    : cloudflare({
        imageService: "compile",
        /** Reuse existing CACHE KV (Astro Sessions vs github.json cache use distinct key prefixes). */
        sessionKVBindingName: "CACHE",
        /** Prerender uses `node:fs` to read Keystatic YAML/MDX; workerd prerender would use /bundle paths. */
        prerenderEnvironment: "node",
      }),
  image: {
    remotePatterns: [
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  integrations: [
    markdoc(),
    mdx(),
    keystatic(),
    sitemap({
      filter: shouldIncludeInSitemap,
    }),
    reactIntegration,
    solidJs({ include: ["**/solid/**", "**/GitHubLiveSection*"] }),
    sentry({
      project: process.env.SENTRY_PROJECT ?? "personal-website",
      org: process.env.SENTRY_ORG ?? "tuliocunha",
      authToken: process.env.SENTRY_AUTH_TOKEN,
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
    },
    resolve: {
      noExternal: ["easymde", "react-simplemde-editor"],
    },
    ssr: {
      noExternal: ["easymde", "react-simplemde-editor"],
    },
  },
});
