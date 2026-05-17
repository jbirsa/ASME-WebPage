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

test("admin crea, edita y elimina cursos", async ({ page }) => {
  let courses = [
    {
      cursoId: 1,
      nombre: "Introduccion a CAD",
      descripcion: "Curso inicial de modelado 3D para estudiantes.",
      imagenUrl: "https://example.com/cad.jpg",
      estado: "activo",
      archivos: [],
      clases: [],
    },
  ]

  await page.route("**/api/cursos", async (route) => {
    const method = route.request().method()

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(courses),
      })
      return
    }

    if (method === "POST") {
      const createdCourse = {
        cursoId: 2,
        nombre: "Curso nuevo",
        descripcion: "Curso creado desde Playwright",
        imagenUrl: "https://example.com/nuevo.jpg",
        estado: "activo",
        archivos: [
          {
            cursoArchivoId: 21,
            nombreOriginal: "guia-curso.pdf",
            url: "https://example.com/guia-curso.pdf",
          },
          {
            cursoArchivoId: 22,
            nombreOriginal: "cronograma-curso.pdf",
            url: "https://example.com/cronograma-curso.pdf",
          },
        ],
        clases: [],
      }
      courses = [...courses, createdCourse]

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(createdCourse),
      })
    }
  })

  await page.route("**/api/cursos/2", async (route) => {
    const method = route.request().method()

    if (method === "PATCH") {
      courses = courses.map((course) =>
        course.cursoId === 2
          ? {
              ...course,
              nombre: "Curso nuevo editado",
              archivos: [
                ...(course.archivos ?? []),
                {
                  cursoArchivoId: 23,
                  nombreOriginal: "programa-curso.pdf",
                  url: "https://example.com/programa-curso.pdf",
                },
              ],
            }
          : course,
      )

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(courses.find((course) => course.cursoId === 2)),
      })
      return
    }

    if (method === "DELETE") {
      courses = courses.filter((course) => course.cursoId !== 2)

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ deleted: true }),
      })
    }
  })

  await setAuthToken(page, createToken({ sub: "admin-1", email: "admin@asme.org", rol: "admin" }))

  await page.goto("/admin/cursos")
  await expect(page.getByRole("heading", { name: "Nuevo curso" })).toBeVisible()

  await expect(page.locator('label[for="nombre"]')).toContainText("*")
  await expect(page.locator("#nombre")).toHaveAttribute("required", "")

  await page.locator("#nombre").fill("Curso nuevo")
  await page.locator("#descripcion").fill("Curso creado desde Playwright")
  await page.locator("#foto").setInputFiles({
    name: "portada-curso.png",
    mimeType: "image/png",
    buffer: Buffer.from("fake image content"),
  })
  await page.locator("#archivos").setInputFiles({
    name: "guia-curso.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("fake file content"),
  })
  await page.locator("#archivos").setInputFiles({
    name: "cronograma-curso.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("fake second file content"),
  })
  await expect(page.getByText("guia-curso.pdf")).toBeVisible()
  await expect(page.getByText("cronograma-curso.pdf")).toBeVisible()
  await page.getByRole("button", { name: "Crear curso" }).click()

  await expect(page.getByText("Curso creado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Curso nuevo" })).toBeVisible()

  await page.getByRole("button", { name: "Editar curso Curso nuevo" }).click()
  await expect(page.locator("#nombre")).toHaveValue("Curso nuevo")
  await expect(page.getByText("guia-curso.pdf")).toBeVisible()
  await expect(page.getByText("cronograma-curso.pdf")).toBeVisible()
  await expect(page.getByRole("button", { name: "Eliminar foto actual" })).toBeVisible()
  await page.locator("#nombre").fill("Curso nuevo editado")
  await page.locator("#archivos").setInputFiles({
    name: "programa-curso.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("fake third file content"),
  })
  await expect(page.getByText("programa-curso.pdf")).toBeVisible()
  await expect(page.getByText("guia-curso.pdf")).toBeVisible()
  await page.getByRole("button", { name: "Guardar cambios" }).click()

  const updatedDialog = page.getByRole("dialog")
  await expect(updatedDialog).toBeVisible()
  await expect(updatedDialog.getByRole("heading", { name: "Curso actualizado" })).toBeVisible()
  await expect(updatedDialog.getByText("Curso actualizado correctamente")).toBeVisible()
  await updatedDialog.getByRole("button", { name: "Entendido" }).click()
  await expect(page.getByRole("heading", { name: "Curso nuevo editado" })).toBeVisible()
  await page.getByRole("button", { name: "Editar curso Curso nuevo editado" }).click()
  await expect(page.getByText("guia-curso.pdf")).toBeVisible()
  await expect(page.getByText("cronograma-curso.pdf")).toBeVisible()
  await expect(page.getByText("programa-curso.pdf")).toBeVisible()
  await page.getByRole("button", { name: "Cancelar edicion" }).click()

  await page.getByRole("button", { name: "Eliminar curso Curso nuevo editado" }).click()
  const confirmDialog = page.getByRole("dialog")
  await expect(confirmDialog).toBeVisible()
  await expect(page.getByText("Esta accion es irreversible")).toBeVisible()
  await confirmDialog.getByRole("button", { name: "Eliminar curso", exact: true }).click()

  await expect(page.getByText("Curso eliminado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Curso nuevo editado" })).toHaveCount(0)
})
