"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FileText, ImageIcon, PlayCircle } from "lucide-react"

import LearningShell from "@/components/learning/LearningShell"
import { clearAuthToken, getAuthToken, getAuthTokenPayload, isAdminAuthPayload } from "@/lib/auth-token"
import {
  campusAccentBadgeClassName,
  campusCardClassName,
  campusOutlineButtonClassName,
  campusPanelClassName,
  campusPrimaryButtonClassName,
} from "@/lib/campus-theme"
import { toSlug } from "@/lib/slug"
import { getSafeHttpUrl, getSafeImageSrc } from "@/lib/safe-url"
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

const panelClassName = campusPanelClassName

function formatFileSize(size?: number | null) {
  if (!size || size < 1) return null
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function formatClassCount(count: number) {
  return count === 1 ? "1 clase" : `${count} clases`
}

function formatAvailableClassCount(count: number) {
  return count === 1 ? "1 clase disponible" : `${count} clases disponibles`
}

function formatMaterialCount(count: number) {
  if (count < 1) return "Sin materiales"
  return count === 1 ? "1 material" : `${count} materiales`
}

function FileRow({
  fileName,
  fileUrl,
  fileSize,
  actionLabel = "Descargar",
}: {
  fileName: string
  fileUrl?: string | null
  fileSize?: number | null
  actionLabel?: string
}) {
  const fileSizeLabel = formatFileSize(fileSize)

  if (!fileUrl) {
    return (
      <div className="flex items-center gap-3 rounded-[18px] border border-[var(--campus-border-soft)] bg-[var(--campus-surface)] px-4 py-3 shadow-[0_8px_20px_rgba(121,142,161,0.06)]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--campus-divider)] bg-[var(--campus-surface-soft)] text-[var(--campus-text)]">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-medium text-[var(--campus-text)] [overflow-wrap:anywhere]">{fileName}</p>
          <p className="mt-1 text-xs text-[var(--campus-text-muted)]">{fileSizeLabel || "Tamaño no disponible"}</p>
        </div>
        <span className="inline-flex shrink-0 rounded-full border border-[var(--campus-divider)] bg-[var(--campus-surface-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">
          URL pendiente
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-[var(--campus-border-soft)] bg-[var(--campus-surface)] px-4 py-3 shadow-[0_8px_20px_rgba(121,142,161,0.06)] transition-colors hover:border-[var(--campus-secondary)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--campus-divider)] bg-[var(--campus-surface-soft)] text-[var(--campus-text)]">
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-medium text-[var(--campus-text)] [overflow-wrap:anywhere]">{fileName}</p>
        <p className="mt-1 text-xs text-[var(--campus-text-muted)]">{fileSizeLabel || "Tamaño no disponible"}</p>
      </div>
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={`${campusOutlineButtonClassName} shrink-0 px-4 py-2`}
      >
        {actionLabel}
      </a>
    </div>
  )
}

export default function CursoDetallePage() {
  const router = useRouter()
  const params = useParams<{ cursoId: string; slug: string }>()
  const [course, setCourse] = useState<Curso | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isAdminView, setIsAdminView] = useState(false)
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

      const isAdmin = isAdminAuthPayload(getAuthTokenPayload())
      setIsAdminView(isAdmin)

      if (!Number.isFinite(courseId)) {
        setErrorMessage("Curso invalido")
        setIsLoading(false)
        return
      }

      try {
        setErrorMessage("")

        const courseResponse = await fetch(`/api/cursos/${courseId}`, {
          method: "GET",
          headers: getAuthHeaders(token),
          cache: "no-store",
        })

        if (courseResponse.status === 401) {
          clearAuthToken()
          router.replace("/login")
          return
        }

        const coursePayload = (await courseResponse.json().catch(() => null)) as unknown

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
            setIsEnrolled(myCourses.some((myCourse) => myCourse.cursoId === courseId))
          }
        } else {
          setIsEnrolled(false)
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
    const videoHref = getSafeHttpUrl(classItem.videoUrl)
    const classFiles = classItem.archivos ?? []

    return (
      <article key={classItem.claseId} className={`${campusCardClassName} flex flex-col gap-5 p-5 md:p-6`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <span className={`${campusAccentBadgeClassName} self-start normal-case tracking-[0.03em]`}>
            Clase {index + 1}
          </span>
          <span className="inline-flex self-start rounded-full border border-[var(--campus-divider)] bg-[var(--campus-surface-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">
            {formatMaterialCount(classFiles.length)}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[var(--campus-text)] break-words [overflow-wrap:anywhere] md:text-xl">{classItem.titulo}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--campus-text-muted)] break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
            {classItem.descripcion || "Esta clase todavia no tiene descripcion cargada."}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.16em] text-[var(--campus-text-muted)]">Materiales</h4>

          {classFiles.length ? (
            <div className="space-y-3">
              {classFiles.map((file) => (
                <FileRow
                  key={file.claseArchivoId}
                  fileName={file.nombreOriginal}
                  fileUrl={file.url}
                  fileSize={file.size}
                  actionLabel="Ver material"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--campus-text-muted)]">Esta clase no tiene materiales cargados.</p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-[var(--campus-divider)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--campus-text-muted)]">
            {videoHref ? "Contenido principal disponible para esta clase." : "El enlace principal de la clase todavia no esta disponible."}
          </p>

          {videoHref ? (
            <a
              href={videoHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${campusPrimaryButtonClassName} self-start px-5 py-2.5 sm:self-auto`}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Ver clase
            </a>
          ) : (
            <span className="inline-flex self-start rounded-full border border-[var(--campus-divider)] bg-[var(--campus-surface-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--campus-text-muted)] sm:self-auto">
              URL pendiente
            </span>
          )}
        </div>
      </article>
    )
  }

  const courseTitle = course?.nombre || "Detalle del curso"
  const canAccessClasses = isAdminView || isEnrolled
  const courseImage = getSafeImageSrc(course?.imagenUrl)
  const courseFiles = course?.archivos ?? []
  const availableClassesLabel = formatAvailableClassCount(sortedClasses.length)
  const generalMaterialsCountLabel = formatMaterialCount(courseFiles.length)
  const pageActions = course ? (
    isAdminView || isEnrolled ? null : (
      <button
        onClick={handleEnroll}
        disabled={isEnrolling}
        className={`${campusPrimaryButtonClassName} px-5 py-2.5`}
      >
        {isEnrolling ? "Inscribiendo..." : "Inscribirme"}
      </button>
    )
  ) : null

  return (
    <LearningShell
      title="Detalle del curso"
      breadcrumbs={[
        { label: "Campus", href: "/cursos" },
        ...(isAdminView ? [] : [{ label: "Mis cursos", href: "/mis-cursos" }]),
        { label: courseTitle },
      ]}
      actions={pageActions}
    >
      {errorMessage ? (
        <div className="campus-feedback-panel rounded-2xl px-5 py-4 text-sm">{errorMessage}</div>
      ) : null}

      {isLoading ? (
        <div className={`${panelClassName} px-6 py-16 text-center text-[var(--campus-text-muted)]`}>Cargando curso...</div>
      ) : !course ? (
        <div className={`${panelClassName} px-6 py-16 text-center`}>
          <p className="text-lg font-medium text-[var(--campus-text)]">No se encontro el curso.</p>
          <p className="mt-3 text-sm text-[var(--campus-text-muted)]">Volve al catalogo para continuar navegando el portal.</p>
          <Link href="/cursos" className={`${campusPrimaryButtonClassName} mt-6 px-6 py-3`}>
            Volver al catalogo
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <section className={`${panelClassName} overflow-hidden p-6 md:p-8`}>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] xl:items-start">
              <div className="space-y-6 xl:col-start-1 xl:row-start-1">
                <div className="flex flex-wrap items-center gap-2">
                  {isAdminView ? <span className={campusAccentBadgeClassName}>Vista admin</span> : null}
                  {course.estado ? <span className={`${campusAccentBadgeClassName} normal-case tracking-[0.03em]`}>{course.estado}</span> : null}
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">Curso</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--campus-text)] md:text-[2.6rem]">{course.nombre}</h2>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--campus-text-muted)] md:text-[1.01rem]">
                    {course.descripcion || "Este curso todavia no tiene descripcion cargada."}
                  </p>
                </div>
              </div>

              <div className="xl:col-start-2 xl:row-span-2">
                <div className="overflow-hidden rounded-[22px] border border-[var(--campus-border)] bg-[var(--campus-surface)] p-3 shadow-[0_18px_36px_rgba(121,142,161,0.08)]">
                  {courseImage ? (
                    <div className="aspect-[4/3] overflow-hidden rounded-[18px] border border-[var(--campus-divider)] bg-[var(--campus-surface-soft)] p-3">
                      <img src={courseImage} alt={`Imagen de ${course.nombre}`} className="h-full w-full rounded-[14px] object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex flex-col items-center justify-center rounded-[18px] border border-[var(--campus-divider)] bg-[var(--campus-surface-soft)] px-6 text-center text-sm text-[var(--campus-text-muted)]">
                      <ImageIcon className="mb-3 h-8 w-8 text-[var(--campus-text)]" />
                      Este curso no tiene imagen cargada.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 xl:col-start-1 xl:row-start-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-semibold text-[var(--campus-text)]">Materiales del curso</h3>
                  <span className="inline-flex items-center rounded-full border border-[var(--campus-divider)] bg-[var(--campus-surface-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">
                    <FileText className="mr-2 h-3.5 w-3.5" />
                    {generalMaterialsCountLabel}
                  </span>
                </div>

                {!canAccessClasses ? (
                  <div className="campus-accent-panel rounded-[22px] px-5 py-4 text-sm leading-7 text-[var(--campus-text)]">
                    Inscribite para desbloquear las clases y los materiales generales de este curso.
                  </div>
                ) : courseFiles.length ? (
                  <div className="space-y-3">
                    {courseFiles.map((file) => (
                      <FileRow
                        key={file.cursoArchivoId}
                        fileName={file.nombreOriginal}
                        fileUrl={file.url}
                        fileSize={file.size}
                        actionLabel="Ver material"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--campus-text-muted)]">No hay materiales generales cargados para este curso.</p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--campus-text)]">Clases del curso</h2>
                <p className="mt-1 text-sm leading-7 text-[var(--campus-text-muted)]">Avanzá por las clases y accedé a sus materiales.</p>
              </div>
              <span className="text-sm font-medium text-[var(--campus-text-muted)]">{availableClassesLabel}</span>
            </div>

            {!canAccessClasses ? (
              <div className={`${panelClassName} px-5 py-10 text-center text-[var(--campus-text-muted)]`}>
                Inscribite para desbloquear las clases de este curso.
              </div>
            ) : sortedClasses.length > 0 ? (
              <div className="space-y-4">
                {sortedClasses.map((classItem, index) => renderClassItem(classItem, index))}
              </div>
            ) : (
              <div className={`${panelClassName} px-5 py-10 text-center text-[var(--campus-text-muted)]`}>
                Este curso aun no tiene clases publicadas.
              </div>
            )}
          </section>
        </div>
      )}
    </LearningShell>
  )
}
