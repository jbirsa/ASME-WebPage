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

test("admin crea, edita y elimina clases por curso", async ({ page }) => {
  const course = {
    cursoId: 1,
    nombre: "Introduccion a CAD",
    descripcion: "Curso inicial de modelado 3D para estudiantes.",
    imagenUrl: "https://example.com/cad.jpg",
    estado: "activo",
    clases: [],
  }

  let classes = [
    {
      claseId: 11,
      titulo: "Clase base",
      descripcion: "Descripcion inicial",
      videoUrl: "https://www.youtube.com/watch?v=abcd1234",
      orden: 1,
    },
  ]

  await page.route("**/api/cursos/1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(course),
    })
  })

  await page.route("**/api/clases/curso/1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(classes),
    })
  })

  await page.route("**/api/clases", async (route) => {
    const body = route.request().postDataJSON() as {
      titulo: string
      descripcion?: string
      videoUrl?: string
      orden?: number
    }

    const createdClass = {
      claseId: 12,
      titulo: body.titulo,
      descripcion: body.descripcion ?? null,
      videoUrl: body.videoUrl ?? null,
      orden: body.orden ?? 2,
    }

    classes = [...classes, createdClass]

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify(createdClass),
    })
  })

  await page.route("**/api/clases/12", async (route) => {
    const method = route.request().method()

    if (method === "PATCH") {
      const body = route.request().postDataJSON() as {
        titulo: string
        descripcion?: string
        videoUrl?: string
        orden?: number
      }

      classes = classes.map((classItem) =>
        classItem.claseId === 12
          ? {
              ...classItem,
              titulo: body.titulo,
              descripcion: body.descripcion ?? null,
              videoUrl: body.videoUrl ?? null,
              orden: body.orden ?? classItem.orden,
            }
          : classItem,
      )

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(classes.find((classItem) => classItem.claseId === 12)),
      })
      return
    }

    if (method === "DELETE") {
      classes = classes.filter((classItem) => classItem.claseId !== 12)

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ deleted: true }),
      })
    }
  })

  await setAuthToken(page, createToken({ sub: "admin-1", email: "admin@asme.org", rol: "admin" }))

  await page.goto("/admin/cursos/1/clases")

  await page.locator("#titulo").fill("Clase nueva")
  await page.locator("#descripcion").fill("Descripcion de clase nueva")
  await page.locator("#videoUrl").fill("https://www.youtube.com/watch?v=nueva123")
  await page.locator("#orden").fill("2")
  await page.getByRole("button", { name: "Crear clase" }).click()

  await expect(page.getByText("Clase creada correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Clase nueva" })).toBeVisible()

  await page.getByRole("button", { name: "Editar clase Clase nueva" }).click()
  await expect(page.locator("#titulo")).toHaveValue("Clase nueva")
  await page.locator("#titulo").fill("Clase nueva editada")
  await page.getByRole("button", { name: "Guardar cambios" }).click()

  await expect(page.getByText("Clase actualizada correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Clase nueva editada" })).toBeVisible()

  await page.getByRole("button", { name: "Eliminar clase Clase nueva editada" }).click()
  const confirmDialog = page.getByRole("dialog")
  await expect(confirmDialog).toBeVisible()
  await expect(page.getByText("Esta accion es irreversible")).toBeVisible()
  await confirmDialog.getByRole("button", { name: "Eliminar clase", exact: true }).click()

  await expect(page.getByText("Clase eliminada correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Clase nueva editada" })).toHaveCount(0)
})
