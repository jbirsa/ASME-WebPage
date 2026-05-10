import type { Evento } from "@/types/db_types"

import { parseEventDate } from "@/lib/date"
import { getSafeHttpUrl } from "@/lib/safe-url"

type BackendEventoPayload = {
  eventoId?: number
  id?: number
  nombre?: string | null
  tipo?: string | null
  fecha?: string | Date | null
  direccion?: string | null
  barrio?: string | null
  provincia?: string | null
  descripcion?: string | null
  link?: string | null
  imagenUrl?: string | null
  imagen_url?: string | null
  paginaEvento?: string | null
  pagina_evento?: string | null
}

export function normalizeEvent(event: BackendEventoPayload): Evento {
  return {
    id: event.id ?? event.eventoId ?? 0,
    nombre: event.nombre ?? "",
    tipo: event.tipo ?? "",
    fecha: event.fecha ?? "",
    direccion: event.direccion ?? "",
    barrio: event.barrio ?? "",
    provincia: event.provincia ?? "",
    descripcion: event.descripcion ?? "",
    link: event.link ?? "",
    imagen_url: event.imagenUrl ?? event.imagen_url ?? "",
    pagina_evento: event.paginaEvento ?? event.pagina_evento ?? "",
  }
}

export function sortEventsByDateAscending(events: Evento[]) {
  return [...events].sort((eventA, eventB) => {
    const dateA = parseEventDate(eventA.fecha)
    const dateB = parseEventDate(eventB.fecha)

    if (Number.isNaN(dateA.getTime()) && Number.isNaN(dateB.getTime())) return 0
    if (Number.isNaN(dateA.getTime())) return 1
    if (Number.isNaN(dateB.getTime())) return -1
    return dateA.getTime() - dateB.getTime()
  })
}

function getTodayStart() {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

export function isFutureEvent(event: Evento) {
  const eventDate = parseEventDate(event.fecha)
  if (Number.isNaN(eventDate.getTime())) return false
  return eventDate.getTime() >= getTodayStart().getTime()
}

export function isPastEvent(event: Evento) {
  const eventDate = parseEventDate(event.fecha)
  if (Number.isNaN(eventDate.getTime())) return false
  return eventDate.getTime() < getTodayStart().getTime()
}

export function getEventDetailsHref(value?: string | null) {
  if (!value) return null

  const trimmedValue = value.trim()
  if (!trimmedValue) return null

  const externalUrl = getSafeHttpUrl(trimmedValue)
  if (externalUrl) return externalUrl

  if (trimmedValue.startsWith("//")) return null
  if (trimmedValue.startsWith("/")) return trimmedValue
  if (trimmedValue.includes(":")) return null

  return `/${trimmedValue}`
}

export function isExternalEventLink(value?: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value))
}
