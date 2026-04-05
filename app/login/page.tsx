"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

import LoginHeader from "@/components/LoginHeader"
import { Input } from "@/components/ui/input"
import { getAuthToken, setAuthToken } from "@/lib/auth-token"
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
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const token = getAuthToken()
    if (token) router.replace("/cursos")
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
            <p className="text-[#a0a0a0] text-sm md:text-base mt-2">Inicia sesion para acceder a tus cursos</p>
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
                className="w-full h-12 bg-white text-gray-800 border-2 border-[#c9a227] rounded-lg placeholder:text-gray-500 focus:border-[#d4a726] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Correo electronico"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Contrasena
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full h-12 bg-white text-gray-800 border-2 border-[#c9a227] rounded-lg placeholder:text-gray-500 focus:border-[#d4a726] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Contrasena"
              />
            </div>

            {errorMessage ? (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#c9a227] hover:bg-[#b8931f] text-[#0f172a] rounded-lg font-medium text-lg transition-colors disabled:opacity-70"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
