"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import Navbar from "@/components/Navbar"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import { toSlug } from "@/lib/slug"
import type { Clase, Curso, MiCurso } from "@/types/learning"

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

function normalizeUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

export default function CursoDetallePage() {
  const router = useRouter()
  const params = useParams<{ cursoId: string; slug: string }>()
  const [course, setCourse] = useState<Curso | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [isEnrolling, setIsEnrolling] = useState(false)

  const courseId = Number(params.cursoId)

  useEffect(() => {
    const loadCourseDetail = async () => {
      const token = getAuthToken()
      if (!token) {
        router.replace("/login")
        return
      }

      if (!Number.isFinite(courseId)) {
        setErrorMessage("Curso invalido")
        setIsLoading(false)
        return
      }

      try {
        setErrorMessage("")

        const [courseResponse, myCoursesResponse] = await Promise.all([
          fetch(`/api/cursos/${courseId}`, {
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

        if (courseResponse.status === 401 || myCoursesResponse.status === 401) {
          clearAuthToken()
          router.replace("/login")
          return
        }

        const coursePayload = (await courseResponse.json().catch(() => null)) as unknown
        const myCoursesPayload = (await myCoursesResponse.json().catch(() => [])) as unknown

        if (!courseResponse.ok || Array.isArray(coursePayload) || !coursePayload) {
          throw new Error(extractErrorMessage(coursePayload, "No se pudo cargar el curso"))
        }

        const currentCourse = coursePayload as Curso
        const canonicalSlug = toSlug(currentCourse.nombre)
        if (params.slug !== canonicalSlug) {
          router.replace(`/cursos/${courseId}/${canonicalSlug}`)
          return
        }

        setCourse(currentCourse)

        if (myCoursesResponse.ok && Array.isArray(myCoursesPayload)) {
          const myCourses = myCoursesPayload as MiCurso[]
          setIsEnrolled(myCourses.some((myCourse) => myCourse.cursoId === courseId))
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage("No se pudo cargar el curso")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCourseDetail()
  }, [router, courseId, params.slug])

  const sortedClasses = useMemo(() => {
    if (!course?.clases) return []
    return [...course.clases].sort((a, b) => {
      const orderA = a.orden ?? Number.MAX_SAFE_INTEGER
      const orderB = b.orden ?? Number.MAX_SAFE_INTEGER

      if (orderA !== orderB) return orderA - orderB
      return a.claseId - b.claseId
    })
  }, [course])

  const handleEnroll = async () => {
    const token = getAuthToken()
    if (!token || !course) {
      router.replace("/login")
      return
    }

    setIsEnrolling(true)

    try {
      const response = await fetch(`/api/cursos/${course.cursoId}/inscribirme`, {
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

      setIsEnrolled(true)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo completar la inscripcion")
      }
    } finally {
      setIsEnrolling(false)
    }
  }

  const renderClassItem = (classItem: Clase, index: number) => {
    return (
      <article
        key={classItem.claseId}
        className="border-2 border-[#c9a227] rounded-2xl bg-[#0f172a]/80 backdrop-blur-sm p-4 md:p-6 space-y-4"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-[#e8e8e8] break-words [overflow-wrap:anywhere]">
          Clase {index + 1}: {classItem.titulo}
        </h2>

        <p className="text-[#c8ced8] break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
          {classItem.descripcion || "Esta clase todavia no tiene descripcion cargada."}
        </p>

        {classItem.videoUrl ? (
          <a
            href={normalizeUrl(classItem.videoUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex border-2 border-[#c9a227] rounded-lg text-[#e8e8e8] px-4 py-2 text-sm font-medium hover:bg-[#c9a227]/10 transition-colors"
          >
            Ver clase
          </a>
        ) : (
          <span className="inline-flex border-2 border-[#505050] rounded-lg text-[#707070] px-4 py-2 text-sm font-medium cursor-not-allowed">
            URL pendiente
          </span>
        )}
      </article>
    )
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

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-14">
        <nav className="mb-8 text-sm text-[#a0a0a0] flex items-center gap-2">
          <Link href="/cursos" className="hover:text-[#c9a227] transition-colors">
            Cursos
          </Link>
          <span>/</span>
          <span className="text-[#c9a227]">{course?.nombre || "Detalle"}</span>
        </nav>

        {errorMessage ? (
          <div className="mb-6 text-sm text-rose-300 border border-rose-500/40 bg-rose-500/10 rounded-xl px-4 py-3">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-[#a0a0a0] text-center py-12">Cargando curso...</p>
        ) : !course ? (
          <div className="text-center py-12">
            <p className="text-[#a0a0a0] mb-6">No se encontro el curso.</p>
            <Link
              href="/cursos"
              className="inline-block bg-[#c9a227] text-[#0f172a] rounded-lg px-8 py-3 font-medium hover:bg-[#b8931f] transition-colors"
            >
              Volver al catalogo
            </Link>
          </div>
        ) : (
          <>
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-serif italic text-[#e8e8e8] break-words [overflow-wrap:anywhere]">
                {course.nombre}
              </h1>
              <p className="mt-4 text-[#c8ced8] leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {isEnrolled ? (
                  <Link
                    href="/mis-cursos"
                    className="inline-flex bg-[#c9a227] text-[#0f172a] rounded-lg px-6 py-2.5 font-medium hover:bg-[#b8931f] transition-colors"
                  >
                    Ver en mis cursos
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="inline-flex bg-[#c9a227] text-[#0f172a] rounded-lg px-6 py-2.5 font-medium hover:bg-[#b8931f] transition-colors disabled:opacity-70"
                  >
                    {isEnrolling ? "Inscribiendo..." : "Inscribirme"}
                  </button>
                )}
              </div>
            </header>

            {course.imagenUrl ? (
              <div className="mb-8 border-2 border-[#c9a227] rounded-2xl overflow-hidden bg-[#1a2744]">
                <img src={course.imagenUrl} alt={`Imagen de ${course.nombre}`} className="w-full h-72 object-cover" />
              </div>
            ) : null}

            <section className="space-y-4">
              {sortedClasses.length > 0 ? (
                sortedClasses.map((classItem, index) => renderClassItem(classItem, index))
              ) : (
                <div className="border-2 border-[#c9a227] rounded-2xl bg-[#0f172a]/80 backdrop-blur-sm p-8 text-center">
                  <p className="text-[#a0a0a0]">Este curso aun no tiene clases publicadas.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
