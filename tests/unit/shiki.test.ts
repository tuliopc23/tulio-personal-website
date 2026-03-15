const codeToHtml = vi.fn();

vi.mock("shiki", () => ({
  codeToHtml,
}));

describe("shiki helpers", () => {
  test("parses line highlights", async () => {
    const { parseLineHighlights } = await import("../../src/lib/shiki");
    expect(parseLineHighlights("1, 3-5,8")).toEqual([1, 3, 4, 5, 8]);
  });

  test("falls back to plaintext for unknown languages", async () => {
    codeToHtml
      .mockRejectedValueOnce(new Error("Unknown language"))
      .mockResolvedValueOnce("<pre>plain</pre>");

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { highlightCode } = await import("../../src/lib/shiki");

    await expect(highlightCode("const ok = true", "nope")).resolves.toBe(
      "<pre>plain</pre>"
    );
    expect(codeToHtml).toHaveBeenLastCalledWith(
      "const ok = true",
      expect.objectContaining({ lang: "plaintext" })
    );
    expect(warnSpy).toHaveBeenCalled();
  });
});
