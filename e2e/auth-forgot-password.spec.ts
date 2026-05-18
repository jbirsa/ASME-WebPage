import { expect, test } from "@playwright/test"

test("forgot password muestra mensaje generico al enviar el formulario", async ({ page }) => {
  await page.route("**/api/auth/forgot-password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ sent: true, code: "QJRMTA" }),
    })
  })

  await page.goto("/olvide-mi-contrasena")

  await expect(page.getByRole("heading", { name: "ASME Campus" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Recuperar contraseña" })).toBeVisible()

  await page.locator("#email").fill("alumno@asme.org")
  const submitButton = page.getByRole("button", { name: "Enviar codigo" })
  await expect(submitButton).toBeEnabled()
  await submitButton.click()

  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByText("Revisá tu correo")).toBeVisible()
  await expect(page.getByText("Si el correo existe, te enviamos un codigo para restablecer la contraseña.")).toBeVisible()
  await expect(page.getByText("Codigo de desarrollo")).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Entendido" })).toBeVisible()
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

  await expect(page.getByRole("heading", { name: "ASME Campus" })).toBeVisible()

  await page.locator("#email").fill("alumno@asme.org")
  await page.getByRole("button", { name: "Enviar codigo" }).click()

  await expect(page.getByText("No se pudo iniciar la recuperacion")).toBeVisible()
})
