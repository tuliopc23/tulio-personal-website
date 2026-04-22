import type { APIRoute } from "astro";

import siteYaml from "../../content/site/featured-github/index.yaml?raw";
import { handleGitHubApi, type WorkerEnvSubset } from "../../server/github-json";

export const prerender = false;

function createMemoryKv(): KVNamespace {
  const store = new Map<string, string>();
  return {
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
    async delete(key: string) {
      store.delete(key);
    },
    async list() {
      return { keys: [], list_complete: true, cursor: "" } as unknown as KVNamespaceListResult<
        unknown,
        string
      >;
    },
  } as KVNamespace;
}

const memoryKv = createMemoryKv();

async function getRuntimeEnv(): Promise<WorkerEnvSubset> {
  try {
    const mod = await import("cloudflare:workers");
    const runtimeEnv = (mod as unknown as { env?: Partial<WorkerEnvSubset> }).env ?? {};
    return {
      ...runtimeEnv,
      CACHE: runtimeEnv.CACHE ?? memoryKv,
    } as WorkerEnvSubset;
  } catch {
    return {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      CACHE: memoryKv,
    };
  }
}

export const GET: APIRoute = async ({ request }) => {
  const runtimeEnv = await getRuntimeEnv();
  return handleGitHubApi(request, runtimeEnv, siteYaml as string);
};
