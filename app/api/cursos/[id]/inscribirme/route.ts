import { NextRequest, NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/backend-api"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const response = await fetch(getBackendApiUrl(`/cursos/${id}/inscribirme`), {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({ message: "Respuesta invalida del servidor" }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo completar la inscripcion" }, { status: 500 })
  }
}
