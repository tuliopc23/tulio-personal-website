import {
  initPageIndicators,
  prefersPageIndicatorReducedMotion,
  resolvePageIndicatorItemSelector,
} from "../../src/components/page-indicator-script";
import {
  installAnimationStubs,
  installMatchMediaStub,
  installObserverStubs,
} from "../helpers/browser";

describe("page indicator script", () => {
  test("normalizes selectors and respects reduced motion", () => {
    installMatchMediaStub({ reducedMotion: true });
    document.documentElement.dataset.motion = "reduced";
    expect(resolvePageIndicatorItemSelector("> *")).toBe(":scope > *");
    expect(prefersPageIndicatorReducedMotion()).toBe(true);
  });

  test("builds dots and triggers item scrolling", () => {
    installAnimationStubs();
    installMatchMediaStub({ reducedMotion: false });
    installObserverStubs();

    document.body.innerHTML = `
      <div data-page-indicator data-container="#carousel" data-item=":scope > *">
        <div data-page-indicator-track>
          <div data-page-indicator-slider></div>
        </div>
      </div>
      <div id="carousel">
        <article id="item-1"></article>
        <article id="item-2"></article>
      </div>
    `;

    const carousel = document.querySelector("#carousel") as HTMLElement;
    const scrollTo = vi.fn();
    Object.defineProperty(carousel, "clientWidth", {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(carousel, "scrollWidth", {
      configurable: true,
      value: 320,
    });
    carousel.scrollTo = scrollTo;
    Object.defineProperty(carousel, "getBoundingClientRect", {
      value: () => ({ left: 0, width: 200 }),
    });
    Array.from(carousel.children).forEach((child, index) => {
      Object.defineProperty(child, "getBoundingClientRect", {
        value: () => ({ left: index * 120, width: 100 }),
      });
      Object.defineProperty(child, "offsetLeft", {
        configurable: true,
        value: index * 120,
      });
      Object.defineProperty(child, "offsetWidth", {
        configurable: true,
        value: 100,
      });
    });
    const track = document.querySelector("[data-page-indicator-track]") as HTMLElement;
    Object.defineProperty(track, "getBoundingClientRect", {
      value: () => ({ left: 0, width: 100 }),
    });

    initPageIndicators();

    const dots = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-page-indicator-dot]")
    );
    expect(dots).toHaveLength(2);
    expect(dots[0]?.getAttribute("aria-pressed")).toBe("true");

    dots[1]?.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    dots[0]?.click();
    expect(scrollTo).toHaveBeenCalledWith({ behavior: "smooth", left: 0 });
  });
});
