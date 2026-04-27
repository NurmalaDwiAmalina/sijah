import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/Badge";
import { formatDate } from "@/lib/format";
import { Download, Plus, Search, SlidersHorizontal, MoreHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PelangganPage() {
  const list = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell>
      <Topbar title="Manajemen Pelanggan" showSearch={false} />

      <div className="flex items-center justify-between mb-5">
        <div />
        <div className="flex items-center gap-3">
          <button className="btn-secondary !py-2.5 !px-4">
            <Download className="h-4 w-4" /> Ekspor
          </button>
          <Link href="/pelanggan/new" className="btn-primary !py-2.5 !px-4">
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">
          Pelanggan ({list.length})
        </h2>
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
          <p className="text-ink-500">Belum ada pelanggan. Klik &quot;Add New&quot; untuk menambahkan.</p>
        </div>
      ) : (
        <div className="card p-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50 text-ink-700">
                <Th>ID</Th>
                <Th>Created at</Th>
                <Th>Updated at</Th>
                <Th>Nama Lengkap</Th>
                <Th>No WA</Th>
                <Th>Alamat</Th>
                <Th>Gender</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-ink-100 last:border-0">
                  <Td>
                    <Link href={`/pelanggan/${p.code}`} className="hover:text-brand-600">
                      {p.code}
                    </Link>
                  </Td>
                  <Td>{formatDate(p.createdAt)}</Td>
                  <Td>{formatDate(p.updatedAt)}</Td>
                  <Td>{p.nama}</Td>
                  <Td>{p.noWa}</Td>
                  <Td className="max-w-[260px]">{p.alamat}</Td>
                  <Td>
                    <StatusBadge value={p.gender} />
                  </Td>
                  <Td>
                    <Link
                      href={`/pelanggan/${p.code}`}
                      className="text-ink-500 hover:text-ink-900 inline-block"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Link>
                  </Td>
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
