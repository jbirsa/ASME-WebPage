import { NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/backend-api"
import { isFutureEvent, normalizeEvent, sortEventsByDateAscending } from "@/lib/events"

export async function GET() {
  try {
    const response = await fetch(getBackendApiUrl("/eventos"), {
      method: "GET",
      cache: "no-store",
    })

    const data = (await response.json().catch(() => [])) as unknown

    if (!response.ok || !Array.isArray(data)) {
      return NextResponse.json({ error: "No se pudieron obtener los eventos" }, { status: response.status || 500 })
    }

    const events = sortEventsByDateAscending(data.map((event) => normalizeEvent(event as Record<string, unknown>))).filter(isFutureEvent)

    return NextResponse.json({ events }, { status: 200, headers: { "Content-Type": "application/json" } })
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener los eventos" }, { status: 500 })
  }
}
