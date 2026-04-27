"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";

export type ConfirmVariant = "danger" | "info";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  variant = "danger",
  pending,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center"
      >
        <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-[#FFD1C9]/40">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#FFD1C9]">
            <Trash2 className="h-7 w-7 text-[#FF4B4B]" strokeWidth={2.5} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-ink-900">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-ink-500">{description}</p>
        )}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-xl border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-100 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={
              "rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60 " +
              (isDanger ? "bg-brand-600 hover:brightness-110" : "bg-brand-600 hover:brightness-110")
            }
          >
            {pending ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
