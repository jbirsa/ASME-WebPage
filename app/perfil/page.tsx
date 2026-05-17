"use client"

import { Mail, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import LearningShell from "@/components/learning/LearningShell"
import { getAuthToken, getAuthTokenPayload, type AuthTokenPayload } from "@/lib/auth-token"
import { campusCardClassName } from "@/lib/campus-theme"

function formatRole(role?: string | null) {
  if (role === "admin") return "Administrador"
  if (role === "user") return "Alumno"
  return "Sin rol detectado"
}

export default function PerfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthTokenPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.replace("/login")
      return
    }

    setUser(getAuthTokenPayload())
    setIsLoading(false)
  }, [router])

  return (
    <LearningShell
      title="Mi perfil"
      breadcrumbs={[{ label: "Campus", href: "/cursos" }, { label: "Mi perfil" }]}
    >
      {isLoading ? (
        <div className={`${campusCardClassName} rounded-3xl px-6 py-12 text-center text-[var(--campus-text-muted)]`}>
          Cargando perfil...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <article className={`${campusCardClassName} rounded-3xl p-5`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--campus-border-soft)] bg-[var(--campus-primary-soft)] text-[var(--campus-text)]">
              <Mail className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--campus-text-muted)]">Correo</p>
            <p className="mt-2 break-all text-sm font-medium text-[var(--campus-text)]">{user?.email || "No disponible"}</p>
          </article>

          <article className={`${campusCardClassName} rounded-3xl p-5`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--campus-border-soft)] bg-[var(--campus-primary-soft)] text-[var(--campus-text)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--campus-text-muted)]">Rol</p>
            <p className="mt-2 text-sm font-medium text-[var(--campus-text)]">{formatRole(user?.rol)}</p>
          </article>
        </div>
      )}
    </LearningShell>
  )
}
