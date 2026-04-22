import cloudflare from "@astrojs/cloudflare";
import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import keystatic from "@keystatic/astro";
import sentry from "@sentry/astro";
import remarkDirective from "remark-directive";
import "dotenv/config";
import { defineConfig } from "astro/config";
import remarkCalloutDirectives from "./src/lib/mdx/remark-callout-directives.mjs";
import { shouldIncludeInSitemap } from "./src/lib/seo.js";

const sentryRelease = process.env.SENTRY_RELEASE || undefined;
const isVitest = process.env.VITEST === "true";

/** Keystatic admin loads React from its own deps — include both app React and keystatic bundles. */
const reactIntegration = react({
  include: [
    // Use regex filters here to stay off the glob-to-picomatch path in Astro's bundled React renderer.
    /(?:^|\/)react(?:\/|$)/,
    /(?:^|\/)remotion(?:\/|$)/,
    /(?:^|\/)HeroPlayer[^/]*(?:[?#].*)?$/,
    /(?:^|\/)keystatic(?:\/|$)/,
    /(?:^|\/)node_modules\/@keystatic\/core\/.*\.js(?:[?#].*)?$/,
    /(?:^|\/)node_modules\/@keystatic\/astro\/.*\.js(?:[?#].*)?$/,
  ],
});

export default defineConfig({
  site: "https://www.tuliocunha.dev",
  trailingSlash: "ignore",
  output: "server",
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
    mdx({
      remarkPlugins: [remarkDirective, remarkCalloutDirectives],
    }),
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
      "process.env": "{}",
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
    },
    optimizeDeps: {
      exclude: ["@keystatic/astro/internal/keystatic-api.js"],
      include: ["lodash", "lodash/debounce", "direction"],
      needsInterop: ["lodash/debounce", "direction", "cookie"],
    },
    build: {
      sourcemap: "hidden",
      rollupOptions: {
        external: ["picomatch"],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        requireReturnsDefault: "auto",
      },
    },
    resolve: {
      noExternal: ["easymde", "react-simplemde-editor"],
    },
    ssr: {
      external: ["cookie", "picomatch"],
      noExternal: [
        "@keystatic/astro",
        "@keystatic/astro/internal/keystatic-api.js",
        "@keystatic/astro/internal/keystatic-page.js",
        "@keystatic/core",
        "set-cookie-parser",
        "easymde",
        "react-simplemde-editor",
      ],
    },
  },
});
