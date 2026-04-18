# AGENTS.md

## Lectura Obligatoria

Antes de hacer cualquier tarea en este repositorio:

1. Leer este `AGENTS.md` completo.
2. Revisar primero el frontend involucrado: pagina, componente, route interna de Next, tipo y utilidades relacionadas.
3. Revisar el contrato actual del backend en `../asme-backend`, especialmente controlador, DTO y Swagger en `/api`.
4. Verificar si ya existe un test de Playwright para el flujo afectado.
5. Si se implementa una feature nueva o se cambia un flujo relevante, probarlo con Playwright.

## Proposito Del Repositorio

Este repositorio es el frontend web de ASME. Hoy combina:

- sitio institucional publico
- login y acceso a cursos
- area de cursos para usuarios autenticados
- futura area admin para gestion de contenido

El foco principal del producto debe ser:

- autenticacion
- cursos y clases
- eventos
- experiencia admin para operacion diaria
- validacion end-to-end con Playwright

## Alcance Actual Del Frontend

Hoy ya existe implementado principalmente:

- home institucional
- navbar general
- login
- catalogo de cursos
- inscripcion a cursos
- mis cursos
- detalle de curso con listado de clases
- paginas institucionales como `mechub`, `aero` y `equilibrista`
- Playwright configurado para tests e2e basicos

Archivos relevantes hoy:

- `app/login/page.tsx`
- `app/cursos/page.tsx`
- `app/mis-cursos/page.tsx`
- `app/cursos/[cursoId]/[slug]/page.tsx`
- `app/api/auth/login/route.ts`
- `app/api/cursos/*`
- `playwright.config.ts`
- `e2e/*`

## Dominio Del Producto

### Estado actual implementado

Hoy el frontend soporta principalmente:

- login con JWT
- navegacion autenticada hacia cursos
- consulta de cursos
- inscripcion a cursos
- visualizacion de cursos inscriptos
- visualizacion de clases de un curso

### Dominio objetivo del producto

El dominio objetivo que debe guiar futuras decisiones es:

- registro de usuario
- login
- recuperacion de contraseña
- reset de contraseña por codigo enviado por mail
- catalogo de cursos
- mis cursos
- acceso a clases solo para usuarios inscriptos
- area admin para ABM de cursos
- area admin para ABM de clases
- area admin para ABM de eventos
- eventos publicos consumidos desde el backend principal
- validacion continua con Playwright por flujo funcional

Importante:

- el frontend debe redirigir a login luego del registro exitoso
- el detalle de curso no debe mostrar clases si el usuario no esta inscripto
- los eventos deben migrarse y mantenerse conectados al backend Nest, no a Supabase
- hoy no existe soporte backend real para evaluaciones o correccion de clases; no asumir esa funcionalidad

## Roles

Los roles tecnicos vigentes en backend son:

- `admin`
- `user`

En terminos funcionales:

- `user` representa al alumno o usuario comun
- `admin` gestiona cursos, clases y eventos

Importante:

- el login hoy devuelve solo `access_token`
- el rol debe obtenerse desde el JWT hasta que exista un endpoint de perfil
- no asumir la existencia de `/auth/me` o `/users/me` porque hoy no existen

## Stack Y Arquitectura

Stack actual detectado en este repo:

- Next.js App Router
- React
- TypeScript
- Tailwind
- API routes de Next como proxy al backend
- Playwright para e2e

Caracteristicas actuales:

- autenticacion manejada en cliente
- token persistido en `localStorage`
- pages cliente que consumen rutas internas `/api/*`
- tests Playwright con `desktop-chromium` y `mobile-chromium`

## Reglas De Integracion Con Backend

1. Antes de implementar UI nueva, revisar el contrato del backend real.
2. Preferir siempre consumir el backend mediante routes internas de Next en `app/api/*`.
3. No conectar paginas cliente directamente al backend si puede resolverse con una route interna del frontend.
4. Si el backend ya expone una capacidad, respetar nombres y payloads del DTO actual.
5. Si el backend no soporta una funcionalidad, no inventar una implementacion final. Como mucho, dejar la UI preparada o mockeada si fue pedido explicitamente.
6. Si un flujo depende de auth, propagar correctamente `Authorization: Bearer <token>` desde el frontend hacia la route interna y desde la route interna al backend.
7. Si cambia el contrato del backend, actualizar los tipos del frontend y los tests.

## Reglas Especificas De Auth

1. Mantener el login apoyado en `app/api/auth/*`.
2. Agregar y mantener estos flujos:
- registro
- forgot password
- reset password
3. En UI de recuperacion se puede hablar de "codigo", pero el contrato backend actual usa el campo `token`.
4. Luego de registrarse correctamente, redirigir a `/login`.
5. Las paginas protegidas deben redirigir a `/login` si no hay token valido.
6. Las pantallas admin deben validar que el rol sea `admin`.
7. Si el backend responde `401`, limpiar sesion y redirigir a login.

