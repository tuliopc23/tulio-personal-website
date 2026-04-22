import type { APIContext } from "astro";
import { defineMiddleware } from "astro:middleware";
import fontsCssHref from "./styles/fonts.css?url";
import keystaticAdminCssHref from "./styles/keystatic-admin.css?url";

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

const KEYSTATIC_HTML_MARKER = 'data-keystatic-admin="true"';
const KEYSTATIC_ASSETS_MARKER = "<!-- keystatic-admin-assets -->";

function keystaticDocumentHead(): string {
  return [
    KEYSTATIC_ASSETS_MARKER,
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    `<meta name="theme-color" content="#050506">`,
    `<link rel="icon" type="image/png" href="/brand-icon-light.png" media="(prefers-color-scheme: light)">`,
    `<link rel="icon" type="image/png" href="/brand-icon-dark.png" media="(prefers-color-scheme: dark)">`,
    `<link rel="stylesheet" href="${fontsCssHref}">`,
    `<link rel="stylesheet" href="${keystaticAdminCssHref}">`,
    `<script>(()=>{const root=document.documentElement;const prefersLight=window.matchMedia("(prefers-color-scheme: light)").matches;root.dataset.theme=prefersLight?"light":"dark";root.classList.toggle("light",prefersLight);root.classList.toggle("dark",!prefersLight);})();</script>`,
  ].join("");
}

function injectKeystaticDocumentTheme(html: string): string {
  const hasDocumentShell = /<html\b/i.test(html) && /<body\b/i.test(html);
  const innerHtml = html.replace(/^<!DOCTYPE html>/i, "");
  let out = hasDocumentShell
    ? html
    : `<!DOCTYPE html><html ${KEYSTATIC_HTML_MARKER}><head><title>Keystatic CMS • Tulio Cunha</title>${keystaticDocumentHead()}</head><body ${KEYSTATIC_HTML_MARKER}>${innerHtml}</body></html>`;

  if (!out.includes(KEYSTATIC_HTML_MARKER)) {
    out = out.replace("<html", '<html data-keystatic-admin="true"');
    out = out.replace("<body", '<body data-keystatic-admin="true"');
  }

  if (!out.includes(KEYSTATIC_ASSETS_MARKER)) {
    out = out.replace("</head>", `${keystaticDocumentHead()}</head>`);
  }

  return out;
}

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

  const isHtml = response.headers.get("content-type")?.includes("text/html");
  if (isHtml && (pathname.startsWith("/keystatic") || import.meta.env.DEV)) {
    const html = await response.text();
    const themed = pathname.startsWith("/keystatic") ? injectKeystaticDocumentTheme(html) : html;
    const finalHtml = import.meta.env.DEV ? rewriteDevPaths(themed) : themed;
    return new Response(finalHtml, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  // Dev-only: rewrite island component URLs so hydration works
  if (import.meta.env.DEV && isHtml) {
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
