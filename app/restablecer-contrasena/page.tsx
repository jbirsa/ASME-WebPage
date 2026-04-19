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

  return "No se pudo restablecer la contrasena"
}

function isRejectedReset(payload: unknown) {
  if (typeof payload !== "object" || payload === null) return false

  const maybePayload = payload as { ok?: boolean }
  return maybePayload.ok === false
}

export default function RestablecerContrasenaPage() {
  const router = useRouter()
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
    if (prefilledCode) setCodigo(prefilledCode)
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contrasenas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: codigo, newPassword }),
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
        setErrorMessage("No se pudo restablecer la contrasena")
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
            <h1 className="text-3xl font-serif italic text-[#e8e8e8]">Nueva contrasena</h1>
            <p className="text-[#a0a0a0] text-sm md:text-base mt-2">Ingresa el codigo recibido y define una nueva contrasena.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="codigo" className="sr-only">
                Codigo
              </label>
              <Input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value)}
                required
                autoComplete="one-time-code"
                className="w-full h-12 bg-white text-gray-800 border-2 border-[#c9a227] rounded-lg placeholder:text-gray-500 focus:border-[#d4a726] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Codigo recibido"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="sr-only">
                Nueva contrasena
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full h-12 bg-white text-gray-800 border-2 border-[#c9a227] rounded-lg placeholder:text-gray-500 focus:border-[#d4a726] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Nueva contrasena"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar nueva contrasena
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full h-12 bg-white text-gray-800 border-2 border-[#c9a227] rounded-lg placeholder:text-gray-500 focus:border-[#d4a726] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Confirmar nueva contrasena"
              />
            </div>

            {errorMessage ? (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !isClientReady}
              className="w-full h-12 bg-[#c9a227] hover:bg-[#b8931f] text-[#0f172a] rounded-lg font-medium text-lg transition-colors disabled:opacity-70"
            >
              {isLoading ? "Guardando..." : "Actualizar contrasena"}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-[#a0a0a0]">
            <p>
              Necesitas un codigo?{" "}
              <Link href="/olvide-mi-contrasena" className="text-[#e3a72f] hover:text-[#d4961a] transition-colors">
                Solicitalo aca
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
