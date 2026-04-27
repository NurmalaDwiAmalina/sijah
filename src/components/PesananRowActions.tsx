"use client";

import { RowActions } from "./RowActions";
import { deletePesananAction } from "@/lib/actions/pesanan";

export function PesananRowActions({ code, judul }: { code: string; judul: string }) {
  return (
    <RowActions
      detailHref={`/pesanan/${code}`}
      editHref={`/pesanan/${code}/edit`}
      deleteAction={async () => {
        try {
          await deletePesananAction(code);
        } catch (err) {
          if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) return;
          return { error: "Gagal menghapus pesanan" };
        }
      }}
      deleteTitle="Mau Hapus Pesanan ini?"
      deleteDescription={`Pesanan ${code} (${judul}) beserta seluruh pembayarannya akan dihapus.`}
      onDeleted={{ title: "Berhasil Menghapus Pesanan", description: code }}
    />
  );
}
