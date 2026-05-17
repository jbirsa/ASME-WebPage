"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useState } from "react"

import AdminShell from "@/components/admin/AdminShell"
import DestructiveConfirmDialog from "@/components/admin/DestructiveConfirmDialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import {
  campusAccentBadgeClassName,
  campusAccentButtonClassName,
  campusCardClassName,
  campusFileInputClassName,
  campusInputClassName,
  campusOutlineButtonClassName,
  campusPanelClassName,
  campusPrimaryButtonClassName,
  campusSubtleSurfaceClassName,
} from "@/lib/campus-theme"
import { mergeSelectedFiles } from "@/lib/file-selection"
import { isValidHttpUrlInput, trimMultiline, trimSingleLine } from "@/lib/form-validation"
import type { Clase, ClaseArchivo, Curso } from "@/types/learning"

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

const fileInputClassName = campusFileInputClassName

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

function formatFileSize(size?: number | null) {
  if (!size || size < 1) return null
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminCursoClasesPage() {
  const router = useRouter()
  const params = useParams<{ cursoId: string }>()
  const [course, setCourse] = useState<Curso | null>(null)
  const [classes, setClasses] = useState<Clase[]>([])
  const [formState, setFormState] = useState<ClassFormState>(emptyFormState)
  const [editingClassId, setEditingClassId] = useState<number | null>(null)
  const [currentFiles, setCurrentFiles] = useState<ClaseArchivo[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileIdsToDelete, setFileIdsToDelete] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingClassId, setDeletingClassId] = useState<number | null>(null)
  const [classToDelete, setClassToDelete] = useState<Clase | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [updatedClassMessage, setUpdatedClassMessage] = useState("")

  const courseId = Number(params.cursoId)
  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      const orderA = a.orden ?? Number.MAX_SAFE_INTEGER
      const orderB = b.orden ?? Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) return orderA - orderB
      return a.claseId - b.claseId
    })
  }, [classes])
  const visibleCurrentFiles = useMemo(
    () => currentFiles.filter((file) => !fileIdsToDelete.includes(file.claseArchivoId)),
    [currentFiles, fileIdsToDelete],
  )
  const panelClassName = campusPanelClassName

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
    setCurrentFiles([])
    setSelectedFiles([])
    setFileIdsToDelete([])
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setUpdatedClassMessage("")

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

    const isEditing = editingClassId !== null
    const formData = new FormData()
    if (!isEditing) formData.set("cursoId", String(courseId))
    formData.set("titulo", normalizedTitle)
    if (normalizedDescription) formData.set("descripcion", normalizedDescription)
    if (normalizedVideoUrl) formData.set("videoUrl", normalizedVideoUrl)
    if (normalizedOrder) formData.set("orden", normalizedOrder)
    if (isEditing && fileIdsToDelete.length > 0) {
      formData.set("archivoIdsAEliminar", JSON.stringify(fileIdsToDelete))
    }
    for (const file of selectedFiles) {
      formData.append("archivos", file)
    }

    setIsSaving(true)

    try {
      const response = await fetch(isEditing ? `/api/clases/${editingClassId}` : "/api/clases", {
        method: isEditing ? "PATCH" : "POST",
        headers: getAuthHeaders(token),
        body: formData,
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

      if (isEditing) {
        setUpdatedClassMessage("Clase actualizada correctamente")
      } else {
        setSuccessMessage("Clase creada correctamente")
      }
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
    setUpdatedClassMessage("")
    setSuccessMessage("")
    setErrorMessage("")
    setEditingClassId(classItem.claseId)
    setFormState({
      titulo: classItem.titulo,
      descripcion: classItem.descripcion ?? "",
      videoUrl: classItem.videoUrl ?? "",
      orden: classItem.orden?.toString() ?? "",
    })
    setCurrentFiles(classItem.archivos ?? [])
    setSelectedFiles([])
    setFileIdsToDelete([])
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
          className={`${campusOutlineButtonClassName} px-5 py-2.5`}
        >
          Volver a clases
        </Link>
      }
    >
      <section className={`${panelClassName} p-6`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--campus-text)]">{editingClassId ? "Editar clase" : "Nueva clase"}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--campus-text-muted)]">Define el contenido, el orden y los archivos privados de cada clase.</p>
          </div>

          {editingClassId ? (
            <button
              type="button"
              onClick={resetForm}
              className={`${campusOutlineButtonClassName} px-4 py-2`}
            >
              Cancelar edicion
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="titulo" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Titulo <span aria-hidden="true" className="text-[var(--campus-primary-dark)]">*</span>
            </label>
            <Input
              id="titulo"
              value={formState.titulo}
              onChange={(event) => setFormState((current) => ({ ...current, titulo: event.target.value }))}
              placeholder="Clase 1 - Interfaz y primeros pasos"
              maxLength={140}
              required
              className={campusInputClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Descripcion
            </label>
            <Textarea
              id="descripcion"
              value={formState.descripcion}
              onChange={(event) => setFormState((current) => ({ ...current, descripcion: event.target.value }))}
              placeholder="Recorrido inicial por el entorno de trabajo."
              maxLength={2000}
              className={`min-h-28 ${campusInputClassName}`}
            />
          </div>

          <div>
            <label htmlFor="videoUrl" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Video URL
            </label>
            <Input
              id="videoUrl"
              value={formState.videoUrl}
              onChange={(event) => setFormState((current) => ({ ...current, videoUrl: event.target.value }))}
              placeholder="https://www.youtube.com/watch?v=abcd1234"
              maxLength={500}
              className={campusInputClassName}
            />
          </div>

          <div>
            <label htmlFor="orden" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Orden
            </label>
            <Input
              id="orden"
              type="number"
              min={1}
              value={formState.orden}
              onChange={(event) => setFormState((current) => ({ ...current, orden: event.target.value }))}
              placeholder="1"
              className={campusInputClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="archivos" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Archivos de la clase
            </label>
            <input
              id="archivos"
              type="file"
              multiple
              onChange={(event) => {
                const incomingFiles = Array.from(event.target.files ?? [])
                setSelectedFiles((currentFiles) => mergeSelectedFiles(currentFiles, incomingFiles))
                event.currentTarget.value = ""
              }}
              className={fileInputClassName}
            />
            <p className="mt-2 text-xs text-[var(--campus-text-muted)]">Hasta 10 archivos de 25 MB cada uno.</p>

            {selectedFiles.length > 0 ? (
              <div className={`${campusSubtleSurfaceClassName} mt-4 space-y-2 p-4`}>
                <p className="text-sm font-medium text-[var(--campus-text)]">Nuevos archivos</p>
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-4 text-sm text-[var(--campus-text-muted)]">
                    <span className="break-words [overflow-wrap:anywhere]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFiles((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                      className="shrink-0 text-[var(--campus-text-muted)] transition-colors hover:text-[var(--campus-primary-deep)]"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {visibleCurrentFiles.length > 0 ? (
              <div className={`${campusSubtleSurfaceClassName} mt-4 space-y-2 p-4`}>
                <p className="text-sm font-medium text-[var(--campus-text)]">Archivos actuales</p>
                {visibleCurrentFiles.map((file) => (
                  <div key={file.claseArchivoId} className="flex items-center justify-between gap-4 text-sm text-[var(--campus-text-muted)]">
                    <div>
                      <p className="break-words [overflow-wrap:anywhere]">{file.nombreOriginal}</p>
                      {formatFileSize(file.size) ? <p className="text-xs text-[var(--campus-text-muted)]">{formatFileSize(file.size)}</p> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileIdsToDelete((current) => [...current, file.claseArchivoId])}
                      className="shrink-0 text-[var(--campus-text)] transition-colors hover:text-[var(--campus-primary-dark)]"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {fileIdsToDelete.length > 0 ? (
              <div className="campus-accent-panel mt-4 space-y-2 rounded-2xl p-4">
                <p className="text-sm font-medium text-[var(--campus-text)]">Archivos marcados para borrar</p>
                {currentFiles
                  .filter((file) => fileIdsToDelete.includes(file.claseArchivoId))
                  .map((file) => (
                    <div key={file.claseArchivoId} className="flex items-center justify-between gap-4 text-sm text-[var(--campus-text)]">
                      <span className="break-words [overflow-wrap:anywhere]">{file.nombreOriginal}</span>
                      <button
                        type="button"
                        onClick={() => setFileIdsToDelete((current) => current.filter((fileId) => fileId !== file.claseArchivoId))}
                        className="shrink-0 text-[var(--campus-text)] transition-colors hover:text-[var(--campus-primary-dark)]"
                      >
                        Deshacer
                      </button>
                    </div>
                  ))}
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className={`${campusPrimaryButtonClassName} px-5 py-3`}
            >
              {isSaving ? (editingClassId ? "Guardando..." : "Creando...") : editingClassId ? "Guardar cambios" : "Crear clase"}
            </button>
          </div>
        </form>

        {successMessage ? <p className="campus-accent-panel mt-4 rounded-[18px] px-4 py-3 text-sm">{successMessage}</p> : null}
        {errorMessage ? <p className="campus-feedback-panel mt-4 rounded-[18px] px-4 py-3 text-sm">{errorMessage}</p> : null}
      </section>

      {editingClassId === null ? (
        <section className={`${panelClassName} p-6`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--campus-text)]">Clases cargadas</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--campus-text-muted)]">Ordena y actualiza el material principal de cada clase.</p>
            </div>
            <span className="text-sm text-[var(--campus-text-muted)]">{sortedClasses.length} clases</span>
          </div>

          {isLoading ? (
            <div className="mt-6 text-sm text-[var(--campus-text-muted)]">Cargando clases...</div>
          ) : !course ? (
            <div className={`${campusSubtleSurfaceClassName} mt-6 px-5 py-12 text-center text-[var(--campus-text-muted)]`}>
              No se encontro el curso.
            </div>
          ) : sortedClasses.length === 0 ? (
            <div className={`${campusSubtleSurfaceClassName} mt-6 px-5 py-12 text-center text-[var(--campus-text-muted)]`}>
              Todavia no hay clases creadas para este curso.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {sortedClasses.map((classItem) => (
                <article key={classItem.claseId} className={`${campusCardClassName} p-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[var(--campus-text)] break-words [overflow-wrap:anywhere]">{classItem.titulo}</h3>
                    <span className={campusAccentBadgeClassName}>
                      Clase {classItem.orden ?? "sin definir"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[var(--campus-text-muted)] break-words [overflow-wrap:anywhere]">
                    {classItem.descripcion || "Sin descripcion cargada."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      aria-label={`Editar clase ${classItem.titulo}`}
                      onClick={() => handleEdit(classItem)}
                      className={`${campusOutlineButtonClassName} px-4 py-2`}
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
                      className={`${campusAccentButtonClassName} px-4 py-2`}
                    >
                      {deletingClassId === classItem.claseId ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

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

      {updatedClassMessage ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Cerrar confirmacion"
            onClick={() => setUpdatedClassMessage("")}
            className="absolute inset-0 bg-[rgba(23,32,51,0.22)] backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="class-updated-dialog-title"
            className="relative w-full max-w-md rounded-[28px] border border-[var(--campus-secondary)] bg-[var(--campus-surface)] p-6 shadow-[0_24px_80px_rgba(121,142,161,0.16)]"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">Cambios guardados</p>
            <h2 id="class-updated-dialog-title" className="mt-3 text-2xl font-semibold text-[var(--campus-text)]">
              Clase actualizada
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--campus-text-muted)]">{updatedClassMessage}</p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setUpdatedClassMessage("")}
                className={`${campusPrimaryButtonClassName} px-5 py-2.5`}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  )
}
