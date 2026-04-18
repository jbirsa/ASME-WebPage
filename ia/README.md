# IA Tasks

## Objetivo

Esta carpeta organiza las tareas de implementacion del area privada de cursos de `ASME-WebPage`.

La idea es avanzar de forma incremental, validando cada cambio con Playwright y tomando como fuente de verdad el backend en `../asme-backend`.

## Estado General

- `pending`: tarea aun no iniciada
- `in_progress`: tarea en curso
- `done`: tarea terminada
- `blocked`: tarea detenida por dependencia faltante

## Orden Recomendado

1. `00-learning-shell-campus-dashboard.md`
2. `01-forgot-password.md`
3. `02-reset-password.md`
4. `03-jwt-roles.md`
5. `04-bloqueo-clases-no-inscriptos.md`
6. `05-admin-shell.md`
7. `06-admin-cursos-abm.md`
8. `07-admin-clases-abm.md`
9. `08-eventos-migracion-nest.md`
10. `09-admin-eventos-abm.md`
11. `10-correccion-clases-bloqueado.md`

## Tareas

### `00-learning-shell-campus-dashboard.md`
- Estado: `done`
- Objetivo: separar visualmente la experiencia de cursos del sitio institucional y convertirla en un producto tipo portal.
- Resultado esperado: nuevo shell privado con topbar y sidebar o drawer.
- Dependencias: ninguna.
- Desbloquea: roles, admin, perfil y navegacion privada consistente.

### `01-forgot-password.md`
- Estado: `pending`
- Objetivo: permitir solicitar recuperacion de contrasena mediante email.
- Backend esperado: `POST /auth/forgot-password`
- Dependencias: ninguna fuerte.

### `02-reset-password.md`
- Estado: `pending`
- Objetivo: permitir resetear contrasena con codigo.
- Backend esperado: `POST /auth/reset-password`
- Dependencias: `01-forgot-password.md`

### `03-jwt-roles.md`
- Estado: `pending`
- Objetivo: leer el rol desde JWT para diferenciar `admin` y `user`.
- Dependencias: ninguna fuerte.
- Desbloquea: admin, menu contextual de usuario y proteccion de rutas.

### `04-bloqueo-clases-no-inscriptos.md`
- Estado: `pending`
- Objetivo: impedir que usuarios no inscriptos vean clases de un curso.
- Dependencias: recomendable despues del shell nuevo.

### `05-admin-shell.md`
- Estado: `pending`
- Objetivo: crear la base de la seccion admin.
- Dependencias: `03-jwt-roles.md`
- Desbloquea: ABM de cursos, clases y eventos.

### `06-admin-cursos-abm.md`
- Estado: `pending`
- Objetivo: ABM completo de cursos.
- Backend esperado:
  - `GET /cursos`
  - `POST /cursos`
  - `PATCH /cursos/:id`
  - `DELETE /cursos/:id`
- Dependencias: `05-admin-shell.md`

### `07-admin-clases-abm.md`
- Estado: `pending`
- Objetivo: ABM completo de clases.
- Backend esperado:
  - `GET /clases/curso/:cursoId`
  - `POST /clases`
  - `PATCH /clases/:id`
  - `DELETE /clases/:id`
- Dependencias: `06-admin-cursos-abm.md`

### `08-eventos-migracion-nest.md`
- Estado: `pending`
- Objetivo: migrar eventos desde Supabase al backend Nest.
- Dependencias: ninguna tecnica estricta, pero recomendable antes del ABM de eventos.
- Nota: decision ya tomada, eventos deben vivir en Nest.

### `09-admin-eventos-abm.md`
- Estado: `pending`
- Objetivo: ABM completo de eventos.
- Backend esperado:
  - `GET /eventos`
  - `POST /eventos`
  - `PATCH /eventos/:id`
  - `DELETE /eventos/:id`
- Dependencias: `05-admin-shell.md`, `08-eventos-migracion-nest.md`

### `10-correccion-clases-bloqueado.md`
- Estado: `blocked`
- Objetivo: documentar lo faltante para corregir cada clase.
- Motivo del bloqueo: el backend aun no tiene evaluaciones, entregas ni correccion por clase.

## Lineamientos De Implementacion

1. Antes de tocar frontend, revisar el contrato real del backend.
2. Preferir `app/api/*` como capa proxy entre UI y backend.
3. Toda feature nueva o cambio relevante debe tener validacion con Playwright.
4. Mantener las tareas chicas y cerrables una por una.
5. No asumir capacidades backend que hoy no existen.
6. Mantener esta carpeta actualizada cuando cambie el orden o el alcance de las tareas.

## Direccion Visual Del Producto

Se definieron tres direcciones de diseno posibles para el area privada:

1. `Campus Dashboard`
2. `Academy Premium`
3. `Portal Tecnico Minimalista`

La primera implementacion concreta sera `Campus Dashboard`, por ser la mejor base para construir el producto privado y la futura seccion admin.
