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

    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-project-card]"));
    const buttons = Array.from(document.querySelectorAll<HTMLElement>("[data-project-filter]"));

    expect(buttons[2]?.getAttribute("aria-pressed")).toBe("true");
    expect(cards[0]?.dataset.state).toBe("hiding");
    expect(cards[1]?.dataset.state).toBe("visible");
  });

  test("handles keyboard navigation and tilt interactions", async () => {
    installAnimationStubs();
    installMatchMediaStub({ reducedMotion: false, hover: true });
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

    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-project-card]"));
    cards.forEach((card) => {
      Object.defineProperty(card, "getBoundingClientRect", {
        value: () => ({ left: 0, top: 0, width: 200, height: 100 }),
      });
    });

    const { initProjectFilters, initProjectTilt } =
      await import("../../src/scripts/projects-filters");
    initProjectFilters();
    initProjectTilt();

    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-project-filter]"),
    );
    buttons[1]?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(document.activeElement).toBe(buttons[2]);

    buttons[2]?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(document.activeElement).toBe(buttons[0]);

    cards[0]?.dispatchEvent(
      new PointerEvent("pointermove", { clientX: 100, clientY: 50, pointerType: "mouse" }),
    );
    expect(cards[0]?.getAttribute("data-tilt")).toBe("active");
    cards[0]?.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" }));
    expect(cards[0]?.hasAttribute("data-tilt")).toBe(false);
  });
});
