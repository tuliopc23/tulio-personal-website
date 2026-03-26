const getSanityClient = vi.fn();
const getPreviewSanityClient = vi.fn();

vi.mock("../../src/sanity/lib/client", () => ({
  getSanityClient,
  getPreviewSanityClient,
}));

describe("loadQuery", () => {
  beforeEach(() => {
    getSanityClient.mockReset();
    getPreviewSanityClient.mockReset();
  });

  test("uses published perspective by default", async () => {
    vi.stubEnv("PUBLIC_SANITY_VISUAL_EDITING_ENABLED", "false");
    vi.resetModules();
    const fetchMock = vi.fn().mockResolvedValueOnce({
      result: [{ title: "ok" }],
      resultSourceMap: undefined,
    });
    getSanityClient.mockResolvedValueOnce({ fetch: fetchMock });

    const { loadQuery } = await import("../../src/sanity/lib/load-query");
    const result = await loadQuery<{ title: string }[]>({ query: "*[]" });

    expect(result.perspective).toBe("published");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "*[]",
      {},
      {
        filterResponse: false,
        resultSourceMap: false,
      },
    );
    expect(result.data).toEqual([{ title: "ok" }]);
  });

  test("returns null data on network failures", async () => {
    vi.stubEnv("PUBLIC_SANITY_VISUAL_EDITING_ENABLED", "false");
    vi.resetModules();
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error("fetch failed: ECONNRESET"));
    getSanityClient.mockResolvedValueOnce({ fetch: fetchMock });

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { loadQuery } = await import("../../src/sanity/lib/load-query");
    const result = await loadQuery<string[]>({ query: "*[]" });

    expect(result.data).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
