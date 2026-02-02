/// <reference path="../.astro/types.d.ts" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_PREVIEW_URL?: string;
  readonly PUBLIC_SANITY_STUDIO_URL?: string;
  readonly PUBLIC_SANITY_VISUAL_EDITING_ENABLED?: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly GITHUB_PERSONAL_ACCESS_TOKEN?: string;
  readonly GITHUB_REPOSITORY?: string;
  readonly DEV_TO_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
