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
