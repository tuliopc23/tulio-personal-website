describe("loadQuery", () => {
  test("uses published perspective by default", async () => {
    vi.stubEnv("PUBLIC_SANITY_VISUAL_EDITING_ENABLED", "false");
    vi.resetModules();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        result: [{ title: "ok" }],
        resultSourceMap: undefined,
      }),
    } as unknown as Response);

    const { loadQuery } = await import("../../src/sanity/lib/load-query");
    const result = await loadQuery<{ title: string }[]>({ query: "*[]" });

    expect(result.perspective).toBe("published");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const callUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(callUrl.searchParams.get("query")).toBe("*[]");
    expect(callUrl.searchParams.get("perspective")).toBe("published");
    expect(result.data).toEqual([{ title: "ok" }]);
  });

  test("returns null data on network failures", async () => {
    vi.stubEnv("PUBLIC_SANITY_VISUAL_EDITING_ENABLED", "false");
    vi.resetModules();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("fetch failed: ECONNRESET"));

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { loadQuery } = await import("../../src/sanity/lib/load-query");
    const result = await loadQuery<string[]>({ query: "*[]" });

    expect(result.data).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
