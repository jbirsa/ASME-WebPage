import type { SupabaseClient } from "@supabase/supabase-js"

import type { Evento } from "@/types/db_types"

type BackendEventoPayload = Partial<Evento> & {
  eventoId?: number | null
  evento_id?: number | null
  imagenUrl?: string | null
  imagen_storage_path?: string | null
  paginaEvento?: string | null
}

const PRIVATE_EVENTS_BUCKET = "asme-private-assets"
const SIGNED_URL_TTL_SECONDS = 60 * 60

export async function normalizeEvent(supabase: SupabaseClient, event: BackendEventoPayload): Promise<Evento> {
  let imageUrl = event.imagen_url ?? event.imagenUrl ?? ""

  if (!imageUrl && event.imagen_storage_path) {
    const { data } = await supabase.storage
      .from(PRIVATE_EVENTS_BUCKET)
      .createSignedUrl(event.imagen_storage_path, SIGNED_URL_TTL_SECONDS)

    imageUrl = data?.signedUrl ?? ""
  }

  return {
    id: event.id ?? event.eventoId ?? event.evento_id ?? 0,
    nombre: event.nombre ?? "",
    tipo: event.tipo ?? "",
    fecha: event.fecha ?? "",
    direccion: event.direccion ?? "",
    barrio: event.barrio ?? "",
    provincia: event.provincia ?? "",
    descripcion: event.descripcion ?? "",
    link: event.link ?? "",
    imagen_url: imageUrl,
    pagina_evento: event.pagina_evento ?? event.paginaEvento ?? "",
  }
}
