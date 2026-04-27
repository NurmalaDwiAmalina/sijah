"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";
import { deletePesananAction } from "@/lib/actions/pesanan";
import { Pencil, Trash2 } from "lucide-react";

export function PesananDetailActions({ code, judul }: { code: string; judul: string }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deletePesananAction(code);
      } catch (err) {
        if (!(err instanceof Error && err.message.includes("NEXT_REDIRECT"))) {
          toast.error("Gagal menghapus");
          setOpen(false);
          return;
        }
      }
      toast.deleted("Pesanan dihapus", code);
      router.push("/pesanan");
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-danger !py-2.5 !px-5"
      >
        <Trash2 className="h-4 w-4" /> Hapus
      </button>
      <Link href={`/pesanan/${code}/edit`} className="btn-primary !py-2.5 !px-5">
        <Pencil className="h-4 w-4" /> Edit
      </Link>
      <ConfirmDialog
        open={open}
        title="Mau Hapus Pesanan ini?"
        description={`Pesanan ${code} (${judul}) beserta pembayarannya akan dihapus permanen.`}
        confirmLabel="Ya, Hapus"
        pending={pending}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
