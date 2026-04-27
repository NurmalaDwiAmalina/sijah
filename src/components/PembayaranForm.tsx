"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ChevronDown, Wallet } from "lucide-react";
import { createPembayaranAction } from "@/lib/actions/pembayaran";
import { formatRupiah } from "@/lib/format";

type OrderOption = {
  code: string;
  pelanggan: string;
  totalHarga: number;
  dibayar: number;
  items: { judul: string; jumlah: number; hargaSatuan: number; subTotal: number }[];
  biayaTambahan: { label: string; amount: number }[];
};

export function PembayaranForm({ orders }: { orders: OrderOption[] }) {
  const [orderCode, setOrderCode] = useState("");
  const [open, setOpen] = useState(false);
  const [bayar, setBayar] = useState<number>(0);
  const [metode, setMetode] = useState<"Tunai" | "Transfer" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const order = orders.find((o) => o.code === orderCode);
  const subtotal = order?.items.reduce((a, b) => a + b.subTotal, 0) ?? 0;
  const biayaTotal = order?.biayaTambahan.reduce((a, b) => a + b.amount, 0) ?? 0;
  const total = subtotal + biayaTotal;
  const sisaSetelahBayar = order ? Math.max(0, total - order.dibayar - bayar) : 0;
  const sisaSekarang = order ? Math.max(0, total - order.dibayar) : 0;

  const filled = order && bayar > 0 && metode;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!filled) return;
    setError(null);
    startTransition(async () => {
      const res = await createPembayaranAction({
        orderCode,
        jumlah: bayar,
        metode: metode!,
      });
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-end gap-3 mb-5 -mt-4">
        <Link href="/pembayaran" className="btn-secondary !py-2.5 !px-5">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={!filled || pending}
          className="btn-primary !py-2.5 !px-7"
        >
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-[#FFD1C9] px-4 py-2 text-sm text-[#FF4B4B]">
          {error}
        </p>
      )}

      <div className="card p-7">
        <h2 className="text-xl font-bold text-ink-900">Buat Pembayaran Baru</h2>
        <p className="text-sm text-ink-500 mt-1 mb-6">
          Masukkan nominal uang yang diterima untuk memperbarui status tagihan pesanan.
        </p>

        <h3 className="text-base font-semibold text-ink-900 mb-3">General</h3>

        <div>
          <label className="label-base">ID Pesanan</label>
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm w-72"
            >
              <span className={order ? "text-ink-900" : "text-ink-500"}>
                {order ? `${order.code} — ${order.pelanggan}` : "Pilih ID Pesanan"}
              </span>
              <ChevronDown className="h-4 w-4 text-ink-400" />
            </button>
            {open && (
              <ul className="absolute z-10 mt-1 w-72 rounded-xl border border-ink-200 bg-white shadow-lg max-h-64 overflow-auto">
                {orders.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-ink-500">
                    Tidak ada pesanan yang masih perlu dibayar
                  </li>
                ) : (
                  orders.map((o) => (
                    <li key={o.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderCode(o.code);
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50"
                      >
                        <span className="text-ink-500 mr-2">{o.code}</span>
                        {o.pelanggan}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-ink-700 mb-2">Detail Pesanan</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-50 text-ink-700">
                  <th className="text-left font-semibold px-4 py-3 rounded-l-lg">Judul Ukuran</th>
                  <th className="text-right font-semibold px-4 py-3">Jumlah</th>
                  <th className="text-right font-semibold px-4 py-3">Harga Satuan</th>
                  <th className="text-right font-semibold px-4 py-3 rounded-r-lg">Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {!order ? (
                  <tr>
                    <td colSpan={4} className="text-center text-sm text-ink-400 py-6">
                      Pilih ID Pesanan terlebih dahulu, maka detail pesanan akan muncul di tabel ini
                    </td>
                  </tr>
                ) : (
                  order.items.map((it, i) => (
                    <tr key={i} className="border-b border-ink-100 last:border-0">
                      <td className="px-4 py-3.5 text-ink-700">{it.judul}</td>
                      <td className="px-4 py-3.5 text-right text-ink-700">{it.jumlah}</td>
                      <td className="px-4 py-3.5 text-right text-ink-500">
                        {formatRupiah(it.hargaSatuan)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-ink-700">
                        {formatRupiah(it.subTotal)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {order && (
                <tfoot>
                  <tr className="border-b border-ink-100">
                    <td colSpan={3} className="px-4 py-3 text-right text-ink-700">Total</td>
                    <td className="px-4 py-3 text-right text-ink-900 font-medium">
                      {formatRupiah(subtotal)}
                    </td>
                  </tr>
                  {order.biayaTambahan.map((b, i) => (
                    <tr key={i} className="border-b border-ink-100">
                      <td className="px-4 py-3 text-ink-500" colSpan={3}>{b.label}</td>
                      <td className="px-4 py-3 text-right text-ink-700">{formatRupiah(b.amount)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-semibold text-ink-900">
                      Total Harga Pesanan
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-ink-900">
                      {formatRupiah(total)}
                    </td>
                  </tr>
                  {order.dibayar > 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right text-ink-500">
                        Sudah Dibayar
                      </td>
                      <td className="px-4 py-2 text-right text-ink-700">
                        {formatRupiah(order.dibayar)}
                      </td>
                    </tr>
                  )}
                </tfoot>
              )}
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[280px]">
            <label className="label-base">Jumlah Bayar</label>
            <div className="relative">
              <input
                type="number"
                value={bayar || ""}
                onChange={(e) => setBayar(Number(e.target.value) || 0)}
                placeholder="Rp 000"
                className="input-base pr-10"
              />
              <Wallet className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            </div>
          </div>
          <div className="text-sm">
            <p className="text-ink-500">Sisa Tagihan {bayar ? "(setelah bayar)" : ""}</p>
            <p className="font-bold text-ink-900 text-right text-lg mt-1">
              {formatRupiah(bayar ? sisaSetelahBayar : sisaSekarang)}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="label-base">Metode Pembayaran</p>
          <div className="flex items-center gap-3">
            {(["Tunai", "Transfer"] as const).map((m) => (
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
      </div>
    </form>
  );
}
