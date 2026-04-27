"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CheckCircle2, Trash2, X, AlertCircle } from "lucide-react";

type ToastVariant = "success" | "error" | "delete";
type Toast = { id: number; title: string; description?: string; variant: ToastVariant };

type Ctx = {
  show: (t: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  deleted: (title: string, description?: string) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const ctx: Ctx = {
    show,
    success: (title, description) => show({ title, description, variant: "success" }),
    error: (title, description) => show({ title, description, variant: "error" }),
    deleted: (title, description) => show({ title, description, variant: "delete" }),
  };

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const cfg = {
    success: {
      bg: "bg-[#DEFFA7]/60",
      icon: <CheckCircle2 className="h-5 w-5 text-[#019537]" />,
      iconBg: "bg-white",
    },
    error: {
      bg: "bg-[#FFD1C9]/60",
      icon: <AlertCircle className="h-5 w-5 text-[#FF4B4B]" />,
      iconBg: "bg-white",
    },
    delete: {
      bg: "bg-[#FFD1C9]/60",
      icon: <Trash2 className="h-5 w-5 text-[#FF4B4B]" />,
      iconBg: "bg-white",
    },
  }[toast.variant];

  return (
    <div className={"flex items-start gap-3 rounded-xl p-3 pr-8 shadow-lg min-w-[280px] max-w-sm relative " + cfg.bg}>
      <div className={"grid h-9 w-9 place-items-center rounded-lg flex-shrink-0 " + cfg.iconBg}>
        {cfg.icon}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-semibold text-ink-900">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-ink-700 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 text-ink-500 hover:text-ink-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
