import { onRequest } from "../../src/middleware";

function assertResponse(response: Response | void): Response {
  expect(response).toBeInstanceOf(Response);
  return response as Response;
}

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
  test("passes through keystatic page requests when auth env is missing", async () => {
    const next = vi.fn(
      async () =>
        new Response("<html><head></head><body>ok</body></html>", {
          headers: { "content-type": "text/html" },
        }),
    );

    const response = assertResponse(
      await onRequest(createRedirectContext("https://www.tuliocunha.dev/keystatic/"), next),
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('data-keystatic-admin="true"');
    expect(html).toContain("brand-icon-light.png");
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("normalizes keystatic api requests without a trailing slash", async () => {
    const next = vi.fn(async () => new Response("ok"));

    const response = assertResponse(
      await onRequest(
        createRedirectContext("https://www.tuliocunha.dev/api/keystatic/github/login"),
        next,
      ),
    );

    expect(response.status).toBe(308);
    expect(response.headers.get("Location")).toBe("/api/keystatic/github/login/");
    expect(next).not.toHaveBeenCalled();
  });
});
