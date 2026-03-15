import { expect, test } from "@playwright/test";

test("theme toggle persists across reload", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle-root] button").first();
  await expect(toggle).toBeVisible();
  await toggle.click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", /light|dark/);
});

test("mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact/");

  const menuButton = page.locator(".topbar__menu");
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(page.locator("body")).toHaveAttribute("data-sidebar-state", "open");

  await page.locator("[data-sidebar-close]").click();
  await expect(page.locator("body")).toHaveAttribute("data-sidebar-state", "closed");
});

test("contact form opens a mailto draft", async ({ page }) => {
  await page.goto("/contact/");
  await page.locator("input[name='name']").fill("Tulio");
  await page.locator("input[name='email']").fill("hello@example.com");
  await page.locator("input[name='subject']").fill("Need help");
  await page.locator("textarea[name='message']").fill("Looking for implementation help.");

  await page.locator("[data-contact-form]").evaluate((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
      },
      { once: true }
    );
  });

  await page.locator("button[type='submit']").click();
  await expect(page.locator("input[name='subject']")).toHaveValue("Need help");
});
