import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/Badge";
import { formatRupiah, formatDate } from "@/lib/format";
import { Download, Plus, Search, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PesananPage() {
  const list = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell>
      <Topbar title="Manajemen Pesanan" showSearch={false} />

      <div className="flex items-center justify-between mb-5">
        <div />
        <div className="flex items-center gap-3">
          <button className="btn-secondary !py-2.5 !px-4">
            <Download className="h-4 w-4" /> Ekspor
          </button>
          <Link href="/pesanan/new" className="btn-primary !py-2.5 !px-4">
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">Pesanan ({list.length})</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input placeholder="Search" className="input-base pl-10 !py-2.5" />
          </div>
          <button className="btn-secondary !py-2.5 !px-4">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-ink-500">Belum ada pesanan.</p>
        </div>
      ) : (
        <div className="card p-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50 text-ink-700">
                <Th>ID</Th>
                <Th>Created at</Th>
                <Th>Updated at</Th>
                <Th>Nama Pesanan</Th>
                <Th>Nama Pelanggan</Th>
                <Th>Deadline</Th>
                <Th>Total Harga</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-ink-100 last:border-0">
                  <Td>{p.code}</Td>
                  <Td>{formatDate(p.createdAt)}</Td>
                  <Td>{formatDate(p.updatedAt)}</Td>
                  <Td className="max-w-[220px]">{p.judul}</Td>
                  <Td>{p.snapshotNama}</Td>
                  <Td>{formatDate(p.tglEstimasi)}</Td>
                  <Td>{formatRupiah(p.totalHarga)}</Td>
                  <Td><StatusBadge value={p.status} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-medium px-4 py-3 first:rounded-l-lg last:rounded-r-lg whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={"px-4 py-4 text-ink-700 align-top " + className}>{children}</td>;
}
