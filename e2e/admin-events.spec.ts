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
  let events = [
    {
      id: 1,
      nombre: "Evento base",
      tipo: "presencial",
      fecha: "2026-05-20",
      direccion: "Av. Siempre Viva 123",
      barrio: "Centro",
      provincia: "Cordoba",
      descripcion: "Descripcion inicial.",
      link: "https://example.com/base",
      imagen_url: "https://example.com/base.jpg",
      pagina_evento: "https://example.com/base",
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
      const body = route.request().postDataJSON() as Record<string, string>
      const createdEvent = {
        id: 2,
        nombre: body.nombre,
        tipo: body.tipo ?? "",
        fecha: body.fecha ?? "",
        direccion: body.direccion ?? "",
        barrio: body.barrio ?? "",
        provincia: body.provincia ?? "",
        descripcion: body.descripcion ?? "",
        link: body.link ?? "",
        imagen_url: body.imagenUrl ?? "",
        pagina_evento: body.paginaEvento ?? "",
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
      const body = route.request().postDataJSON() as Record<string, string>
      events = events.map((event) =>
        event.id === 2
          ? {
              ...event,
              nombre: body.nombre,
              tipo: body.tipo ?? "",
              fecha: body.fecha ?? "",
              direccion: body.direccion ?? "",
              barrio: body.barrio ?? "",
              provincia: body.provincia ?? "",
              descripcion: body.descripcion ?? "",
              link: body.link ?? "",
              imagen_url: body.imagenUrl ?? "",
              pagina_evento: body.paginaEvento ?? "",
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

  await page.locator("#nombre").fill("Evento nuevo")
  await page.locator("#tipo").fill("presencial")
  await page.locator("#fecha").fill("2026-06-10")
  await page.locator("#direccion").fill("Av. Corrientes 123")
  await page.locator("#descripcion").fill("Evento creado desde Playwright")
  await page.getByRole("button", { name: "Crear evento" }).click()

  await expect(page.getByText("Evento creado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Evento nuevo" })).toBeVisible()

  await page.getByRole("button", { name: "Editar evento Evento nuevo" }).click()
  await expect(page.locator("#nombre")).toHaveValue("Evento nuevo")
  await page.locator("#nombre").fill("Evento nuevo editado")
  await page.getByRole("button", { name: "Guardar cambios" }).click()

  await expect(page.getByText("Evento actualizado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Evento nuevo editado" })).toBeVisible()

  await page.getByRole("button", { name: "Eliminar evento Evento nuevo editado" }).click()
  const confirmDialog = page.getByRole("dialog")
  await expect(confirmDialog).toBeVisible()
  await expect(page.getByText("Esta accion es irreversible")).toBeVisible()
  await confirmDialog.getByRole("button", { name: "Eliminar evento", exact: true }).click()

  await expect(page.getByText("Evento eliminado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Evento nuevo editado" })).toHaveCount(0)
})
