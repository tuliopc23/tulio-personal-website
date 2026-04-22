/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

interface ImportMetaEnv {
  readonly GITHUB_TOKEN?: string;
  readonly GITHUB_PERSONAL_ACCESS_TOKEN?: string;
  readonly KEYSTATIC_SECRET?: string;
  readonly KEYSTATIC_GITHUB_CLIENT_ID?: string;
  readonly KEYSTATIC_GITHUB_CLIENT_SECRET?: string;
  readonly PUBLIC_KEYSTATIC_GITHUB_APP_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
