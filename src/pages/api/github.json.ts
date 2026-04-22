import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

import siteYaml from "../../content/site/featured-github/index.yaml?raw";
import { handleGitHubApi, type WorkerEnvSubset } from "../../server/github-json";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const runtimeEnv = env as unknown as WorkerEnvSubset;
  return handleGitHubApi(request, runtimeEnv, siteYaml as string);
};
