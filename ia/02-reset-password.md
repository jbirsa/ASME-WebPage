# 02 - Reset Password

## Estado

`pending`

## Objetivo

Permitir que el usuario restablezca su contrasena usando un codigo recibido por mail.

## Backend Involucrado

- `POST /auth/reset-password`

## Contrato Actual Esperado

Payload real del backend:

```json
{
  "token": "codigo-o-token-recibido",
  "newPassword": "654321"
}
```

## Regla De Producto

En la UI se puede hablar de `codigo`, pero internamente el payload debe seguir usando el campo `token`.

## Frontend A Tocar

- nueva pagina `app/restablecer-contrasena/page.tsx`
- nueva route interna `app/api/auth/reset-password/route.ts`
- enlace natural desde `olvide-mi-contrasena`

## Flujo UX Esperado

1. El usuario abre la pagina de reset.
2. Ingresa codigo.
3. Ingresa nueva contrasena.
4. Confirma nueva contrasena.
5. Si sale bien, se lo redirige a login con mensaje de exito.

## Casos Borde

1. Codigo vacio o invalido.
2. Contrasenas que no coinciden.
3. Password menor a 6 caracteres.
4. Token expirado o ya usado.

## Playwright A Agregar

1. Reset exitoso.
2. Error por token invalido.
3. Validacion de contrasenas no coincidentes.

## Criterio De Aceptacion

1. La pagina de reset existe y funciona contra `app/api/auth/reset-password`.
2. La UI habla de `codigo`, no de `token`.
3. El usuario vuelve a login despues del exito.
4. Hay cobertura Playwright del flujo principal.
