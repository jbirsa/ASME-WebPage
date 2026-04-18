# 01 - Forgot Password

## Estado

`pending`

## Objetivo

Permitir que un usuario solicite la recuperacion de su contrasena ingresando su email.

## Backend Involucrado

- `POST /auth/forgot-password`

## Contrato Actual Esperado

Payload:

```json
{
  "email": "alumno@asme.org"
}
```

Respuesta esperada:

```json
{
  "sent": true
}
```

En desarrollo el backend puede devolver tambien un `token`, pero el frontend no debe depender de eso para el flujo final.

## Frontend A Tocar

- `app/login/page.tsx`
- nueva pagina `app/olvide-mi-contrasena/page.tsx`
- nueva route interna `app/api/auth/forgot-password/route.ts`

## Flujo UX Esperado

1. Desde login, el usuario hace click en `Olvide mi contrasena`.
2. Ingresa su email.
3. El frontend envia la solicitud.
4. La UI muestra un mensaje neutro si la operacion fue aceptada.

## Regla Importante

No revelar si el email existe o no. El mensaje debe ser generico.

## Casos Borde

1. Email invalido.
2. Backend caido.
3. Respuesta inesperada.
4. Usuario ya autenticado.

## Playwright A Agregar

1. Solicitud exitosa.
2. Error de backend controlado.
3. Link visible desde login.

## Criterio De Aceptacion

1. Existe la pantalla publica para solicitar recuperacion.
2. La UI usa `app/api/auth/forgot-password` como proxy.
3. El mensaje final no expone existencia del usuario.
4. Hay cobertura Playwright del flujo principal.
