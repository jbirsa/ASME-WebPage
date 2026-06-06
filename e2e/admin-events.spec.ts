import { expect, test, type Page } from "@playwright/test"

function createToken(payload: { sub: string; email: string; rol: string }) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `header.${encodedPayload}.signature`
}

async function setAuthToken(page: Page, token: string) {
  await page.addInitScript((storedToken) => {
    window.localStorage.setItem("asme_access_token", storedToken)
  }, token)
}

test("admin crea, edita y elimina eventos", async ({ page }) => {
  let createRequestBody = ""
  let events = [
    {
      id: 1,
      nombre: "Evento base",
      tipo: "Competencia",
      fecha: "2026-05-20",
      direccion: "Av. Siempre Viva 123",
      sede: "Sede Distrito Rectorado (SDR)",
      descripcion: "Descripcion inicial.",
      link: "https://example.com/base",
      imagen_url: "https://example.com/evento-base.jpg",
    },
  ]

  await page.route("**/api/events", async (route) => {
    const method = route.request().method()

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ events }),
      })
      return
    }

    if (method === "POST") {
      createRequestBody = (await route.request().postDataBuffer())?.toString("utf8") ?? ""

      const createdEvent = {
        id: 2,
        nombre: "Evento nuevo",
        tipo: "Charla",
        fecha: "2026-06-10",
        direccion: "Av. Corrientes 123",
        sede: "Sede Distrito Financiero (SDF)",
        descripcion: "Evento creado desde Playwright",
        link: "https://forms.gle/evento-nuevo",
        imagen_url: "https://example.com/evento-nuevo.jpg",
      }
      events = [...events, createdEvent]

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(createdEvent),
      })
    }
  })

  await page.route("**/api/events/2", async (route) => {
    const method = route.request().method()

    if (method === "PATCH") {
      events = events.map((event) =>
        event.id === 2
          ? {
              ...event,
              nombre: "Evento nuevo editado",
              link: "",
            }
          : event,
      )

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(events.find((event) => event.id === 2)),
      })
      return
    }

    if (method === "DELETE") {
      events = events.filter((event) => event.id !== 2)

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ deleted: true }),
      })
    }
  })

  await setAuthToken(page, createToken({ sub: "admin-1", email: "admin@asme.org", rol: "admin" }))

  await page.goto("/admin/eventos")
  await expect(page.getByRole("heading", { name: "Nuevo evento" })).toBeVisible()

  await page.locator("#nombre").fill("Evento nuevo")
  await page.locator("#tipo").selectOption("Charla")
  await page.locator("#fecha").fill("2026-06-10")
  await page.locator("#direccion").fill("Av. Corrientes 123")
  await page.locator("#sede").selectOption("Sede Distrito Financiero (SDF)")
  await page.locator("#descripcion").fill("Evento creado desde Playwright")
  await page.locator("#link").fill("https://forms.gle/evento-nuevo")
  await page.locator("#foto").setInputFiles({
    name: "evento.png",
    mimeType: "image/png",
    buffer: Buffer.from("fake event image"),
  })
  await page.getByRole("button", { name: "Crear evento" }).click()

  expect(createRequestBody).toContain('name="link"')
  expect(createRequestBody).toContain("https://forms.gle/evento-nuevo")
  await expect(page.getByText("Evento creado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Evento nuevo" })).toBeVisible()

  await page.getByRole("button", { name: "Editar evento Evento nuevo" }).click()
  await expect(page.locator("#nombre")).toHaveValue("Evento nuevo")
  await expect(page.locator("#tipo")).toHaveValue("Charla")
  await expect(page.locator("#sede")).toHaveValue("Sede Distrito Financiero (SDF)")
  await expect(page.locator("#link")).toHaveValue("https://forms.gle/evento-nuevo")
  await expect(page.getByRole("button", { name: "Eliminar foto actual" })).toBeVisible()
  await page.locator("#nombre").fill("Evento nuevo editado")
  await page.locator("#link").fill("")
  await page.getByRole("button", { name: "Guardar cambios" }).click()

  const updatedDialog = page.getByRole("dialog")
  await expect(updatedDialog).toBeVisible()
  await expect(updatedDialog.getByRole("heading", { name: "Evento actualizado" })).toBeVisible()
  await expect(updatedDialog.getByText("Evento actualizado correctamente")).toBeVisible()
  await updatedDialog.getByRole("button", { name: "Entendido" }).click()
  await expect(page.getByRole("heading", { name: "Evento nuevo editado" })).toBeVisible()

  await page.getByRole("button", { name: "Eliminar evento Evento nuevo editado" }).click()
  const confirmDialog = page.getByRole("dialog")
  await expect(confirmDialog).toBeVisible()
  await expect(page.getByText("Esta accion es irreversible")).toBeVisible()
  await confirmDialog.getByRole("button", { name: "Eliminar evento", exact: true }).click()

  await expect(page.getByText("Evento eliminado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Evento nuevo editado" })).toHaveCount(0)
})
