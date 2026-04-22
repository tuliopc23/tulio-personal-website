import { onRequest } from "../../src/middleware";

function createRedirectContext(url: string) {
  return {
    url: new URL(url),
    locals: {
      runtime: {
        env: {},
      },
    },
    redirect(to: string, status = 302) {
      return new Response(null, {
        status,
        headers: {
          Location: to,
        },
      });
    },
  } as any;
}

describe("keystatic middleware", () => {
  test("redirects keystatic requests to GitHub app creation when auth env is missing", async () => {
    const next = vi.fn(async () => new Response("ok"));

    const response = await onRequest(
      createRedirectContext("https://www.tuliocunha.dev/keystatic/"),
      next,
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("https://github.com/settings/apps/new");
    expect(next).not.toHaveBeenCalled();
  });

  test("redirects keystatic api requests to GitHub app creation when auth env is missing", async () => {
    const next = vi.fn(async () => new Response("ok"));

    const response = await onRequest(
      createRedirectContext("https://www.tuliocunha.dev/api/keystatic/github/login"),
      next,
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toBe("https://github.com/settings/apps/new");
    expect(next).not.toHaveBeenCalled();
  });
});
