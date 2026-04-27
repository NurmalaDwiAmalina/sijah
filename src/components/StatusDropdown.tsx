"use client";

import { useTransition } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateStatusPesananAction } from "@/lib/actions/pesanan";
import { Popover } from "./Popover";
import { useToast } from "./Toast";
import { cn } from "@/lib/cn";
import { ORDER_STATUS, ORDER_STATUS_BADGE } from "@/lib/config";

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
            ORDER_STATUS_BADGE[current as keyof typeof ORDER_STATUS_BADGE] ??
              "bg-ink-100 text-ink-700"
          )}
        >
          {pending ? "..." : current}
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      )}
    >
      {(close) => (
        <ul>
          {ORDER_STATUS.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => pick(s, close)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-xs hover:bg-brand-50",
                  s === current
                    ? "bg-brand-50/60 text-brand-700 font-semibold"
                    : "text-ink-700"
                )}
              >
                <span className={cn("inline-block rounded px-1.5 py-0.5", ORDER_STATUS_BADGE[s])}>
                  {s}
                </span>
                {s === current && <Check className="h-3.5 w-3.5 text-brand-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}
