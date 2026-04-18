# 08 - Migracion De Eventos A Nest

## Estado

`pending`

## Objetivo

Migrar la fuente de datos de eventos desde Supabase al backend principal en Nest.

## Decision Ya Tomada

Los eventos deben dejar de depender de Supabase y pasar a vivir en el backend Nest, para que el futuro ABM de eventos impacte directamente en la home publica.

## Contexto Actual

Hoy el frontend usa:

- `app/api/events/route.ts`
- `app/api/events/future/route.ts`
- `app/api/events/past/route.ts`

Estas rutas consultan Supabase.

## Backend Involucrado

- `GET /eventos`
- `GET /eventos/:id`

## Ajustes Esperados

1. Reemplazar acceso a Supabase por proxy a Nest.
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
