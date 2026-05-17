"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import { BookMarked, ChevronRight, LayoutGrid, LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react"

import {
  AUTH_TOKEN_CHANGED_EVENT,
  clearAuthToken,
  getAuthTokenPayload,
  isAdminAuthPayload,
  type AuthTokenPayload,
} from "@/lib/auth-token"
import { campusOutlineButtonClassName } from "@/lib/campus-theme"
import { cn } from "@/lib/utils"

type BreadcrumbItem = {
  label: string
  href?: string
}

type LearningShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  contentClassName?: string
}

type LearningNavItem = {
  href: string
  label: string
  icon: typeof LayoutGrid
  match: (pathname: string) => boolean
}

function formatRole(role?: string | null) {
  if (role === "admin") return "Administrador"
  if (role === "user") return "Alumno"
  return "Sesion activa"
}

function getUserLabel(user: AuthTokenPayload | null) {
  if (user?.email) return user.email
  return "Usuario ASME"
}

function getUserInitial(user: AuthTokenPayload | null) {
  return getUserLabel(user).charAt(0).toUpperCase()
}

function LearningNavLink({
  item,
  pathname,
  onClick,
}: {
  item: LearningNavItem
  pathname: string
  onClick?: () => void
}) {
  const isActive = item.match(pathname)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
        isActive
          ? "border border-[var(--campus-secondary)] bg-[var(--campus-primary-soft)] text-[var(--campus-text)] shadow-[0_14px_30px_rgba(121,142,161,0.12)]"
          : "border border-transparent bg-transparent text-[var(--campus-text)] hover:border-[var(--campus-border-soft)] hover:bg-[var(--campus-surface)] hover:text-[var(--campus-text)] hover:shadow-[0_10px_22px_rgba(121,142,161,0.08)]",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
          isActive
            ? "border-[var(--campus-secondary)] bg-[var(--campus-surface)] text-[var(--campus-text)]"
            : "border-[var(--campus-border-soft)] bg-[var(--campus-surface)] text-[var(--campus-text)]",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span>{item.label}</span>
    </Link>
  )
}

