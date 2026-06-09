import { initContactForm } from "../../src/scripts/contact-form";

describe("contact form script", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("builds a mailto URL from submitted data", () => {
    document.body.innerHTML = `
      <form data-contact-form>
        <input name="name" value="Tulio" />
        <input name="email" value="hello@example.com" />
        <input name="subject" value="Need help" />
        <textarea name="message">Shipping an Astro site</textarea>
        <p data-contact-status role="status" aria-live="polite"></p>
      </form>
    `;

    const form = document.querySelector("form") as HTMLFormElement;
    const status = form.querySelector("[data-contact-status]") as HTMLElement;
    const assignSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { assign: assignSpy },
      configurable: true,
    });

    initContactForm();
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(assignSpy).toHaveBeenCalledWith(
      expect.stringContaining("mailto:contact@tuliocunha.dev?subject=Need%20help"),
    );
    expect(assignSpy).toHaveBeenCalledWith(expect.stringContaining("Shipping%20an%20Astro%20site"));
    expect(status.dataset.kind).toBe("pending");
    expect(status.textContent).toContain("Opening your mail client");

    vi.advanceTimersByTime(1800);
    expect(status.dataset.kind).toBe("fallback");
    expect(status.querySelector("[data-contact-copy]")).toBeTruthy();
    expect(status.textContent).toContain("contact@tuliocunha.dev");
  });

  test("copy button writes email to clipboard", async () => {
    document.body.innerHTML = `
      <form data-contact-form>
        <input name="name" value="Tulio" />
        <input name="email" value="hello@example.com" />
        <input name="subject" value="Need help" />
        <textarea name="message">Hello</textarea>
        <p data-contact-status role="status" aria-live="polite"></p>
      </form>
    `;

    const form = document.querySelector("form") as HTMLFormElement;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    Object.defineProperty(window, "location", {
      value: { assign: vi.fn() },
      configurable: true,
    });

    initContactForm();
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    vi.advanceTimersByTime(1800);

    const copyButton = form.querySelector("[data-contact-copy]") as HTMLButtonElement;
    copyButton.click();

    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith("contact@tuliocunha.dev");
  });
});
