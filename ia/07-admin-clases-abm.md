# 07 - Admin Clases ABM

## Estado

`pending`

## Objetivo

Implementar alta, baja y modificacion de clases, idealmente administradas dentro de cada curso.

## Backend Involucrado

- `GET /clases/curso/:cursoId`
- `POST /clases`
- `PATCH /clases/:id`
- `DELETE /clases/:id`

## Campos Soportados Hoy

- `cursoId`
- `titulo`
- `descripcion`
- `videoUrl`
- `orden`

## Recomendacion De Producto

Administrar clases desde la vista de un curso, no desde una grilla global compleja.

## Frontend A Tocar

- `app/admin/cursos/[cursoId]/clases/*` o equivalente
- routes internas de Next para clases

## Alcance

1. Listar clases del curso.
2. Crear clase.
3. Editar clase.
4. Eliminar clase.
5. Modificar orden de aparicion.

## Playwright A Agregar

1. Alta de clase.
2. Edicion de clase.
3. Baja de clase.
4. Cambio de orden.

## Criterio De Aceptacion

1. El admin puede gestionar clases dentro del curso.
2. El orden se refleja correctamente en el frontend.
3. Hay cobertura Playwright del flujo principal.
