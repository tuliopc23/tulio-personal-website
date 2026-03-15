import { installAnimationStubs, installMatchMediaStub } from "../helpers/browser";

describe("project filters script", () => {
  test("restores the filter from the URL and hides unmatched cards", async () => {
    installAnimationStubs();
    installMatchMediaStub();
    window.history.replaceState({}, "", "/projects/?filter=web");

    document.body.innerHTML = `
      <div data-project-empty hidden></div>
      <div data-projects-grid>
        <article data-project-card data-project-categories="native"></article>
        <article data-project-card data-project-categories="web"></article>
      </div>
      <button data-project-filter="all"></button>
      <button data-project-filter="native"></button>
      <button data-project-filter="web"></button>
    `;

    const { initProjectFilters } = await import("../../src/scripts/projects-filters");
    initProjectFilters();

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-project-card]")
    );
    const buttons = Array.from(
      document.querySelectorAll<HTMLElement>("[data-project-filter]")
    );

    expect(buttons[2]?.getAttribute("aria-pressed")).toBe("true");
    expect(cards[0]?.dataset.state).toBe("hiding");
    expect(cards[1]?.dataset.state).toBe("visible");
  });
});
