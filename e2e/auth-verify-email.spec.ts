import { expect, test } from "@playwright/test"

test("verificar email exitoso habilita el acceso a login", async ({ page }) => {
  let requestBody: Record<string, unknown> | null = null

  await page.route("**/api/auth/verify-email", async (route) => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto("/verificar-email?token=abc123")

  await expect.poll(() => requestBody).toEqual({ token: "abc123" })
  await expect(page.getByText("Tu correo fue verificado correctamente. Ya podes iniciar sesion.")).toBeVisible()
  await expect(page.getByRole("link", { name: "Ir a login" })).toHaveAttribute("href", "/login?verified=1")
})

test("verificar email invalido permite reenviar la verificacion", async ({ page }) => {
  let resendBody: Record<string, unknown> | null = null

  await page.route("**/api/auth/verify-email", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, message: "Token invalido o expirado" }),
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

  await page.goto("/verificar-email?token=expired-token")

  await expect(page.getByText("Token invalido o expirado")).toBeVisible()

  await page.locator("#email").fill("alumno@asme.org")
  await page.getByRole("button", { name: "Reenviar verificacion" }).click()

  expect(resendBody).toEqual({ email: "alumno@asme.org" })
  await expect(page.getByText("Si el correo existe y la cuenta sigue pendiente, reenviamos la verificacion.")).toBeVisible()
})
