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

function getKeystaticRuntimeEnv(
  context: Parameters<typeof defineMiddleware>[0],
): KeystaticRuntimeEnv | undefined {
  try {
    return context.locals.runtime?.env as KeystaticRuntimeEnv | undefined;
  } catch {
    return undefined;
  }
}

function hasKeystaticGitHubAuth(context: Parameters<typeof defineMiddleware>[0]): boolean {
  const runtimeEnv = getKeystaticRuntimeEnv(context);
  const fallbackEnv = globalThis.process?.env as KeystaticRuntimeEnv | undefined;
  const env = runtimeEnv ?? fallbackEnv;

  return Boolean(
    env?.KEYSTATIC_GITHUB_CLIENT_ID?.trim() &&
      env?.KEYSTATIC_GITHUB_CLIENT_SECRET?.trim() &&
      env?.KEYSTATIC_SECRET?.trim(),
  );
}

// Keystatic's GitHub auth endpoints can omit a trailing slash. When GitHub auth
// is missing, route users to the setup page instead of letting the admin throw.
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const search = context.url.search;
  const keystaticGitHubConfigured = hasKeystaticGitHubAuth(context);

  if (
    !keystaticGitHubConfigured &&
    pathname.startsWith("/keystatic/") &&
    pathname !== "/keystatic/setup" &&
    pathname !== "/keystatic/setup/"
  ) {
    return context.redirect("/keystatic/setup", 303);
  }

  if (!keystaticGitHubConfigured && pathname.startsWith("/api/keystatic/")) {
    return context.redirect("/keystatic/setup", 303);
  }

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
