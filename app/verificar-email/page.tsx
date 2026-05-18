"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FormEvent, type ReactNode, Suspense, useEffect, useRef, useState } from "react"

import AuthSplitLayout from "@/components/AuthSplitLayout"
import { Input } from "@/components/ui/input"
import { isValidEmailInput, normalizeEmailInput, trimSingleLine } from "@/lib/form-validation"

type VerificationStatus = "loading" | "success" | "invalid" | "missing"

function extractErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "object" && payload !== null) {
    const maybePayload = payload as { message?: string | string[] }
    if (Array.isArray(maybePayload.message)) return maybePayload.message.join(", ")
    if (typeof maybePayload.message === "string") return maybePayload.message
  }

  return fallback
}

function isRejectedVerification(payload: unknown) {
  if (typeof payload !== "object" || payload === null) return false

  const maybePayload = payload as { ok?: boolean }
  return maybePayload.ok === false
}

function VerificationLayoutShell({ children }: { children: ReactNode }) {
  return (
    <AuthSplitLayout
      imageSrc="/aeroContent4.jpg"
      imageAlt="Estudiante trabajando sobre el prototipo de ala volante en el taller"
      eyebrow="Validacion de cuenta"
      title="ASME Campus"
      subtitle="Verificá tu correo para activar tu acceso al campus y continuar con tu recorrido de aprendizaje."
    >
      <div className="mb-8 text-center">
        <Image src="/asme_logo_azul_sin_fondo.png" alt="ASME ITBA" width={156} height={156} className="mx-auto mb-4" priority />
        <h2 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">Verificación de correo</h2>
        <p className="auth-muted-copy mt-3 text-sm leading-6 md:text-base">Confirmá tu dirección de email para habilitar el acceso al campus.</p>
      </div>

      {children}
    </AuthSplitLayout>
  )
}

function VerificarEmailPageContent() {
  const searchParams = useSearchParams()
  const lastTokenAttemptRef = useRef<string | null>(null)

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<VerificationStatus>("loading")
  const [isClientReady, setIsClientReady] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [resendMessage, setResendMessage] = useState("")

  const token = trimSingleLine(searchParams.get("token") ?? "")

  useEffect(() => {
    setIsClientReady(true)

    const initialEmail = normalizeEmailInput(searchParams.get("email") ?? "")
    if (initialEmail) {
      setEmail(initialEmail)
    }
  }, [searchParams])

  useEffect(() => {
    if (!isClientReady) {
      return
    }

    if (!token) {
      setStatus("missing")
      setErrorMessage("El enlace de verificacion no incluye un token valido.")
      return
    }

    if (lastTokenAttemptRef.current === token) {
      return
    }

    lastTokenAttemptRef.current = token

    let cancelled = false

    async function verifyEmail() {
      setStatus("loading")
      setErrorMessage("")
      setResendMessage("")

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const payload = (await response.json().catch(() => null)) as unknown
        if (cancelled) {
          return
        }

        if (!response.ok || isRejectedVerification(payload)) {
          setStatus("invalid")
          setErrorMessage(extractErrorMessage(payload, "El enlace de verificacion es invalido o expiro."))
          return
        }

        setStatus("success")
      } catch {
        if (cancelled) {
          return
        }

        setStatus("invalid")
        setErrorMessage("No se pudo verificar el correo en este momento.")
      }
    }

    void verifyEmail()

    return () => {
      cancelled = true
    }
  }, [isClientReady, token])

  const handleResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setResendMessage("")

    const normalizedEmail = normalizeEmailInput(email)
    if (!isValidEmailInput(normalizedEmail)) {
      setErrorMessage("Ingresa un correo electronico valido para reenviar la verificacion.")
      return
    }

    setIsResending(true)

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

      setResendMessage("Si el correo existe y la cuenta sigue pendiente, reenviamos la verificacion.")
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo reenviar la verificacion")
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <VerificationLayoutShell>
      {status === "loading" ? (
        <div className="campus-accent-panel rounded-xl px-4 py-4 text-sm">
          Estamos verificando tu correo. Esto puede tardar unos segundos.
        </div>
      ) : null}

      {status === "success" ? (
        <div className="space-y-4">
          <div className="campus-accent-panel rounded-xl px-4 py-4 text-sm">
            Tu correo fue verificado correctamente. Ya podes iniciar sesion.
          </div>
          <Link href="/login?verified=1" className="campus-accent-button inline-flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold">
            Ir a login
          </Link>
        </div>
      ) : null}

      {(status === "invalid" || status === "missing") ? (
        <div className="space-y-4">
          <div className="campus-feedback-panel rounded-xl px-4 py-4 text-sm">{errorMessage}</div>

          <form onSubmit={handleResend} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electronico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                maxLength={254}
                className="auth-input-surface h-12 w-full rounded-xl px-4 text-base focus:border-[var(--campus-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Correo electronico"
              />
            </div>

            {resendMessage ? (
              <div className="campus-accent-panel rounded-xl px-4 py-4 text-sm">{resendMessage}</div>
            ) : null}

            <button
              type="submit"
              disabled={isResending || !isClientReady}
              className="campus-accent-button h-12 w-full rounded-xl text-base font-semibold disabled:opacity-70"
            >
              {isResending ? "Reenviando..." : "Reenviar verificacion"}
            </button>
          </form>

          <div className="auth-muted-copy space-y-2 text-center text-sm">
            <p>
              Ya verificaste tu cuenta?{" "}
              <Link href="/login" className="auth-link">
                Volver a login
              </Link>
            </p>
          </div>
        </div>
      ) : null}
    </VerificationLayoutShell>
  )
}

function VerificarEmailFallback() {
  return (
    <VerificationLayoutShell>
      <div className="campus-accent-panel rounded-xl px-4 py-4 text-sm">
        Estamos preparando la verificacion de tu correo.
      </div>
    </VerificationLayoutShell>
  )
}

export default function VerificarEmailPage() {
  return (
    <Suspense fallback={<VerificarEmailFallback />}>
      <VerificarEmailPageContent />
    </Suspense>
  )
}
