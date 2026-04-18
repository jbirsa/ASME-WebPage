# 04 - Bloqueo De Clases Para No Inscriptos

## Estado

`pending`

## Objetivo

Evitar que un usuario no inscripto vea el contenido de clases de un curso.

## Decision Ya Tomada

Si el usuario no esta inscripto, la pagina del curso no debe mostrar las clases. Debe verse un estado de acceso restringido con CTA claro para inscribirse.

## Contexto Actual

Hoy el detalle del curso obtiene el curso completo y renderiza las clases aunque el usuario no este inscripto.

Archivo principal involucrado:

- `app/cursos/[cursoId]/[slug]/page.tsx`

## Backend Disponible

- `GET /cursos/:id`
- `GET /cursos/mis-cursos`
- `POST /cursos/:id/inscribirme`

## Frontend A Tocar

- detalle de curso
- estados de CTA
- posibles mensajes informativos en el shell privado

## UX Esperada

1. Usuario no inscripto ve descripcion, portada y CTA de inscripcion.
2. Usuario inscripto ve clases disponibles.
3. Si se inscribe desde esa pantalla, el estado cambia correctamente.

## Casos Borde

1. Usuario pierde sesion.
2. Error durante inscripcion.
3. Curso sin clases.

## Playwright A Agregar

1. No inscripto no ve clases.
2. No inscripto ve CTA de inscripcion.
3. Inscriptos si ven clases.

## Criterio De Aceptacion

1. Las clases dejan de exponerse visualmente a usuarios no inscriptos.
2. El flujo de inscripcion sigue funcionando.
3. Hay cobertura Playwright de ambos escenarios.
