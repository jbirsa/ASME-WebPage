"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

import LoginHeader from "@/components/LoginHeader"
import { Input } from "@/components/ui/input"
import { getAuthToken } from "@/lib/auth-token"

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
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const payload = (await response.json().catch(() => null)) as unknown

      if (!response.ok) {
        throw new Error(extractErrorMessage(payload))
      }

      setSuccessMessage("Si el correo existe, te enviamos un codigo para restablecer la contrasena.")
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
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a2744_0%,#0f172a_70%)]" />
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <LoginHeader />

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-28 pb-12">
        <section className="w-full max-w-md border-2 border-[#c9a227] rounded-2xl bg-[#0f172a]/90 backdrop-blur-sm px-7 py-8 md:px-10 md:py-10">
          <div className="text-center mb-8">
            <Image
              src="/asme_logo_blanco.png"
              alt="ASME ITBA"
              width={110}
              height={110}
              className="mx-auto mb-3"
              priority
            />
            <h1 className="text-3xl font-serif italic text-[#e8e8e8]">Recuperar contrasena</h1>
            <p className="text-[#a0a0a0] text-sm md:text-base mt-2">Ingresa tu correo y te vamos a enviar un codigo para recuperar el acceso.</p>
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
                className="w-full h-12 bg-white text-gray-800 border-2 border-[#c9a227] rounded-lg placeholder:text-gray-500 focus:border-[#d4a726] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Correo electronico"
              />
            </div>

            {successMessage ? (
              <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                {successMessage}
              </p>
            ) : null}

            {developmentCode ? (
              <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-3 text-sm text-sky-100">
                <p className="font-medium">Codigo de desarrollo</p>
                <p className="mt-2 break-all font-mono text-xs">{developmentCode}</p>
                <Link
                  href={`/restablecer-contrasena?codigo=${encodeURIComponent(developmentCode)}`}
                  className="mt-3 inline-flex text-[#e3a72f] hover:text-[#d4961a] transition-colors"
                >
                  Usar este codigo ahora
                </Link>
              </div>
            ) : null}

            {errorMessage ? (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !isClientReady}
              className="w-full h-12 bg-[#c9a227] hover:bg-[#b8931f] text-[#0f172a] rounded-lg font-medium text-lg transition-colors disabled:opacity-70"
            >
              {isLoading ? "Enviando codigo..." : "Enviar codigo"}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-[#a0a0a0]">
            <p>
              Ya tenes el codigo?{" "}
              <Link href="/restablecer-contrasena" className="text-[#e3a72f] hover:text-[#d4961a] transition-colors">
                Restablece tu contrasena
              </Link>
            </p>
            <p>
              <Link href="/login" className="text-[#e3a72f] hover:text-[#d4961a] transition-colors">
                Volver a login
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
