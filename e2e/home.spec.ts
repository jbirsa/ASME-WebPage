import { expect, test } from "@playwright/test";

test("home carga y navega a la seccion about", async ({ page }) => {
  await page.route("**/api/events/past", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ events: [] }),
    });
  });

  await page.route("**/api/events/future", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ events: [] }),
    });
  });

  await page.route("**/api/sponsors", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.goto("/");

  const aboutButton = page.getByRole("button", { name: "Conocer Más" });

  await expect(aboutButton).toBeVisible();
  await aboutButton.click();
  await expect(page).toHaveURL(/#about/);
  await expect(page.getByRole("heading", { name: "¿Qué es ASME?" })).toBeVisible();
});

test("home renderiza eventos publicos", async ({ page }) => {
  await page.route("**/api/events/past", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        events: [
          {
            id: 2,
            nombre: "Evento pasado",
            tipo: "presencial",
            fecha: "2025-05-20",
            direccion: "Av. Siempre Viva 123",
            sede: "Sede Distrito Rectorado (SDR)",
            barrio: "Centro",
            provincia: "Cordoba",
            descripcion: "Descripcion del evento pasado.",
            link: "https://example.com/pasado",
            imagen_url: "https://example.com/pasado.jpg",
            pagina_evento: "https://example.com/pasado",
          },
        ],
      }),
    });
  });

  await page.route("**/api/events/future", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        events: [
          {
            id: 1,
            nombre: "Evento futuro",
            tipo: "presencial",
            fecha: "2026-05-20",
            direccion: "Av. Siempre Viva 123",
            sede: "Sede Distrito Financiero (SDF)",
            barrio: "Centro",
            provincia: "Cordoba",
            descripcion: "Descripcion del evento futuro.",
            link: "https://example.com/futuro",
            imagen_url: "https://example.com/futuro.jpg",
            pagina_evento: "https://example.com/futuro",
          },
        ],
      }),
    });
  });

  await page.route("**/api/sponsors", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Evento futuro" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evento pasado" })).toBeVisible();
  await expect(page.getByText("Sede Distrito Financiero (SDF) · Av. Siempre Viva 123")).toBeVisible();
  await expect(page.getByText("Sede Distrito Rectorado (SDR) · Av. Siempre Viva 123")).toBeVisible();
});
