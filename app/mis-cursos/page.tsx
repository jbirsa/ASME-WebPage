"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import LearningShell from "@/components/learning/LearningShell"
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

const panelClassName = "rounded-2xl border border-white/10 bg-[#0d1726]"

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
    <LearningShell
      title="Mis cursos"
      breadcrumbs={[{ label: "Campus", href: "/cursos" }, { label: "Mis cursos" }]}
      actions={
        <Link
          href="/cursos"
          className="inline-flex items-center justify-center rounded-2xl border border-[#e3a72f]/25 bg-[#e3a72f]/10 px-5 py-2.5 text-sm font-medium text-[#f3d48a] transition-colors hover:bg-[#e3a72f]/15"
        >
          Explorar catalogo
        </Link>
      }
    >
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">{errorMessage}</div>
      ) : null}

      {isLoading ? (
        <div className={`${panelClassName} px-6 py-16 text-center text-slate-400`}>Cargando tus cursos...</div>
      ) : courses.length === 0 ? (
        <div className={`${panelClassName} px-6 py-16 text-center`}>
          <p className="text-lg font-medium text-white">Todavia no estas inscripto en ningun curso.</p>
          <p className="mt-3 text-sm text-slate-400">Sumate desde el catalogo para empezar a construir tu recorrido.</p>
          <Link
            href="/cursos"
            className="mt-6 inline-flex rounded-2xl bg-[#e3a72f] px-6 py-3 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a]"
          >
            Ir al catalogo
          </Link>
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const courseHref = `/cursos/${course.cursoId}/${toSlug(course.nombre)}`
            const totalCourseClasses = course.clases?.length ?? 0

            return (
              <article key={course.cursoId} className={`${panelClassName} overflow-hidden p-4 transition-colors hover:border-white/20`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Curso #{course.cursoId}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white break-words [overflow-wrap:anywhere]">{course.nombre}</h2>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#5f87ab]/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                    {formatEstado(course.inscripcion.estado)}
                  </span>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl bg-[#13233a]">
                  {course.imagenUrl ? (
                    <img src={course.imagenUrl} alt={`Imagen de ${course.nombre}`} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-sm text-slate-400">Imagen no disponible</div>
                  )}
                </div>

                <p className="mt-4 min-h-20 text-sm leading-7 text-slate-300 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                  {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{totalCourseClasses} clases</span>
                  <span>{formatEstado(course.inscripcion.estado)}</span>
                </div>

                <div className="mt-5">
                  <Link
                    href={courseHref}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-[#e3a72f] px-4 py-3 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a]"
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
