import { NextRequest, NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/backend-api"

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const response = await fetch(getBackendApiUrl("/cursos/mis-cursos"), {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({ message: "Respuesta invalida del servidor" }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudieron obtener tus cursos" }, { status: 500 })
  }
}
