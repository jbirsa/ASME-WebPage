import { NextRequest, NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/backend-api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch(getBackendApiUrl("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({ message: "Respuesta invalida del servidor" }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo iniciar sesion" }, { status: 500 })
  }
}
