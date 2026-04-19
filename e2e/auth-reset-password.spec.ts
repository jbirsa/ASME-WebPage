import { expect, test } from "@playwright/test"

test("reset password exitoso redirige a login", async ({ page }) => {
  await page.route("**/api/auth/reset-password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto("/restablecer-contrasena?codigo=dev-reset-123")

  await expect(page.locator("#codigo")).toHaveValue("dev-reset-123")
  await page.locator("#newPassword").fill("654321")
  await page.locator("#confirmPassword").fill("654321")
  await page.getByRole("button", { name: "Actualizar contrasena" }).click()

  await expect(page).toHaveURL(/\/login\?reset=1/)
  await expect(page.getByText("Contrasena actualizada correctamente. Ya podes iniciar sesion.")).toBeVisible()
})

test("reset password muestra error cuando el codigo es invalido", async ({ page }) => {
  await page.route("**/api/auth/reset-password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, message: "Token invalido o expirado" }),
    })
  })

  await page.goto("/restablecer-contrasena")

  await page.locator("#codigo").fill("codigo-invalido")
  await page.locator("#newPassword").fill("654321")
  await page.locator("#confirmPassword").fill("654321")
  await page.getByRole("button", { name: "Actualizar contrasena" }).click()

  await expect(page.getByText("Token invalido o expirado")).toBeVisible()
  await expect(page).toHaveURL(/\/restablecer-contrasena$/)
})

test("reset password valida contrasenas distintas antes de enviar", async ({ page }) => {
  let requestWasSent = false

  await page.route("**/api/auth/reset-password", async (route) => {
    requestWasSent = true
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto("/restablecer-contrasena")

  await page.locator("#codigo").fill("dev-reset-123")
  await page.locator("#newPassword").fill("654321")
  await page.locator("#confirmPassword").fill("111111")
  await page.getByRole("button", { name: "Actualizar contrasena" }).click()

  await expect(page.getByText("Las contrasenas no coinciden")).toBeVisible()
  expect(requestWasSent).toBeFalsy()
})
