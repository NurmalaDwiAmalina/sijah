"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { updatePembayaranAction } from "@/lib/actions/pembayaran";
import { useToast } from "./Toast";
import { formatRupiah } from "@/lib/format";
import { PAYMENT_METHOD, type PaymentMethod } from "@/lib/config";

export function PembayaranEditForm({
  code,
  order,
  totalDibayarLain,
  initial,
}: {
  code: string;
  order: { code: string; pelanggan: string; totalHarga: number };
  totalDibayarLain: number;
  initial: { jumlah: number; metode: "Tunai" | "Transfer"; catatan: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [jumlah, setJumlah] = useState<number>(initial.jumlah);
  const [metode, setMetode] = useState<PaymentMethod>(initial.metode);
  const [catatan, setCatatan] = useState(initial.catatan);

  const sisaSetelahEdit = Math.max(0, order.totalHarga - totalDibayarLain - jumlah);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updatePembayaranAction(code, { jumlah, metode, catatan });
      if (res?.error) toast.error("Gagal", res.error);
      else {
        toast.success("Pembayaran diperbarui", code);
        router.push(`/pembayaran/${code}`);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-end gap-3 mb-5 -mt-4">
        <Link href={`/pembayaran/${code}`} className="btn-secondary !py-2.5 !px-5">
          Cancel
        </Link>
        <button type="submit" disabled={pending || jumlah <= 0} className="btn-primary !py-2.5 !px-7">
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <div className="card p-7 space-y-5">
        <div>
          <p className="text-xs text-ink-500">Pesanan</p>
          <p className="text-base font-semibold text-ink-900">
            {order.code} — {order.pelanggan}
          </p>
          <p className="text-xs text-ink-500 mt-1">
            Total pesanan: {formatRupiah(order.totalHarga)} • Pembayaran lain: {formatRupiah(totalDibayarLain)}
          </p>
        </div>

        <div>
          <label className="label-base">Jumlah Bayar</label>
          <div className="relative">
            <input
              type="number"
              value={jumlah || ""}
              onChange={(e) => setJumlah(Number(e.target.value) || 0)}
              className="input-base pr-10"
            />
            <Wallet className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          </div>
          <p className="mt-1 text-xs text-ink-500">
            Sisa setelah edit: <b>{formatRupiah(sisaSetelahEdit)}</b>
          </p>
        </div>

        <div>
          <p className="label-base">Metode Pembayaran</p>
          <div className="flex items-center gap-3">
            {PAYMENT_METHOD.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetode(m)}
                className={
                  "rounded-lg border px-5 py-2 text-sm font-medium transition " +
                  (metode === m
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-ink-200 bg-white text-brand-600 hover:bg-brand-50")
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-base">Catatan</label>
          <input
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Opsional"
            className="input-base"
          />
        </div>
      </div>
    </form>
  );
}
