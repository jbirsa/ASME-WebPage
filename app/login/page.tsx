"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

import AuthSplitLayout from "@/components/AuthSplitLayout"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { getAuthToken, setAuthToken } from "@/lib/auth-token"
import { isValidEmailInput, normalizeEmailInput } from "@/lib/form-validation"
import type { LoginResponse } from "@/types/learning"

function extractErrorMessage(payload: unknown) {
  if (typeof payload === "object" && payload !== null) {
    const maybePayload = payload as { message?: string | string[] }
    if (Array.isArray(maybePayload.message)) return maybePayload.message.join(", ")
    if (typeof maybePayload.message === "string") return maybePayload.message
  }

  return "No se pudo iniciar sesion"
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isClientReady, setIsClientReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false)
  const [showResetMessage, setShowResetMessage] = useState(false)

  useEffect(() => {
    setIsClientReady(true)

    const token = getAuthToken()
    if (token) router.replace("/cursos")

    const searchParams = new URLSearchParams(window.location.search)
    setShowRegisteredMessage(searchParams.get("registered") === "1")
    setShowResetMessage(searchParams.get("reset") === "1")
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

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

      const payload = (await response.json().catch(() => null)) as LoginResponse | null

      if (!response.ok || !payload?.access_token) {
        throw new Error(extractErrorMessage(payload))
      }

      setAuthToken(payload.access_token)
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

      {showRegisteredMessage ? (
        <p className="campus-accent-panel mb-4 rounded-xl px-4 py-3 text-sm">
          Cuenta creada correctamente. Ya podes iniciar sesion.
        </p>
      ) : null}

      {showResetMessage ? (
        <p className="campus-accent-panel mb-4 rounded-xl px-4 py-3 text-sm">
          Contraseña actualizada correctamente. Ya podes iniciar sesion.
        </p>
      ) : null}

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
    </AuthSplitLayout>
  )
}
