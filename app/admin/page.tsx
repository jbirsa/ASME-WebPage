"use client"

import Link from "next/link"
import { BookOpenCheck, CalendarDays, FolderKanban } from "lucide-react"

import AdminShell from "@/components/admin/AdminShell"

const resources = [
  {
    href: "/admin/cursos",
    title: "Cursos",
    description: "Crea, edita y elimina cursos del catalogo.",
    icon: FolderKanban,
  },
  {
    href: "/admin/clases",
    title: "Clases",
    description: "Gestiona las clases dentro de cada curso.",
    icon: BookOpenCheck,
  },
  {
    href: "/admin/eventos",
    title: "Eventos",
    description: "Espacio listo para el proximo ABM de eventos.",
    icon: CalendarDays,
  },
]

export default function AdminPage() {
  return (
    <AdminShell title="Admin" breadcrumbs={[{ label: "Campus", href: "/cursos" }, { label: "Admin" }]}>
      <section className="grid gap-4 md:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon

          return (
            <Link
              key={resource.href}
              href={resource.href}
              className="rounded-2xl border border-white/10 bg-[#0d1726] p-5 transition-colors hover:border-white/20"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-100">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-white">{resource.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">{resource.description}</p>
            </Link>
          )
        })}
      </section>
    </AdminShell>
  )
}
