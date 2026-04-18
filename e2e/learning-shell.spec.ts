import { expect, test, type Page } from "@playwright/test"

const courses = [
  {
    cursoId: 1,
    nombre: "Introduccion a CAD",
    descripcion: "Curso inicial de modelado 3D para estudiantes.",
    imagenUrl: "https://example.com/cad.jpg",
    estado: "activo",
    clases: [{ claseId: 11, titulo: "Clase 1", descripcion: "Primeros pasos", orden: 1 }],
  },
  {
    cursoId: 2,
    nombre: "Mecanica aplicada",
    descripcion: "Analisis y herramientas de base para sistemas mecanicos.",
    imagenUrl: "https://example.com/mecanica.jpg",
    estado: "activo",
    clases: [{ claseId: 21, titulo: "Clase 1", descripcion: "Fundamentos", orden: 1 }],
  },
]

const myCourses = [
  {
    ...courses[0],
    inscripcion: {
      estado: "en_progreso",
      fechaInscripcion: "2026-04-18T12:00:00.000Z",
    },
  },
]

function createToken(payload: { sub: string; email: string; rol: string }) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `header.${encodedPayload}.signature`
}

async function setAuthToken(page: Page, token: string) {
  await page.addInitScript((storedToken) => {
    window.localStorage.setItem("asme_access_token", storedToken)
  }, token)
}

async function mockLearningApi(page: Page) {
  await page.route("**/api/cursos/mis-cursos", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(myCourses),
    })
  })

  await page.route("**/api/cursos", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(courses),
    })
  })
}

async function openNavigationIfNeeded(page: Page) {
  const viewportWidth = page.viewportSize()?.width ?? 0
  if (viewportWidth < 1024) {
    await page.getByRole("button", { name: "Abrir navegacion privada" }).click()
  }
}

test("campus dashboard navega en desktop y permite logout", async ({ page }) => {
  await setAuthToken(page, createToken({ sub: "user-1", email: "alumno@asme.org", rol: "user" }))
  await mockLearningApi(page)

  await page.goto("/cursos")

  await expect(page.getByRole("heading", { name: "Catalogo" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Admin" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Inicio" })).toHaveCount(0)

  await openNavigationIfNeeded(page)
  await page.getByRole("link", { name: /^Mis cursos$/ }).click()

  await expect(page).toHaveURL(/\/mis-cursos$/)
  await expect(page.getByRole("heading", { name: "Mis cursos" })).toBeVisible()

  await openNavigationIfNeeded(page)
  const logoutButton = page.getByRole("button", { name: "Cerrar sesion" })
  await logoutButton.scrollIntoViewIfNeeded()
  await logoutButton.click()

  await expect(page).toHaveURL(/\/login$/)
})

test("campus dashboard abre drawer mobile y navega a perfil", async ({ page }) => {
  await setAuthToken(page, createToken({ sub: "user-1", email: "alumno@asme.org", rol: "user" }))
  await mockLearningApi(page)

  await page.goto("/cursos")

  await openNavigationIfNeeded(page)
  await expect(page.getByRole("link", { name: /^Mi perfil$/ })).toBeVisible()

  await page.getByRole("link", { name: /^Mi perfil$/ }).click()

  await expect(page).toHaveURL(/\/perfil$/)
  await expect(page.getByRole("heading", { name: "Mi perfil" })).toBeVisible()
  await expect(page.getByRole("main").getByText("alumno@asme.org")).toBeVisible()
})
