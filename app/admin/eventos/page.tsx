"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useState } from "react"

import AdminShell from "@/components/admin/AdminShell"
import DestructiveConfirmDialog from "@/components/admin/DestructiveConfirmDialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { clearAuthToken, getAuthToken } from "@/lib/auth-token"
import { formatEventDate } from "@/lib/date"
import { isValidEventPageInput, isValidHttpUrlInput, trimMultiline, trimSingleLine } from "@/lib/form-validation"
import type { Evento } from "@/types/db_types"

type EventFormState = {
  nombre: string
  tipo: string
  fecha: string
  direccion: string
  barrio: string
  provincia: string
  descripcion: string
  link: string
  imagenUrl: string
  paginaEvento: string
}

const emptyFormState: EventFormState = {
  nombre: "",
  tipo: "",
  fecha: "",
  direccion: "",
  barrio: "",
  provincia: "",
  descripcion: "",
  link: "",
  imagenUrl: "",
  paginaEvento: "",
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

function buildEventPayload(formState: EventFormState, includeEmptyOptional: boolean) {
  const nombre = formState.nombre.trim()
  const payload: Record<string, string> = { nombre }

  const optionalFields = {
    tipo: formState.tipo.trim(),
    fecha: formState.fecha.trim(),
    direccion: formState.direccion.trim(),
    barrio: formState.barrio.trim(),
    provincia: formState.provincia.trim(),
    descripcion: formState.descripcion.trim(),
    link: formState.link.trim(),
    imagenUrl: formState.imagenUrl.trim(),
    paginaEvento: formState.paginaEvento.trim(),
  }

  for (const [key, value] of Object.entries(optionalFields)) {
    if (includeEmptyOptional || value) payload[key] = value
  }

  return payload
}

export default function AdminEventosPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Evento[]>([])
  const [formState, setFormState] = useState<EventFormState>(emptyFormState)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [eventToDelete, setEventToDelete] = useState<Evento | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const sortedEvents = useMemo(() => {
    return [...events].sort((eventA, eventB) => String(eventB.fecha ?? "").localeCompare(String(eventA.fecha ?? "")))
  }, [events])

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
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    const normalizedForm = {
      nombre: trimSingleLine(formState.nombre),
      tipo: trimSingleLine(formState.tipo),
      fecha: trimSingleLine(formState.fecha),
      direccion: trimSingleLine(formState.direccion),
      barrio: trimSingleLine(formState.barrio),
      provincia: trimSingleLine(formState.provincia),
      descripcion: trimMultiline(formState.descripcion),
      link: trimSingleLine(formState.link),
      imagenUrl: trimSingleLine(formState.imagenUrl),
      paginaEvento: trimSingleLine(formState.paginaEvento),
    }

    if (!normalizedForm.nombre) {
      setErrorMessage("El nombre del evento es obligatorio")
      return
    }

    if (normalizedForm.nombre.length > 140) {
      setErrorMessage("El nombre del evento supera el limite de caracteres")
      return
    }

    if (normalizedForm.tipo.length > 40) {
      setErrorMessage("El tipo del evento supera el limite de caracteres")
      return
    }

    if (normalizedForm.direccion.length > 160 || normalizedForm.barrio.length > 80 || normalizedForm.provincia.length > 80) {
      setErrorMessage("La ubicacion del evento supera el limite de caracteres")
      return
    }

    if (normalizedForm.descripcion.length > 3000) {
      setErrorMessage("La descripcion del evento supera el limite de caracteres")
      return
    }

    if (normalizedForm.link && (!isValidHttpUrlInput(normalizedForm.link) || normalizedForm.link.length > 500)) {
      setErrorMessage("El link principal debe ser una URL http o https valida")
      return
    }

    if (normalizedForm.imagenUrl && (!isValidHttpUrlInput(normalizedForm.imagenUrl) || normalizedForm.imagenUrl.length > 500)) {
      setErrorMessage("La imagen debe ser una URL http o https valida")
      return
    }

    if (normalizedForm.paginaEvento && (!isValidEventPageInput(normalizedForm.paginaEvento) || normalizedForm.paginaEvento.length > 500)) {
      setErrorMessage("La pagina del evento debe ser una URL segura o un path relativo valido")
      return
    }

    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    setIsSaving(true)

    try {
      const isEditing = editingEventId !== null
      const response = await fetch(isEditing ? `/api/events/${editingEventId}` : "/api/events", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildEventPayload(normalizedForm, isEditing)),
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

      setSuccessMessage(isEditing ? "Evento actualizado correctamente" : "Evento creado correctamente")
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
    setSuccessMessage("")
    setErrorMessage("")
    setEditingEventId(event.id)
    setFormState({
      nombre: event.nombre,
      tipo: event.tipo ?? "",
      fecha: typeof event.fecha === "string" ? event.fecha.slice(0, 10) : "",
      direccion: event.direccion ?? "",
      barrio: event.barrio ?? "",
      provincia: event.provincia ?? "",
      descripcion: event.descripcion ?? "",
      link: event.link ?? "",
      imagenUrl: event.imagen_url ?? "",
      paginaEvento: event.pagina_evento ?? "",
    })
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
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.06]"
        >
          Volver al panel
        </Link>
      }
    >
      <section className="rounded-2xl border border-white/10 bg-[#0d1726] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{editingEventId ? "Editar evento" : "Nuevo evento"}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">Crea o actualiza eventos publicos para la home institucional.</p>
          </div>

          {editingEventId ? (
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
              onChange={(inputEvent) => setFormState((current) => ({ ...current, nombre: inputEvent.target.value }))}
              placeholder="Feria de Proyectos ASME"
              maxLength={140}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="tipo" className="mb-2 block text-sm font-medium text-slate-200">
              Tipo
            </label>
            <Input
              id="tipo"
              value={formState.tipo}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, tipo: inputEvent.target.value }))}
              placeholder="presencial"
              maxLength={40}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="fecha" className="mb-2 block text-sm font-medium text-slate-200">
              Fecha
            </label>
            <Input
              id="fecha"
              type="date"
              value={formState.fecha}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, fecha: inputEvent.target.value }))}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="direccion" className="mb-2 block text-sm font-medium text-slate-200">
              Direccion
            </label>
            <Input
              id="direccion"
              value={formState.direccion}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, direccion: inputEvent.target.value }))}
              placeholder="Av. Siempre Viva 123"
              maxLength={160}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="barrio" className="mb-2 block text-sm font-medium text-slate-200">
              Barrio
            </label>
            <Input
              id="barrio"
              value={formState.barrio}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, barrio: inputEvent.target.value }))}
              placeholder="Centro"
              maxLength={80}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="provincia" className="mb-2 block text-sm font-medium text-slate-200">
              Provincia
            </label>
            <Input
              id="provincia"
              value={formState.provincia}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, provincia: inputEvent.target.value }))}
              placeholder="Cordoba"
              maxLength={80}
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
              onChange={(inputEvent) => setFormState((current) => ({ ...current, descripcion: inputEvent.target.value }))}
              placeholder="Evento institucional abierto para la comunidad."
              maxLength={3000}
              className="min-h-28 border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="link" className="mb-2 block text-sm font-medium text-slate-200">
              Link principal
            </label>
            <Input
              id="link"
              value={formState.link}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, link: inputEvent.target.value }))}
              placeholder="https://meet.example.com/asme-feria"
              maxLength={500}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div>
            <label htmlFor="imagenUrl" className="mb-2 block text-sm font-medium text-slate-200">
              Imagen URL
            </label>
            <Input
              id="imagenUrl"
              value={formState.imagenUrl}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, imagenUrl: inputEvent.target.value }))}
              placeholder="https://example.com/eventos/feria.jpg"
              maxLength={500}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="paginaEvento" className="mb-2 block text-sm font-medium text-slate-200">
              Pagina del evento
            </label>
            <Input
              id="paginaEvento"
              value={formState.paginaEvento}
              onChange={(inputEvent) => setFormState((current) => ({ ...current, paginaEvento: inputEvent.target.value }))}
              placeholder="https://asme.org/eventos/feria-2026"
              maxLength={500}
              className="border-white/10 bg-[#08111b] text-white"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex rounded-2xl bg-[#e3a72f] px-5 py-3 text-sm font-semibold text-[#08111e] transition-colors hover:bg-[#d4961a] disabled:opacity-70"
            >
              {isSaving ? (editingEventId ? "Guardando..." : "Creando...") : editingEventId ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>

        {successMessage ? <p className="mt-4 text-sm text-emerald-300">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-4 text-sm text-rose-300">{errorMessage}</p> : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0d1726] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Eventos cargados</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">Lista de eventos visibles para la home y listos para editar o borrar.</p>
          </div>
          <span className="text-sm text-slate-500">{sortedEvents.length} eventos</span>
        </div>

        {isLoading ? (
          <div className="mt-6 text-sm text-slate-400">Cargando eventos...</div>
        ) : sortedEvents.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-12 text-center text-slate-400">
            Todavia no hay eventos creados.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {sortedEvents.map((event) => (
              <article key={event.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white break-words [overflow-wrap:anywhere]">{event.nombre}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {event.fecha
                        ? formatEventDate(event.fecha, "es-AR", { day: "numeric", month: "long", year: "numeric" }) ||
                          String(event.fecha)
                        : "Sin fecha"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {event.tipo || "evento"}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300 break-words [overflow-wrap:anywhere]">
                  {event.descripcion || "Sin descripcion cargada."}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{event.direccion || "Sin direccion"}</span>
                  <span>{event.imagen_url ? "Con imagen" : "Sin imagen"}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    aria-label={`Editar evento ${event.nombre}`}
                    onClick={() => handleEdit(event)}
                    className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.04]"
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
                    className="inline-flex rounded-2xl border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/10 disabled:opacity-70"
                  >
                    {deletingEventId === event.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

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
    </AdminShell>
  )
}
