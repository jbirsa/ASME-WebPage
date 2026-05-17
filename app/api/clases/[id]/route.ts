import { NextRequest, NextResponse } from "next/server"

import { getBackendApiUrl } from "@/lib/backend-api"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const response = await fetch(getBackendApiUrl(`/clases/${id}`), {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({ message: "Respuesta invalida del servidor" }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo obtener la clase" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const contentType = req.headers.get("content-type") ?? ""
    const isMultipart = contentType.includes("multipart/form-data")
    const body = isMultipart ? await req.formData() : await req.json()

    const response = await fetch(getBackendApiUrl(`/clases/${id}`), {
      method: "PATCH",
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
    return NextResponse.json({ message: "No se pudo actualizar la clase" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const authorization = req.headers.get("authorization")

    if (!authorization) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    const response = await fetch(getBackendApiUrl(`/clases/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    })

    const data = await response.json().catch(() => ({ message: "Respuesta invalida del servidor" }))

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "No se pudo eliminar la clase" }, { status: 500 })
  }
}
