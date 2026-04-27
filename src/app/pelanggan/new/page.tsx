import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { PelangganForm } from "@/components/PelangganForm";
import { ChevronRight } from "lucide-react";

export default function PelangganNewPage() {
  return (
    <DashboardShell>
      <h1 className="text-2xl font-bold text-ink-900 mb-3">Manajemen Pelanggan</h1>

      <nav className="flex items-center gap-2 text-sm mb-5">
        <Link href="/pelanggan" className="text-ink-500 hover:text-ink-700">
          Pelanggan
        </Link>
        <ChevronRight className="h-4 w-4 text-ink-400" />
        <span className="text-brand-600 font-medium">Add New</span>
      </nav>

      <PelangganForm mode="create" />
    </DashboardShell>
  );
}
