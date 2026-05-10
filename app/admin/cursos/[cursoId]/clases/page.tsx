"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useState } from "react"

import AdminShell from "@/components/admin/AdminShell"
import DestructiveConfirmDialog from "@/components/admin/DestructiveConfirmDialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import { isValidHttpUrlInput, trimMultiline, trimSingleLine } from "@/lib/form-validation"
import { getSafeHttpUrl } from "@/lib/safe-url"
import type { Clase, Curso } from "@/types/learning"

type ClassFormState = {
  titulo: string
  descripcion: string
  videoUrl: string
  orden: string
}

const emptyFormState: ClassFormState = {
  titulo: "",
  descripcion: "",
  videoUrl: "",
  orden: "",
}

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

function buildClassPayload(courseId: number, formState: ClassFormState, isEditing: boolean) {
  const payload: Record<string, string | number> = {
    titulo: formState.titulo.trim(),
  }

  if (!isEditing) payload.cursoId = courseId

  payload.descripcion = formState.descripcion.trim()
  payload.videoUrl = formState.videoUrl.trim()

  const normalizedOrder = formState.orden.trim()
  if (normalizedOrder) {
    payload.orden = Number(normalizedOrder)
  }

  return payload
}

export default function AdminCursoClasesPage() {
  const router = useRouter()
  const params = useParams<{ cursoId: string }>()
  const [course, setCourse] = useState<Curso | null>(null)
  const [classes, setClasses] = useState<Clase[]>([])
  const [formState, setFormState] = useState<ClassFormState>(emptyFormState)
  const [editingClassId, setEditingClassId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingClassId, setDeletingClassId] = useState<number | null>(null)
  const [classToDelete, setClassToDelete] = useState<Clase | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const courseId = Number(params.cursoId)
  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      const orderA = a.orden ?? Number.MAX_SAFE_INTEGER
      const orderB = b.orden ?? Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) return orderA - orderB
      return a.claseId - b.claseId
    })
  }, [classes])

  const loadData = async () => {
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

      const [courseResponse, classesResponse] = await Promise.all([
        fetch(`/api/cursos/${courseId}`, {
          method: "GET",
          headers: getAuthHeaders(token),
          cache: "no-store",
        }),
        fetch(`/api/clases/curso/${courseId}`, {
          method: "GET",
          headers: getAuthHeaders(token),
          cache: "no-store",
        }),
      ])

      const coursePayload = (await courseResponse.json().catch(() => null)) as unknown
      const classesPayload = (await classesResponse.json().catch(() => null)) as unknown

      if (courseResponse.status === 401 || classesResponse.status === 401) {
        clearAuthToken()
        router.replace("/login")
        return
      }

      if (courseResponse.status === 403 || classesResponse.status === 403) {
        router.replace("/cursos")
        return
      }

      if (!courseResponse.ok || Array.isArray(coursePayload) || !coursePayload) {
        throw new Error(extractErrorMessage(coursePayload, "No se pudo cargar el curso"))
      }

      if (!classesResponse.ok || !Array.isArray(classesPayload)) {
        throw new Error(extractErrorMessage(classesPayload, "No se pudieron cargar las clases"))
      }

      setCourse(coursePayload as Curso)
      setClasses(classesPayload as Clase[])
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudieron cargar las clases")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [courseId])

  const resetForm = () => {
    setFormState(emptyFormState)
    setEditingClassId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    const normalizedTitle = trimSingleLine(formState.titulo)
    const normalizedDescription = trimMultiline(formState.descripcion)
    const normalizedVideoUrl = trimSingleLine(formState.videoUrl)
    const normalizedOrder = trimSingleLine(formState.orden)

    if (!normalizedTitle) {
      setErrorMessage("El titulo de la clase es obligatorio")
      return
    }

    if (normalizedTitle.length > 140) {
      setErrorMessage("El titulo de la clase supera el limite de caracteres")
      return
    }

    if (normalizedDescription.length > 2000) {
      setErrorMessage("La descripcion de la clase supera el limite de caracteres")
      return
    }

    if (normalizedVideoUrl && (!isValidHttpUrlInput(normalizedVideoUrl) || normalizedVideoUrl.length > 500)) {
      setErrorMessage("El video debe ser una URL http o https valida")
      return
    }

    if (normalizedOrder && (!/^\d+$/.test(normalizedOrder) || Number(normalizedOrder) < 1)) {
      setErrorMessage("El orden debe ser un numero entero mayor a cero")
      return
    }

    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    setIsSaving(true)

    try {
      const isEditing = editingClassId !== null
      const response = await fetch(isEditing ? `/api/clases/${editingClassId}` : "/api/clases", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          buildClassPayload(
            courseId,
            {
              titulo: normalizedTitle,
              descripcion: normalizedDescription,
              videoUrl: normalizedVideoUrl,
              orden: normalizedOrder,
            },
            isEditing,
          ),
        ),
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

      if (!response.ok) {
        throw new Error(extractErrorMessage(payload, isEditing ? "No se pudo actualizar la clase" : "No se pudo crear la clase"))
      }

      setSuccessMessage(isEditing ? "Clase actualizada correctamente" : "Clase creada correctamente")
      resetForm()
      await loadData()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(editingClassId !== null ? "No se pudo actualizar la clase" : "No se pudo crear la clase")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (classItem: Clase) => {
    setSuccessMessage("")
    setErrorMessage("")
    setEditingClassId(classItem.claseId)
    setFormState({
      titulo: classItem.titulo,
      descripcion: classItem.descripcion ?? "",
      videoUrl: classItem.videoUrl ?? "",
      orden: classItem.orden?.toString() ?? "",
    })
  }

  const handleDelete = async (classItem: Clase) => {
    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    setDeletingClassId(classItem.claseId)
    setClassToDelete(classItem)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch(`/api/clases/${classItem.claseId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
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

      if (!response.ok) {
        throw new Error(extractErrorMessage(payload, "No se pudo eliminar la clase"))
      }

      if (editingClassId === classItem.claseId) {
        resetForm()
      }

      setSuccessMessage("Clase eliminada correctamente")
      setClassToDelete(null)
      await loadData()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo eliminar la clase")
      }
    } finally {
      setDeletingClassId(null)
    }
  }

  return (
    <AdminShell
      title={course ? `Clases de ${course.nombre}` : "Clases del curso"}
      breadcrumbs={[
        { label: "Campus", href: "/cursos" },
        { label: "Admin", href: "/admin" },
        { label: "Clases", href: "/admin/clases" },
        { label: course?.nombre || "Curso" },
      ]}
      actions={
        <Link
          href="/admin/clases"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.06]"
        >
          Volver a clases
        </Link>
      }
    >
      <section className="rounded-2xl border border-white/10 bg-[#0d1726] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{editingClassId ? "Editar clase" : "Nueva clase"}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">Define el contenido y el orden de aparicion de las clases dentro del curso.</p>
          </div>

          {editingClassId ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.04]"
            >
              Cancelar edicion
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="titulo" className="mb-2 block text-sm font-medium text-slate-200">
              Titulo
            </label>
            <Input
              id="titulo"
              value={formState.titulo}
              onChange={(event) => setFormState((current) => ({ ...current, titulo: event.target.value }))}
              placeholder="Clase 1 - Interfaz y primeros pasos"
              maxLength={140}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-slate-200">
              Descripcion
            </label>
            <Textarea
              id="descripcion"
              value={formState.descripcion}
              onChange={(event) => setFormState((current) => ({ ...current, descripcion: event.target.value }))}
              placeholder="Recorrido inicial por el entorno de trabajo."
              maxLength={2000}
              className="min-h-28 border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="videoUrl" className="mb-2 block text-sm font-medium text-slate-200">
              Video URL
            </label>
            <Input
              id="videoUrl"
              value={formState.videoUrl}
              onChange={(event) => setFormState((current) => ({ ...current, videoUrl: event.target.value }))}
              placeholder="https://www.youtube.com/watch?v=abcd1234"
              maxLength={500}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="orden" className="mb-2 block text-sm font-medium text-slate-200">
              Orden
            </label>
            <Input
              id="orden"
              type="number"
              min={1}
              value={formState.orden}
              onChange={(event) => setFormState((current) => ({ ...current, orden: event.target.value }))}
              placeholder="1"
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex rounded-2xl bg-[#e3a72f] px-5 py-3 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a] disabled:opacity-70"
            >
              {isSaving ? (editingClassId ? "Guardando..." : "Creando...") : editingClassId ? "Guardar cambios" : "Crear clase"}
            </button>
          </div>
        </form>

        {successMessage ? <p className="mt-4 text-sm text-emerald-300">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-4 text-sm text-rose-300">{errorMessage}</p> : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1726] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Clases cargadas</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">Ordena y actualiza el material principal de cada clase.</p>
          </div>
          <span className="text-sm text-slate-500">{sortedClasses.length} clases</span>
        </div>

        {isLoading ? (
          <div className="mt-6 text-sm text-slate-400">Cargando clases...</div>
        ) : !course ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-12 text-center text-slate-400">
            No se encontro el curso.
          </div>
        ) : sortedClasses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-12 text-center text-slate-400">
            Todavia no hay clases creadas para este curso.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {sortedClasses.map((classItem) => (
              (() => {
                const videoHref = getSafeHttpUrl(classItem.videoUrl)

                return (
                  <article key={classItem.claseId} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Clase #{classItem.claseId}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white break-words [overflow-wrap:anywhere]">{classItem.titulo}</h3>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Orden {classItem.orden ?? "sin definir"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-300 break-words [overflow-wrap:anywhere]">
                      {classItem.descripcion || "Sin descripcion cargada."}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                      <span>{videoHref ? "Con video" : "Sin video"}</span>
                      {videoHref ? (
                        <a href={videoHref} target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-[#e3a72f]">
                          Abrir video
                        </a>
                      ) : (
                        <span>URL pendiente</span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        aria-label={`Editar clase ${classItem.titulo}`}
                        onClick={() => handleEdit(classItem)}
                        className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.04]"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar clase ${classItem.titulo}`}
                        disabled={deletingClassId === classItem.claseId}
                        onClick={() => {
                          setErrorMessage("")
                          setSuccessMessage("")
                          setClassToDelete(classItem)
                        }}
                        className="inline-flex rounded-2xl border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/10 disabled:opacity-70"
                      >
                        {deletingClassId === classItem.claseId ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </article>
                )
              })()
            ))}
          </div>
        )}
      </section>

      <DestructiveConfirmDialog
        open={classToDelete !== null}
        title="Eliminar clase"
        description={
          classToDelete
            ? `Estas por eliminar la clase \"${classToDelete.titulo}\". Esta accion es irreversible y el material asociado dejara de estar disponible.`
            : ""
        }
        confirmLabel="Eliminar clase"
        isLoading={classToDelete !== null && deletingClassId === classToDelete.claseId}
        onCancel={() => {
          if (deletingClassId !== null) return
          setClassToDelete(null)
        }}
        onConfirm={() => {
          if (!classToDelete) return
          void handleDelete(classToDelete)
        }}
      />
    </AdminShell>
  )
}
