"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { X } from "lucide-react"

import Navbar from "@/components/Navbar"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import type { Curso, MiCurso } from "@/types/learning"

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

export default function CursosPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Curso[]>([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null)

  const enrolledSet = useMemo(() => new Set(enrolledCourseIds), [enrolledCourseIds])

  useEffect(() => {
    const loadCourses = async () => {
      const token = getAuthToken()
      if (!token) {
        router.replace("/login")
        return
      }

      try {
        setErrorMessage("")

        const [coursesResponse, myCoursesResponse] = await Promise.all([
          fetch("/api/cursos", {
            method: "GET",
            headers: getAuthHeaders(token),
            cache: "no-store",
          }),
          fetch("/api/cursos/mis-cursos", {
            method: "GET",
            headers: getAuthHeaders(token),
            cache: "no-store",
          }),
        ])

        if (coursesResponse.status === 401 || myCoursesResponse.status === 401) {
          clearAuthToken()
          router.replace("/login")
          return
        }

        const coursesPayload = (await coursesResponse.json().catch(() => null)) as unknown
        const myCoursesPayload = (await myCoursesResponse.json().catch(() => [])) as unknown

        if (!coursesResponse.ok || !Array.isArray(coursesPayload)) {
          throw new Error(extractErrorMessage(coursesPayload, "No se pudo cargar el catalogo de cursos"))
        }

        setCourses(coursesPayload as Curso[])

        if (myCoursesResponse.ok && Array.isArray(myCoursesPayload)) {
          const myCourses = myCoursesPayload as MiCurso[]
          setEnrolledCourseIds(myCourses.map((course) => course.cursoId))
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage("No se pudo cargar el catalogo de cursos")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [router])

  const handleEnroll = async (cursoId: number) => {
    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    setEnrollingCourseId(cursoId)

    try {
      const response = await fetch(`/api/cursos/${cursoId}/inscribirme`, {
        method: "POST",
        headers: getAuthHeaders(token),
      })

      const payload = (await response.json().catch(() => null)) as unknown

      if (response.status === 401) {
        clearAuthToken()
        router.replace("/login")
        return
      }

      if (!response.ok) {
        throw new Error(extractErrorMessage(payload, "No se pudo completar la inscripcion"))
      }

      setEnrolledCourseIds((current) => (current.includes(cursoId) ? current : [...current, cursoId]))
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo completar la inscripcion")
      }
    } finally {
      setEnrollingCourseId(null)
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

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-14">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif italic text-[#e8e8e8] mb-4">Catalogo de cursos</h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Explora nuestras propuestas de formacion y sumate a la experiencia ASME.
          </p>
          <Link
            href="/mis-cursos"
            className="inline-flex mt-6 border-2 border-[#c9a227] rounded-lg text-[#e8e8e8] px-6 py-2 text-sm font-medium hover:bg-[#c9a227]/10 transition-colors"
          >
            Ver mis cursos
          </Link>
        </div>

        {errorMessage ? (
          <div className="mb-6 text-sm text-rose-300 border border-rose-500/40 bg-rose-500/10 rounded-xl px-4 py-3 max-w-2xl mx-auto text-center">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-[#a0a0a0] text-center">Cargando cursos...</p>
        ) : courses.length === 0 ? (
          <p className="text-[#a0a0a0] text-center">Todavia no hay cursos disponibles.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isEnrolled = enrolledSet.has(course.cursoId)
              const isSubmitting = enrollingCourseId === course.cursoId

              return (
                <article
                  key={course.cursoId}
                  className="border-2 border-[#c9a227] rounded-2xl bg-[#0f172a]/80 backdrop-blur-sm overflow-hidden"
                >
                  <div className="p-4 pb-2">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#e8e8e8] break-words [overflow-wrap:anywhere]">
                      {course.nombre}
                    </h2>
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
                    <p className="text-[#c8ced8] text-sm min-h-16 break-words [overflow-wrap:anywhere]">
                      {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-[#8f9aad]">
                      <span>{course.clases?.length ?? 0} clases</span>
                      <span>{course.estado || "activo"}</span>
                    </div>
                  </div>

                  <div className="p-4 pt-5 flex gap-3">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 border-2 border-[#c9a227] rounded-lg text-[#e8e8e8] py-2.5 text-center text-sm font-medium hover:bg-[#c9a227]/10 transition-colors"
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => handleEnroll(course.cursoId)}
                      disabled={isEnrolled || isSubmitting}
                      className="flex-1 bg-[#c9a227] text-[#0f172a] rounded-lg py-2.5 text-sm font-medium hover:bg-[#b8931f] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isEnrolled ? "Ya inscripto" : isSubmitting ? "Inscribiendo..." : "Inscribirme"}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      {selectedCourse ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Cerrar modal"
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedCourse(null)}
          />

          <div className="relative w-full max-w-xl border-2 border-[#c9a227] rounded-2xl bg-[#0f172a] p-6 md:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedCourse(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 p-2 text-[#e8e8e8] hover:text-[#c9a227] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl md:text-3xl font-serif italic text-[#e8e8e8] pr-10 break-words [overflow-wrap:anywhere]">
              {selectedCourse.nombre}
            </h2>
            <p className="mt-5 text-[#c8ced8] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
              {selectedCourse.descripcion || "Este curso todavia no tiene descripcion cargada."}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
