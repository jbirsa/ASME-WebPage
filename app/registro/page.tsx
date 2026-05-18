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

  return "No se pudo crear la cuenta"
}

export default function RegistroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isClientReady, setIsClientReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setIsClientReady(true)

    const token = getAuthToken()
    if (token) router.replace("/cursos")
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    const normalizedName = trimSingleLine(nombre)
    const normalizedEmail = normalizeEmailInput(email)

    if (!normalizedName) {
      setErrorMessage("El nombre es obligatorio")
      return
    }

    if (normalizedName.length > 120) {
      setErrorMessage("El nombre supera el limite de caracteres")
      return
    }

    if (!isValidEmailInput(normalizedEmail)) {
      setErrorMessage("Ingresa un correo electronico valido")
      return
    }

    if (password.length > 128) {
      setErrorMessage("La contraseña supera el limite de caracteres")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: normalizedName, email: normalizedEmail, password }),
      })

      const payload = (await response.json().catch(() => null)) as unknown

      if (!response.ok) {
        throw new Error(extractErrorMessage(payload))
      }

      router.replace(`/login?registered=1&email=${encodeURIComponent(normalizedEmail)}`)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo crear la cuenta")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout imageSrc="/aeroContent9.JPG" imageAlt="Prototipo de ala volante sobre la pista de pruebas">
      <div className="mb-8 text-center">
        <Image src="/asme_logo_azul_sin_fondo.png" alt="ASME ITBA" width={156} height={156} className="mx-auto mb-4" priority />
        <h2 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">Crear cuenta</h2>
        <p className="auth-muted-copy mt-3 text-sm leading-6 md:text-base">Registrate para empezar a aprender dentro del campus.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="sr-only">
            Nombre
          </label>
          <Input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
            autoComplete="name"
            maxLength={120}
            className="auth-input-surface h-12 w-full rounded-xl px-4 text-base focus:border-[var(--campus-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Nombre completo"
          />
        </div>

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
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            maxLength={128}
            autoComplete="new-password"
            className="auth-input-surface h-12 w-full rounded-xl px-4 text-base focus:border-[var(--campus-secondary)] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Contraseña"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirmar contraseña
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
            placeholder="Confirmar contraseña"
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
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="auth-muted-copy mt-6 text-center text-sm">
        Ya tenes cuenta?{" "}
        <Link href="/login" className="auth-link">
          Inicia sesion
        </Link>
      </p>
    </AuthSplitLayout>
  )
}
