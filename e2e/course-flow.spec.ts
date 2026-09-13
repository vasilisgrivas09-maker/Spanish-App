import { expect, test } from "@playwright/test";

test("home → quiz → settings → export", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".header-title")).toContainText("Español", {
    timeout: 20_000,
  });

  await page.locator("#all-quiz").click();
  await expect(page.locator(".quiz-screen, .question-card").first()).toBeVisible();
  await page.locator("#quiz-back").click();

  await page.locator("#settings-link").click();
  await expect(page.getByRole("heading", { name: "Ρυθμίσεις" })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#export-progress").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/i);
});
