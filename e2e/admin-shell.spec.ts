import { expect, test, type Page } from "@playwright/test"

const courses = [
  {
    cursoId: 1,
    nombre: "Introduccion a CAD",
    descripcion: "Curso inicial de modelado 3D para estudiantes.",
    imagenUrl: "https://example.com/cad.jpg",
    estado: "activo",
    clases: [],
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

async function mockCoursesCatalog(page: Page) {
  await page.route("**/api/cursos", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(courses),
    })
  })

  await page.route("**/api/cursos/mis-cursos", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    })
  })
}

test("admin puede entrar al panel y ver accesos principales", async ({ page }) => {
  await setAuthToken(page, createToken({ sub: "admin-1", email: "admin@asme.org", rol: "admin" }))

  await page.goto("/admin")

  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible()
  await expect(page.locator('a[href="/admin/cursos"]')).toBeVisible()
  await expect(page.locator('a[href="/admin/clases"]')).toBeVisible()
  await expect(page.locator('a[href="/admin/eventos"]')).toBeVisible()
})

test("usuario comun rebota al intentar entrar a admin", async ({ page }) => {
  await setAuthToken(page, createToken({ sub: "user-1", email: "alumno@asme.org", rol: "user" }))
  await mockCoursesCatalog(page)

  await page.goto("/admin")

  await expect(page).toHaveURL(/\/cursos$/)
  await expect(page.getByRole("heading", { name: "Catalogo" })).toBeVisible()
})
