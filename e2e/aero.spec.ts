import { expect, test } from "@playwright/test";

test("aero carga y navega a competencia", async ({ page }) => {
  await page.goto("/aero");

  await expect(page.getByRole("heading", { name: "AERO ITBA" })).toBeVisible();

  const isMobile = (page.viewportSize()?.width ?? 0) < 768;

  if (isMobile) {
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page
      .locator('div[style*="calc(3px + 64px)"] a[href="#competencia"]')
      .evaluate((link: HTMLAnchorElement) => link.click());
  } else {
    await page.locator('nav a[href="#competencia"]').click();
  }

  await expect(page).toHaveURL(/#competencia/);
  await expect(page.getByRole("heading", { name: "Design. Build. Fly." })).toBeVisible();
});

test("aero mantiene los enlaces externos clave", async ({ page }) => {
  await page.goto("/aero#competencia");

  await expect(page.getByRole("link", { name: "Sitio de la competencia" })).toHaveAttribute(
    "href",
    "https://www.aiaa.org/dbf",
  );

  await expect(page.getByRole("link", { name: "Reglamento", exact: true })).toHaveAttribute(
    "href",
    "https://7ffac911-d3fa-4a62-aebe-b0d26d4780f1.filesusr.com/ugd/9b69a1_2ea68d7933034cfca8536e5dd576b5eb.pdf",
  );
});
