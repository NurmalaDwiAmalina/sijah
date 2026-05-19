"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { formatDate, formatRupiah } from "@/lib/format";
import { STATUS_COLORS } from "@/lib/config";

interface Order {
  id: string;
  code: string;
  judul: string;
  snapshotNama: string;
  totalHarga: number;
  status: string;
  statusBayar: string;
  createdAt: Date;
  tglEstimasi: Date;
  payments: Array<{ jumlah: number }>;
}

export function CekStatusModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !noWa.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/orders/search?nama=${encodeURIComponent(nama)}&noWa=${encodeURIComponent(noWa)}`
      );
      const data = await response.json();
      setOrders(data);
      setSearched(true);
    } catch (error) {
      console.error("Error searching orders:", error);
      setOrders([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ink-900">Cek Status Jahitan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ink-100 rounded-lg transition"
          >
            <X className="h-6 w-6 text-ink-900" />
          </button>
        </div>

        <p className="text-ink-700 mb-6">Masukkan data saat awal membuat pesanan</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Nama Pelanggan
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi"
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-900 mb-2">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              value={noWa}
              onChange={(e) => setNoWa(e.target.value)}
              placeholder="08..."
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600 text-sm"
            />
          </div>

          {!searched ? (
            <>
              <div className="bg-brand-50 rounded-lg p-3 mt-2">
                <p className="text-xs text-brand-600 text-center">Pesanan ditemukan</p>
              </div>
              <button
                type="submit"
                disabled={loading || !nama.trim() || !noWa.trim()}
                className="w-full py-3 bg-ink-900 text-white rounded-lg hover:bg-ink-800 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Mencari..." : "Cek Status"}
              </button>
            </>
          ) : orders.length === 0 ? (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700 font-semibold text-sm">Pesanan Tidak Ditemukan</p>
                <p className="text-red-600 text-xs mt-1">
                  Pastikan nama dan nomor WA sudah benar
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearched(false);
                  setOrders([]);
                }}
                className="w-full py-3 border-2 border-ink-900 text-ink-900 rounded-lg hover:bg-ink-50 transition font-semibold text-sm"
              >
                Coba Lagi
              </button>
            </>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const dibayar = order.payments.reduce((sum, p) => sum + p.jumlah, 0);
                const sisaBayar = Math.max(0, order.totalHarga - dibayar);

                return (
                  <div key={order.id} className="border border-ink-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold text-ink-500">ID Pesanan</p>
                        <p className="text-lg font-bold text-ink-900">{order.code}</p>
                        <p className="text-xs text-ink-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                          style={{ backgroundColor: STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] }}
                        >
                          {order.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-accent-orange">
                          {order.statusBayar}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-ink-100 py-3">
                      <p className="font-semibold text-ink-900 text-sm">{order.judul}</p>
                      <p className="text-xs text-ink-700">{order.snapshotNama}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-ink-100 text-sm">
                      <div>
                        <p className="text-xs text-ink-500 mb-1">Total Harga</p>
                        <p className="font-bold text-ink-900">{formatRupiah(order.totalHarga)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-500 mb-1">Sudah Dibayar</p>
                        <p className="font-bold text-brand-600">{formatRupiah(dibayar)}</p>
                      </div>
                      {sisaBayar > 0 && (
                        <div>
                          <p className="text-xs text-ink-500 mb-1">Sisa Bayar</p>
                          <p className="font-bold text-accent-red">{formatRupiah(sisaBayar)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-ink-500 mb-1">Deadline</p>
                        <p className="font-bold text-ink-900">{formatDate(order.tglEstimasi)}</p>
                      </div>
                    </div>

                    <button className="w-full mt-3 py-2 border-2 border-ink-200 text-ink-900 rounded-lg hover:bg-ink-50 transition font-semibold text-xs">
                      📄 Unduh Invoice
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setSearched(false);
                  setOrders([]);
                  setNama("");
                  setNoWa("");
                }}
                className="w-full py-3 border-2 border-ink-900 text-ink-900 rounded-lg hover:bg-ink-50 transition font-semibold text-sm"
              >
                Cari Lagi
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
