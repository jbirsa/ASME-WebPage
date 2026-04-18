"use client"

import { Fingerprint, Mail, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import LearningShell from "@/components/learning/LearningShell"
import { getAuthToken, getAuthTokenPayload, type AuthTokenPayload } from "@/lib/auth-token"

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
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center text-slate-400 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          Cargando perfil...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5f87ab]/20 text-[#dbe9f6]">
                <Mail className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Correo</p>
              <p className="mt-2 break-all text-sm font-medium text-white">{user?.email || "No disponible"}</p>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5f87ab]/20 text-[#dbe9f6]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Rol</p>
              <p className="mt-2 text-sm font-medium text-white">{formatRole(user?.rol)}</p>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5f87ab]/20 text-[#dbe9f6]">
                <Fingerprint className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Usuario</p>
              <p className="mt-2 break-all text-sm font-medium text-white">{user?.sub || "No disponible"}</p>
            </article>
          </div>

          <section className="rounded-3xl border border-white/10 bg-[#0b1627]/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#5f87ab]">Proximo paso</p>
            <h2 className="mt-3 text-xl font-semibold text-white">Perfil basico listo para crecer</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Esta pantalla ya expone los datos disponibles en el JWT. Cuando exista un endpoint de perfil real en backend,
              aca se podran sumar cambios de nombre, preferencias y accesos administrativos mas completos.
            </p>
          </section>
        </>
      )}
    </LearningShell>
  )
}
