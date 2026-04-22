import type { APIContext } from "astro";
import { defineMiddleware } from "astro:middleware";

/**
 * Workaround for Astro dev mode with the Cloudflare adapter.
 * Module URLs sometimes contain raw absolute filesystem paths instead of
 * browser-resolvable `/@fs/` URLs. Rewrite them so scripts and islands load.
 */
function rewriteDevPaths(html: string): string {
  // Match absolute filesystem paths in common attributes
  // e.g. /Users/... or /home/... but not already-rewritten /@fs/ or /@id/
  return html.replace(/(component-url|src)="(\/[^"]+)"/g, (match, attr: string, p1: string) => {
    if (
      p1.startsWith("/") &&
      !p1.startsWith("/@fs/") &&
      !p1.startsWith("/@id/") &&
      p1.length > 1 &&
      p1[1] !== "/"
    ) {
      return `${attr}="/@fs${p1}"`;
    }
    return match;
  });
}

type KeystaticRuntimeEnv = Record<string, string | undefined>;
type KeystaticMiddlewareContext = APIContext & {
  locals: APIContext["locals"] & {
    runtime?: {
      env?: KeystaticRuntimeEnv;
    };
  };
};

const KEYSTATIC_ENV_KEYS = [
  "KEYSTATIC_GITHUB_CLIENT_ID",
  "KEYSTATIC_GITHUB_CLIENT_SECRET",
  "KEYSTATIC_SECRET",
  "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
] as const;

function getKeystaticRuntimeEnv(
  context: KeystaticMiddlewareContext,
): KeystaticRuntimeEnv | undefined {
  try {
    return context.locals.runtime?.env as KeystaticRuntimeEnv | undefined;
  } catch {
    return undefined;
  }
}

function getProcessEnv(): KeystaticRuntimeEnv {
  const globalWithProcess = globalThis as {
    process?: {
      env?: KeystaticRuntimeEnv;
    };
  };

  globalWithProcess.process ??= { env: {} };
  globalWithProcess.process.env ??= {};
  return globalWithProcess.process.env;
}

function hydrateKeystaticProcessEnv(context: KeystaticMiddlewareContext): void {
  const runtimeEnv = getKeystaticRuntimeEnv(context);
  const fallbackEnv = getProcessEnv();
  const env = { ...fallbackEnv, ...runtimeEnv };
  const processEnv = getProcessEnv();

  for (const key of KEYSTATIC_ENV_KEYS) {
    const value = env[key];
    if (typeof value === "string" && value.trim()) {
      processEnv[key] = value;
    }
  }
}

// Keystatic's GitHub auth endpoints can omit a trailing slash.
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const search = context.url.search;
  hydrateKeystaticProcessEnv(context as KeystaticMiddlewareContext);

  if (pathname.startsWith("/api/keystatic/") && !pathname.endsWith("/")) {
    return context.redirect(pathname + "/" + search, 308);
  }

  const response = await next();

  // Dev-only: rewrite island component URLs so hydration works
  if (import.meta.env.DEV && response.headers.get("content-type")?.includes("text/html")) {
    const original = await response.text();
    const rewritten = rewriteDevPaths(original);
    return new Response(rewritten, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  return response;
});
