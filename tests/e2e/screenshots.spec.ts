import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const STATIC_ROUTES = [
  "/",
  "/about/",
  "/blog/",
  "/projects/",
  "/now/",
  "/contact/",
  "/studio/",
  "/rss.xml",
  "/blog/feed.xml",
  "/blog/atom.xml",
  "/sitemap-index.xml",
];

function sanitizeRoute(route: string): string {
  const trimmed = route.replace(/^\//, "").replace(/\/$/, "");
  return (trimmed || "index").replace(/\//g, "__");
}

async function pathsFromSitemap(request: APIRequestContext, baseURL: string): Promise<string[]> {
  const res = await request.get(new URL("/sitemap-index.xml", baseURL).toString());
  if (!res.ok()) {
    return [];
  }
  const text = await res.text();
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths: string[] = [];
  for (const loc of locs) {
    try {
      paths.push(new URL(loc).pathname);
    } catch {
      /* ignore */
    }
  }
  return paths;
}

async function discoverTopicAndSeriesLinks(page: Page, baseURL: string): Promise<string[]> {
  await page.goto(new URL("/blog/", baseURL).toString(), {
    waitUntil: "load",
    timeout: 90_000,
  });
  const hrefs = await page.locator('a[href^="/blog/"]').evaluateAll((elements) =>
    elements.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? ""),
  );
  const out = new Set<string>();
  for (const href of hrefs) {
    if (!href) {
      continue;
    }
    if (href.includes("/blog/topic/") || href.includes("/blog/series/")) {
      try {
        out.add(new URL(href, baseURL).pathname);
      } catch {
        /* ignore */
      }
    }
  }
  return [...out];
}

async function collectRoutes(
  request: APIRequestContext,
  page: Page,
  baseURL: string,
): Promise<string[]> {
  const fromSitemap = await pathsFromSitemap(request, baseURL);
  let topicSeries: string[] = [];
  try {
    topicSeries = await discoverTopicAndSeriesLinks(page, baseURL);
  } catch {
    topicSeries = [];
  }
  const merged = [...STATIC_ROUTES, ...fromSitemap, ...topicSeries];
  const normalized = merged.map((p) => (p.startsWith("/") ? p : `/${p}`));
  return [...new Set(normalized)].sort((a, b) => a.localeCompare(b));
}

test.describe("full-page route screenshots", () => {
  test.describe.configure({ mode: "serial", timeout: 600_000 });

  test("capture all discovered routes", async ({ page, request }, testInfo) => {
    test.setTimeout(600_000);
    const baseURL = testInfo.project.use.baseURL;
    expect(baseURL).toBeTruthy();
    const projectName = testInfo.project.name;
    const outDir = join(process.cwd(), "e2e-screenshots", projectName);
    await mkdir(outDir, { recursive: true });

    const routes = await collectRoutes(request, page, baseURL as string);
    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      await test.step(`screenshot ${route}`, async () => {
        const isXmlLike = route.endsWith(".xml");
        await page.goto(new URL(route, baseURL).toString(), {
          waitUntil: "load",
          timeout: route.includes("/studio") ? 120_000 : 90_000,
        });
        if (!isXmlLike) {
          await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
        }
        const fileName = `${sanitizeRoute(route)}.png`;
        await page.screenshot({
          path: join(outDir, fileName),
          fullPage: true,
          timeout: 120_000,
        });
      });
    }
  });
});
