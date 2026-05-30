import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import keystatic from "@keystatic/astro";
import remarkDirective from "remark-directive";
import "dotenv/config";
import { defineConfig } from "astro/config";
import remarkCalloutDirectives from "./src/lib/mdx/remark-callout-directives.mjs";
import { shouldIncludeInSitemap } from "./src/lib/seo.js";

const isVitest = process.env.VITEST === "true";
const mobileNavPath = fileURLToPath(
  new URL("./src/components/navigation/MobileLiquidGlassNav.tsx", import.meta.url),
);
const mobileNavMockPath = fileURLToPath(
  new URL("./tests/mocks/MobileLiquidGlassNav.tsx", import.meta.url),
);
const siteSearchTriggerMockPath = fileURLToPath(
  new URL("./tests/mocks/SiteSearchTrigger.tsx", import.meta.url),
);
const themeToggleMockPath = fileURLToPath(
  new URL("./tests/mocks/ThemeToggle.tsx", import.meta.url),
);
/** Keystatic admin loads React from its own deps — include both app React and keystatic bundles. */
const reactIntegration = react({
  include: [
    // Use regex filters here to stay off the glob-to-picomatch path in Astro's bundled React renderer.
    /(?:^|\/)react(?:\/|$)/,
    /(?:^|\/)src\/components\/navigation\/.*\.tsx$/,
    /(?:^|\/)tests\/mocks\/.*\.tsx$/,
    /(?:^|\/)src\/components\/ui\/.*\.tsx$/,
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
        /** Build: sharp variants in dist. Runtime: Cloudflare Images binding on SSR paths. */
        imageService: { build: "compile", runtime: "cloudflare-binding" },
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
    solidJs({ include: ["**/solid/**"] }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      ...(isVitest
        ? [
            {
              name: "vitest-nav-stubs",
              enforce: "pre",
              load(id) {
                if (id.endsWith("/navigation/MobileLiquidGlassNav.tsx")) {
                  return readFileSync(mobileNavMockPath, "utf8");
                }
                if (id.endsWith("/navigation/SiteSearchTrigger.tsx")) {
                  return readFileSync(siteSearchTriggerMockPath, "utf8");
                }
                if (id.endsWith("/navigation/ThemeToggle.tsx")) {
                  return readFileSync(themeToggleMockPath, "utf8");
                }
              },
            },
          ]
        : []),
    ],
    define: {
      "process.env": "{}",
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
    },
    optimizeDeps: {
      exclude: ["@keystatic/astro/internal/keystatic-api.js"],
      include: ["lodash", "lodash/debounce", "direction"],
      needsInterop: ["lodash/debounce", "direction", "cookie"],
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        external: ["picomatch"],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        requireReturnsDefault: "auto",
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        ...(isVitest
          ? {
              [mobileNavPath]: mobileNavMockPath,
            }
          : {}),
      },
      tsconfigPaths: true,
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
