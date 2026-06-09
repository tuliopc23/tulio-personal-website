import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html"], ["github"]] : [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4331",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "node scripts/with-system-certs.mjs pnpm exec astro preview --host 127.0.0.1 --port 4331",
    url: "http://127.0.0.1:4331",
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
