"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { X } from "lucide-react"

import LearningShell from "@/components/learning/LearningShell"
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

const panelClassName = "rounded-2xl border border-white/10 bg-[#0d1726]"

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
    <LearningShell
      title="Catalogo"
      breadcrumbs={[{ label: "Campus", href: "/cursos" }, { label: "Catalogo" }]}
      actions={
        <Link
          href="/mis-cursos"
          className="inline-flex items-center justify-center rounded-2xl border border-[#e3a72f]/25 bg-[#e3a72f]/10 px-5 py-2.5 text-sm font-medium text-[#f3d48a] transition-colors hover:bg-[#e3a72f]/15"
        >
          Ver mis cursos
        </Link>
      }
    >
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">{errorMessage}</div>
      ) : null}

      {isLoading ? (
        <div className={`${panelClassName} px-6 py-16 text-center text-slate-400`}>Cargando catalogo...</div>
      ) : courses.length === 0 ? (
        <div className={`${panelClassName} px-6 py-16 text-center`}>
          <p className="text-lg font-medium text-white">Todavia no hay cursos disponibles.</p>
          <p className="mt-3 text-sm text-slate-400">Cuando haya nuevas propuestas cargadas, van a aparecer aca.</p>
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolledSet.has(course.cursoId)
            const isSubmitting = enrollingCourseId === course.cursoId

            return (
              <article key={course.cursoId} className={`${panelClassName} overflow-hidden p-4 transition-colors hover:border-white/20`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Curso #{course.cursoId}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white break-words [overflow-wrap:anywhere]">{course.nombre}</h2>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {course.estado || "activo"}
                  </span>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl bg-[#13233a]">
                  {course.imagenUrl ? (
                    <img src={course.imagenUrl} alt={`Imagen de ${course.nombre}`} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-sm text-slate-400">Imagen no disponible</div>
                  )}
                </div>

                <p className="mt-4 min-h-20 text-sm leading-7 text-slate-300 break-words [overflow-wrap:anywhere]">
                  {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{course.clases?.length ?? 0} clases</span>
                  <span>{isEnrolled ? "Inscripto" : "Disponible"}</span>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.04]"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleEnroll(course.cursoId)}
                    disabled={isEnrolled || isSubmitting}
                    className="flex-1 rounded-2xl bg-[#e3a72f] px-4 py-3 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isEnrolled ? "Ya inscripto" : isSubmitting ? "Inscribiendo..." : "Inscribirme"}
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}

      {selectedCourse ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Cerrar modal"
            className="absolute inset-0 bg-[#02060b]/75 backdrop-blur-sm"
            onClick={() => setSelectedCourse(null)}
          />

          <div className="relative w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#08111b] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] md:p-8">
            <button
              type="button"
              onClick={() => setSelectedCourse(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-100 transition-colors hover:bg-white/[0.08]"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Curso #{selectedCourse.cursoId}</p>
            <h2 className="mt-3 pr-12 text-3xl font-semibold text-white break-words [overflow-wrap:anywhere]">{selectedCourse.nombre}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-300 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
              {selectedCourse.descripcion || "Este curso todavia no tiene descripcion cargada."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
              <span>{selectedCourse.estado || "activo"}</span>
              <span>{selectedCourse.clases?.length ?? 0} clases</span>
            </div>
          </div>
        </div>
      ) : null}
    </LearningShell>
  )
}
