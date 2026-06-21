import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { ChevronRight } from "lucide-react";
import { PesananForm } from "@/components/PesananForm";

export const dynamic = "force-dynamic";

export default async function PesananEditPage({
  params,
}: {
  params: { code: string };
}) {
  const [order, customers] = await Promise.all([
    prisma.order.findUnique({
      where: { code: params.code },
      include: { items: true, additionalCosts: true, customer: true },
    }),
    prisma.customer.findMany({
      orderBy: { nama: "asc" },
      include: { measurements: { orderBy: { createdAt: "asc" } } },
    }),
  ]);
  if (!order) notFound();

  return (
    <DashboardShell>
      <h1 className="text-2xl font-bold text-ink-900 mb-3">Edit Pesanan</h1>
      <nav className="flex items-center gap-2 text-sm mb-5">
        <Link href="/pesanan" className="text-ink-500 hover:text-ink-700">Pesanan</Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <Link href={`/pesanan/${order.code}`} className="text-ink-500 hover:text-ink-700">{order.code}</Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <span className="text-brand-600 font-medium">Edit</span>
      </nav>

      <PesananForm
        mode="edit"
        code={order.code}
        orphanSubtotal={order.items
          .filter((it) => !it.measurementId)
          .reduce((a, b) => a + b.subTotal, 0)}
        customers={customers.map((c) => ({
          code: c.code,
          nama: c.nama,
          measurements: c.measurements.map((m) => ({
            id: m.id,
            judul: m.judul,
            catatan: m.catatan,
          })),
        }))}
        initial={{
          judul: order.judul,
          customerCode: order.customer.code,
          tglMasuk: order.tglMasuk.toISOString().slice(0, 10),
          tglEstimasi: order.tglEstimasi.toISOString().slice(0, 10),
          catatan: order.catatan ?? "",
          status: order.status,
          statusBayar: order.statusBayar,
          fotoReferensi: order.fotoReferensi ?? null,
          items: order.items
            .filter((it) => it.measurementId)
            .map((it) => ({
              measurementId: it.measurementId as string,
              jumlah: it.jumlah,
              hargaSatuan: it.hargaSatuan,
            })),
          biaya: order.additionalCosts.map((b) => ({
            label: b.label,
            amount: b.amount,
          })),
        }}
      />
    </DashboardShell>
  );
}
