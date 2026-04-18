# 09 - Admin Eventos ABM

## Estado

`pending`

## Objetivo

Implementar alta, baja y modificacion de eventos para administradores.

## Dependencias

- `05-admin-shell.md`
- `08-eventos-migracion-nest.md`

## Backend Involucrado

- `GET /eventos`
- `POST /eventos`
- `PATCH /eventos/:id`
- `DELETE /eventos/:id`

## Campos Soportados Hoy

- `nombre`
- `tipo`
- `fecha`
- `direccion`
- `barrio`
- `provincia`
- `descripcion`
- `link`
- `imagenUrl`
- `paginaEvento`
- `patrocinadorIds`

## Frontend A Tocar

- `app/admin/eventos/*`
- routes internas de Next para CRUD de eventos

## Alcance

1. Listar eventos.
2. Crear evento.
3. Editar evento.
4. Eliminar evento.

## Casos Borde

1. Fechas invalidas.
2. Patrocinadores opcionales.
3. Evento sin imagen.

## Playwright A Agregar

1. Alta de evento.
2. Edicion de evento.
3. Baja de evento.

## Criterio De Aceptacion

1. El admin puede gestionar eventos desde frontend.
2. Los cambios impactan en la home publica luego de la migracion.
3. Hay cobertura Playwright del flujo principal.
