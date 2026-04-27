"use client";

import { useTransition } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateStatusPesananAction } from "@/lib/actions/pesanan";
import { Popover } from "./Popover";
import { useToast } from "./Toast";
import { cn } from "@/lib/cn";

const STATUS_LIST = [
  "Antrean",
  "Potong Kain",
  "Dijahit",
  "Fitting",
  "Selesai",
  "Diambil",
  "Dibatalkan",
] as const;

const palette: Record<string, string> = {
  Antrean: "bg-[#DFDFDF] text-[#504F4F]",
  "Potong Kain": "bg-[#DAEEFF] text-[#008BFF]",
  Dijahit: "bg-[#FFEDB1] text-[#FFB62E]",
  Fitting: "bg-[#DEFFA7] text-[#019537]",
  Selesai: "bg-[#DEFFA7] text-[#019537]",
  Diambil: "bg-[#DEFFA7] text-[#019537]",
  Dibatalkan: "bg-[#FFD1C9] text-[#FF4B4B]",
};

export function StatusDropdown({
  code,
  current,
}: {
  code: string;
  current: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  function pick(status: string, close: () => void) {
    close();
    if (status === current) return;
    startTransition(async () => {
      const res = await updateStatusPesananAction(code, status);
      if (res?.ok) {
        toast.success("Status diperbarui", `${code} → ${status}`);
        router.refresh();
      }
    });
  }

  return (
    <Popover
      align="left"
      width={180}
      trigger={({ onClick, ref }) => (
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium hover:brightness-95 transition",
            palette[current] ?? "bg-ink-100 text-ink-700"
          )}
        >
          {pending ? "..." : current}
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      )}
    >
      {(close) => (
        <ul>
          {STATUS_LIST.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => pick(s, close)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-xs hover:bg-brand-50",
                  s === current ? "bg-brand-50/60 text-brand-700 font-semibold" : "text-ink-700"
                )}
              >
                <span className={cn("inline-block rounded px-1.5 py-0.5", palette[s])}>{s}</span>
                {s === current && <Check className="h-3.5 w-3.5 text-brand-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}
