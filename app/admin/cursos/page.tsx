"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useState } from "react"

import AdminShell from "@/components/admin/AdminShell"
import DestructiveConfirmDialog from "@/components/admin/DestructiveConfirmDialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import {
  campusAccentButtonClassName,
  campusCardClassName,
  campusFileInputClassName,
  campusInputClassName,
  campusManagementButtonClassName,
  campusOutlineButtonClassName,
  campusPanelClassName,
  campusPrimaryButtonClassName,
  campusSubtleSurfaceClassName,
} from "@/lib/campus-theme"
import { mergeSelectedFiles } from "@/lib/file-selection"
import { trimMultiline, trimSingleLine } from "@/lib/form-validation"
import type { Curso, CursoArchivo } from "@/types/learning"

type CourseFormState = {
  nombre: string
  descripcion: string
}

const emptyFormState: CourseFormState = {
  nombre: "",
  descripcion: "",
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

export default function AdminCursosPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Curso[]>([])
  const [formState, setFormState] = useState<CourseFormState>(emptyFormState)
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [currentFiles, setCurrentFiles] = useState<CursoArchivo[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileIdsToDelete, setFileIdsToDelete] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null)
  const [courseToDelete, setCourseToDelete] = useState<Curso | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [updatedCourseMessage, setUpdatedCourseMessage] = useState("")

  const sortedCourses = useMemo(() => [...courses].sort((a, b) => b.cursoId - a.cursoId), [courses])
  const visibleCurrentFiles = useMemo(
    () => currentFiles.filter((file) => !fileIdsToDelete.includes(file.cursoArchivoId)),
    [currentFiles, fileIdsToDelete],
  )

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

  useEffect(() => {
    loadCourses()
  }, [])

  const resetForm = () => {
    setFormState(emptyFormState)
    setEditingCourseId(null)
    setCurrentPhotoUrl(null)
    setRemoveCurrentPhoto(false)
    setSelectedPhoto(null)
    setCurrentFiles([])
    setSelectedFiles([])
    setFileIdsToDelete([])
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setUpdatedCourseMessage("")

    const normalizedName = trimSingleLine(formState.nombre)
    const normalizedDescription = trimMultiline(formState.descripcion)

    if (!normalizedName) {
      setErrorMessage("El nombre del curso es obligatorio")
      return
    }

    if (normalizedName.length > 120) {
      setErrorMessage("El nombre del curso supera el limite de caracteres")
      return
    }

    if (normalizedDescription.length > 2000) {
      setErrorMessage("La descripcion del curso supera el limite de caracteres")
      return
    }

    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    const formData = new FormData()
    formData.set("nombre", normalizedName)
    if (normalizedDescription) formData.set("descripcion", normalizedDescription)
    if (selectedPhoto) formData.set("foto", selectedPhoto)
    for (const file of selectedFiles) {
      formData.append("archivos", file)
    }

    const isEditing = editingCourseId !== null
    if (isEditing && removeCurrentPhoto && !selectedPhoto) {
      formData.set("eliminarFoto", "true")
    }
    if (isEditing && fileIdsToDelete.length > 0) {
      formData.set("archivoIdsAEliminar", JSON.stringify(fileIdsToDelete))
    }

    setIsSaving(true)

    try {
      const response = await fetch(isEditing ? `/api/cursos/${editingCourseId}` : "/api/cursos", {
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
        throw new Error(extractErrorMessage(payload, isEditing ? "No se pudo actualizar el curso" : "No se pudo crear el curso"))
      }

      if (isEditing) {
        setUpdatedCourseMessage("Curso actualizado correctamente")
      } else {
        setSuccessMessage("Curso creado correctamente")
      }
      resetForm()
      await loadCourses()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(editingCourseId !== null ? "No se pudo actualizar el curso" : "No se pudo crear el curso")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (course: Curso) => {
    setUpdatedCourseMessage("")
    setSuccessMessage("")
    setErrorMessage("")
    setEditingCourseId(course.cursoId)
    setFormState({
      nombre: course.nombre,
      descripcion: course.descripcion ?? "",
    })
    setCurrentPhotoUrl(course.imagenUrl ?? null)
    setRemoveCurrentPhoto(false)
    setSelectedPhoto(null)
    setCurrentFiles(course.archivos ?? [])
    setSelectedFiles([])
    setFileIdsToDelete([])
  }

  const handleDelete = async (course: Curso) => {
    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    setDeletingCourseId(course.cursoId)
    setCourseToDelete(course)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch(`/api/cursos/${course.cursoId}`, {
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
        throw new Error(extractErrorMessage(payload, "No se pudo eliminar el curso"))
      }

      if (editingCourseId === course.cursoId) {
        resetForm()
      }

      setSuccessMessage("Curso eliminado correctamente")
      setCourseToDelete(null)
      await loadCourses()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo eliminar el curso")
      }
    } finally {
      setDeletingCourseId(null)
    }
  }

  return (
    <AdminShell
      title="Admin de cursos"
      breadcrumbs={[
        { label: "Campus", href: "/cursos" },
        { label: "Admin", href: "/admin" },
        { label: "Cursos" },
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
      <section className={`${campusPanelClassName} p-6`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--campus-text)]">{editingCourseId ? "Editar curso" : "Nuevo curso"}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--campus-text-muted)]">Carga el curso, su portada y los materiales adjuntos disponibles para alumnos inscriptos.</p>
          </div>

          {editingCourseId ? (
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
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Nombre <span aria-hidden="true" className="text-[var(--campus-primary-dark)]">*</span>
            </label>
            <Input
              id="nombre"
              value={formState.nombre}
              onChange={(event) => setFormState((current) => ({ ...current, nombre: event.target.value }))}
              placeholder="Introduccion a CAD"
              maxLength={120}
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
              placeholder="Curso inicial de modelado 3D para estudiantes."
              maxLength={2000}
              className={`min-h-28 ${campusInputClassName}`}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="foto" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Foto
            </label>
            <input
              id="foto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                setSelectedPhoto(file)
                if (file) setRemoveCurrentPhoto(false)
              }}
              className={fileInputClassName}
            />
            <p className="mt-2 text-xs text-[var(--campus-text-muted)]">JPG, PNG o WEBP. Maximo 25 MB.</p>

            {selectedPhoto ? (
              <div className={`${campusSubtleSurfaceClassName} mt-3 flex items-center justify-between px-4 py-3 text-sm text-[var(--campus-text)]`}>
                <span>Nueva foto: {selectedPhoto.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="text-[var(--campus-text-muted)] transition-colors hover:text-[var(--campus-primary-deep)]"
                >
                  Quitar
                </button>
              </div>
            ) : null}

            {currentPhotoUrl && !removeCurrentPhoto && !selectedPhoto ? (
              <div className={`${campusSubtleSurfaceClassName} mt-4 p-4`}>
                <p className="text-sm font-medium text-[var(--campus-text)]">Foto actual</p>
                <img src={currentPhotoUrl} alt="Foto actual del curso" className="mt-3 h-40 w-full rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => setRemoveCurrentPhoto(true)}
                  className={campusAccentButtonClassName}
                >
                  Eliminar foto actual
                </button>
              </div>
            ) : null}

            {removeCurrentPhoto && !selectedPhoto ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="text-sm text-[var(--campus-text)]">La foto actual se eliminara cuando guardes los cambios.</p>
                <button
                  type="button"
                  onClick={() => setRemoveCurrentPhoto(false)}
                  className="text-sm font-medium text-[var(--campus-primary-deep)] transition-colors hover:text-[var(--campus-primary-dark)]"
                >
                  Restaurar foto
                </button>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="archivos" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Archivos del curso
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
                  <div key={file.cursoArchivoId} className="flex items-center justify-between gap-4 text-sm text-[var(--campus-text-muted)]">
                    <div>
                      <p className="break-words [overflow-wrap:anywhere]">{file.nombreOriginal}</p>
                      {formatFileSize(file.size) ? <p className="text-xs text-[var(--campus-text-muted)]">{formatFileSize(file.size)}</p> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileIdsToDelete((current) => [...current, file.cursoArchivoId])}
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
                  .filter((file) => fileIdsToDelete.includes(file.cursoArchivoId))
                  .map((file) => (
                    <div key={file.cursoArchivoId} className="flex items-center justify-between gap-4 text-sm text-[var(--campus-text)]">
                      <span className="break-words [overflow-wrap:anywhere]">{file.nombreOriginal}</span>
                      <button
                        type="button"
                        onClick={() => setFileIdsToDelete((current) => current.filter((fileId) => fileId !== file.cursoArchivoId))}
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
              {isSaving ? (editingCourseId ? "Guardando..." : "Creando...") : editingCourseId ? "Guardar cambios" : "Crear curso"}
            </button>
          </div>
        </form>

        {successMessage ? <p className="campus-accent-panel mt-4 rounded-[18px] px-4 py-3 text-sm">{successMessage}</p> : null}
        {errorMessage ? <p className="campus-feedback-panel mt-4 rounded-[18px] px-4 py-3 text-sm">{errorMessage}</p> : null}
      </section>

      {editingCourseId === null ? (
        <section className={`${campusPanelClassName} p-6`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--campus-text)]">Cursos cargados</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--campus-text-muted)]">Lista de cursos disponibles para editar, borrar o administrar sus clases.</p>
            </div>
            <span className="text-sm text-[var(--campus-text-muted)]">{sortedCourses.length} cursos</span>
          </div>

          {isLoading ? (
            <div className="mt-6 text-sm text-[var(--campus-text-muted)]">Cargando cursos...</div>
          ) : sortedCourses.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[var(--campus-border)] bg-[var(--campus-surface-soft)] px-5 py-12 text-center text-[var(--campus-text-muted)]">
              Todavia no hay cursos creados.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {sortedCourses.map((course) => (
                <article key={course.cursoId} className={`${campusCardClassName} p-5`}>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--campus-text)] break-words [overflow-wrap:anywhere]">{course.nombre}</h3>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[var(--campus-text-muted)] break-words [overflow-wrap:anywhere]">
                    {course.descripcion || "Sin descripcion cargada."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      aria-label={`Editar curso ${course.nombre}`}
                      onClick={() => handleEdit(course)}
                      className={`${campusOutlineButtonClassName} px-4 py-2`}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      aria-label={`Eliminar curso ${course.nombre}`}
                      disabled={deletingCourseId === course.cursoId}
                      onClick={() => {
                        setErrorMessage("")
                        setSuccessMessage("")
                        setCourseToDelete(course)
                      }}
                      className={`${campusAccentButtonClassName} px-4 py-2`}
                    >
                      {deletingCourseId === course.cursoId ? "Eliminando..." : "Eliminar"}
                    </button>
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
      ) : null}

      <DestructiveConfirmDialog
        open={courseToDelete !== null}
        title="Eliminar curso"
        description={
          courseToDelete
            ? `Estas por eliminar el curso \"${courseToDelete.nombre}\". Esta accion es irreversible y tambien puede afectar sus clases asociadas.`
            : ""
        }
        confirmLabel="Eliminar curso"
        isLoading={courseToDelete !== null && deletingCourseId === courseToDelete.cursoId}
        onCancel={() => {
          if (deletingCourseId !== null) return
          setCourseToDelete(null)
        }}
        onConfirm={() => {
          if (!courseToDelete) return
          void handleDelete(courseToDelete)
        }}
      />

      {updatedCourseMessage ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Cerrar confirmacion"
            onClick={() => setUpdatedCourseMessage("")}
            className="absolute inset-0 bg-[rgba(23,32,51,0.22)] backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-updated-dialog-title"
            className="relative w-full max-w-md rounded-[28px] border border-[var(--campus-secondary)] bg-[var(--campus-surface)] p-6 shadow-[0_24px_80px_rgba(121,142,161,0.16)]"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">Cambios guardados</p>
            <h2 id="course-updated-dialog-title" className="mt-3 text-2xl font-semibold text-[var(--campus-text)]">
              Curso actualizado
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--campus-text-muted)]">{updatedCourseMessage}</p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setUpdatedCourseMessage("")}
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
