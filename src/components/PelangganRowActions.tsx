"use client";

import { RowActions } from "./RowActions";
import { deletePelangganAction } from "@/lib/actions/pelanggan";

export function PelangganRowActions({ code, nama }: { code: string; nama: string }) {
  return (
    <RowActions
      detailHref={`/pelanggan/${code}`}
      editHref={`/pelanggan/${code}`}
      deleteAction={async () => {
        const res = await deletePelangganAction(code);
        return res?.error ? { error: res.error } : undefined;
      }}
      deleteTitle="Mau Hapus Pelanggan ini?"
      deleteDescription={`Pelanggan ${nama} akan dihapus permanen.`}
      onDeleted={{ title: "Berhasil Menghapus Pelanggan", description: nama }}
    />
  );
}
