import { expect, test } from "@playwright/test"

test("reset password permite mostrar y ocultar las contraseñas", async ({ page }) => {
  await page.goto("/restablecer-contrasena")

  await expect(page.getByRole("heading", { name: "ASME Campus" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Nueva contraseña" })).toBeVisible()

  const newPasswordInput = page.locator("#newPassword")
  const confirmPasswordInput = page.locator("#confirmPassword")
  const newPasswordToggleButton = page.locator("#newPassword + button")
  const confirmPasswordToggleButton = page.locator("#confirmPassword + button")

  await expect(newPasswordInput).toHaveAttribute("type", "password")
  await expect(confirmPasswordInput).toHaveAttribute("type", "password")

  await newPasswordToggleButton.click()
  await expect(newPasswordInput).toHaveAttribute("type", "text")
  await expect(confirmPasswordInput).toHaveAttribute("type", "password")

  await confirmPasswordToggleButton.click()
  await expect(confirmPasswordInput).toHaveAttribute("type", "text")

  await newPasswordToggleButton.click()
  await confirmPasswordToggleButton.click()
  await expect(newPasswordInput).toHaveAttribute("type", "password")
  await expect(confirmPasswordInput).toHaveAttribute("type", "password")
})

test("reset password exitoso redirige a login", async ({ page }) => {
  let requestBody: Record<string, unknown> | null = null

  await page.route("**/api/auth/reset-password", async (route) => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto("/restablecer-contrasena?codigo=qjrmta")

  await expect(page.locator("#codigo")).toHaveValue("QJRMTA")
  await page.locator("#email").fill("alumno@asme.org")
  await page.locator("#newPassword").fill("654321")
  await page.locator("#confirmPassword").fill("654321")
  await page.getByRole("button", { name: "Actualizar contraseña" }).click()

  expect(requestBody).toEqual({
    email: "alumno@asme.org",
    code: "QJRMTA",
    newPassword: "654321",
  })
  await expect(page).toHaveURL(/\/login\?reset=1/)
  await expect(page.getByText(/Contrase.a actualizada correctamente\. Ya podes iniciar sesion\./)).toBeVisible()
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

  await page.locator("#email").fill("alumno@asme.org")
  await page.locator("#codigo").fill("QJRMTA")
  await page.locator("#newPassword").fill("654321")
  await page.locator("#confirmPassword").fill("654321")
  await page.getByRole("button", { name: "Actualizar contraseña" }).click()

  await expect(page.getByText("Token invalido o expirado")).toBeVisible()
  await expect(page).toHaveURL(/\/restablecer-contrasena$/)
})

test("reset password valida contraseñas distintas antes de enviar", async ({ page }) => {
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

  await page.locator("#email").fill("alumno@asme.org")
  await page.locator("#codigo").fill("QJRMTA")
  await page.locator("#newPassword").fill("654321")
  await page.locator("#confirmPassword").fill("111111")
  await page.getByRole("button", { name: "Actualizar contraseña" }).click()

  await expect(page.getByText("Las contraseñas no coinciden")).toBeVisible()
  expect(requestWasSent).toBeFalsy()
})

test("reset password normaliza el codigo en mayusculas antes de enviarlo", async ({ page }) => {
  let requestBody: Record<string, unknown> | null = null

  await page.route("**/api/auth/reset-password", async (route) => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto("/restablecer-contrasena")

  await page.locator("#email").fill("alumno@asme.org")
  await page.locator("#codigo").fill("qjrmta")
  await page.locator("#newPassword").fill("654321")
  await page.locator("#confirmPassword").fill("654321")
  await page.getByRole("button", { name: "Actualizar contraseña" }).click()

  expect(requestBody).toEqual({
    email: "alumno@asme.org",
    code: "QJRMTA",
    newPassword: "654321",
  })
})
