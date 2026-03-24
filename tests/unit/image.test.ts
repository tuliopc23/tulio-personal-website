describe("sanity image helpers", () => {
  test("uses Cloudflare transforms when configured", async () => {
    vi.stubEnv("PUBLIC_CLOUDFLARE_IMAGE_BASE", "https://images.example.com");
    vi.resetModules();

    const { cloudflareImageUrl, generateSrcset } = await import("../../src/sanity/lib/image");

    expect(
      cloudflareImageUrl("https://cdn.sanity.io/images/demo/image.png", {
        width: 640,
        fit: "cover",
        quality: 88,
      }),
    ).toContain(
      "https://images.example.com/cdn-cgi/image/format=auto,quality=88,sharpen=1,fit=cover,width=640/https://cdn.sanity.io/images/demo/image.png",
    );

    expect(generateSrcset("https://cdn.sanity.io/images/demo/image.png", [320, 640])).toContain(
      " 320w",
    );
  });

  test("falls back to raw source without Cloudflare base", async () => {
    vi.stubEnv("PUBLIC_CLOUDFLARE_IMAGE_BASE", "");
    vi.resetModules();

    const { optimizedImageUrl } = await import("../../src/sanity/lib/image");

    expect(optimizedImageUrl("https://cdn.sanity.io/images/demo/image.png", 1200, 630)).toContain(
      "auto=format",
    );
  });
});
