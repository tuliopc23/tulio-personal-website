import { installAnimationStubs, installMatchMediaStub } from "../helpers/browser";

describe("navbar search script", () => {
  test("opens, filters results, and closes with escape", async () => {
    installAnimationStubs();
    installMatchMediaStub();

    document.body.innerHTML = `
      <button data-site-search-open aria-expanded="false">Open</button>
      <div data-site-search-root aria-hidden="true" hidden>
        <button data-site-search-close type="button">Close</button>
        <input data-site-search-input />
        <a data-site-search-item data-search-value="home landing page" href="/">Home</a>
        <a data-site-search-item data-search-value="projects work portfolio" href="/projects">Projects</a>
        <p data-site-search-empty hidden>Empty</p>
        <p data-site-search-status></p>
      </div>
    `;

    vi.resetModules();
    await import("../../src/scripts/navbar-search");

    const trigger = document.querySelector("[data-site-search-open]") as HTMLButtonElement;
    const root = document.querySelector("[data-site-search-root]") as HTMLElement;
    const input = document.querySelector("[data-site-search-input]") as HTMLInputElement;
    const items = Array.from(document.querySelectorAll("[data-site-search-item]")) as HTMLElement[];

    trigger.click();

    expect(root.hidden).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.classList.contains("is-search-open")).toBe(true);

    input.value = "proj";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(items[0]?.hidden).toBe(true);
    expect(items[1]?.hidden).toBe(false);
    expect(document.querySelector("[data-site-search-status]")?.textContent).toContain(
      "Showing 1 quick search destination",
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(root.hidden).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.body.classList.contains("is-search-open")).toBe(false);
  });
});
