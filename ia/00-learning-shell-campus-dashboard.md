# 00 - Learning Shell Campus Dashboard

## Estado

`done`

## Objetivo

Separar visual y estructuralmente la experiencia de cursos del sitio institucional de ASME.

La idea es que, una vez autenticado, el usuario entre a una experiencia distinta, tipo portal o dashboard, y no sienta que sigue navegando una seccion mas de la home institucional.

## Contexto Actual

Hoy las pantallas privadas de cursos reutilizan el `Navbar` institucional y comparten buena parte del lenguaje visual del sitio principal.

Archivos afectados actualmente:

- `app/cursos/page.tsx`
- `app/mis-cursos/page.tsx`
- `app/cursos/[cursoId]/[slug]/page.tsx`
- `components/Navbar.tsx`

## Decisiones Ya Tomadas

1. El area privada debe sentirse como otra pagina, similar a como hoy `aero` se siente distinto del sitio principal.
2. En mobile puede haber menu de tres rayitas.
3. En desktop no conviene depender solo de hamburguesa; debe existir una navegacion mas persistente.
4. El branding ASME se mantiene, pero el shell no debe reutilizar el header institucional.
5. Esta direccion visual sera la primera implementacion concreta antes de explorar otras variantes.

## Resultado Esperado

Al entrar a `cursos` o `mis-cursos`, el usuario debe ver una experiencia tipo app:

- topbar propia
- sidebar izquierda en desktop
- drawer lateral en mobile
- identidad visual consistente de portal
- menu de usuario claro
- navegacion persistente entre areas privadas

## Alcance

### Debe incluir

1. Nuevo shell privado para el area de cursos.
2. Nuevo header o topbar, distinto del `Navbar` institucional.
3. Sidebar izquierda para desktop.
4. Drawer lateral para mobile con boton de menu.
5. Accesos visibles a:
- `Catalogo`
- `Mis cursos`
- `Mi perfil`
- `Cerrar sesion`
- `Admin` solo cuando exista soporte de rol

6. Integracion inicial con las pantallas:
- `app/cursos/page.tsx`
- `app/mis-cursos/page.tsx`
- `app/cursos/[cursoId]/[slug]/page.tsx`

### No debe incluir aun

1. Implementacion completa de perfil.
2. Reglas finales de `admin`.
3. Cambio de rol real.
4. Cambios de backend.
5. Las otras variantes visuales (`Academy Premium`, `Portal Tecnico Minimalista`).

## Propuesta De Layout

### Topbar

Debe ser mas sobria que la del sitio principal.

Contenido sugerido:

- logo ASME
- nombre del producto: `ASME Campus`
- titulo de pagina o breadcrumb simple
- acceso al usuario en el extremo derecho o integrado con la sidebar

### Sidebar Desktop

Navegacion persistente del area privada.

Items iniciales:

- `Catalogo`
- `Mis cursos`
- `Mi perfil`
- `Admin` si corresponde
- `Cerrar sesion`

### Mobile Drawer

En mobile, la misma navegacion debe abrirse desde un boton de menu de tres rayitas.

Debe contener:

- identidad del producto
- links principales
- zona de usuario
- logout

## Componentes Propuestos

1. `components/learning/LearningShell.tsx`
2. `components/learning/LearningTopbar.tsx`
3. `components/learning/LearningSidebar.tsx`
4. `components/learning/LearningMobileDrawer.tsx`
5. `components/learning/LearningUserMenu.tsx`

## Reglas UX

1. Debe sentirse como portal, no como landing institucional.
2. El usuario debe poder ubicarse rapido dentro de la experiencia privada.
3. La navegacion principal no debe depender de scroll o de anchors.
4. El logout debe ser facil de encontrar.
5. Debe haber continuidad entre `Catalogo`, `Mis cursos` y futuras pantallas privadas.
6. Debe verse bien en desktop y mobile.
7. Se puede mantener la identidad ASME, pero con un lenguaje de producto mas funcional.

## Reglas Visuales

1. Reducir la sensacion de hero y home institucional.
2. Priorizar contenedores, paneles, layouts persistentes y jerarquia de app.
3. Mantener buena legibilidad para cards, listados y detalles.
4. Evitar que el header compita visualmente con el contenido.
5. El shell debe ser reutilizable para futuras vistas privadas y admin.

## Archivos A Tocar

Minimo esperado:

- `app/cursos/page.tsx`
- `app/mis-cursos/page.tsx`
- `app/cursos/[cursoId]/[slug]/page.tsx`
- nuevos componentes en `components/learning/*`

Posible apoyo:

- `lib/auth-token.ts`
- futuras utilidades de usuario o rol si hacen falta para el menu

## Dependencias

### Previas
- ninguna obligatoria

### Tareas que esta desbloquea
- `03-jwt-roles.md`
- `04-bloqueo-clases-no-inscriptos.md`
- `05-admin-shell.md`

## Riesgos O Cuidados

1. No romper la navegacion publica del sitio.
2. No mezclar el `Navbar` institucional con el shell privado.
3. No introducir complejidad excesiva en la primera version.
4. No disenar pensando solo en `cursos`; el shell debe servir tambien para perfil y admin.
5. No depender aun de datos de perfil que el backend todavia no expone.

## Playwright A Agregar

1. Navegacion entre `Catalogo` y `Mis cursos`.
2. Render correcto del shell en desktop.
3. Apertura y cierre del drawer mobile.
4. Logout desde la navegacion privada.
5. Persistencia del layout al navegar entre pantallas privadas.

## Criterio De Aceptacion

1. Un usuario autenticado entra a `cursos` y percibe una experiencia distinta del sitio institucional.
2. `cursos`, `mis-cursos` y detalle de curso dejan de usar `components/Navbar.tsx`.
3. Existe una navegacion privada persistente y clara.
4. En desktop hay sidebar funcional.
5. En mobile hay drawer funcional desde menu hamburguesa.
6. El shell queda listo para soportar `Mi perfil` y `Admin`.
7. Hay validacion con Playwright del flujo principal del nuevo shell.

## Orden De Implementacion Recomendado

1. Crear los componentes base del shell.
2. Migrar `app/cursos/page.tsx` al nuevo shell.
3. Migrar `app/mis-cursos/page.tsx` al nuevo shell.
4. Migrar `app/cursos/[cursoId]/[slug]/page.tsx` al nuevo shell.
5. Agregar o actualizar tests Playwright del shell privado.
6. Ajustar detalles visuales y de navegacion.

## Nota De Producto

Mas adelante pueden explorarse otras dos direcciones visuales:

1. `Academy Premium`
2. `Portal Tecnico Minimalista`

Pero la primera implementacion real del area privada debe ser `Campus Dashboard`, porque da una base clara, reutilizable y escalable para todo lo que sigue.
