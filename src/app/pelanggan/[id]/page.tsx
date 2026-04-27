import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { PelangganForm } from "@/components/PelangganForm";
import { prisma } from "@/lib/db";
import type { MeasurementKategori } from "@/lib/config";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PelangganDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const pelanggan = await prisma.customer.findUnique({
    where: { code: params.id },
    include: { measurements: { orderBy: { createdAt: "asc" } } },
  });
  if (!pelanggan) notFound();

  return (
    <DashboardShell>
      <h1 className="text-2xl font-bold text-ink-900 mb-3">Manajemen Pelanggan</h1>

      <nav className="flex items-center gap-2 text-sm mb-5">
        <Link href="/pelanggan" className="text-ink-500 hover:text-ink-700">
          Pelanggan
        </Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <span className="text-brand-600 font-medium">Detail Pelanggan</span>
      </nav>

      <PelangganForm
        mode="detail"
        initial={{
          code: pelanggan.code,
          nama: pelanggan.nama,
          noWa: pelanggan.noWa,
          alamat: pelanggan.alamat,
          gender: pelanggan.gender,
          measurements: pelanggan.measurements.map((m) => ({
            ...m,
            kategori: m.kategori as MeasurementKategori,
          })),
        }}
      />
    </DashboardShell>
  );
}
