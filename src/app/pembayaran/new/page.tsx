import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { ChevronRight } from "lucide-react";
import { PembayaranForm } from "@/components/PembayaranForm";

export const dynamic = "force-dynamic";

export default async function PembayaranNewPage() {
  const orders = await prisma.order.findMany({
    where: { statusBayar: { not: "Lunas" } },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      additionalCosts: true,
      payments: true,
    },
  });

  return (
    <DashboardShell>
      <h1 className="text-2xl font-bold text-ink-900 mb-3">Manajemen Pembayaran</h1>

      <nav className="flex items-center gap-2 text-sm mb-5">
        <Link href="/pembayaran" className="text-ink-500 hover:text-ink-700">
          Pembayaran
        </Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <span className="text-brand-600 font-medium">Add New</span>
      </nav>

      <PembayaranForm
        orders={orders.map((o) => ({
          code: o.code,
          pelanggan: o.snapshotNama,
          totalHarga: o.totalHarga,
          dibayar: o.payments.reduce((a, b) => a + b.jumlah, 0),
          items: o.items.map((it) => ({
            judul: it.judulUkuran,
            jumlah: it.jumlah,
            hargaSatuan: it.hargaSatuan,
            subTotal: it.subTotal,
          })),
          biayaTambahan: o.additionalCosts.map((b) => ({
            label: b.label,
            amount: b.amount,
          })),
        }))}
      />
    </DashboardShell>
  );
}
