describe("posts helpers", () => {
  test("calculates reading time from markdown", async () => {
    const { calculateReadingTimeMinutes } = await import("../../src/lib/reading-time");
    const minutes = calculateReadingTimeMinutes("word ".repeat(500));
    expect(minutes).toBe(2);
  });
});
