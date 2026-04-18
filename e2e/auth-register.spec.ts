import { expect, test } from "@playwright/test"

test.describe.configure({ mode: "serial" })

test("registro exitoso redirige a login", async ({ page }) => {
  await page.route("**/api/auth/register", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "test-user-id",
        email: "nuevo@asme.org",
        nombre: "Nuevo Usuario",
      }),
    })
  })

  await page.goto("/registro")

  await page.locator("#nombre").fill("Nuevo Usuario")
  await page.locator("#email").fill("nuevo@asme.org")
  await page.locator("#password").fill("123456")
  await page.locator("#confirmPassword").fill("123456")
  const submitButton = page.getByRole("button", { name: "Crear cuenta" })
  await expect(submitButton).toBeEnabled({ timeout: 30_000 })
  await submitButton.click()

  await expect(page).toHaveURL(/\/login\?registered=1/, { timeout: 30_000 })
  await expect(page.getByText("Cuenta creada correctamente. Ya podes iniciar sesion.")).toBeVisible()
})

test("registro muestra error del backend", async ({ page }) => {
  await page.route("**/api/auth/register", async (route) => {
    await route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({ message: "Email ya registrado" }),
    })
  })

  await page.goto("/registro")

  await page.locator("#nombre").fill("Nuevo Usuario")
  await page.locator("#email").fill("nuevo@asme.org")
  await page.locator("#password").fill("123456")
  await page.locator("#confirmPassword").fill("123456")
  const submitButton = page.getByRole("button", { name: "Crear cuenta" })
  await expect(submitButton).toBeEnabled({ timeout: 30_000 })
  await submitButton.click()

  await expect(page.getByText("Email ya registrado")).toBeVisible({ timeout: 30_000 })
  await expect(page).toHaveURL(/\/registro$/, { timeout: 30_000 })
})
