"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import LearningShell from "@/components/learning/LearningShell"
import { clearAuthToken, getAuthToken, getAuthTokenPayload, isAdminAuthPayload } from "@/lib/auth-token"
import {
  campusAccentBadgeClassName,
  campusCardClassName,
  campusPanelClassName,
  campusPrimaryButtonClassName,
} from "@/lib/campus-theme"
import { toSlug } from "@/lib/slug"
import { getSafeImageSrc } from "@/lib/safe-url"
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

const panelClassName = campusPanelClassName

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

      if (isAdminAuthPayload(getAuthTokenPayload())) {
        router.replace("/admin")
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
    <LearningShell
      title="Mis cursos"
      breadcrumbs={[{ label: "Campus", href: "/cursos" }, { label: "Mis cursos" }]}
    >
      {errorMessage ? (
        <div className="campus-feedback-panel rounded-2xl px-5 py-4 text-sm">{errorMessage}</div>
      ) : null}

      {isLoading ? (
        <div className={`${panelClassName} px-6 py-16 text-center text-[var(--campus-text-muted)]`}>Cargando tus cursos...</div>
      ) : courses.length === 0 ? (
        <div className={`${panelClassName} px-6 py-16 text-center`}>
          <p className="text-lg font-medium text-[var(--campus-text)]">Todavia no estas inscripto en ningun curso.</p>
          <p className="mt-3 text-sm text-[var(--campus-text-muted)]">Sumate desde el catalogo para empezar a construir tu recorrido.</p>
          <Link
            href="/cursos"
            className={`${campusPrimaryButtonClassName} mt-6 px-6 py-3`}
          >
            Ir al catalogo
          </Link>
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const courseHref = `/cursos/${course.cursoId}/${toSlug(course.nombre)}`
            const totalCourseClasses = course.clases?.length ?? 0
            const courseImage = getSafeImageSrc(course.imagenUrl)

            return (
              <article key={course.cursoId} className={`${campusCardClassName} overflow-hidden p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--campus-text)] break-words [overflow-wrap:anywhere]">{course.nombre}</h2>
                  </div>
                  <span className={`${campusAccentBadgeClassName} shrink-0`}>
                    {formatEstado(course.inscripcion.estado)}
                  </span>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-[var(--campus-border)] bg-[var(--campus-surface-soft)]">
                  {courseImage ? (
                    <img src={courseImage} alt={`Imagen de ${course.nombre}`} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-sm text-[var(--campus-text-muted)]">Imagen no disponible</div>
                  )}
                </div>

                <p className="mt-4 min-h-20 text-sm leading-7 text-[var(--campus-text-muted)] break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                  {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--campus-text-muted)]">
                  <span>{totalCourseClasses} clases</span>
                  <span className={`${campusAccentBadgeClassName} normal-case tracking-[0.02em]`}>
                    {formatEstado(course.inscripcion.estado)}
                  </span>
                </div>

                <div className="mt-5">
                  <Link
                    href={courseHref}
                    className={`${campusPrimaryButtonClassName} w-full px-4 py-3`}
                  >
                    Continuar curso
                  </Link>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </LearningShell>
  )
}
