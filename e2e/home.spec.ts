import { expect, test } from "@playwright/test";

test("home carga y navega a la seccion about", async ({ page }) => {
  await page.route("**/api/events/past", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.route("**/api/events/future", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.route("**/api/sponsors", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.goto("/");

  const aboutButton = page.getByRole("button", { name: "Conocer Más" });

  await expect(aboutButton).toBeVisible();
  await aboutButton.click();
  await expect(page).toHaveURL(/#about/);
  await expect(page.getByRole("heading", { name: "¿Qué es ASME?" })).toBeVisible();
});
