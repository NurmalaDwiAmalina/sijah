import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusDropdown } from "@/components/StatusDropdown";
import { PesananDetailActions } from "@/components/PesananDetailActions";
import { ChevronRight, ImageIcon } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PesananDetailPage({
  params,
}: {
  params: { code: string };
}) {
  const order = await prisma.order.findUnique({
    where: { code: params.code },
    include: {
      items: true,
      additionalCosts: true,
      payments: { orderBy: { createdAt: "desc" } },
      customer: true,
    },
  });
  if (!order) notFound();

  const subtotal = order.items.reduce((a, b) => a + b.subTotal, 0);
  const biayaTotal = order.additionalCosts.reduce((a, b) => a + b.amount, 0);
  const totalDibayar = order.payments.reduce((a, b) => a + b.jumlah, 0);
  const sisa = Math.max(0, order.totalHarga - totalDibayar);

  return (
    <DashboardShell>
      <div className="flex items-start justify-between mb-3">
        <h1 className="text-2xl font-bold text-ink-900">Detail Pesanan</h1>
        <PesananDetailActions code={order.code} judul={order.judul} />
      </div>

      <nav className="flex items-center gap-2 text-sm mb-5">
        <Link href="/pesanan" className="text-ink-500 hover:text-ink-700">
          Pesanan
        </Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <span className="text-brand-600 font-medium">{order.code}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2 space-y-5">
          <div>
            <p className="text-xs text-ink-500">Judul Pesanan</p>
            <h2 className="text-xl font-bold text-ink-900">{order.judul}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="ID Pesanan">{order.code}</Field>
            <Field label="Status Pesanan">
              <StatusDropdown code={order.code} current={order.status} />
            </Field>
            <Field label="Pelanggan">
              <Link href={`/pelanggan/${order.customer.code}`} className="text-brand-600 hover:underline">
                {order.snapshotNama}
              </Link>
            </Field>
            <Field label="No WA">{order.snapshotNoWa}</Field>
            <Field label="Tanggal Masuk">{formatDate(order.tglMasuk)}</Field>
            <Field label="Tanggal Estimasi">{formatDate(order.tglEstimasi)}</Field>
          </div>

          {order.catatan && (
            <Field label="Catatan">{order.catatan}</Field>
          )}

          {order.fotoReferensi && (
            <div>
              <p className="text-xs text-ink-500 mb-2">Referensi Gambar</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.fotoReferensi}
                alt="referensi"
                className="h-48 rounded-xl border border-ink-200 object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-ink-900 mb-2">Detail Item</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-50 text-ink-700">
                    <Th>Judul Ukuran</Th>
                    <Th align="right">Jumlah</Th>
                    <Th align="right">Harga Satuan</Th>
                    <Th align="right">Sub Total</Th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it) => (
                    <tr key={it.id} className="border-b border-ink-100 last:border-0">
                      <Td>{it.judulUkuran}</Td>
                      <Td align="right">{it.jumlah}</Td>
                      <Td align="right">{formatRupiah(it.hargaSatuan)}</Td>
                      <Td align="right">{formatRupiah(it.subTotal)}</Td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-b border-ink-100">
                    <td colSpan={3} className="px-4 py-2.5 text-right text-ink-700">Subtotal</td>
                    <td className="px-4 py-2.5 text-right font-medium text-ink-900">{formatRupiah(subtotal)}</td>
                  </tr>
                  {order.additionalCosts.map((b) => (
                    <tr key={b.id} className="border-b border-ink-100">
                      <td colSpan={3} className="px-4 py-2 text-right text-ink-500">{b.label}</td>
                      <td className="px-4 py-2 text-right text-ink-700">{formatRupiah(b.amount)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-ink-900">Total</td>
                    <td className="px-4 py-3 text-right font-bold text-ink-900">{formatRupiah(order.totalHarga)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="text-base font-semibold text-ink-900 mb-3">Status Pembayaran</h3>
            <span
              className={
                "rounded-md px-3 py-1.5 text-sm font-semibold " +
                (order.statusBayar === "Lunas"
                  ? "bg-[#DEFFA7] text-[#019537]"
                  : order.statusBayar === "DP"
                  ? "bg-[#FFEDB1] text-[#FFB62E]"
                  : "bg-[#FFD1C9] text-[#FF4B4B]")
              }
            >
              {order.statusBayar}
            </span>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Total Pesanan" value={formatRupiah(order.totalHarga)} />
              <Row label="Sudah Dibayar" value={formatRupiah(totalDibayar)} />
              <Row label="Sisa Tagihan" value={formatRupiah(sisa)} bold />
            </div>
            {sisa > 0 && (
              <Link
                href={`/pembayaran/new?orderCode=${order.code}`}
                className="mt-4 btn-primary !py-2 !px-4 inline-flex w-full"
              >
                + Tambah Pembayaran
              </Link>
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-base font-semibold text-ink-900 mb-3">
              Riwayat Pembayaran ({order.payments.length})
            </h3>
            {order.payments.length === 0 ? (
              <p className="text-sm text-ink-400">Belum ada pembayaran</p>
            ) : (
              <ul className="space-y-3">
                {order.payments.map((pay) => (
                  <li
                    key={pay.id}
                    className="flex items-start gap-3 rounded-lg border border-ink-100 p-3"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/pembayaran/${pay.code}`}
                        className="text-sm font-semibold text-ink-900 hover:text-brand-600"
                      >
                        {formatRupiah(pay.jumlah)}
                      </Link>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {pay.code} • {pay.metode} • {formatDate(pay.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-ink-500 mb-1">{label}</p>
      <div className="text-sm text-ink-900">{children}</div>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={bold ? "font-bold text-ink-900" : "text-ink-700"}>{value}</span>
    </div>
  );
}
function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={"font-semibold px-4 py-2.5 first:rounded-l-lg last:rounded-r-lg whitespace-nowrap text-" + align}>
      {children}
    </th>
  );
}
function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return <td className={"px-4 py-3 text-ink-700 text-" + align}>{children}</td>;
}
