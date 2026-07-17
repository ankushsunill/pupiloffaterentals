import { test, expect } from "@playwright/test";

test("renders the core experience without browser errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Luxury mobility");
  await expect(page.locator("#siteNav")).toBeVisible();
  await expect(page.locator("#enquire")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-pof-booted", "true");
  expect(errors).toEqual([]);
});

test("prepares a validated WhatsApp enquiry", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Preferred vehicle", { exact: true }).selectOption("Ferrari Purosangue");
  await page.getByRole("button", { name: "Prepare request" }).click();
  await expect(page.getByText("Your request is ready to send.")).toBeVisible();
  await expect(page.locator(".concierge-builder-whatsapp")).toHaveAttribute("href", /wa\.me\/971549957255/);
});

test("concierge dialog supports keyboard open and close", async ({ page }) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Open POF digital concierge" });
  await launcher.focus();
  await launcher.press("Enter");
  await expect(page.getByRole("dialog", { name: "POF digital concierge" })).toHaveAttribute("aria-modal", "true");
  await page.keyboard.press("Escape");
  await expect(launcher).toBeFocused();
});

test("page exposes essential accessibility landmarks", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(page.locator("img:not([alt])")).toHaveCount(0);
});
