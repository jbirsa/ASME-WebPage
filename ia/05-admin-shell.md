# 05 - Admin Shell

## Estado

`pending`

## Objetivo

Crear la estructura base del area admin dentro del frontend privado.

## Dependencia Principal

- `03-jwt-roles.md`

## Resultado Esperado

1. Existe una entrada clara a admin para usuarios con rol `admin`.
2. Existe una ruta base `app/admin/page.tsx`.
3. El shell privado soporta navegacion hacia admin.

## Frontend A Tocar

- `app/admin/page.tsx`
- componentes de navegacion privada
- protecciones client-side iniciales

## Alcance

1. Crear landing simple de admin.
2. Mostrar accesos a `Cursos`, `Clases` y `Eventos`.
3. Bloquear visualmente el acceso a usuarios no admin.

## Casos Borde

1. Token sin rol.
2. Usuario comun intentando entrar directo a `/admin`.
3. Token vencido o ausente.

## Playwright A Agregar

1. Admin accede.
2. User es rechazado o redirigido.

## Criterio De Aceptacion

1. Existe el shell base de admin.
2. El acceso depende del rol en cliente.
3. La ruta sirve como punto de partida de los ABM.
