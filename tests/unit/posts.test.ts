vi.mock("astro-portabletext", () => ({
  toPlainText: vi.fn((blocks: Array<{ children?: Array<{ text?: string }> }>) =>
    blocks
      .flatMap((block) => block.children ?? [])
      .map((child) => child.text ?? "")
      .join(" "),
  ),
}));

describe("posts helpers", () => {
  test("calculates reading time from portable text blocks", async () => {
    const { calculateReadingTimeMinutes } = await import("../../src/lib/reading-time");
    const minutes = calculateReadingTimeMinutes([
      {
        _type: "block",
        children: Array.from({ length: 230 }, (_, index) => ({ text: `word-${index}` })),
      } as unknown as import("@portabletext/types").PortableTextBlock,
    ]);

    expect(minutes).toBe(1);
  });

  test("falls back to markdown when blocks are empty", async () => {
    const { calculateReadingTimeMinutes } = await import("../../src/lib/reading-time");
    const minutes = calculateReadingTimeMinutes([], "word ".repeat(500));
    expect(minutes).toBe(2);
  });
});
