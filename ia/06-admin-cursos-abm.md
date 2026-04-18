# 06 - Admin Cursos ABM

## Estado

`pending`

## Objetivo

Implementar alta, baja y modificacion de cursos para administradores.

## Backend Involucrado

- `GET /cursos`
- `POST /cursos`
- `PATCH /cursos/:id`
- `DELETE /cursos/:id`

## Campos Soportados Hoy

- `nombre`
- `descripcion`
- `imagenUrl`
- `estado`

## Frontend A Tocar

- `app/admin/cursos/*`
- routes internas de Next para `POST`, `PATCH` y `DELETE`
- formularios y tabla o cards de admin

## Alcance

1. Listar cursos.
2. Crear curso.
3. Editar curso.
4. Eliminar curso.

## Casos Borde

1. Curso con datos incompletos.
2. Errores de validacion del backend.
3. Confirmacion antes de borrar.

## Playwright A Agregar

1. Alta exitosa.
2. Edicion exitosa.
3. Baja exitosa.

## Criterio De Aceptacion

1. El admin puede administrar cursos de punta a punta.
2. El frontend respeta el DTO real del backend.
3. Hay cobertura Playwright del flujo principal.
