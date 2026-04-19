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
      const body = route.request().postDataJSON() as { nombre: string; descripcion?: string; imagenUrl?: string; estado?: string }
      const createdCourse = {
        cursoId: 2,
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        imagenUrl: body.imagenUrl ?? null,
        estado: body.estado ?? "activo",
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
      const body = route.request().postDataJSON() as { nombre: string; descripcion?: string; imagenUrl?: string; estado?: string }
      courses = courses.map((course) =>
        course.cursoId === 2
          ? {
              ...course,
              nombre: body.nombre,
              descripcion: body.descripcion ?? null,
              imagenUrl: body.imagenUrl ?? null,
              estado: body.estado ?? course.estado,
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

  await page.locator("#nombre").fill("Curso nuevo")
  await page.locator("#descripcion").fill("Curso creado desde Playwright")
  await page.locator("#imagenUrl").fill("https://example.com/nuevo.jpg")
  await page.getByRole("button", { name: "Crear curso" }).click()

  await expect(page.getByText("Curso creado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Curso nuevo" })).toBeVisible()

  await page.getByRole("button", { name: "Editar curso Curso nuevo" }).click()
  await expect(page.locator("#nombre")).toHaveValue("Curso nuevo")
  await page.locator("#nombre").fill("Curso nuevo editado")
  await page.getByRole("button", { name: "Guardar cambios" }).click()

  await expect(page.getByText("Curso actualizado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Curso nuevo editado" })).toBeVisible()

  await page.getByRole("button", { name: "Eliminar curso Curso nuevo editado" }).click()
  const confirmDialog = page.getByRole("dialog")
  await expect(confirmDialog).toBeVisible()
  await expect(page.getByText("Esta accion es irreversible")).toBeVisible()
  await confirmDialog.getByRole("button", { name: "Eliminar curso", exact: true }).click()

  await expect(page.getByText("Curso eliminado correctamente")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Curso nuevo editado" })).toHaveCount(0)
})
