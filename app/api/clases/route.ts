import { NextRequest, NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/backend-api"

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const response = await fetch(getBackendApiUrl("/clases"), {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({ message: "Respuesta invalida del servidor" }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudieron obtener las clases" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const contentType = req.headers.get("content-type") ?? ""
    const isMultipart = contentType.includes("multipart/form-data")
    const body = isMultipart ? await req.formData() : await req.json()

    const response = await fetch(getBackendApiUrl("/clases"), {
      method: "POST",
      headers: {
        Authorization: authorization,
        ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      },
      body: isMultipart ? body : JSON.stringify(body),
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({ message: "Respuesta invalida del servidor" }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo crear la clase" }, { status: 500 })
  }
}
