import { expect, test } from "@playwright/test";

test("equilibrista muestra el reglamento descargable", async ({ page }) => {
  await page.goto("/equilibrista-mecanico");

  await expect(page.getByRole("heading", { name: "Equilibrista Mecánico" })).toBeVisible();

  await expect(page.getByRole("link", { name: "Descargar Reglamento Completo" })).toHaveAttribute(
    "href",
    "/reglamento-equilibrista-mecanico.pdf",
  );
});
