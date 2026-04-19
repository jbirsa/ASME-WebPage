import { expect, test, type Page } from "@playwright/test"

const course = {
  cursoId: 1,
  nombre: "Introduccion a CAD",
  descripcion: "Curso inicial de modelado 3D para estudiantes.",
  imagenUrl: "https://example.com/cad.jpg",
  estado: "activo",
  clases: [
    {
      claseId: 11,
      titulo: "Clase 1 - Interfaz y primeros pasos",
      descripcion: "Recorrido inicial por el entorno de trabajo.",
      orden: 1,
      videoUrl: "https://www.youtube.com/watch?v=abcd1234",
    },
  ],
}

function createToken(payload: { sub: string; email: string; rol: string }) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `header.${encodedPayload}.signature`
}

async function setAuthToken(page: Page, token: string) {
  await page.addInitScript((storedToken) => {
    window.localStorage.setItem("asme_access_token", storedToken)
  }, token)
}

async function mockCourseDetail(page: Page, enrolled: boolean) {
  await page.route("**/api/cursos/mis-cursos", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        enrolled
          ? [
              {
                ...course,
                inscripcion: {
                  estado: "en_progreso",
                  fechaInscripcion: "2026-04-20T10:00:00.000Z",
                },
              },
            ]
          : [],
      ),
    })
  })

  await page.route("**/api/cursos/1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(course),
    })
  })
}

test("usuario no inscripto no ve clases del curso", async ({ page }) => {
  await setAuthToken(page, createToken({ sub: "user-1", email: "alumno@asme.org", rol: "user" }))
  await mockCourseDetail(page, false)

  await page.goto("/cursos/1/introduccion-a-cad")

  await expect(page.getByRole("button", { name: "Inscribirme" })).toBeVisible()
  await expect(page.getByText("Inscribite para desbloquear las clases de este curso.")).toBeVisible()
  await expect(page.getByText("Clase 1 - Interfaz y primeros pasos")).toHaveCount(0)
})

test("usuario inscripto si ve clases del curso", async ({ page }) => {
  await setAuthToken(page, createToken({ sub: "user-1", email: "alumno@asme.org", rol: "user" }))
  await mockCourseDetail(page, true)

  await page.goto("/cursos/1/introduccion-a-cad")

  await expect(page.getByText("Inscribite para desbloquear las clases de este curso.")).toHaveCount(0)
  await expect(page.getByText("Clase 1 - Interfaz y primeros pasos")).toBeVisible()
  await expect(page.getByRole("link", { name: "Ver clase" })).toBeVisible()
})
