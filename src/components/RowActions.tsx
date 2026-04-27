"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Eye, Trash2, Pencil } from "lucide-react";
import { Popover } from "./Popover";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";

type DeleteResult = { error?: string } | void;

export function RowActions({
  detailHref,
  editHref,
  deleteAction,
  deleteTitle = "Mau Hapus item ini?",
  deleteDescription = "Item yang sudah dihapus tidak dapat dipulihkan.",
  onDeleted,
}: {
  detailHref: string;
  editHref?: string;
  deleteAction?: () => Promise<DeleteResult>;
  deleteTitle?: string;
  deleteDescription?: string;
  onDeleted?: { title: string; description?: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!deleteAction) return;
    startTransition(async () => {
      try {
        const res = await deleteAction();
        if (res && "error" in res && res.error) {
          toast.error("Gagal menghapus", res.error);
        } else if (onDeleted) {
          toast.deleted(onDeleted.title, onDeleted.description);
        }
        setConfirmOpen(false);
        router.refresh();
      } catch (err) {
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) return;
        toast.error("Gagal menghapus", "Terjadi kesalahan");
        setConfirmOpen(false);
      }
    });
  }

  return (
    <>
      <Popover
        align="right"
        width={150}
        trigger={({ onClick, ref }) => (
          <button
            ref={ref}
            type="button"
            onClick={onClick}
            className="text-ink-500 hover:text-ink-900 p-1 rounded hover:bg-ink-100"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      >
        {(close) => (
          <ul>
            <li>
              <Link
                href={detailHref}
                onClick={close}
                className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-brand-50"
              >
                <Eye className="h-4 w-4" /> Detail
              </Link>
            </li>
            {editHref && (
              <li>
                <Link
                  href={editHref}
                  onClick={close}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-brand-50"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
              </li>
            )}
            {deleteAction && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    setConfirmOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF4B4B] hover:bg-[#FFD1C9]/40"
                >
                  <Trash2 className="h-4 w-4" /> Hapus
                </button>
              </li>
            )}
          </ul>
        )}
      </Popover>

      <ConfirmDialog
        open={confirmOpen}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        pending={pending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
