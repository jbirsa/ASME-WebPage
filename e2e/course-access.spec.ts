import { expect, test, type Page } from "@playwright/test"

const course = {
  cursoId: 1,
  nombre: "Introduccion a CAD",
  descripcion: "Curso inicial de modelado 3D para estudiantes.",
  imagenUrl: "https://example.com/cad.jpg",
  estado: "activo",
  archivos: [
    {
      cursoArchivoId: 31,
      nombreOriginal: "guia-del-curso.pdf",
      url: "https://example.com/guia-del-curso.pdf",
    },
  ],
  clases: [
    {
      claseId: 11,
      titulo: "Clase 1 - Interfaz y primeros pasos",
      descripcion: "Recorrido inicial por el entorno de trabajo.",
      orden: 1,
      videoUrl: "https://www.youtube.com/watch?v=abcd1234",
      archivos: [
        {
          claseArchivoId: 41,
          nombreOriginal: "plantilla-clase-1.pdf",
          url: "https://example.com/plantilla-clase-1.pdf",
        },
      ],
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
  await expect(page.getByRole("main").getByRole("link", { name: /^Mis cursos$/ })).toBeVisible()
  await expect(page.getByText("Inscribite para desbloquear las clases de este curso.")).toBeVisible()
  await expect(page.getByText("Inscripto")).toHaveCount(0)
  await expect(page.getByText("1 clases")).toHaveCount(0)
  await expect(page.getByText("Orden 1")).toHaveCount(0)
  await expect(page.getByText("Clase 1 - Interfaz y primeros pasos")).toHaveCount(0)
  await expect(page.getByText("guia-del-curso.pdf")).toHaveCount(0)
  await expect(page.getByText("plantilla-clase-1.pdf")).toHaveCount(0)
})

test("usuario inscripto si ve clases del curso", async ({ page }) => {
  await setAuthToken(page, createToken({ sub: "user-1", email: "alumno@asme.org", rol: "user" }))
  await mockCourseDetail(page, true)

  await page.goto("/cursos/1/introduccion-a-cad")

  await expect(page.getByRole("main").getByRole("link", { name: /^Mis cursos$/ })).toBeVisible()
  await expect(page.getByRole("link", { name: "Ver en mis cursos" })).toHaveCount(0)
  await expect(page.getByText("Inscribite para desbloquear las clases de este curso.")).toHaveCount(0)
  await expect(page.getByText("Inscripto")).toHaveCount(0)
  await expect(page.getByText("1 clases")).toHaveCount(0)
  await expect(page.getByText("Orden 1")).toHaveCount(0)
  await expect(page.getByText("Clase 1 - Interfaz y primeros pasos")).toBeVisible()
  await expect(page.getByRole("link", { name: "Ver clase" })).toBeVisible()
  await expect(page.getByText("guia-del-curso.pdf")).toBeVisible()
  await expect(page.getByText("plantilla-clase-1.pdf")).toBeVisible()
  await expect(page.getByRole("link", { name: "Ver material" })).toHaveCount(2)
})

test("admin puede revisar el detalle del curso sin inscribirse", async ({ page }) => {
  await setAuthToken(page, createToken({ sub: "admin-1", email: "admin@asme.org", rol: "admin" }))
  await mockCourseDetail(page, false)

  await page.goto("/cursos/1/introduccion-a-cad")

  await expect(page.getByText("Vista admin")).toBeVisible()
  await expect(page.getByRole("main").getByRole("link", { name: /^Mis cursos$/ })).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Inscribirme" })).toHaveCount(0)
  await expect(page.getByText("Inscribite para desbloquear las clases de este curso.")).toHaveCount(0)
  await expect(page.getByText("1 clases")).toHaveCount(0)
  await expect(page.getByText("Orden 1")).toHaveCount(0)
  await expect(page.getByText("Clase 1 - Interfaz y primeros pasos")).toBeVisible()
  await expect(page.getByText("guia-del-curso.pdf")).toBeVisible()
  await expect(page.getByText("plantilla-clase-1.pdf")).toBeVisible()
  await expect(page.getByRole("link", { name: "Ver material" })).toHaveCount(2)
})
