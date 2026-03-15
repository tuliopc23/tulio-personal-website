const fetchMock = vi.fn();

vi.mock("sanity:client", () => ({
  sanityClient: {
    fetch: fetchMock,
  },
}));

describe("loadQuery", () => {
  test("uses published perspective by default", async () => {
    vi.stubEnv("PUBLIC_SANITY_VISUAL_EDITING_ENABLED", "false");
    vi.resetModules();
    fetchMock.mockResolvedValueOnce({
      result: [{ title: "ok" }],
      resultSourceMap: undefined,
    });

    const { loadQuery } = await import("../../src/sanity/lib/load-query");
    const result = await loadQuery<{ title: string }[]>({ query: "*[]" });

    expect(result.perspective).toBe("published");
    expect(fetchMock).toHaveBeenCalledWith(
      "*[]",
      {},
      expect.objectContaining({ perspective: "published", stega: false })
    );
    expect(result.data).toEqual([{ title: "ok" }]);
  });

  test("returns null data on network failures", async () => {
    vi.stubEnv("PUBLIC_SANITY_VISUAL_EDITING_ENABLED", "false");
    vi.resetModules();
    fetchMock.mockRejectedValueOnce(new Error("fetch failed: ECONNRESET"));

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { loadQuery } = await import("../../src/sanity/lib/load-query");
    const result = await loadQuery<string[]>({ query: "*[]" });

    expect(result.data).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });
});
