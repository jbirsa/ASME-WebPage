"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useState } from "react"

import AdminShell from "@/components/admin/AdminShell"
import DestructiveConfirmDialog from "@/components/admin/DestructiveConfirmDialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import type { Curso } from "@/types/learning"

type CourseFormState = {
  nombre: string
  descripcion: string
  imagenUrl: string
  estado: string
}

const emptyFormState: CourseFormState = {
  nombre: "",
  descripcion: "",
  imagenUrl: "",
  estado: "activo",
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

function buildCoursePayload(formState: CourseFormState, includeEmptyOptional: boolean) {
  const nombre = formState.nombre.trim()
  const descripcion = formState.descripcion.trim()
  const imagenUrl = formState.imagenUrl.trim()
  const estado = formState.estado.trim()

  const payload: Record<string, string> = { nombre }

  if (includeEmptyOptional || descripcion) payload.descripcion = descripcion
  if (includeEmptyOptional || imagenUrl) payload.imagenUrl = imagenUrl
  if (includeEmptyOptional || estado) payload.estado = estado

  return payload
}

export default function AdminCursosPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Curso[]>([])
  const [formState, setFormState] = useState<CourseFormState>(emptyFormState)
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null)
  const [courseToDelete, setCourseToDelete] = useState<Curso | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const sortedCourses = useMemo(() => [...courses].sort((a, b) => b.cursoId - a.cursoId), [courses])

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
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!formState.nombre.trim()) {
      setErrorMessage("El nombre del curso es obligatorio")
      return
    }

    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    setIsSaving(true)

    try {
      const isEditing = editingCourseId !== null
      const response = await fetch(isEditing ? `/api/cursos/${editingCourseId}` : "/api/cursos", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildCoursePayload(formState, isEditing)),
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

      setSuccessMessage(isEditing ? "Curso actualizado correctamente" : "Curso creado correctamente")
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
    setSuccessMessage("")
    setErrorMessage("")
    setEditingCourseId(course.cursoId)
    setFormState({
      nombre: course.nombre,
      descripcion: course.descripcion ?? "",
      imagenUrl: course.imagenUrl ?? "",
      estado: course.estado ?? "",
    })
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
          href="/admin/clases"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.06]"
        >
          Ir a clases
        </Link>
      }
    >
      <section className="rounded-2xl border border-white/10 bg-[#0d1726] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{editingCourseId ? "Editar curso" : "Nuevo curso"}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">Carga los campos principales del curso y administra su estado.</p>
          </div>

          {editingCourseId ? (
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
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-slate-200">
              Nombre
            </label>
            <Input
              id="nombre"
              value={formState.nombre}
              onChange={(event) => setFormState((current) => ({ ...current, nombre: event.target.value }))}
              placeholder="Introduccion a CAD"
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
              placeholder="Curso inicial de modelado 3D para estudiantes."
              className="min-h-28 border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="imagenUrl" className="mb-2 block text-sm font-medium text-slate-200">
              Imagen URL
            </label>
            <Input
              id="imagenUrl"
              value={formState.imagenUrl}
              onChange={(event) => setFormState((current) => ({ ...current, imagenUrl: event.target.value }))}
              placeholder="https://example.com/curso.jpg"
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="estado" className="mb-2 block text-sm font-medium text-slate-200">
              Estado
            </label>
            <select
              id="estado"
              value={formState.estado}
              onChange={(event) => setFormState((current) => ({ ...current, estado: event.target.value }))}
              className="flex h-10 w-full rounded-md border border-white/10 bg-[#08111b] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#d4a726]"
            >
              <option value="activo">activo</option>
              <option value="borrador">borrador</option>
              <option value="archivado">archivado</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex rounded-2xl bg-[#e3a72f] px-5 py-3 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a] disabled:opacity-70"
            >
              {isSaving ? (editingCourseId ? "Guardando..." : "Creando...") : editingCourseId ? "Guardar cambios" : "Crear curso"}
            </button>
          </div>
        </form>

        {successMessage ? <p className="mt-4 text-sm text-emerald-300">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-4 text-sm text-rose-300">{errorMessage}</p> : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1726] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Cursos cargados</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">Lista de cursos disponibles para editar, borrar o administrar sus clases.</p>
          </div>
          <span className="text-sm text-slate-500">{sortedCourses.length} cursos</span>
        </div>

        {isLoading ? (
          <div className="mt-6 text-sm text-slate-400">Cargando cursos...</div>
        ) : sortedCourses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-12 text-center text-slate-400">
            Todavia no hay cursos creados.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {sortedCourses.map((course) => (
              <article key={course.cursoId} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Curso #{course.cursoId}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white break-words [overflow-wrap:anywhere]">{course.nombre}</h3>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {course.estado || "activo"}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300 break-words [overflow-wrap:anywhere]">
                  {course.descripcion || "Sin descripcion cargada."}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{course.clases?.length ?? 0} clases</span>
                  <span>{course.imagenUrl ? "Con portada" : "Sin portada"}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    aria-label={`Editar curso ${course.nombre}`}
                    onClick={() => handleEdit(course)}
                    className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.04]"
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
                    className="inline-flex rounded-2xl border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/10 disabled:opacity-70"
                  >
                    {deletingCourseId === course.cursoId ? "Eliminando..." : "Eliminar"}
                  </button>
                  <Link
                    href={`/admin/cursos/${course.cursoId}/clases`}
                    aria-label={`Gestionar clases de ${course.nombre}`}
                    className="inline-flex rounded-2xl bg-[#e3a72f] px-4 py-2 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a]"
                  >
                    Gestionar clases
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

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
    </AdminShell>
  )
}
