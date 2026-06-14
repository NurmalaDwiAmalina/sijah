import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { formatDate, formatRupiah } from "@/lib/format";
import { ORDER_STATUS, STATUS_COLORS } from "@/lib/config";
import type { Order, Payment } from "@prisma/client";

export default async function CekStatusPage({
  searchParams,
}: {
  searchParams: { nama?: string; noWa?: string };
}) {
  const nama = searchParams.nama?.trim();
  const noWa = searchParams.noWa?.trim();

  let orders: (Order & { payments: Payment[] })[] = [];
  let found = false;

  if (nama && noWa) {
    orders = await prisma.order.findMany({
      where: {
        AND: [
          { snapshotNama: { contains: nama } },
          { snapshotNoWa: { contains: noWa } },
        ],
      },
      include: { payments: true },
      orderBy: { createdAt: "desc" },
    });
    found = true;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-ink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-sijah.png" alt="Sijah Asy-Syifa Logo" width={40} height={40} className="h-10 w-auto" />
            <div>
              <div className="font-black text-brand-600 text-base leading-tight">sijah Asy-Syifa</div>
              <div className="text-xs text-ink-500">Sistem Informasi Penjahit Syifa</div>
            </div>
          </Link>
          <Link
            href="/buat-pesanan"
            className="px-5 py-2 bg-brand-600 text-white text-sm rounded hover:bg-brand-700 transition font-semibold"
          >
            Buat Pesanan
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-ink-100">
          <h1 className="text-3xl font-bold text-ink-900 mb-3">Cek Status Jahitan</h1>
          <p className="text-ink-700 mb-8">
            Masukkan data sesuai saat awal membuat pesanan
          </p>

          <form className="space-y-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  name="nama"
                  defaultValue={nama || ""}
                  placeholder="Masukkan nama pelanggan"
                  className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-900 mb-2">
                  No Wa
                </label>
                <input
                  type="text"
                  name="noWa"
                  defaultValue={noWa || ""}
                  placeholder="Masukkan no WA pelanggan"
                  className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-600 text-sm"
                />
              </div>
            </div>

            <div className="bg-brand-50 rounded-lg p-4">
              <button
                type="submit"
                className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-semibold text-sm"
              >
                Cek Status
              </button>
            </div>
          </form>

          {/* Search Results */}
          {found && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-700 font-semibold mb-2">Pesanan Tidak Ditemukan</p>
                  <p className="text-red-600 text-sm">
                    Pastikan nama dan nomor WA yang Anda masukkan sudah benar.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold text-ink-900 mb-4">
                    Hasil Pencarian ({orders.length})
                  </h2>
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const dibayar = order.payments.reduce((sum, p) => sum + p.jumlah, 0);
                      const sisaBayar = Math.max(0, order.totalHarga - dibayar);

                      return (
                        <div key={order.id} className="border border-ink-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm font-semibold text-ink-500">ID Pesanan</p>
                              <p className="text-2xl font-bold text-ink-900">{order.code}</p>
                              <p className="text-xs text-ink-500 mt-1">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="flex gap-2">
                              <span
                                className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                                style={{ backgroundColor: STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] || "#666" }}
                              >
                                {order.status}
                              </span>
                              <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-accent-orange">
                                {order.statusBayar}
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-ink-100 py-4">
                            <p className="font-semibold text-ink-900 mb-1">{order.judul}</p>
                            <p className="text-sm text-ink-700">{order.snapshotNama}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 py-4 border-t border-ink-100">
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

                          <button className="w-full mt-4 py-3 border-2 border-ink-200 text-ink-900 rounded-lg hover:bg-ink-50 transition font-semibold text-sm flex items-center justify-center gap-2">
                            📄 Unduh Invoice
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
