import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { ChevronRight } from "lucide-react";
import { PesananEditForm } from "@/components/PesananEditForm";

export const dynamic = "force-dynamic";

export default async function PesananEditPage({
  params,
}: {
  params: { code: string };
}) {
  const order = await prisma.order.findUnique({
    where: { code: params.code },
  });
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

      <PesananEditForm
        code={order.code}
        initial={{
          judul: order.judul,
          catatan: order.catatan ?? "",
          status: order.status,
          statusBayar: order.statusBayar,
          tglEstimasi: order.tglEstimasi.toISOString().slice(0, 10),
          fotoReferensi: order.fotoReferensi ?? null,
        }}
      />
    </DashboardShell>
  );
}