## Reglas Especificas De Cursos

1. El catalogo de cursos debe mostrar cursos disponibles y estado de inscripcion.
2. `Mis cursos` debe usar el endpoint de cursos del usuario autenticado.
3. El detalle del curso no debe exponer clases si el usuario no esta inscripto.
4. Si el usuario no esta inscripto, el CTA principal debe ser inscribirse.
5. No simular progreso por clase como si fuera real si el backend todavia no lo soporta.
6. Si mas adelante se implementa tracking por clase en backend, reflejarlo en frontend y en tests.

## Reglas Especificas De Admin

El area admin debe implementarse de forma incremental y priorizar:

1. ABM de cursos
2. ABM de clases
3. ABM de eventos

Lineamientos:

1. Empezar por un shell simple en `app/admin`.
2. Crear vistas separadas y claras para listar, crear, editar y eliminar.
3. Preferir formularios simples y consistentes con el DTO real del backend.
4. En clases, priorizar administracion por curso antes que una vista global compleja.
5. En eventos, usar el backend Nest como fuente de verdad.
6. No seguir ampliando Supabase como backend de eventos.

## Eventos

Situacion actual:

- el frontend hoy obtiene eventos desde Supabase en `app/api/events/*`

Direccion obligatoria:

1. Migrar `app/api/events/*` para consumir el backend Nest.
2. Unificar el shape de datos del frontend con el contrato del backend.
3. Toda mejora futura de eventos debe apoyarse en esa integracion.
4. El ABM de eventos debe impactar directamente en la home publica.

## Playwright

Playwright es parte obligatoria del flujo de trabajo de este repo.

Reglas:

1. Toda feature nueva o cambio relevante debe quedar validado con Playwright.
2. Todo bug importante corregido debe tener cobertura e2e cuando sea razonable.
3. Si se modifica auth, cursos o admin, agregar o actualizar tests.
4. Antes de dar una tarea por cerrada, correr al menos los specs afectados.
5. Si el flujo cambia en desktop y mobile, considerar ambos escenarios.
6. Si un flujo depende de backend no estable o aun no conectado, usar mocks de red de forma explicita en el test.
7. No confiar solo en testing manual si el flujo puede automatizarse razonablemente.

### Flujos Que Deben Tener Cobertura

Auth:

- login valido
- login invalido
- registro exitoso
- registro con error
- forgot password
- reset password

Cursos:

- redirect a login sin sesion
- carga de catalogo
- inscripcion a curso
- visualizacion de mis cursos
- detalle de curso inscripto
- bloqueo de clases si no esta inscripto

Admin:

- acceso permitido para admin
- acceso denegado para user
- crear curso
- editar curso
- eliminar curso
- crear clase
- editar clase
- eliminar clase
- crear evento
- editar evento
- eliminar evento

Publico:

- home carga correctamente
- eventos se renderizan con datos del backend principal

## Orden De Implementacion Recomendado

1. `AGENTS.md`
2. utilidades de auth y lectura de rol desde JWT
3. registro
4. forgot password
5. reset password
6. ajustes del flujo actual de login
7. restriccion de clases solo para inscriptos
8. shell admin
9. ABM de cursos
10. ABM de clases
11. migracion de eventos desde Supabase al backend Nest
12. ABM de eventos

## Restricciones Actuales Del Backend

Al planificar tareas futuras, recordar:

- login devuelve solo `access_token`
- no existe endpoint de perfil actual
- no existe soporte real para evaluaciones
- no existe soporte real para corregir cada clase
- no existe tracking real de progreso por clase
- eventos ya tienen CRUD en backend
- cursos ya tienen CRUD en backend
- clases ya tienen CRUD en backend

Por lo tanto:

- no implementar UX final de correccion o evaluaciones como si el backend ya existiera
- si se necesita esa feature, primero debe ampliarse `asme-backend`

## Criterio De Trabajo

1. Hacer cambios pequenos y consistentes.
2. Preferir la solucion mas simple que respete el contrato actual.
3. No introducir abstracciones grandes sin necesidad concreta.
4. Si aparece una discrepancia entre frontend y backend, resolverla explicitamente en codigo y tests.
5. Si una decision afecta la arquitectura, documentarla en este archivo.

## Documentacion Viva

Este archivo debe mantenerse actualizado cuando cambien:

- los flujos de auth
- la fuente de datos de eventos
- la estructura del area admin
- la estrategia de tests
- el contrato con el backend
- el orden de prioridades del producto
