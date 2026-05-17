import Image from "next/image"
import type { ReactNode } from "react"

import LoginPageHeader from "@/components/LoginPageHeader"

type AuthSplitLayoutProps = {
  imageSrc: string
  imageAlt: string
  children: ReactNode
  eyebrow?: string
  title?: string
  subtitle?: string
  imageSizes?: string
  imageClassName?: string
}

export default function AuthSplitLayout({
  imageSrc,
  imageAlt,
  children,
  eyebrow = "Plataforma de aprendizaje",
  title = "ASME Campus",
  subtitle = "Accedé a cursos, talleres y contenidos técnicos de ASME desde un solo lugar.",
  imageSizes = "(min-width: 1024px) 64vw, 100vw",
  imageClassName = "object-cover object-[54%_center]",
}: AuthSplitLayoutProps) {
  return (
    <div className="campus-auth relative min-h-screen overflow-hidden bg-[var(--campus-background)] text-[var(--campus-text)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--campus-primary)_12%,var(--campus-surface))_0%,color-mix(in_srgb,var(--campus-primary)_7%,var(--campus-surface))_100%)]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--campus-primary)_18%,transparent)_0%,transparent_72%)]" />
      </div>

      <LoginPageHeader />

      <main className="relative z-10 pt-24">
        <div className="flex min-h-[calc(100vh-6rem)] flex-col lg:flex-row">
          <section className="relative min-h-[24rem] border-b border-[var(--campus-secondary)] lg:min-h-[calc(100vh-6rem)] lg:flex-[1.3] lg:border-b-0 lg:border-r">
            <Image src={imageSrc} alt={imageAlt} fill priority sizes={imageSizes} className={imageClassName} />
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(121,142,161,0.78)_0%,rgba(121,142,161,0.34)_42%,rgba(245,217,139,0.28)_100%)]" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 75% 70% at 50% 55%, transparent 16%, rgba(17,17,17,0.3) 100%)",
              }}
            />

            <div className="relative z-10 flex h-full items-end">
              <div className="w-full px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
                <div className="max-w-xl rounded-[2rem] border border-[var(--campus-secondary)] bg-[rgba(255,255,255,0.2)] px-6 py-6 backdrop-blur-md sm:px-7 sm:py-7">
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--campus-text)] sm:text-[0.95rem]"
                  >
                    {eyebrow}
                  </p>
                  <div className="mt-4 h-[3px] w-24 rounded-full border border-[var(--campus-text)] bg-[var(--campus-secondary)]" />
                  <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight text-[var(--campus-text)] sm:text-5xl lg:text-[3.7rem]">
                    {title}
                  </h1>
                  <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--campus-text)] sm:text-base">{subtitle}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-6 py-8 sm:px-8 sm:py-10 lg:min-h-[calc(100vh-6rem)] lg:flex-[0.7] lg:px-14">
            <div className="auth-panel w-full max-w-md px-6 py-7 sm:px-8 sm:py-9">{children}</div>
          </section>
        </div>
      </main>
    </div>
  )
}
