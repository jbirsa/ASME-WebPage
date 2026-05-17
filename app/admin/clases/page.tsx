"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import AdminShell from "@/components/admin/AdminShell"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import {
  campusAccentBadgeClassName,
  campusCardClassName,
  campusManagementButtonClassName,
  campusOutlineButtonClassName,
  campusPanelClassName,
} from "@/lib/campus-theme"
import type { Curso } from "@/types/learning"

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

export default function AdminClasesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Curso[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const sortedCourses = useMemo(() => [...courses].sort((a, b) => a.nombre.localeCompare(b.nombre)), [courses])

  useEffect(() => {
    const loadCourses = async () => {
      const token = getAuthToken()
      if (!token) {
        router.replace("/login")
        return
      }

      try {
        setErrorMessage("")

        const response = await fetch("/api/cursos", {
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

        if (response.status === 403) {
          router.replace("/cursos")
          return
        }

        if (!response.ok || !Array.isArray(payload)) {
          throw new Error(extractErrorMessage(payload, "No se pudo cargar los cursos"))
        }

        setCourses(payload as Curso[])
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage("No se pudo cargar los cursos")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [router])

  return (
    <AdminShell
      title="Admin de clases"
      breadcrumbs={[
        { label: "Campus", href: "/cursos" },
        { label: "Admin", href: "/admin" },
        { label: "Clases" },
      ]}
      actions={
        <Link
          href="/admin"
          className={`${campusOutlineButtonClassName} px-5 py-2.5`}
        >
          Volver al panel
        </Link>
      }
    >
      {errorMessage ? <div className="campus-feedback-panel rounded-2xl px-5 py-4 text-sm">{errorMessage}</div> : null}

      <section className={`${campusPanelClassName} p-6`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--campus-text)]">Elegi un curso</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--campus-text-muted)]">La gestion de clases se resuelve por curso para mantener el orden y el contexto.</p>
          </div>
          <span className="text-sm text-[var(--campus-text-muted)]">{sortedCourses.length} cursos</span>
        </div>

        {isLoading ? (
          <div className="mt-6 text-sm text-[var(--campus-text-muted)]">Cargando cursos...</div>
        ) : sortedCourses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[var(--campus-border)] bg-[var(--campus-surface-soft)] px-5 py-12 text-center text-[var(--campus-text-muted)]">
            Crea un curso primero para poder administrar sus clases.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {sortedCourses.map((course) => (
              <article key={course.cursoId} className={`${campusCardClassName} p-5`}>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--campus-text-muted)]">Curso #{course.cursoId}</p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--campus-text)] break-words [overflow-wrap:anywhere]">{course.nombre}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--campus-text-muted)]">{course.descripcion || "Sin descripcion cargada."}</p>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--campus-text-muted)]">
                  <span>{course.clases?.length ?? 0} clases</span>
                    <span className={`${campusAccentBadgeClassName} normal-case tracking-[0.02em]`}>{course.estado || "activo"}</span>
                  </div>
                  <div className="mt-5">
                    <Link
                      href={`/admin/cursos/${course.cursoId}/clases`}
                      aria-label={`Gestionar clases de ${course.nombre}`}
                      className={`${campusManagementButtonClassName} px-4 py-2`}
                    >
                      Gestionar clases
                    </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  )
}
