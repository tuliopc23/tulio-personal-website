import { experimental_AstroContainer as AstroContainer } from "astro/container";

describe("keystatic setup page", () => {
  test("renders the GitHub auth fallback guidance", async () => {
    const container = await AstroContainer.create();
    const { default: KeystaticSetupPage } = await import(
      "../../src/pages/keystatic/setup.astro"
    );

    const html = await container.renderToString(
      KeystaticSetupPage as any,
      {
        request: new Request("https://www.tuliocunha.dev/keystatic/setup"),
      } as any,
    );

    expect(html).toContain("Keystatic needs GitHub auth before the admin can open.");
    expect(html).toContain("KEYSTATIC_GITHUB_CLIENT_ID");
    expect(html).toContain("KEYSTATIC_GITHUB_CLIENT_SECRET");
    expect(html).toContain("KEYSTATIC_SECRET");
    expect(html).toContain('name="robots" content="noindex,nofollow"');
  });
});
