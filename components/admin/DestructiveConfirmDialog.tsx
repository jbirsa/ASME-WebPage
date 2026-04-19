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
        className="absolute inset-0 bg-[#02060b]/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="destructive-dialog-title"
        className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[#08111b] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
      >
        <p className="text-[11px] uppercase tracking-[0.24em] text-rose-300">Accion irreversible</p>
        <h2 id="destructive-dialog-title" className="mt-3 text-2xl font-semibold text-white">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.04] disabled:opacity-70"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/15 disabled:opacity-70"
          >
            {isLoading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
