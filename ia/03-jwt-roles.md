# 03 - JWT Roles

## Estado

`pending`

## Objetivo

Leer los datos basicos del JWT para distinguir `admin` de `user` y poder construir la navegacion privada y las futuras protecciones de admin.

## Contexto Backend

Hoy `POST /auth/login` devuelve solo:

```json
{
  "access_token": "..."
}
```

El rol no llega en otro endpoint de perfil, por lo que debe obtenerse desde el token.

## Datos Esperados En El Payload

- `sub`
- `email`
- `rol`

## Frontend A Tocar

- `lib/auth-token.ts` o util complementaria
- componentes privados que necesiten mostrar datos del usuario
- futura proteccion de rutas admin

## Alcance

1. Decodificar JWT en cliente.
2. Exponer helpers seguros para leer email, rol y user id.
3. Usar el rol para mostrar u ocultar accesos de admin.

## No Incluye Aun

1. Seguridad server-side completa.
2. Middleware de auth.
3. Validacion definitiva del token mas alla de su lectura de payload.

## Playwright A Agregar

1. Usuario comun no ve acceso admin.
2. Usuario admin si ve acceso admin.

## Criterio De Aceptacion

1. El frontend puede obtener rol y email del JWT.
2. La UI privada usa esa informacion sin romper el flujo actual.
3. Hay cobertura Playwright de visibilidad por rol.