export default function LearningShell({
  title,
  description,
  actions,
  children,
  breadcrumbs,
  contentClassName,
}: LearningShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<AuthTokenPayload | null>(null)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    const syncUser = () => {
      setUser(getAuthTokenPayload())
    }

    syncUser()
    window.addEventListener("storage", syncUser)
    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, syncUser as EventListener)

    return () => {
      window.removeEventListener("storage", syncUser)
      window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, syncUser as EventListener)
    }
  }, [])

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  const navItems = useMemo(() => {
    const items: LearningNavItem[] = [
      {
        href: "/cursos",
        label: "Catalogo",
        icon: LayoutGrid,
        match: (currentPathname) => {
          if (currentPathname === "/cursos") return true
          return isAdminAuthPayload(user) && currentPathname.startsWith("/cursos/")
        },
      },
      {
        href: "/perfil",
        label: "Mi perfil",
        icon: UserRound,
        match: (currentPathname) => currentPathname === "/perfil",
      },
    ]

    if (!isAdminAuthPayload(user)) {
      items.splice(1, 0, {
        href: "/mis-cursos",
        label: "Mis cursos",
        icon: BookMarked,
        match: (currentPathname) => currentPathname === "/mis-cursos" || currentPathname.startsWith("/cursos/"),
      })
    }

    if (isAdminAuthPayload(user)) {
      items.push({
        href: "/admin",
        label: "Admin",
        icon: ShieldCheck,
        match: (currentPathname) => currentPathname === "/admin" || currentPathname.startsWith("/admin/"),
      })
    }

    return items
  }, [user])

  const handleLogout = () => {
    clearAuthToken()
    router.replace("/login")
  }

  const navigationContent = (
    <div className="flex h-full min-h-full flex-col gap-6 p-4 md:p-5">
      <div className="flex items-center gap-3 px-3 pt-2">
        <Link href="/cursos" className="relative block h-12 w-12 shrink-0">
          <Image src="/asme_logo_blanco.png" alt="ASME" fill sizes="48px" className="object-contain" priority />
        </Link>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--campus-text-muted)]">ASME</p>
          <p className="text-lg font-semibold text-[var(--campus-text)]">Campus</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <LearningNavLink key={item.href} item={item} pathname={pathname} onClick={() => setIsMobileNavOpen(false)} />
        ))}
      </nav>

      <div className="mt-auto border-t border-[color-mix(in_srgb,var(--campus-secondary)_78%,transparent)] pt-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--campus-secondary)] bg-[var(--campus-primary-soft)] text-sm font-semibold text-[var(--campus-text)]">
            {getUserInitial(user)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--campus-text)]">{getUserLabel(user)}</p>
            <p className="truncate text-xs text-[var(--campus-text-muted)]">{formatRole(user?.rol)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={cn(campusOutlineButtonClassName, "mt-3 w-full gap-2 py-3")}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </button>

        <Link
          href="/"
          className="mt-4 inline-flex px-2 text-xs font-medium text-[var(--campus-text-muted)] transition-colors hover:text-[var(--campus-primary-deep)]"
        >
          Volver al sitio ASME
        </Link>
      </div>
    </div>
  )

  return (
    <div className="campus-app min-h-screen bg-[var(--campus-background)] text-[var(--campus-text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--campus-background)]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--campus-primary)_14%,transparent)_0%,transparent_72%)]" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 overflow-y-auto border-r border-[var(--campus-secondary)] bg-[var(--campus-primary)] lg:block">
        {navigationContent}
      </aside>

      <div className="lg:pl-64">
        {isMobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Cerrar navegacion privada"
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute inset-0 bg-[rgba(23,32,51,0.24)] backdrop-blur-sm"
            />

            <aside className="absolute inset-y-0 left-0 w-[84vw] max-w-sm overflow-y-auto border-r border-[var(--campus-secondary)] bg-[var(--campus-primary)] shadow-2xl">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--campus-border-soft)] bg-[var(--campus-surface)] text-[var(--campus-text)] transition-colors hover:bg-[var(--campus-primary-soft)]"
                aria-label="Cerrar menu"
              >
                <X className="h-5 w-5" />
              </button>
              {navigationContent}
            </aside>
          </div>
        ) : null}

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--campus-border-soft)] bg-[var(--campus-surface)] text-[var(--campus-text)] transition-colors hover:bg-[var(--campus-primary-soft)]"
              aria-label="Abrir navegacion privada"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              href="/perfil"
              aria-label="Abrir perfil"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--campus-border-soft)] bg-[var(--campus-surface)] text-sm font-semibold text-[var(--campus-text)] transition-colors hover:bg-[var(--campus-primary-soft)]"
            >
              {getUserInitial(user)}
            </Link>
          </div>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              {breadcrumbs?.length ? (
                <nav className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <span key={`${breadcrumb.label}-${index}`} className="flex items-center gap-2">
                      {breadcrumb.href ? (
                        <Link href={breadcrumb.href} className="transition-colors hover:text-[var(--campus-primary-deep)]">
                          {breadcrumb.label}
                        </Link>
                      ) : (
                        <span className="text-[var(--campus-primary-deep)]">{breadcrumb.label}</span>
                      )}
                      {index < breadcrumbs.length - 1 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
                    </span>
                  ))}
                </nav>
              ) : null}

              <h1 className="text-3xl font-semibold tracking-tight text-[var(--campus-text)] md:text-[2.2rem]">{title}</h1>
              {description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--campus-text-muted)]">{description}</p> : null}
            </div>

            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          <div className={cn("space-y-6", contentClassName)}>{children}</div>
        </main>
      </div>
    </div>
  )
}
