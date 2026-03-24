import { installAnimationStubs, installMatchMediaStub } from "../helpers/browser";

describe("sidebar script", () => {
  test("filters menu links and updates the status text", async () => {
    installAnimationStubs();
    installMatchMediaStub();

    document.body.dataset.hasMobileDrawer = "true";
    document.body.innerHTML = `
      <aside class="sidebar">
        <button data-sidebar-close>Close</button>
        <input id="sidebarFilter" />
        <div class="sidebar__group">
          <a class="sidebar__link">Home</a>
          <a class="sidebar__link">Projects</a>
        </div>
        <p data-sidebar-status></p>
      </aside>
      <button class="topbar__menu">Menu</button>
    `;

    vi.resetModules();
    await import("../../src/scripts/sidebar");

    const input = document.querySelector("#sidebarFilter") as HTMLInputElement;
    input.value = "proj";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    const links = Array.from(document.querySelectorAll<HTMLElement>(".sidebar__link"));
    expect(links[0]?.style.display).toBe("none");
    expect(links[1]?.style.display).toBe("flex");
    expect(document.querySelector("[data-sidebar-status]")?.textContent).toContain(
      "Showing 1 menu link",
    );
  });

  test("opens the mobile drawer and focuses the filter with slash", async () => {
    installAnimationStubs();
    installMatchMediaStub();

    document.body.dataset.hasMobileDrawer = "true";
    document.body.innerHTML = `
      <aside class="sidebar">
        <button data-sidebar-close>Close</button>
        <input id="sidebarFilter" />
        <div class="sidebar__group">
          <a class="sidebar__link">Home</a>
        </div>
        <p data-sidebar-status></p>
      </aside>
      <button class="topbar__menu">Menu</button>
    `;

    vi.resetModules();
    await import("../../src/scripts/sidebar");

    (document.querySelector(".topbar__menu") as HTMLButtonElement).click();
    expect(document.body.dataset.sidebarState).toBe("open");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true }));
    expect(document.activeElement?.id).toBe("sidebarFilter");
  });

  test("toggles desktop sidebar visibility from close button and menu button", async () => {
    installAnimationStubs();
    const media = installMatchMediaStub();
    media.setMatches("(max-width: 1024px)", false);

    document.body.dataset.hasSidebar = "true";
    document.body.dataset.hasMobileDrawer = "true";
    document.body.innerHTML = `
      <aside class="sidebar">
        <button data-sidebar-close>Close</button>
        <input id="sidebarFilter" />
        <div class="sidebar__group">
          <a class="sidebar__link">Home</a>
        </div>
        <p data-sidebar-status></p>
      </aside>
      <button class="topbar__menu">Menu</button>
    `;

    vi.resetModules();
    await import("../../src/scripts/sidebar");

    expect(document.body.dataset.sidebarVisibility).toBe("visible");

    (document.querySelector("[data-sidebar-close]") as HTMLButtonElement).click();
    expect(document.body.dataset.sidebarVisibility).toBe("hidden");

    (document.querySelector(".topbar__menu") as HTMLButtonElement).click();
    expect(document.body.dataset.sidebarVisibility).toBe("visible");
  });
});
