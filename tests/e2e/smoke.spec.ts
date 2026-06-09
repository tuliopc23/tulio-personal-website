import { expect, test } from "@playwright/test";

test("theme toggle persists across reload", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator('[role="switch"]').first();

  await expect(toggle).toBeVisible();
  await toggle.click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", /light|dark/);
});

test("mobile theme toggle is visible in topbar", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator('[role="switch"]').first()).toBeVisible();
});

test("mobile liquid glass nav opens drawer and navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact/");

  const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
  await expect(mobileNav).toBeVisible();
  await expect(page.locator(".topbar__menu")).toBeHidden();
  await expect(mobileNav.getByRole("button", { name: "Open navigation menu" })).toBeVisible();

  const menuButton = mobileNav.getByRole("button", { name: "Open navigation menu" });
  await menuButton.click();
  const sidebar = page.locator("#site-sidebar");
  await expect(sidebar).toHaveClass(/is-open/);
  await expect(sidebar.getByText("Elsewhere", { exact: true })).toBeVisible();
  await expect(menuButton).toBeHidden();

  await sidebar.getByRole("button", { name: "Close menu" }).click();
  await expect(sidebar).not.toHaveClass(/is-open/);
  await expect(mobileNav.getByRole("button", { name: "Open navigation menu" })).toBeVisible();

  await mobileNav.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(sidebar).toHaveClass(/is-open/);

  await sidebar.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(mobileNav.getByRole("button", { name: "Open navigation menu" })).toContainText(
    "Home",
  );
});

test("mobile search FAB opens dock search", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__siteSearch?.open === "function");

  const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
  const searchPanel = page.locator(".siteSearchPanel--mobile");
  await mobileNav.getByRole("button", { name: "Open search" }).click();
  await expect(searchPanel).toBeVisible();
  await expect(page.getByText("The starting point")).toHaveCount(0);
  await expect(searchPanel.getByPlaceholder("Search pages…")).toBeVisible();
  await searchPanel.getByRole("button", { name: "Close search" }).click();
  await expect(searchPanel).toHaveCount(0);
});

test("case study carousel allows vertical page scroll on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/");

  const track = page.locator("[data-case-track]");
  await expect(track).toBeVisible();

  const before = await page.evaluate(() => window.scrollY);
  await track.hover();
  await page.mouse.wheel(0, 240);
  const after = await page.evaluate(() => window.scrollY);

  expect(after).toBeGreaterThan(before);
});

test("case study carousel allows vertical page scroll on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/projects/");

  const track = page.locator("[data-case-track]");
  await expect(track).toBeVisible();

  const before = await page.evaluate(() => window.scrollY);
  await track.hover();
  await page.mouse.wheel(0, 320);
  const after = await page.evaluate(() => window.scrollY);

  expect(after).toBeGreaterThan(before);
});

test("mobile Cmd+K opens dock search", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__siteSearch?.open === "function");
  await page.keyboard.press("Meta+k");
  const searchPanel = page.locator(".siteSearchPanel--mobile");
  await expect(searchPanel).toBeVisible();
  await searchPanel.locator("[cmdk-input]").pressSequentially("blog", { delay: 40 });
  await expect(searchPanel.locator(".siteSearchItem__title", { hasText: "Blog" })).toBeVisible();
  await searchPanel.locator(".siteSearchItem__title", { hasText: "Blog" }).click();
  await expect(page).toHaveURL(/\/blog\/?$/);
});

test("mobile back from blog returns home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.goto("/blog/");
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("desktop topbar shows Cases nav and Cmd+K search", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Cases" })).toBeVisible();
  await expect(page.locator("[data-topbar-tab-indicator]")).toBeVisible();
  await page.keyboard.press("Meta+k");
  await expect(page.locator(".siteLiquidSearch__desktopPopover")).toBeVisible();
});

test("blog index newsletter is visible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blog/");
  await expect(page.locator(".newsletterSignup")).toBeVisible();
});

test("contact form opens a mailto draft", async ({ page }) => {
  await page.goto("/contact/");
  const form = page.locator("[data-contact-form]");
  await form.locator("input[name='name']").fill("Tulio");
  await form.locator("input[name='email']").fill("hello@example.com");
  await form.locator("input[name='subject']").fill("Need help");
  await form.locator("textarea[name='message']").fill("Looking for implementation help.");

  await form.evaluate((contactForm) => {
    contactForm.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
      },
      { once: true },
    );
  });

  await form.locator("button[type='submit']").click();
  await expect(form.locator("input[name='subject']")).toHaveValue("Need help");
});
