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
  campusAccentBadgeClassName,
  campusAccentButtonClassName,
  campusCardClassName,
  campusFileInputClassName,
  campusInputClassName,
  campusOutlineButtonClassName,
  campusPanelClassName,
  campusPrimaryButtonClassName,
  campusSelectClassName,
  campusSubtleSurfaceClassName,
} from "@/lib/campus-theme"
import { formatEventDate } from "@/lib/date"
import { trimMultiline, trimSingleLine } from "@/lib/form-validation"
import type { Evento } from "@/types/db_types"

const EVENT_TYPE_OPTIONS = ["Charla", "Visita", "Competencia", "Evento especial"] as const
const EVENT_SEDE_OPTIONS = [
  "Sede Distrito Financiero (SDF)",
  "Sede Distrito Rectorado (SDR)",
  "Sede Distrito Tecnologico (SDT)",
] as const

type EventFormState = {
  nombre: string
  tipo: string
  fecha: string
  direccion: string
  sede: string
  descripcion: string
}

const emptyFormState: EventFormState = {
  nombre: "",
  tipo: "",
  fecha: "",
  direccion: "",
  sede: "",
  descripcion: "",
}

const selectClassName = campusSelectClassName
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

export default function AdminEventosPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Evento[]>([])
  const [formState, setFormState] = useState<EventFormState>(emptyFormState)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [eventToDelete, setEventToDelete] = useState<Evento | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [updatedEventMessage, setUpdatedEventMessage] = useState("")

  const sortedEvents = useMemo(() => {
    return [...events].sort((eventA, eventB) => String(eventB.fecha ?? "").localeCompare(String(eventA.fecha ?? "")))
  }, [events])
  const panelClassName = campusPanelClassName

  const loadEvents = async () => {
    try {
      setErrorMessage("")

      const response = await fetch("/api/events", {
        method: "GET",
        cache: "no-store",
      })

      const payload = (await response.json().catch(() => null)) as unknown

      if (!response.ok || typeof payload !== "object" || payload === null || !Array.isArray((payload as { events?: unknown[] }).events)) {
        throw new Error(extractErrorMessage(payload, "No se pudieron cargar los eventos"))
      }

      setEvents((payload as { events: Evento[] }).events)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudieron cargar los eventos")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const resetForm = () => {
    setFormState(emptyFormState)
    setEditingEventId(null)
    setCurrentPhotoUrl(null)
    setRemoveCurrentPhoto(false)
    setSelectedPhoto(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setUpdatedEventMessage("")

    const normalizedForm = {
      nombre: trimSingleLine(formState.nombre),
      tipo: trimSingleLine(formState.tipo),
      fecha: trimSingleLine(formState.fecha),
      direccion: trimSingleLine(formState.direccion),
      sede: trimSingleLine(formState.sede),
      descripcion: trimMultiline(formState.descripcion),
    }

    if (!normalizedForm.nombre) {
      setErrorMessage("El nombre del evento es obligatorio")
      return
    }

    if (normalizedForm.nombre.length > 140) {
      setErrorMessage("El nombre del evento supera el limite de caracteres")
      return
    }

    if (!normalizedForm.tipo) {
      setErrorMessage("El tipo del evento es obligatorio")
      return
    }

    if (!EVENT_TYPE_OPTIONS.includes(normalizedForm.tipo as (typeof EVENT_TYPE_OPTIONS)[number])) {
      setErrorMessage("El tipo del evento no es valido")
      return
    }

    if (!normalizedForm.fecha) {
      setErrorMessage("La fecha del evento es obligatoria")
      return
    }

    if (!normalizedForm.direccion) {
      setErrorMessage("La direccion del evento es obligatoria")
      return
    }

    if (normalizedForm.direccion.length > 160) {
      setErrorMessage("La direccion del evento supera el limite de caracteres")
      return
    }

    if (!normalizedForm.descripcion) {
      setErrorMessage("La descripcion del evento es obligatoria")
      return
    }

    if (normalizedForm.descripcion.length > 3000) {
      setErrorMessage("La descripcion del evento supera el limite de caracteres")
      return
    }

    if (normalizedForm.sede && !EVENT_SEDE_OPTIONS.includes(normalizedForm.sede as (typeof EVENT_SEDE_OPTIONS)[number])) {
      setErrorMessage("La sede del evento no es valida")
      return
    }

    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    const formData = new FormData()
    formData.set("nombre", normalizedForm.nombre)
    formData.set("tipo", normalizedForm.tipo)
    formData.set("fecha", normalizedForm.fecha)
    formData.set("direccion", normalizedForm.direccion)
    formData.set("descripcion", normalizedForm.descripcion)
    if (normalizedForm.sede) formData.set("sede", normalizedForm.sede)

    setIsSaving(true)

    try {
      const isEditing = editingEventId !== null
      if (selectedPhoto) {
        formData.set("foto", selectedPhoto)
      } else if (isEditing && removeCurrentPhoto) {
        formData.set("eliminarFoto", "true")
      }

      const response = await fetch(isEditing ? `/api/events/${editingEventId}` : "/api/events", {
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
        throw new Error(extractErrorMessage(payload, isEditing ? "No se pudo actualizar el evento" : "No se pudo crear el evento"))
      }

      if (isEditing) {
        setUpdatedEventMessage("Evento actualizado correctamente")
      } else {
        setSuccessMessage("Evento creado correctamente")
      }
      resetForm()
      await loadEvents()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(editingEventId !== null ? "No se pudo actualizar el evento" : "No se pudo crear el evento")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (event: Evento) => {
    setUpdatedEventMessage("")
    setSuccessMessage("")
    setErrorMessage("")
    setEditingEventId(event.id)
    setFormState({
      nombre: event.nombre,
      tipo: event.tipo ?? "",
      fecha: typeof event.fecha === "string" ? event.fecha.slice(0, 10) : "",
      direccion: event.direccion ?? "",
      sede: event.sede ?? "",
      descripcion: event.descripcion ?? "",
    })
    setCurrentPhotoUrl(event.imagen_url ?? null)
    setRemoveCurrentPhoto(false)
    setSelectedPhoto(null)
  }

  const handleDelete = async (event: Evento) => {
    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    setDeletingEventId(event.id)
    setEventToDelete(event)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch(`/api/events/${event.id}`, {
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
        throw new Error(extractErrorMessage(payload, "No se pudo eliminar el evento"))
      }

      if (editingEventId === event.id) {
        resetForm()
      }

      setSuccessMessage("Evento eliminado correctamente")
      setEventToDelete(null)
      await loadEvents()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("No se pudo eliminar el evento")
      }
    } finally {
      setDeletingEventId(null)
    }
  }

  return (
    <AdminShell
      title="Admin de eventos"
      breadcrumbs={[
        { label: "Campus", href: "/cursos" },
        { label: "Admin", href: "/admin" },
        { label: "Eventos" },
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
      <section className={`${panelClassName} p-6`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--campus-text)]">{editingEventId ? "Editar evento" : "Nuevo evento"}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--campus-text-muted)]">Crea o actualiza eventos publicos para la home institucional.</p>
          </div>

          {editingEventId ? (
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
              Nombre
            </label>
            <Input
              id="nombre"
              value={formState.nombre}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, nombre: inputEvent.target.value }))}
              placeholder="Feria de Proyectos ASME"
              maxLength={140}
              required
              className={campusInputClassName}
            />
          </div>

          <div>
            <label htmlFor="tipo" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Tipo
            </label>
            <select
              id="tipo"
              value={formState.tipo}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, tipo: inputEvent.target.value }))}
              required
              className={selectClassName}
            >
              <option value="" disabled>
                Seleccionar tipo
              </option>
              {EVENT_TYPE_OPTIONS.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fecha" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Fecha
            </label>
            <Input
              id="fecha"
              type="date"
              value={formState.fecha}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, fecha: inputEvent.target.value }))}
              required
              className={campusInputClassName}
            />
          </div>

          <div>
            <label htmlFor="direccion" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Direccion
            </label>
            <Input
              id="direccion"
              value={formState.direccion}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, direccion: inputEvent.target.value }))}
              placeholder="Av. Siempre Viva 123"
              maxLength={160}
              required
              className={campusInputClassName}
            />
          </div>

          <div>
            <label htmlFor="sede" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Sede
            </label>
            <select
              id="sede"
              value={formState.sede}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, sede: inputEvent.target.value }))}
              className={selectClassName}
            >
              <option value="">
                Seleccionar sede
              </option>
              {EVENT_SEDE_OPTIONS.map((eventSede) => (
                <option key={eventSede} value={eventSede}>
                  {eventSede}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-[var(--campus-text)]">
              Descripcion
            </label>
            <Textarea
              id="descripcion"
              value={formState.descripcion}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, descripcion: inputEvent.target.value }))}
              placeholder="Evento institucional abierto para la comunidad."
              maxLength={3000}
              required
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
              onChange={(inputEvent) => {
                const file = inputEvent.target.files?.[0] ?? null
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
                <img src={currentPhotoUrl} alt="Foto actual del evento" className="mt-3 h-40 w-full rounded-xl object-cover" />
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

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className={`${campusPrimaryButtonClassName} px-5 py-3`}
            >
              {isSaving ? (editingEventId ? "Guardando..." : "Creando...") : editingEventId ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>

        {successMessage ? <p className="campus-accent-panel mt-4 rounded-[18px] px-4 py-3 text-sm">{successMessage}</p> : null}
        {errorMessage ? <p className="campus-feedback-panel mt-4 rounded-[18px] px-4 py-3 text-sm">{errorMessage}</p> : null}
      </section>

      {editingEventId === null ? (
        <section className={`${panelClassName} p-6`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--campus-text)]">Eventos cargados</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--campus-text-muted)]">Lista de eventos visibles para la home y listos para editar o borrar.</p>
            </div>
            <span className="text-sm text-[var(--campus-text-muted)]">{sortedEvents.length} eventos</span>
          </div>

          {isLoading ? (
            <div className="mt-6 text-sm text-[var(--campus-text-muted)]">Cargando eventos...</div>
          ) : sortedEvents.length === 0 ? (
            <div className={`${campusSubtleSurfaceClassName} mt-6 px-5 py-12 text-center text-[var(--campus-text-muted)]`}>
              Todavia no hay eventos creados.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {sortedEvents.map((event) => {
                const eventDateLabel = event.fecha
                  ? formatEventDate(event.fecha, "es-AR", { day: "numeric", month: "long", year: "numeric" }) || String(event.fecha)
                  : null
                const eventMeta = [eventDateLabel, event.direccion, event.sede].filter(Boolean).join(" · ")

                return (
                  <article key={event.id} className={`${campusCardClassName} flex h-full flex-col p-5`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--campus-text)] break-words [overflow-wrap:anywhere]">{event.nombre}</h3>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--campus-text-muted)]">
                          {eventMeta || "Sin datos principales"}
                        </p>
                      </div>
                      <span className={`${campusAccentBadgeClassName} shrink-0`}>
                        {event.tipo || "evento"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[var(--campus-text-muted)] break-words [overflow-wrap:anywhere]">
                      {event.descripcion || "Sin descripcion cargada."}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-3 pt-5">
                      <button
                        type="button"
                        aria-label={`Editar evento ${event.nombre}`}
                        onClick={() => handleEdit(event)}
                        className={`${campusOutlineButtonClassName} px-4 py-2`}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar evento ${event.nombre}`}
                        disabled={deletingEventId === event.id}
                        onClick={() => {
                          setErrorMessage("")
                          setSuccessMessage("")
                          setEventToDelete(event)
                        }}
                        className={`${campusAccentButtonClassName} px-4 py-2`}
                      >
                        {deletingEventId === event.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      ) : null}

      <DestructiveConfirmDialog
        open={eventToDelete !== null}
        title="Eliminar evento"
        description={
          eventToDelete
            ? `Estas por eliminar el evento \"${eventToDelete.nombre}\". Esta accion es irreversible y dejara de verse en la home publica.`
            : ""
        }
        confirmLabel="Eliminar evento"
        isLoading={eventToDelete !== null && deletingEventId === eventToDelete.id}
        onCancel={() => {
          if (deletingEventId !== null) return
          setEventToDelete(null)
        }}
        onConfirm={() => {
          if (!eventToDelete) return
          void handleDelete(eventToDelete)
        }}
      />

      {updatedEventMessage ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Cerrar confirmacion"
            onClick={() => setUpdatedEventMessage("")}
            className="absolute inset-0 bg-[rgba(23,32,51,0.22)] backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-updated-dialog-title"
            className="relative w-full max-w-md rounded-[28px] border border-[var(--campus-secondary)] bg-[var(--campus-surface)] p-6 shadow-[0_24px_80px_rgba(121,142,161,0.16)]"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">Cambios guardados</p>
            <h2 id="event-updated-dialog-title" className="mt-3 text-2xl font-semibold text-[var(--campus-text)]">
              Evento actualizado
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--campus-text-muted)]">{updatedEventMessage}</p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setUpdatedEventMessage("")}
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
