import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// https://docs.astro.build
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx()],
  vite: {
    css: { devSourcemap: true },
  },
});
