import { expect, test } from "@playwright/test";

test("mechub navega desde el hero a la seccion de planes", async ({ page }) => {
  await page.goto("/mechub");

  await expect(page.getByRole("heading", { name: "MecHub", exact: true })).toBeVisible();

  await page
    .locator('a[href="#planes"]')
    .first()
    .evaluate((link: HTMLAnchorElement) => link.click());

  await expect(page).toHaveURL(/#planes/);
  await expect(page.getByRole("heading", { name: "Planes de Sponsoreo", exact: true })).toBeVisible();
});
