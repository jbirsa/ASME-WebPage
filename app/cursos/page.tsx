"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { X } from "lucide-react"

import LearningShell from "@/components/learning/LearningShell"
import { clearAuthToken, getAuthToken, getAuthTokenPayload, isAdminAuthPayload } from "@/lib/auth-token"
import {
  campusAccentBadgeClassName,
  campusAccentButtonClassName,
  campusCardClassName,
  campusOutlineButtonClassName,
  campusPanelClassName,
  campusPrimaryButtonClassName,
} from "@/lib/campus-theme"
import { getSafeImageSrc } from "@/lib/safe-url"
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

const panelClassName = campusPanelClassName

export default function CursosPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Curso[]>([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([])
  const [isAdminView, setIsAdminView] = useState(false)
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

      const isAdmin = isAdminAuthPayload(getAuthTokenPayload())
      setIsAdminView(isAdmin)

      try {
        setErrorMessage("")

        const coursesResponse = await fetch("/api/cursos", {
          method: "GET",
          headers: getAuthHeaders(token),
          cache: "no-store",
        })

        if (coursesResponse.status === 401) {
          clearAuthToken()
          router.replace("/login")
          return
        }

        const coursesPayload = (await coursesResponse.json().catch(() => null)) as unknown

        if (!coursesResponse.ok || !Array.isArray(coursesPayload)) {
          throw new Error(extractErrorMessage(coursesPayload, "No se pudo cargar el catalogo de cursos"))
        }

        setCourses(coursesPayload as Curso[])

        if (!isAdmin) {
          const myCoursesResponse = await fetch("/api/cursos/mis-cursos", {
            method: "GET",
            headers: getAuthHeaders(token),
            cache: "no-store",
          })

          if (myCoursesResponse.status === 401) {
            clearAuthToken()
            router.replace("/login")
            return
          }

          const myCoursesPayload = (await myCoursesResponse.json().catch(() => [])) as unknown

          if (myCoursesResponse.ok && Array.isArray(myCoursesPayload)) {
            const myCourses = myCoursesPayload as MiCurso[]
            setEnrolledCourseIds(myCourses.map((course) => course.cursoId))
          }
        } else {
          setEnrolledCourseIds([])
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
    >
      {errorMessage ? (
        <div className="campus-feedback-panel rounded-2xl px-5 py-4 text-sm">{errorMessage}</div>
      ) : null}

      {isLoading ? (
        <div className={`${panelClassName} px-6 py-16 text-center text-[var(--campus-text-muted)]`}>Cargando catalogo...</div>
      ) : courses.length === 0 ? (
        <div className={`${panelClassName} px-6 py-16 text-center`}>
          <p className="text-lg font-medium text-[var(--campus-text)]">Todavia no hay cursos disponibles.</p>
          <p className="mt-3 text-sm text-[var(--campus-text-muted)]">Cuando haya nuevas propuestas cargadas, van a aparecer aca.</p>
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolledSet.has(course.cursoId)
            const isSubmitting = enrollingCourseId === course.cursoId
            const courseImage = getSafeImageSrc(course.imagenUrl)

            return (
              <article key={course.cursoId} className={`${campusCardClassName} overflow-hidden p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-[var(--campus-text)] break-words [overflow-wrap:anywhere]">{course.nombre}</h2>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-[var(--campus-border)] bg-[var(--campus-surface-soft)]">
                  {courseImage ? (
                    <img src={courseImage} alt={`Imagen de ${course.nombre}`} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-sm text-[var(--campus-text-muted)]">Imagen no disponible</div>
                  )}
                </div>

                <p className="mt-4 min-h-20 text-sm leading-7 text-[var(--campus-text-muted)] break-words [overflow-wrap:anywhere]">
                  {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--campus-text-muted)]">
                  <span>{course.clases?.length ?? 0} clases</span>
                  <span className={campusAccentBadgeClassName}>
                    {isAdminView ? "Vista admin" : isEnrolled ? "Inscripto" : "Disponible"}
                  </span>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className={`${campusOutlineButtonClassName} px-4 py-3 ${
                      isAdminView ? "w-full" : "flex-1"
                    }`}
                  >
                    Ver detalles
                  </button>
                  {!isAdminView ? (
                    <button
                      onClick={() => handleEnroll(course.cursoId)}
                      disabled={isEnrolled || isSubmitting}
                      className={`${isEnrolled ? campusAccentButtonClassName : campusPrimaryButtonClassName} flex-1 px-4 py-3`}
                    >
                      {isEnrolled ? "Ya inscripto" : isSubmitting ? "Inscribiendo..." : "Inscribirme"}
                    </button>
                  ) : null}
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
            className="absolute inset-0 bg-[rgba(23,32,51,0.18)] backdrop-blur-sm"
            onClick={() => setSelectedCourse(null)}
          />

          <div className="relative w-full max-w-2xl rounded-[28px] border border-[var(--campus-border)] bg-[var(--campus-surface)] p-6 shadow-[0_24px_80px_rgba(121,142,161,0.16)] md:p-8">
            <button
              type="button"
              onClick={() => setSelectedCourse(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--campus-border)] bg-[var(--campus-surface)] text-[var(--campus-primary-deep)] transition-colors hover:bg-[var(--campus-primary-soft)]"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mt-3 pr-12 text-3xl font-semibold text-[var(--campus-text)] break-words [overflow-wrap:anywhere]">{selectedCourse.nombre}</h2>
            <p className="mt-5 text-sm leading-7 text-[var(--campus-text-muted)] whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
              {selectedCourse.descripcion || "Este curso todavia no tiene descripcion cargada."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--campus-text-muted)]">
              <span>{selectedCourse.clases?.length ?? 0} clases</span>
            </div>
          </div>
        </div>
      ) : null}
    </LearningShell>
  )
}
