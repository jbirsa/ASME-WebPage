# 08 - Migracion De Eventos A Nest

## Estado

`done`

## Objetivo

Migrar el consumo del frontend de eventos para que pase por el backend principal en Nest.

## Decision Ya Tomada

El frontend debe dejar de depender de Supabase de forma directa y pasar a pedir los eventos a Nest. Nest puede seguir resolviendo los datos con su capa actual por detras.

## Contexto Actual

Hoy el frontend usa:

- `app/api/events/route.ts`
- `app/api/events/future/route.ts`
- `app/api/events/past/route.ts`

Estas rutas consultaban Supabase de forma directa.

## Backend Involucrado

- `GET /eventos`
- `GET /eventos/:id`

## Ajustes Esperados

1. Reemplazar acceso directo a Supabase por proxy a Nest.
2. Adaptar el shape de datos del frontend.
3. Revisar nombres como `imagenUrl` y `paginaEvento` contra el tipo local.

## Casos Borde

1. Eventos sin imagen.
2. Eventos sin pagina de detalle.
3. Eventos pasados y futuros.

## Playwright A Agregar

1. Home renderiza eventos desde el backend principal.
2. Estados vacios siguen funcionando.

## Criterio De Aceptacion

1. El frontend deja de depender de Supabase para eventos.
2. La home sigue renderizando proximos y pasados.
3. El cambio deja listo el ABM de eventos.
