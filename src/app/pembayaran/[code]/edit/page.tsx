import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { ChevronRight } from "lucide-react";
import { PembayaranEditForm } from "@/components/PembayaranEditForm";

export const dynamic = "force-dynamic";

export default async function PembayaranEditPage({
  params,
}: {
  params: { code: string };
}) {
  const p = await prisma.payment.findUnique({
    where: { code: params.code },
    include: { order: { include: { payments: true } } },
  });
  if (!p) notFound();

  const totalDibayarLain = p.order.payments
    .filter((x) => x.id !== p.id)
    .reduce((a, b) => a + b.jumlah, 0);

  return (
    <DashboardShell>
      <h1 className="text-2xl font-bold text-ink-900 mb-3">Edit Pembayaran</h1>

      <nav className="flex items-center gap-2 text-sm mb-5">
        <Link href="/pembayaran" className="text-ink-500 hover:text-ink-700">
          Pembayaran
        </Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <Link href={`/pembayaran/${p.code}`} className="text-ink-500 hover:text-ink-700">
          {p.code}
        </Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <span className="text-brand-600 font-medium">Edit</span>
      </nav>

      <PembayaranEditForm
        code={p.code}
        order={{
          code: p.order.code,
          pelanggan: p.order.snapshotNama,
          totalHarga: p.order.totalHarga,
        }}
        totalDibayarLain={totalDibayarLain}
        initial={{
          jumlah: p.jumlah,
          metode: p.metode as "Tunai" | "Transfer",
          catatan: p.catatan ?? "",
        }}
      />
    </DashboardShell>
  );
}
