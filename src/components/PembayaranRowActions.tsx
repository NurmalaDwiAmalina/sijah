"use client";

import { RowActions } from "./RowActions";
import { deletePembayaranAction } from "@/lib/actions/pembayaran";

export function PembayaranRowActions({
  code,
  pesananCode,
}: {
  code: string;
  pesananCode: string;
}) {
  return (
    <RowActions
      detailHref={`/pembayaran/${code}`}
      editHref={`/pembayaran/${code}/edit`}
      deleteAction={async () => {
        const res = await deletePembayaranAction(code);
        return res?.error ? { error: res.error } : undefined;
      }}
      deleteTitle="Mau Hapus Pembayaran ini?"
      deleteDescription={`Pembayaran ${code} (pesanan ${pesananCode}) akan dihapus & status pesanan dihitung ulang.`}
      onDeleted={{ title: "Berhasil Menghapus Pembayaran", description: code }}
    />
  );
}
