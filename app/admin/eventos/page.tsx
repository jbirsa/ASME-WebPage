"use client"

import Link from "next/link"

import AdminShell from "@/components/admin/AdminShell"

export default function AdminEventosPage() {
  return (
    <AdminShell
      title="Admin de eventos"
      breadcrumbs={[
        { label: "Campus", href: "/cursos" },
        { label: "Admin", href: "/admin" },
        { label: "Eventos" },
      ]}
      actions={
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.06]"
        >
          Volver al panel
        </Link>
      }
    >
      <section className="rounded-2xl border border-white/10 bg-[#0d1726] p-6">
        <p className="text-sm leading-7 text-slate-300">
          Esta seccion queda lista como parte del shell admin, pero el ABM real de eventos se implementa despues de migrar
          eventos desde Supabase al backend Nest.
        </p>
      </section>
    </AdminShell>
  )
}
