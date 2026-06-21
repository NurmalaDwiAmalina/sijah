import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { Topbar } from "@/components/Topbar";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { ExportButton } from "@/components/ExportButton";
import { StatusDropdown } from "@/components/StatusDropdown";
import { PesananRowActions } from "@/components/PesananRowActions";
import { formatRupiah, formatDate } from "@/lib/format";
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_STATUS_BADGE } from "@/lib/config";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PesananPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; statusBayar?: string };
}) {
  const q = searchParams.q?.trim();
  const status = searchParams.status;
  const statusBayar = searchParams.statusBayar;

  const list = await prisma.order.findMany({
    where: {
      AND: [
        status ? { status } : {},
        statusBayar ? { statusBayar } : {},
        q
          ? {
              OR: [
                { judul: { contains: q, mode: "insensitive" } },
                { code: { contains: q, mode: "insensitive" } },
                { snapshotNama: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const csvRows = list.map((p) => ({
    ID: p.code,
    "Nama Pesanan": p.judul,
    "Nama Pelanggan": p.snapshotNama,
    "No WA": p.snapshotNoWa,
    Deadline: formatDate(p.tglEstimasi),
    "Total Harga": p.totalHarga,
    Status: p.status,
    "Status Bayar": p.statusBayar,
    "Created at": formatDate(p.createdAt),
    "Updated at": formatDate(p.updatedAt),
  }));

  return (
    <DashboardShell>
      <Topbar title="Manajemen Pesanan" showSearch={false} />

      <div className="flex items-center justify-between mb-5">
        <div />
        <div className="flex items-center gap-3">
          <ExportButton rows={csvRows} filename="pesanan" />
          <Link href="/pesanan/new" className="btn-primary !py-2.5 !px-4">
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">Pesanan ({list.length})</h2>
        <SearchFilterBar
          searchPlaceholder="Cari ID, judul, pelanggan..."
          filters={[
            {
              key: "status",
              label: "Status Pesanan",
              options: ORDER_STATUS.map((s) => ({ value: s, label: s })),
            },
            {
              key: "statusBayar",
              label: "Status Bayar",
              options: PAYMENT_STATUS.map((s) => ({ value: s, label: s })),
            },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-ink-500">
            {q || status || statusBayar ? "Tidak ada hasil." : "Belum ada pesanan."}
          </p>
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
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Bayar</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-ink-100 last:border-0">
                  <Td>
                    <Link href={`/pesanan/${p.code}`} className="hover:text-brand-600">
                      {p.code}
                    </Link>
                  </Td>
                  <Td>{formatDate(p.createdAt)}</Td>
                  <Td>{formatDate(p.updatedAt)}</Td>
                  <Td className="max-w-[220px]">{p.judul}</Td>
                  <Td>{p.snapshotNama}</Td>
                  <Td>{formatDate(p.tglEstimasi)}</Td>
                  <Td>{formatRupiah(p.totalHarga)}</Td>
                  <Td>
                    <StatusDropdown code={p.code} current={p.status} />
                  </Td>
                  <Td>
                    <span
                      className={
                        "rounded-md px-2.5 py-1 text-xs font-medium " +
                        (PAYMENT_STATUS_BADGE[p.statusBayar as keyof typeof PAYMENT_STATUS_BADGE] ??
                          "bg-ink-100 text-ink-700")
                      }
                    >
                      {p.statusBayar}
                    </span>
                  </Td>
                  <Td>
                    <PesananRowActions code={p.code} judul={p.judul} />
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
