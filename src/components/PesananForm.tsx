"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { createPesananAction } from "@/lib/actions/pesanan";
import { formatRupiah } from "@/lib/format";

type CustomerOption = {
  code: string;
  nama: string;
  measurements: { id: string; judul: string; catatan: string | null }[];
};

type ItemRow = {
  measurementId: string;
  selected: boolean;
  jumlah: number;
  hargaSatuan: number;
};

type Biaya = { label: string; amount: number };

export function PesananForm({ customers }: { customers: CustomerOption[] }) {
  const [judul, setJudul] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [open, setOpen] = useState(false);
  const [tglMasuk, setTglMasuk] = useState("");
  const [tglEstimasi, setTglEstimasi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [rows, setRows] = useState<Record<string, ItemRow>>({});
  const [biaya, setBiaya] = useState<Biaya[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedCustomer = customers.find((c) => c.code === customerCode);
  const ukuran = selectedCustomer?.measurements ?? [];

  const subtotal = useMemo(
    () =>
      ukuran.reduce((acc, u) => {
        const r = rows[u.id];
        if (!r?.selected) return acc;
        return acc + r.jumlah * r.hargaSatuan;
      }, 0),
    [rows, ukuran]
  );
  const biayaTotal = biaya.reduce((a, b) => a + (b.amount || 0), 0);
  const total = subtotal + biayaTotal;

  function setRow(id: string, patch: Partial<ItemRow>) {
    setRows((prev) => {
      const base: ItemRow = prev[id] ?? {
        measurementId: id,
        selected: false,
        jumlah: 1,
        hargaSatuan: 0,
      };
      return { ...prev, [id]: { ...base, ...patch, measurementId: id } };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const items = ukuran
      .filter((u) => rows[u.id]?.selected)
      .map((u) => ({
        measurementId: u.id,
        jumlah: rows[u.id].jumlah || 1,
        hargaSatuan: rows[u.id].hargaSatuan || 0,
      }));

    startTransition(async () => {
      const res = await createPesananAction({
        judul,
        customerCode,
        tglMasuk,
        tglEstimasi,
        catatan,
        items,
        biaya: biaya.filter((b) => b.label.trim() && b.amount > 0),
      });
      if (res?.error) setError(res.error);
    });
  }

  const filled =
    judul && customerCode && tglMasuk && tglEstimasi &&
    Object.values(rows).some((r) => r.selected);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-end gap-3 mb-5 -mt-4">
        <Link href="/pesanan" className="btn-secondary !py-2.5 !px-5">
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
        <h2 className="text-xl font-bold text-ink-900">Buat Pesanan Baru</h2>
        <p className="text-sm text-ink-500 mt-1 mb-6">
          Lengkapi detail pesanan, pilih pelanggan, dan tentukan ukuran yang digunakan.
        </p>

        <h3 className="text-base font-semibold text-ink-900 mb-3">General</h3>

        <div>
          <label className="label-base">Judul Pesanan</label>
          <div className="relative">
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul pesanan"
              className="input-base pr-10"
            />
            <ClipboardList className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          </div>
        </div>

        <div className="mt-5">
          <label className="label-base">Nama Pelanggan</label>
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm w-72"
            >
              <span className={selectedCustomer ? "text-ink-900" : "text-ink-500"}>
                {selectedCustomer?.nama ?? "Pilih Pelanggan"}
              </span>
              <ChevronDown className="h-4 w-4 text-ink-400" />
            </button>
            {open && (
              <ul className="absolute z-10 mt-1 w-72 rounded-xl border border-ink-200 bg-white shadow-lg max-h-64 overflow-auto">
                {customers.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerCode(c.code);
                        setOpen(false);
                        setRows({});
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50"
                    >
                      <span className="text-ink-500 mr-2">{c.code}</span>
                      {c.nama}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-ink-700 mb-2">Ukuran Pelanggan</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-50 text-ink-700">
                  <th className="text-left font-semibold px-4 py-3 rounded-l-lg w-10"></th>
                  <th className="text-left font-semibold px-4 py-3">Judul Ukuran</th>
                  <th className="text-left font-semibold px-4 py-3">Catatan</th>
                  <th className="text-right font-semibold px-4 py-3">Jumlah</th>
                  <th className="text-right font-semibold px-4 py-3">Harga Satuan</th>
                  <th className="text-right font-semibold px-4 py-3 rounded-r-lg">Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {!selectedCustomer ? (
                  <tr>
                    <td colSpan={6} className="text-center text-sm text-ink-400 py-6">
                      Pilih pelanggan terlebih dahulu, maka ukuran yang sudah dibuat akan
                      muncul di tabel ini
                    </td>
                  </tr>
                ) : ukuran.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-sm text-ink-400 py-6">
                      Pelanggan ini belum punya ukuran. Tambahkan dulu di halaman pelanggan.
                    </td>
                  </tr>
                ) : (
                  ukuran.map((u) => {
                    const r = rows[u.id] ?? {
                      measurementId: u.id,
                      selected: false,
                      jumlah: 1,
                      hargaSatuan: 0,
                    };
                    return (
                      <tr key={u.id} className="border-b border-ink-100 last:border-0">
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={r.selected}
                            onChange={(e) => setRow(u.id, { selected: e.target.checked })}
                            className="h-5 w-5 rounded accent-brand-600"
                          />
                        </td>
                        <td className="px-4 py-3.5 text-ink-700">{u.judul}</td>
                        <td className="px-4 py-3.5 text-ink-500">{u.catatan ?? "-"}</td>
                        <td className="px-4 py-3.5 text-right">
                          <input
                            type="number"
                            min={1}
                            value={r.jumlah}
                            onChange={(e) =>
                              setRow(u.id, { jumlah: Number(e.target.value) || 1 })
                            }
                            className="w-16 rounded-md border border-ink-200 px-2 py-1 text-right"
                          />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={r.hargaSatuan || ""}
                            placeholder="0"
                            onChange={(e) =>
                              setRow(u.id, { hargaSatuan: Number(e.target.value) || 0 })
                            }
                            className="w-32 rounded-md border border-ink-200 px-2 py-1 text-right"
                          />
                        </td>
                        <td className="px-4 py-3.5 text-right text-ink-700">
                          {formatRupiah(r.jumlah * r.hargaSatuan)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {selectedCustomer && ukuran.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={5} className="px-4 py-3.5 text-right font-medium text-ink-700">
                      Total
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-ink-900">
                      {formatRupiah(total)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="mt-3 space-y-2">
            {biaya.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={b.label}
                  onChange={(e) =>
                    setBiaya(
                      biaya.map((x, idx) =>
                        idx === i ? { ...x, label: e.target.value } : x
                      )
                    )
                  }
                  placeholder="Label biaya (mis. Biaya kilat)"
                  className="input-base !py-2 flex-1"
                />
                <input
                  type="number"
                  value={b.amount || ""}
                  onChange={(e) =>
                    setBiaya(
                      biaya.map((x, idx) =>
                        idx === i ? { ...x, amount: Number(e.target.value) || 0 } : x
                      )
                    )
                  }
                  placeholder="Nominal"
                  className="input-base !py-2 w-40 text-right"
                />
                <button
                  type="button"
                  onClick={() => setBiaya(biaya.filter((_, idx) => idx !== i))}
                  className="text-[#FF4B4B] p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setBiaya([...biaya, { label: "", amount: 0 }])}
              className="btn-secondary !py-2 !px-3 text-xs"
            >
              Biaya Tambahan <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <h3 className="mt-8 text-base font-semibold text-ink-900 mb-3">Informasi Lainnya</h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label-base">Tanggal Masuk</label>
            <div className="relative">
              <input
                type="date"
                value={tglMasuk}
                onChange={(e) => setTglMasuk(e.target.value)}
                className="input-base pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="label-base">Tanggal Estimasi Selesai</label>
            <div className="relative">
              <input
                type="date"
                value={tglEstimasi}
                onChange={(e) => setTglEstimasi(e.target.value)}
                className="input-base pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="label-base">Referensi Gambar</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Upload gambar referensi (opsional, segera hadir)"
              disabled
              className="input-base pr-10 disabled:bg-ink-50"
            />
            <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          </div>
        </div>

        <div className="mt-5">
          <label className="label-base">Catatan</label>
          <div className="relative">
            <input
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tambahkan catatan"
              className="input-base pr-10"
            />
            <ClipboardList className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          </div>
        </div>
      </div>
    </form>
  );
}
