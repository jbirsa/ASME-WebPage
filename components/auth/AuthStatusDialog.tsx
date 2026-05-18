"use client"

import type { ReactNode } from "react"

type DialogAction = {
  label: string
  onClick: () => void
  isLoading?: boolean
  loadingLabel?: string
}

type AuthStatusDialogProps = {
  open: boolean
  eyebrow?: string
  title: string
  description: string
  primaryAction: DialogAction
  secondaryAction?: DialogAction
  onClose: () => void
  children?: ReactNode
}

export default function AuthStatusDialog({
  open,
  eyebrow = "Estado de cuenta",
  title,
  description,
  primaryAction,
  secondaryAction,
  onClose,
  children,
}: AuthStatusDialogProps) {
  if (!open) return null

  const isBusy = Boolean(primaryAction.isLoading || secondaryAction?.isLoading)

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Cerrar dialogo"
        onClick={isBusy ? undefined : onClose}
        className="absolute inset-0 bg-[rgba(23,32,51,0.22)] backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-status-dialog-title"
        className="relative w-full max-w-md rounded-[28px] border border-[var(--campus-secondary)] bg-[var(--campus-surface)] p-6 shadow-[0_24px_80px_rgba(121,142,161,0.16)]"
      >
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">{eyebrow}</p>
        <h2 id="auth-status-dialog-title" className="mt-3 text-2xl font-semibold text-[var(--campus-text)]">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--campus-text-muted)]">{description}</p>

        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          {secondaryAction ? (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              disabled={isBusy}
              className="inline-flex rounded-2xl border border-[var(--campus-border)] bg-[var(--campus-surface)] px-4 py-2.5 text-sm font-medium text-[var(--campus-primary-deep)] transition-colors hover:bg-[var(--campus-primary-soft)] disabled:opacity-70"
            >
              {secondaryAction.isLoading
                ? secondaryAction.loadingLabel || secondaryAction.label
                : secondaryAction.label}
            </button>
          ) : null}

          <button
            type="button"
            onClick={primaryAction.onClick}
            disabled={isBusy}
            className="campus-accent-button inline-flex rounded-2xl px-4 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            {primaryAction.isLoading ? primaryAction.loadingLabel || primaryAction.label : primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  )
}
