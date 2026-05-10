import { NextRequest, NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/backend-api"
import { normalizeEvent } from "@/lib/events"

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

    return NextResponse.json(
      { events: data.map((event) => normalizeEvent(event as Record<string, unknown>)) },
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch {
    return NextResponse.json({ error: "No se pudieron obtener los eventos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const body = await req.json()

    const response = await fetch(getBackendApiUrl("/eventos"), {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const data = (await response.json().catch(() => null)) as unknown

    if (!response.ok || !data || Array.isArray(data)) {
      return NextResponse.json(data ?? { message: "No se pudo crear el evento" }, { status: response.status || 500 })
    }

    return NextResponse.json(normalizeEvent(data as Record<string, unknown>), { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo crear el evento" }, { status: 500 })
  }
}
