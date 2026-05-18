import { expect, test } from "@playwright/test"

test("login muestra el panel visual de Aero", async ({ page }) => {
  await page.goto("/login")

  await expect(page.getByText("Plataforma de aprendizaje")).toBeVisible()
  await expect(page.getByRole("heading", { name: "ASME Campus" })).toBeVisible()
  await expect(page.getByText("Accedé a cursos, talleres y contenidos técnicos de ASME desde un solo lugar.")).toBeVisible()
  await expect(page.getByPlaceholder("Correo electrónico")).toBeVisible()
})

test("login permite mostrar y ocultar la contraseña", async ({ page }) => {
  await page.goto("/login")

  const passwordInput = page.locator("#password")
  const toggleButton = page.getByRole("button", { name: "Mostrar contraseña" })

  await expect(passwordInput).toHaveAttribute("type", "password")
  await toggleButton.click()
  await expect(passwordInput).toHaveAttribute("type", "text")
  await expect(page.getByRole("button", { name: "Ocultar contraseña" })).toBeVisible()

  await page.getByRole("button", { name: "Ocultar contraseña" }).click()
  await expect(passwordInput).toHaveAttribute("type", "password")
})

test("login muestra estado de cuenta no verificada y permite reenviar la verificacion", async ({ page }) => {
  let resendBody: Record<string, unknown> | null = null

  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 403,
      contentType: "application/json",
      body: JSON.stringify({ message: "Debes verificar tu email antes de iniciar sesión" }),
    })
  })

  await page.route("**/api/auth/resend-verification-email", async (route) => {
    resendBody = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ sent: true }),
    })
  })

  await page.goto("/login")

  await page.locator("#email").fill("alumno@asme.org")
  await page.locator("#password").fill("123456")
  await page.getByRole("button", { name: "Ingresar" }).click()

  await expect(page.getByText("Debes verificar tu email antes de iniciar sesión")).toBeVisible()
  await expect(page.getByRole("button", { name: "Reenviar verificacion" })).toBeVisible()

  await page.getByRole("button", { name: "Reenviar verificacion" }).click()

  expect(resendBody).toEqual({ email: "alumno@asme.org" })
  await expect(page.getByText("Si el correo existe y la cuenta sigue pendiente, reenviamos la verificacion.")).toBeVisible()
})
