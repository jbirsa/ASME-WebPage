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
      archivos: [],
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
    const createdClass = {
      claseId: 12,
      titulo: "Clase nueva",
      descripcion: "Descripcion de clase nueva",
      videoUrl: "https://www.youtube.com/watch?v=nueva123",
      orden: 2,
      archivos: [
        {
          claseArchivoId: 41,
          nombreOriginal: "apunte-clase.pdf",
          url: "https://example.com/apunte-clase.pdf",
        },
        {
          claseArchivoId: 42,
          nombreOriginal: "slides-clase.pdf",
          url: "https://example.com/slides-clase.pdf",
        },
      ],
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
      classes = classes.map((classItem) =>
        classItem.claseId === 12
          ? {
              ...classItem,
              titulo: "Clase nueva editada",
              archivos: [
                ...(classItem.archivos ?? []),
                {
                  claseArchivoId: 43,
                  nombreOriginal: "ejercicios-clase.pdf",
                  url: "https://example.com/ejercicios-clase.pdf",
                },
              ],
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
  await expect(page.getByRole("heading", { name: "Nueva clase" })).toBeVisible()

  await expect(page.locator('label[for="titulo"]')).toContainText("*")
  await expect(page.locator("#titulo")).toHaveAttribute("required", "")

  await page.locator("#titulo").fill("Clase nueva")
  await page.locator("#descripcion").fill("Descripcion de clase nueva")
  await page.locator("#videoUrl").fill("https://www.youtube.com/watch?v=nueva123")
  await page.locator("#orden").fill("2")
  await page.locator("#archivos").setInputFiles({
    name: "apunte-clase.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("fake class file"),
  })
  await page.locator("#archivos").setInputFiles({
    name: "slides-clase.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("fake second class file"),
  })
  await expect(page.getByText("apunte-clase.pdf")).toBeVisible()
  await expect(page.getByText("slides-clase.pdf")).toBeVisible()
  await page.getByRole("button", { name: "Crear clase" }).click()

  await expect(page.getByText("Clase creada correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Clase nueva" })).toBeVisible()

  await page.getByRole("button", { name: "Editar clase Clase nueva" }).click()
  await expect(page.locator("#titulo")).toHaveValue("Clase nueva")
  await expect(page.getByText("apunte-clase.pdf")).toBeVisible()
  await expect(page.getByText("slides-clase.pdf")).toBeVisible()
  await page.locator("#titulo").fill("Clase nueva editada")
  await page.locator("#archivos").setInputFiles({
    name: "ejercicios-clase.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("fake third class file"),
  })
  await expect(page.getByText("ejercicios-clase.pdf")).toBeVisible()
  await expect(page.getByText("apunte-clase.pdf")).toBeVisible()
  await page.getByRole("button", { name: "Guardar cambios" }).click()

  const updatedDialog = page.getByRole("dialog")
  await expect(updatedDialog).toBeVisible()
  await expect(updatedDialog.getByRole("heading", { name: "Clase actualizada" })).toBeVisible()
  await expect(updatedDialog.getByText("Clase actualizada correctamente")).toBeVisible()
  await updatedDialog.getByRole("button", { name: "Entendido" }).click()
  await expect(page.getByRole("heading", { name: "Clase nueva editada" })).toBeVisible()
  await page.getByRole("button", { name: "Editar clase Clase nueva editada" }).click()
  await expect(page.getByText("apunte-clase.pdf")).toBeVisible()
  await expect(page.getByText("slides-clase.pdf")).toBeVisible()
  await expect(page.getByText("ejercicios-clase.pdf")).toBeVisible()
  await page.getByRole("button", { name: "Cancelar edicion" }).click()

  await page.getByRole("button", { name: "Eliminar clase Clase nueva editada" }).click()
  const confirmDialog = page.getByRole("dialog")
  await expect(confirmDialog).toBeVisible()
  await expect(page.getByText("Esta accion es irreversible")).toBeVisible()
  await confirmDialog.getByRole("button", { name: "Eliminar clase", exact: true }).click()

  await expect(page.getByText("Clase eliminada correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Clase nueva editada" })).toHaveCount(0)
})
