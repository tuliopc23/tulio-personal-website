import { installAnimationStubs, installMatchMediaStub } from "../helpers/browser";

function mockHorizontalMetrics(
  element: HTMLElement,
  options: { clientWidth: number; scrollWidth: number; scrollLeft?: number },
) {
  let currentScrollLeft = options.scrollLeft ?? 0;

  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: options.clientWidth,
  });
  Object.defineProperty(element, "scrollWidth", {
    configurable: true,
    value: options.scrollWidth,
  });
  Object.defineProperty(element, "scrollLeft", {
    configurable: true,
    get: () => currentScrollLeft,
    set: (value: number) => {
      currentScrollLeft = value;
    },
  });
}

describe("scroll indicators", () => {
  async function loadModule() {
    return import("../../src/scripts/scroll-indicators");
  }

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("marks rail overflow and edge states", async () => {
    installMatchMediaStub({ reducedMotion: false });
    const { cleanupScrollIndicators, initScrollIndicators } = await loadModule();

    document.body.innerHTML = `
      <div class="articleCarousel">
        <ul class="articleGrid">
          <li></li>
          <li></li>
        </ul>
      </div>
    `;

    const rail = document.querySelector(".articleGrid") as HTMLElement;
    mockHorizontalMetrics(rail, { clientWidth: 320, scrollWidth: 960 });

    initScrollIndicators();

    expect(rail.getAttribute("data-lenis-prevent-wheel")).toBe("");
    expect(rail.getAttribute("data-lenis-prevent-touch")).toBe("");
    expect(rail.dataset.hasOverflow).toBe("true");
    expect(rail.dataset.atStart).toBe("true");

    rail.scrollLeft = 640;
    rail.dispatchEvent(new Event("scroll"));

    expect(rail.dataset.atEnd).toBe("true");
    expect((document.querySelector(".articleCarousel") as HTMLElement).dataset.atEnd).toBe("true");

    cleanupScrollIndicators();
  });

  test("does not attach to [data-case-rail] because the case carousel owns its own navigation", async () => {
    installMatchMediaStub({ reducedMotion: false });
    const { cleanupScrollIndicators, initScrollIndicators } = await loadModule();

    document.body.innerHTML = `
      <div class="container">
        <div data-case-rail>
          <article></article>
          <article></article>
        </div>
      </div>
    `;

    const rail = document.querySelector("[data-case-rail]") as HTMLElement;
    mockHorizontalMetrics(rail, { clientWidth: 400, scrollWidth: 1200 });

    initScrollIndicators();

    expect(rail.getAttribute("data-lenis-prevent-wheel")).toBeNull();
    expect(rail.dataset.hasOverflow).toBeUndefined();

    cleanupScrollIndicators();
  });

  test("converts wheel and keyboard input into horizontal movement", async () => {
    installAnimationStubs();
    installMatchMediaStub({ reducedMotion: false });
    const { cleanupScrollIndicators, initScrollIndicators } = await loadModule();

    document.body.innerHTML = `
      <div class="container">
        <div class="cardRail">
          <article></article>
          <article></article>
          <article></article>
        </div>
      </div>
    `;

    const rail = document.querySelector(".cardRail") as HTMLElement;
    mockHorizontalMetrics(rail, { clientWidth: 360, scrollWidth: 1260, scrollLeft: 0 });

    Array.from(rail.children).forEach((child, index) => {
      Object.defineProperty(child, "getBoundingClientRect", {
        configurable: true,
        value: () => ({ width: 320, left: index * 340 }),
      });
      (child as HTMLElement).scrollIntoView = vi.fn();
    });

    initScrollIndicators();

    const wheelEvent = new WheelEvent("wheel", {
      deltaY: 120,
      bubbles: true,
      cancelable: true,
    });

    rail.dispatchEvent(wheelEvent);

    expect(rail.scrollLeft).toBeGreaterThan(0);

    rail.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    expect(rail.scrollLeft).toBeGreaterThan(100);

    cleanupScrollIndicators();
  });
});
