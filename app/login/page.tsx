"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

import AuthSplitLayout from "@/components/AuthSplitLayout"
import AuthStatusDialog from "@/components/auth/AuthStatusDialog"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { getAuthToken, setAuthToken } from "@/lib/auth-token"
import { isValidEmailInput, normalizeEmailInput } from "@/lib/form-validation"

function extractErrorMessage(payload: unknown, fallback = "No se pudo iniciar sesion") {
  if (typeof payload === "object" && payload !== null) {
    const maybePayload = payload as { message?: string | string[] }
    if (Array.isArray(maybePayload.message)) return maybePayload.message.join(", ")
    if (typeof maybePayload.message === "string") return maybePayload.message
  }

  return fallback
}

function extractAccessToken(payload: unknown) {
  if (typeof payload !== "object" || payload === null) return null

  const maybePayload = payload as { access_token?: string }
  return typeof maybePayload.access_token === "string" ? maybePayload.access_token : null
}

type AuthDialogType = "registered" | "verified" | "reset" | "requiresVerification" | "resendSuccess"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isClientReady, setIsClientReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [dialogType, setDialogType] = useState<AuthDialogType | null>(null)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [dialogErrorMessage, setDialogErrorMessage] = useState("")
  const [isResendingVerification, setIsResendingVerification] = useState(false)

  useEffect(() => {
    setIsClientReady(true)

    const token = getAuthToken()
    if (token) router.replace("/cursos")

    const searchParams = new URLSearchParams(window.location.search)
    const prefilledEmail = normalizeEmailInput(searchParams.get("email") ?? "")
    if (prefilledEmail) {
      setEmail(prefilledEmail)
    }

    if (searchParams.get("registered") === "1") {
      setDialogType("registered")
    } else if (searchParams.get("verified") === "1") {
      setDialogType("verified")
    } else if (searchParams.get("reset") === "1") {
      setDialogType("reset")
    }

    if (["registered", "verified", "reset", "email"].some((key) => searchParams.has(key))) {
      window.history.replaceState({}, "", "/login")
    }
  }, [router])

  const handleResendVerification = async () => {
    setErrorMessage("")
    setDialogErrorMessage("")

    const normalizedEmail = normalizeEmailInput(email)
    if (!isValidEmailInput(normalizedEmail)) {
      setDialogErrorMessage("Ingresa un correo electronico valido para reenviar la verificacion")
      return
    }

    setIsResendingVerification(true)

    try {
      const response = await fetch("/api/auth/resend-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const payload = (await response.json().catch(() => null)) as unknown
      if (!response.ok) {
        throw new Error(extractErrorMessage(payload, "No se pudo reenviar la verificacion"))
      }

      setDialogType("resendSuccess")
    } catch (error) {
      if (error instanceof Error) {
        setDialogErrorMessage(error.message)
      } else {
        setDialogErrorMessage("No se pudo reenviar la verificacion")
      }
    } finally {
      setIsResendingVerification(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setDialogType(null)
    setVerificationMessage("")
    setDialogErrorMessage("")

    const normalizedEmail = normalizeEmailInput(email)
    if (!isValidEmailInput(normalizedEmail)) {
      setErrorMessage("Ingresa un correo electronico valido")
      return
    }

    if (!password || password.length > 128) {
      setErrorMessage("La contraseña es invalida")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      })

      const payload = (await response.json().catch(() => null)) as unknown

      if (response.status === 403) {
        setDialogType("requiresVerification")
        setVerificationMessage(
          extractErrorMessage(payload, "Tu cuenta todavia no esta verificada. Revisa tu correo o pedi un nuevo enlace."),
        )
        return
      }

      const accessToken = extractAccessToken(payload)

      if (!response.ok || !accessToken) {
        throw new Error(extractErrorMessage(payload))
      }

      setAuthToken(accessToken)
      router.replace("/cursos")
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo iniciar sesion")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout imageSrc="/aeroContent4.jpg" imageAlt="Estudiante trabajando sobre el prototipo de ala volante en el taller">
      <div className="mb-8 text-center">
        <Image src="/asme_logo_azul_sin_fondo.png" alt="ASME ITBA" width={156} height={156} className="mx-auto mb-4" priority />
        <h2 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">Iniciá sesión</h2>
        <p className="auth-muted-copy mt-3 text-sm leading-6 md:text-base">Accedé a tus cursos, clases y recursos del campus ASME.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Correo electrónico
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
            className="auth-input-surface h-12 w-full rounded-xl px-4 text-base focus:border-[var(--campus-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Correo electrónico"
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            maxLength={128}
            className="auth-input-surface h-12 w-full rounded-xl px-4 text-base focus:border-[var(--campus-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Contraseña"
          />
        </div>

        <div className="flex justify-end">
          <Link href="/olvide-mi-contrasena" className="auth-link text-sm">
            Olvidé mi contraseña
          </Link>
        </div>

        {errorMessage ? (
          <p className="campus-feedback-panel rounded-xl px-4 py-3 text-sm">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading || !isClientReady}
          className="campus-accent-button h-12 w-full rounded-xl text-base font-semibold disabled:opacity-70"
        >
          {isLoading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="auth-muted-copy mt-6 text-center text-sm">
        No tenés cuenta?{" "}
        <Link href="/registro" className="auth-link">
          Crear cuenta
        </Link>
      </p>

      <AuthStatusDialog
        open={dialogType !== null}
        eyebrow={
          dialogType === "verified"
            ? "Verificacion completada"
            : dialogType === "reset"
              ? "Contraseña actualizada"
              : dialogType === "resendSuccess"
                ? "Correo reenviado"
                : "Estado de cuenta"
        }
        title={
          dialogType === "registered"
            ? "Revisá tu correo"
            : dialogType === "verified"
              ? "Correo verificado"
              : dialogType === "reset"
                ? "Contraseña actualizada"
                : dialogType === "requiresVerification"
                  ? "Cuenta pendiente de verificacion"
                  : dialogType === "resendSuccess"
                    ? "Verificacion reenviada"
                    : ""
        }
        description={
          dialogType === "registered"
            ? "Te enviamos un correo para verificar tu cuenta antes de iniciar sesion."
            : dialogType === "verified"
              ? "Tu correo ya fue verificado. Ya podes iniciar sesion."
              : dialogType === "reset"
                ? "Tu contraseña fue actualizada correctamente. Ya podes iniciar sesion con la nueva clave."
                : dialogType === "requiresVerification"
                  ? verificationMessage
                  : dialogType === "resendSuccess"
                    ? "Si el correo existe y la cuenta sigue pendiente, reenviamos la verificacion."
                    : ""
        }
        primaryAction={
          dialogType === "registered"
            ? {
                label: "Entendido",
                onClick: () => setDialogType(null),
              }
            : dialogType === "requiresVerification"
              ? {
                  label: "Reenviar verificacion",
                  onClick: () => {
                    void handleResendVerification()
                  },
                  isLoading: isResendingVerification,
                  loadingLabel: "Reenviando...",
                }
              : dialogType === "resendSuccess"
                ? {
                    label: "Entendido",
                    onClick: () => setDialogType(null),
                  }
                : {
                    label: "Continuar",
                    onClick: () => setDialogType(null),
                  }
        }
        secondaryAction={
          dialogType === "registered"
            ? {
                label: "Reenviar verificacion",
                onClick: () => {
                  void handleResendVerification()
                },
                isLoading: isResendingVerification,
                loadingLabel: "Reenviando...",
              }
            : dialogType === "requiresVerification"
              ? {
                  label: "Cerrar",
                  onClick: () => setDialogType(null),
                }
              : undefined
        }
        onClose={() => {
          if (isResendingVerification) return
          setDialogType(null)
        }}
      >
        {dialogType === "registered" || dialogType === "requiresVerification" ? (
          dialogErrorMessage ? <p className="campus-feedback-panel rounded-xl px-4 py-3 text-sm">{dialogErrorMessage}</p> : null
        ) : null}
      </AuthStatusDialog>
    </AuthSplitLayout>
  )
}
