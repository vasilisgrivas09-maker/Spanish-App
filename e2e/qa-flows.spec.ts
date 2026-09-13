import { expect, test } from "@playwright/test";

test("home → unit tabs → grammar → dialogue flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".header-title")).toContainText("Español", { timeout: 20_000 });

  await page.locator('[data-unit="2"]').click();
  await expect(page.locator("#dialogues-link")).toBeVisible();
  await expect(page.locator(".grammar-card")).toHaveCount(0);

  await page.locator('[data-unit="1"]').click();
  await expect(page.locator(".grammar-card").first()).toBeVisible();
  await page.locator(".grammar-card").first().click();
  await expect(page.locator(".lesson-card")).toBeVisible();
  await page.locator("#grammar-back").click();

  await page.locator('[data-unit="2"]').click();
  await page.locator("#dialogues-link").click();
  await expect(page.getByRole("heading", { name: "Μικροί διάλογοι" })).toBeVisible();

  await page.locator(".dialogue-card").first().click();
  await expect(page.locator(".dialogue-prompt")).toBeVisible();
  await expect(page.locator(".bubble-gr")).toHaveCount(0);
  await expect(page.locator(".choice-gr")).toHaveCount(0);

  const choiceCount = await page.locator("[data-choice-index]").count();
  expect(choiceCount).toBeGreaterThanOrEqual(2);
});

test("settings gear opens backup controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#settings-link")).toBeVisible({ timeout: 20_000 });
  await page.locator("#settings-link").click();
  await expect(page.getByRole("heading", { name: "Ρυθμίσεις" })).toBeVisible();
  await expect(page.locator("#export-progress")).toBeVisible();
  await expect(page.locator("#import-progress")).toBeVisible();
  await expect(page.locator("#setting-theme")).toBeVisible();
});

test("category browse and quiz open", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".category-card").first()).toBeVisible({ timeout: 20_000 });
  await page.locator("[data-browse]").first().click();
  await expect(page.locator(".word-list, .empty-state").first()).toBeVisible();
  await page.locator("#browse-back").click();
  await page.locator("[data-quiz]").first().click();
  await expect(page.locator(".quiz-screen, .question-card").first()).toBeVisible();
});
