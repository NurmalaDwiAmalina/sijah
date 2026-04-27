import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { ChevronRight } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PembayaranDetailPage({
  params,
}: {
  params: { code: string };
}) {
  const p = await prisma.payment.findUnique({
    where: { code: params.code },
    include: { order: { include: { items: true, additionalCosts: true, payments: true } } },
  });
  if (!p) notFound();

  const totalDibayar = p.order.payments.reduce((a, b) => a + b.jumlah, 0);
  const sisa = Math.max(0, p.order.totalHarga - totalDibayar);

  return (
    <DashboardShell>
      <h1 className="text-2xl font-bold text-ink-900 mb-3">Detail Pembayaran</h1>

      <nav className="flex items-center gap-2 text-sm mb-5">
        <Link href="/pembayaran" className="text-ink-500 hover:text-ink-700">
          Pembayaran
        </Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <span className="text-brand-600 font-medium">{p.code}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-ink-900">Pembayaran {p.code}</h2>
          <Field label="Pesanan">
            <Link href={`/pesanan/${p.order.code}`} className="text-brand-600 hover:underline">
              {p.order.code} — {p.order.judul}
            </Link>
          </Field>
          <Field label="Pelanggan">{p.order.snapshotNama}</Field>
          <Field label="Jumlah Bayar">
            <span className="text-xl font-bold text-ink-900">{formatRupiah(p.jumlah)}</span>
          </Field>
          <Field label="Metode Pembayaran">
            <span
              className={
                "rounded-md px-2.5 py-1 text-xs font-medium " +
                (p.metode === "Tunai"
                  ? "bg-[#FFEDB1] text-[#FFB62E]"
                  : "bg-[#DAEEFF] text-[#008BFF]")
              }
            >
              {p.metode}
            </span>
          </Field>
          <Field label="Catatan">{p.catatan ?? "-"}</Field>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-ink-100">
            <Field label="Created at">{formatDate(p.createdAt)}</Field>
            <Field label="Updated at">{formatDate(p.updatedAt)}</Field>
          </div>

          <Link
            href={`/pembayaran/${p.code}/edit`}
            className="btn-primary !py-2 !px-5 inline-flex"
          >
            Edit Pembayaran
          </Link>
        </div>

        <div className="card p-6 space-y-3">
          <h3 className="text-base font-semibold text-ink-900">Ringkasan Pesanan</h3>
          <Row label="Total Pesanan" value={formatRupiah(p.order.totalHarga)} />
          <Row label="Sudah Dibayar" value={formatRupiah(totalDibayar)} />
          <Row label="Sisa Tagihan" value={formatRupiah(sisa)} bold />
          <div className="pt-3 border-t border-ink-100">
            <p className="text-xs text-ink-500 mb-1">Status Pembayaran</p>
            <span
              className={
                "rounded-md px-2.5 py-1 text-xs font-medium " +
                (p.order.statusBayar === "Lunas"
                  ? "bg-[#DEFFA7] text-[#019537]"
                  : p.order.statusBayar === "DP"
                  ? "bg-[#FFEDB1] text-[#FFB62E]"
                  : "bg-[#FFD1C9] text-[#FF4B4B]")
              }
            >
              {p.order.statusBayar}
            </span>
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
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className={bold ? "font-bold text-ink-900" : "text-ink-700"}>{value}</span>
    </div>
  );
}
