"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

import AuthSplitLayout from "@/components/AuthSplitLayout"
import { Input } from "@/components/ui/input"
import { getAuthToken } from "@/lib/auth-token"
import { isValidEmailInput, normalizeEmailInput } from "@/lib/form-validation"

function extractErrorMessage(payload: unknown) {
  if (typeof payload === "object" && payload !== null) {
    const maybePayload = payload as { message?: string | string[] }
    if (Array.isArray(maybePayload.message)) return maybePayload.message.join(", ")
    if (typeof maybePayload.message === "string") return maybePayload.message
  }

  return "No se pudo iniciar la recuperacion"
}

function extractDevelopmentCode(payload: unknown) {
  if (typeof payload !== "object" || payload === null) return null

  const maybePayload = payload as { token?: string; code?: string }
  if (typeof maybePayload.code === "string") return maybePayload.code
  if (typeof maybePayload.token === "string") return maybePayload.token

  return null
}

export default function OlvideMiContrasenaPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isClientReady, setIsClientReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [developmentCode, setDevelopmentCode] = useState<string | null>(null)

  useEffect(() => {
    setIsClientReady(true)

    const token = getAuthToken()
    if (token) router.replace("/cursos")
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setDevelopmentCode(null)

    const normalizedEmail = normalizeEmailInput(email)
    if (!isValidEmailInput(normalizedEmail)) {
      setErrorMessage("Ingresa un correo electronico valido")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const payload = (await response.json().catch(() => null)) as unknown

      if (!response.ok) {
        throw new Error(extractErrorMessage(payload))
      }

      setSuccessMessage("Si el correo existe, te enviamos un codigo para restablecer la contraseña.")
      setDevelopmentCode(extractDevelopmentCode(payload))
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo iniciar la recuperacion")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout imageSrc="/aeroContent10.jpg" imageAlt="Avión de ala volante sobre la pista listo para volar">
      <div className="mb-8 text-center">
        <Image src="/asme_logo_azul_sin_fondo.png" alt="ASME ITBA" width={156} height={156} className="mx-auto mb-4" priority />
        <h2 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">Recuperar contraseña</h2>
        <p className="auth-muted-copy mt-3 text-sm leading-6 md:text-base">Ingresa tu correo y te vamos a enviar un codigo para recuperar el acceso.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {successMessage ? (
          <p className="campus-accent-panel rounded-xl px-4 py-3 text-sm">{successMessage}</p>
        ) : null}

        {developmentCode ? (
          <div className="campus-accent-panel rounded-xl px-4 py-4 text-sm">
            <p className="font-medium">Codigo de desarrollo</p>
            <p className="mt-2 break-all font-mono text-xs">{developmentCode}</p>
            <Link
              href={`/restablecer-contrasena?codigo=${encodeURIComponent(developmentCode)}`}
              className="auth-link mt-3 inline-flex"
            >
              Usar este codigo ahora
            </Link>
          </div>
        ) : null}

        {errorMessage ? (
          <p className="campus-feedback-panel rounded-xl px-4 py-3 text-sm">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading || !isClientReady}
          className="campus-accent-button h-12 w-full rounded-xl text-base font-semibold disabled:opacity-70"
        >
          {isLoading ? "Enviando codigo..." : "Enviar codigo"}
        </button>
      </form>

      <div className="auth-muted-copy mt-6 space-y-2 text-center text-sm">
        <p>
          Ya tenes el codigo?{" "}
          <Link href="/restablecer-contrasena" className="auth-link">
            Restablece tu contraseña
          </Link>
        </p>
        <p>
          <Link href="/login" className="auth-link">
            Volver a login
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}
