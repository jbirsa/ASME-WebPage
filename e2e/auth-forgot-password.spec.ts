import { expect, test } from "@playwright/test"

test("forgot password muestra mensaje generico y codigo de desarrollo", async ({ page }) => {
  await page.route("**/api/auth/forgot-password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ sent: true, token: "dev-reset-123" }),
    })
  })

  await page.goto("/olvide-mi-contrasena")

  await page.locator("#email").fill("alumno@asme.org")
  const submitButton = page.getByRole("button", { name: "Enviar codigo" })
  await expect(submitButton).toBeEnabled()
  await submitButton.click()

  await expect(page.getByText("Si el correo existe, te enviamos un codigo para restablecer la contrasena.")).toBeVisible()
  await expect(page.getByText("Codigo de desarrollo")).toBeVisible()
  await expect(page.getByText("dev-reset-123")).toBeVisible()
  await expect(page.getByRole("link", { name: "Usar este codigo ahora" })).toBeVisible()
})

test("forgot password muestra error de backend", async ({ page }) => {
  await page.route("**/api/auth/forgot-password", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "No se pudo iniciar la recuperacion" }),
    })
  })

  await page.goto("/olvide-mi-contrasena")

  await page.locator("#email").fill("alumno@asme.org")
  await page.getByRole("button", { name: "Enviar codigo" }).click()

  await expect(page.getByText("No se pudo iniciar la recuperacion")).toBeVisible()
})
