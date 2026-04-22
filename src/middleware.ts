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

// Keystatic's GitHub auth endpoints can omit a trailing slash, but this site
// uses trailingSlash = "always". Redirect /api/keystatic/* to a trailing-slash
// URL so GitHub mode login/setup works.
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const search = context.url.search;

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
