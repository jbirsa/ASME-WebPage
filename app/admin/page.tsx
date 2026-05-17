"use client"

import Link from "next/link"
import { BookOpenCheck, CalendarDays, FolderKanban } from "lucide-react"

import AdminShell from "@/components/admin/AdminShell"
import { campusCardClassName } from "@/lib/campus-theme"

const resources = [
  {
    href: "/admin/cursos",
    title: "Cursos",
    description: "Gestiona los cursos del catalogo.",
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
    description: "Gestiona los eventos.",
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
              className={`${campusCardClassName} p-5`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--campus-border)] bg-[var(--campus-primary-soft)] text-[var(--campus-text)]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-[var(--campus-text)]">{resource.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--campus-text-muted)]">{resource.description}</p>
            </Link>
          )
        })}
      </section>
    </AdminShell>
  )
}
