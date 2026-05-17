"use client"

import { useRouter } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"

import LearningShell from "@/components/learning/LearningShell"
import { getAuthToken, getAuthTokenPayload, isAdminAuthPayload } from "@/lib/auth-token"

type AdminShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export default function AdminShell({ title, description, actions, children, breadcrumbs }: AdminShellProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"checking" | "ready">("checking")

  useEffect(() => {
    const token = getAuthToken()
    const payload = getAuthTokenPayload()

    if (!token) {
      router.replace("/login")
      return
    }

    if (!isAdminAuthPayload(payload)) {
      router.replace("/cursos")
      return
    }

    setStatus("ready")
  }, [router])

  if (status !== "ready") {
    return <div className="campus-app flex min-h-screen items-center justify-center bg-[var(--campus-background)] text-[var(--campus-text-muted)]">Verificando permisos...</div>
  }

  return (
    <LearningShell title={title} description={description} actions={actions} breadcrumbs={breadcrumbs}>
      {children}
    </LearningShell>
  )
}
