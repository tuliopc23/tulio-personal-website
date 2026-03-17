/// <reference path="../.astro/types.d.ts" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_PREVIEW_URL?: string;
  readonly PUBLIC_SANITY_STUDIO_URL?: string;
  readonly PUBLIC_SANITY_VISUAL_EDITING_ENABLED?: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly SANITY_ALLOW_BUILD_FALLBACK?: string;
  readonly GITHUB_TOKEN?: string;
  readonly GITHUB_PERSONAL_ACCESS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "/@id/sanity:studio" {
  export { SanityStudio } from "sanity:studio";
}
