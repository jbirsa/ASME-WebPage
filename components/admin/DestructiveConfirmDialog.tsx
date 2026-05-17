"use client"

type DestructiveConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DestructiveConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  isLoading = false,
  onConfirm,
  onCancel,
}: DestructiveConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Cerrar confirmacion"
        onClick={isLoading ? undefined : onCancel}
        className="absolute inset-0 bg-[rgba(23,32,51,0.22)] backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="destructive-dialog-title"
        className="relative w-full max-w-md rounded-[28px] border border-[var(--campus-border)] bg-[var(--campus-surface)] p-6 shadow-[0_24px_80px_rgba(121,142,161,0.16)]"
      >
        <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--campus-text-muted)]">Accion irreversible</p>
        <h2 id="destructive-dialog-title" className="mt-3 text-2xl font-semibold text-[var(--campus-text)]">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--campus-text-muted)]">{description}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex rounded-2xl border border-[var(--campus-border)] bg-[var(--campus-surface)] px-4 py-2.5 text-sm font-medium text-[var(--campus-primary-deep)] transition-colors hover:bg-[var(--campus-primary-soft)] disabled:opacity-70"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="campus-accent-button inline-flex rounded-2xl px-4 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            {isLoading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
