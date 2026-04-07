/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/astro/**/*.test.ts"],
    globals: true,
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    environment: "node",
  },
});
