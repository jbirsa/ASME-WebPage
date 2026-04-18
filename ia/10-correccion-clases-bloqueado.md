# 10 - Correccion De Clases

## Estado

`blocked`

## Objetivo

Documentar lo necesario para soportar un flujo real de correccion por clase.

## Motivo Del Bloqueo

El backend actual no tiene soporte real para:

- evaluaciones por clase
- entregas o respuestas de alumnos
- estados de correccion
- feedback docente
- notas por actividad o clase

## Lo Que Si Existe Hoy

- cursos
- clases
- inscripciones
- un campo de calificacion a nivel inscripcion

## Lo Que Falta En Backend

1. Modelo de evaluacion por clase.
2. Modelo de entrega o respuesta.
3. Endpoints para enviar evaluacion.
4. Endpoints para corregir.
5. Estados de entrega y correccion.
6. Feedback y notas por entrega.

## Implicancia Para Frontend

No conviene implementar una UX final de correccion como si ya existiera soporte real. A lo sumo puede hacerse un diseo o prototipo, pero no una funcionalidad productiva completa.

## Criterio Para Desbloquear

1. El backend implementa entidades y endpoints reales.
2. Existe un contrato claro para evaluaciones y correccion.
3. Recien ahi se crea la tarea frontend correspondiente.
