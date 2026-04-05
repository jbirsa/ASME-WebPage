"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import Navbar from "@/components/Navbar"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import { toSlug } from "@/lib/slug"
import type { MiCurso } from "@/types/learning"

function extractErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "object" && payload !== null) {
    const maybePayload = payload as { message?: string | string[] }
    if (Array.isArray(maybePayload.message)) return maybePayload.message.join(", ")
    if (typeof maybePayload.message === "string") return maybePayload.message
  }

  return fallback
}

function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

function formatEstado(estado: string) {
  return estado.replace(/_/g, " ")
}

export default function MisCursosPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<MiCurso[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadMyCourses = async () => {
      const token = getAuthToken()
      if (!token) {
        router.replace("/login")
        return
      }

      try {
        setErrorMessage("")

        const response = await fetch("/api/cursos/mis-cursos", {
          method: "GET",
          headers: getAuthHeaders(token),
          cache: "no-store",
        })

        const payload = (await response.json().catch(() => null)) as unknown

        if (response.status === 401) {
          clearAuthToken()
          router.replace("/login")
          return
        }

        if (!response.ok || !Array.isArray(payload)) {
          throw new Error(extractErrorMessage(payload, "No se pudo cargar tus cursos"))
        }

        setCourses(payload as MiCurso[])
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage("No se pudo cargar tus cursos")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadMyCourses()
  }, [router])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a2744_0%,#0f172a_70%)]" />
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-14">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif italic text-[#e8e8e8] mb-4">Mis cursos</h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Continua tu recorrido con tus clases disponibles y materiales de cada curso.
          </p>
          <Link
            href="/cursos"
            className="inline-flex mt-6 border-2 border-[#c9a227] rounded-lg text-[#e8e8e8] px-6 py-2 text-sm font-medium hover:bg-[#c9a227]/10 transition-colors"
          >
            Ir al catalogo
          </Link>
        </div>

        {errorMessage ? (
          <div className="mb-6 text-sm text-rose-300 border border-rose-500/40 bg-rose-500/10 rounded-xl px-4 py-3 max-w-2xl mx-auto text-center">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-[#a0a0a0] text-center">Cargando tus cursos...</p>
        ) : courses.length === 0 ? (
          <div className="text-center">
            <p className="text-[#a0a0a0] mb-6">Todavia no estas inscripto en ningun curso.</p>
            <Link
              href="/cursos"
              className="inline-block bg-[#c9a227] text-[#0f172a] rounded-lg px-8 py-3 font-medium hover:bg-[#b8931f] transition-colors"
            >
              Ir al catalogo
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const courseHref = `/cursos/${course.cursoId}/${toSlug(course.nombre)}`
              const totalClasses = course.clases?.length ?? 0
              const completedClasses = 0
              const progressPercentage = totalClasses > 0 ? (completedClasses / totalClasses) * 100 : 0

              return (
                <article
                  key={course.cursoId}
                  className="border-2 border-[#c9a227] rounded-2xl bg-[#0f172a]/80 backdrop-blur-sm overflow-hidden"
                >
                  <div className="p-4 pb-2 flex items-start justify-between gap-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#e8e8e8] break-words [overflow-wrap:anywhere] flex-1">
                      {course.nombre}
                    </h2>
                    <span className="text-[11px] uppercase tracking-wide border border-[#c9a227]/70 text-[#c9a227] rounded-full px-2 py-1 shrink-0">
                      {formatEstado(course.inscripcion.estado)}
                    </span>
                  </div>

                  <div className="px-4">
                    <div className="border-2 border-[#c9a227] rounded-xl overflow-hidden bg-[#1a2744]">
                      {course.imagenUrl ? (
                        <img
                          src={course.imagenUrl}
                          alt={`Imagen de ${course.nombre}`}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="h-40 flex items-center justify-center text-[#a0a0a0] text-sm">
                          Imagen no disponible
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pt-4">
                    <p className="text-[#c8ced8] text-sm min-h-16 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                      {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
                    </p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-[#8f9aad]">
                        <span>Completado</span>
                        <span>
                          {completedClasses}/{totalClasses} clases
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#1a2744] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#5f87ab] transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-[#8f9aad]">
                      <span>{totalClasses} clases</span>
                      <span>Inscripto</span>
                    </div>
                  </div>

                  <div className="p-4 pt-5">
                    <Link
                      href={courseHref}
                      className="w-full inline-flex justify-center bg-[#c9a227] text-[#0f172a] rounded-lg py-2.5 text-sm font-medium hover:bg-[#b8931f] transition-colors"
                    >
                      Continuar
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
