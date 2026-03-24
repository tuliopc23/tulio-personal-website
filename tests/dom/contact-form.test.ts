import { initContactForm } from "../../src/scripts/contact-form";

describe("contact form script", () => {
  test("builds a mailto URL from submitted data", () => {
    document.body.innerHTML = `
      <form data-contact-form>
        <input name="name" value="Tulio" />
        <input name="email" value="hello@example.com" />
        <input name="subject" value="Need help" />
        <textarea name="message">Shipping an Astro site</textarea>
      </form>
    `;

    const form = document.querySelector("form") as HTMLFormElement;
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
  });
});
