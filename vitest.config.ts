/// <reference types="vitest" />

import { getViteConfig } from "astro/config";

const config = {
  test: {
    globals: true,
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    environment: "jsdom",
    environmentMatchGlobs: [["tests/astro/**/*.test.ts", "node"]],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: [
        "src/lib/*.ts",
        "src/components/github-activity-utils.ts",
        "src/sanity/lib/{image,load-query,posts,resolve}.ts",
        "src/scripts/{contact-form,projects-filters,sidebar,theme}.ts",
      ],
      exclude: [
        "src/env.d.ts",
        "src/styles/**",
        "src/assets/**",
        "src/pages/studio/**",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 60,
        functions: 70,
        branches: 50,
        statements: 60,
      },
    },
  },
} as const;

export default getViteConfig(config as unknown as Parameters<typeof getViteConfig>[0]);
