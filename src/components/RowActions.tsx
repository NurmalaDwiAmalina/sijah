"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";

export function RowActions({
  detailHref,
  onDelete,
  deleteConfirm = "Yakin hapus item ini?",
}: {
  detailHref: string;
  onDelete?: () => Promise<{ error?: string } | void>;
  deleteConfirm?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function handleDelete() {
    if (!onDelete) return;
    setOpen(false);
    if (!confirm(deleteConfirm)) return;
    startTransition(async () => {
      const res = await onDelete();
      if (res && "error" in res && res.error) alert(res.error);
      else router.refresh();
    });
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        disabled={pending}
        className="text-ink-500 hover:text-ink-900 p-1 rounded hover:bg-ink-100"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      {open && (
        <ul className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-ink-200 bg-white shadow-lg overflow-hidden">
          <li>
            <Link
              href={detailHref}
              className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              <Eye className="h-4 w-4" />
              Detail
            </Link>
          </li>
          {onDelete && (
            <li>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF4B4B] hover:bg-[#FFD1C9]/40"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
