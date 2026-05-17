"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

import AuthSplitLayout from "@/components/AuthSplitLayout"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { getAuthToken } from "@/lib/auth-token"
import { isValidEmailInput, normalizeEmailInput, trimSingleLine } from "@/lib/form-validation"

function extractErrorMessage(payload: unknown) {
  if (typeof payload === "object" && payload !== null) {
    const maybePayload = payload as { message?: string | string[] }
    if (Array.isArray(maybePayload.message)) return maybePayload.message.join(", ")
    if (typeof maybePayload.message === "string") return maybePayload.message
  }

  return "No se pudo restablecer la contraseña"
}

function isRejectedReset(payload: unknown) {
  if (typeof payload !== "object" || payload === null) return false

  const maybePayload = payload as { ok?: boolean }
  return maybePayload.ok === false
}

export default function RestablecerContrasenaPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [codigo, setCodigo] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isClientReady, setIsClientReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setIsClientReady(true)

    const token = getAuthToken()
    if (token) {
      router.replace("/cursos")
      return
    }

    const searchParams = new URLSearchParams(window.location.search)
    const prefilledCode = searchParams.get("codigo")
    if (prefilledCode) setCodigo(prefilledCode.toUpperCase())
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    const normalizedEmail = normalizeEmailInput(email)
    const normalizedCode = trimSingleLine(codigo)

    if (!isValidEmailInput(normalizedEmail)) {
      setErrorMessage("Ingresa un correo electronico valido")
      return
    }

    if (!normalizedCode) {
      setErrorMessage("El codigo es obligatorio")
      return
    }

    if (!/^[A-Z]{6}$/.test(normalizedCode)) {
      setErrorMessage("El codigo debe tener 6 letras")
      return
    }

    if (newPassword.length > 128) {
      setErrorMessage("La contraseña supera el limite de caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, code: normalizedCode, newPassword }),
      })

      const payload = (await response.json().catch(() => null)) as unknown

      if (!response.ok || isRejectedReset(payload)) {
        throw new Error(extractErrorMessage(payload))
      }

      router.replace("/login?reset=1")
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo restablecer la contraseña")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout imageSrc="/aeroContent10.jpg" imageAlt="Avión de ala volante sobre la pista listo para volar">
      <div className="mb-8 text-center">
        <Image src="/asme_logo_azul_sin_fondo.png" alt="ASME ITBA" width={156} height={156} className="mx-auto mb-4" priority />
        <h2 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">Nueva contraseña</h2>
        <p className="auth-muted-copy mt-3 text-sm leading-6 md:text-base">Ingresa el codigo recibido y define una nueva contraseña.</p>
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

        <div>
          <label htmlFor="codigo" className="sr-only">
            Codigo
          </label>
          <Input
            id="codigo"
            type="text"
            value={codigo}
            onChange={(event) => setCodigo(event.target.value.toUpperCase())}
            required
            autoComplete="one-time-code"
            autoCapitalize="characters"
            maxLength={6}
            className="auth-input-surface h-12 w-full rounded-xl px-4 text-base focus:border-[var(--campus-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Codigo recibido"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="sr-only">
            Nueva contraseña
          </label>
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={6}
            maxLength={128}
            autoComplete="new-password"
            className="auth-input-surface h-12 w-full rounded-xl px-4 text-base focus:border-[var(--campus-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Nueva contraseña"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirmar nueva contraseña
          </label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
            maxLength={128}
            autoComplete="new-password"
            className="auth-input-surface h-12 w-full rounded-xl px-4 text-base focus:border-[var(--campus-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Confirmar nueva contraseña"
          />
        </div>

        {errorMessage ? (
          <p className="campus-feedback-panel rounded-xl px-4 py-3 text-sm">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading || !isClientReady}
          className="campus-accent-button h-12 w-full rounded-xl text-base font-semibold disabled:opacity-70"
        >
          {isLoading ? "Guardando..." : "Actualizar contraseña"}
        </button>
      </form>

      <div className="auth-muted-copy mt-6 space-y-2 text-center text-sm">
        <p>
          Necesitas un codigo?{" "}
          <Link href="/olvide-mi-contrasena" className="auth-link">
            Solicitalo aca
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
