import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { ChevronRight } from "lucide-react";
import { PesananForm } from "@/components/PesananForm";

export const dynamic = "force-dynamic";

export default async function PesananNewPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { nama: "asc" },
    include: { measurements: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <DashboardShell>
      <h1 className="text-2xl font-bold text-ink-900 mb-3">Manajemen Pesanan</h1>

      <nav className="flex items-center gap-2 text-sm mb-5">
        <Link href="/pesanan" className="text-ink-500 hover:text-ink-700">
          Pesanan
        </Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <span className="text-brand-600 font-medium">Add New</span>
      </nav>

      <PesananForm
        customers={customers.map((c) => ({
          code: c.code,
          nama: c.nama,
          measurements: c.measurements.map((m) => ({
            id: m.id,
            judul: m.judul,
            catatan: m.catatan,
          })),
        }))}
      />
    </DashboardShell>
  );
}
