/// <reference types="vitest" />

import { getViteConfig } from "astro/config";

export default getViteConfig({
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
        lines: 40,
        functions: 35,
        branches: 30,
        statements: 40,
      },
    },
  },
} as any);
