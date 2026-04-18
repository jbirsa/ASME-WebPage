"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import LearningShell from "@/components/learning/LearningShell"
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

const panelClassName = "rounded-2xl border border-white/10 bg-[#0d1726]"

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
      <article key={classItem.claseId} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Clase {index + 1}
          </span>
          <h2 className="text-lg font-semibold text-white break-words [overflow-wrap:anywhere]">{classItem.titulo}</h2>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-300 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
          {classItem.descripcion || "Esta clase todavia no tiene descripcion cargada."}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Orden {classItem.orden ?? index + 1}</span>

          {classItem.videoUrl ? (
            <a
              href={normalizeUrl(classItem.videoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-2xl border border-[#e3a72f]/25 bg-[#e3a72f]/10 px-4 py-2 text-sm font-medium text-[#f3d48a] transition-colors hover:bg-[#e3a72f]/15"
            >
              Ver clase
            </a>
          ) : (
            <span className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-500">
              URL pendiente
            </span>
          )}
        </div>
      </article>
    )
  }

  const courseTitle = course?.nombre || "Detalle del curso"
  const pageActions = course ? (
    isEnrolled ? (
      <Link
        href="/mis-cursos"
        className="inline-flex items-center justify-center rounded-2xl border border-[#e3a72f]/25 bg-[#e3a72f]/10 px-5 py-2.5 text-sm font-medium text-[#f3d48a] transition-colors hover:bg-[#e3a72f]/15"
      >
        Ver en mis cursos
      </Link>
    ) : (
      <button
        onClick={handleEnroll}
        disabled={isEnrolling}
        className="inline-flex items-center justify-center rounded-2xl bg-[#e3a72f] px-5 py-2.5 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isEnrolling ? "Inscribiendo..." : "Inscribirme"}
      </button>
    )
  ) : null

  return (
    <LearningShell
      title={courseTitle}
      breadcrumbs={[
        { label: "Campus", href: "/cursos" },
        { label: "Catalogo", href: "/cursos" },
        { label: courseTitle },
      ]}
      actions={pageActions}
    >
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">{errorMessage}</div>
      ) : null}

      {isLoading ? (
        <div className={`${panelClassName} px-6 py-16 text-center text-slate-400`}>Cargando curso...</div>
      ) : !course ? (
        <div className={`${panelClassName} px-6 py-16 text-center`}>
          <p className="text-lg font-medium text-white">No se encontro el curso.</p>
          <p className="mt-3 text-sm text-slate-400">Volve al catalogo para continuar navegando el portal.</p>
          <Link
            href="/cursos"
            className="mt-6 inline-flex rounded-2xl bg-[#e3a72f] px-6 py-3 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a]"
          >
            Volver al catalogo
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <section className={`${panelClassName} overflow-hidden`}>
            {course.imagenUrl ? (
              <div className="overflow-hidden bg-[#13233a]">
                <img src={course.imagenUrl} alt={`Imagen de ${course.nombre}`} className="h-64 w-full object-cover" />
              </div>
            ) : null}

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Curso #{course.cursoId}</span>
                <span>{course.estado || "activo"}</span>
                <span>{isEnrolled ? "Inscripto" : "Disponible"}</span>
                <span>{sortedClasses.length} clases</span>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-300 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
              </p>
            </div>
          </section>

          <section className={`${panelClassName} p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <h2 className="text-xl font-semibold text-white">Clases del curso</h2>
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{sortedClasses.length} clases</span>
            </div>

            <div className="mt-6 space-y-4">
              {!isEnrolled ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-10 text-center text-slate-400">
                  Inscribite para desbloquear las clases de este curso.
                </div>
              ) : sortedClasses.length > 0 ? (
                sortedClasses.map((classItem, index) => renderClassItem(classItem, index))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-10 text-center text-slate-400">
                  Este curso aun no tiene clases publicadas.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </LearningShell>
  )
}
