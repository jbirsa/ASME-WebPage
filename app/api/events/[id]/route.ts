import { NextRequest, NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/backend-api"
import { normalizeEvent } from "@/lib/events"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params

    const response = await fetch(getBackendApiUrl(`/eventos/${id}`), {
      method: "GET",
      cache: "no-store",
    })

    const data = (await response.json().catch(() => null)) as unknown

    if (!response.ok || !data || Array.isArray(data)) {
      return NextResponse.json(data ?? { message: "No se pudo obtener el evento" }, { status: response.status || 500 })
    }

    return NextResponse.json(normalizeEvent(data as Record<string, unknown>), { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo obtener el evento" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const body = await req.json()

    const response = await fetch(getBackendApiUrl(`/eventos/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const data = (await response.json().catch(() => null)) as unknown

    if (!response.ok || !data || Array.isArray(data)) {
      return NextResponse.json(data ?? { message: "No se pudo actualizar el evento" }, { status: response.status || 500 })
    }

    return NextResponse.json(normalizeEvent(data as Record<string, unknown>), { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo actualizar el evento" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const response = await fetch(getBackendApiUrl(`/eventos/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({ message: "Respuesta invalida del servidor" }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo eliminar el evento" }, { status: 500 })
  }
}
