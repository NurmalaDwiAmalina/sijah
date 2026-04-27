import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { Topbar } from "@/components/Topbar";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { ExportButton } from "@/components/ExportButton";
import { PembayaranRowActions } from "@/components/PembayaranRowActions";
import { formatRupiah, formatDate } from "@/lib/format";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PembayaranPage({
  searchParams,
}: {
  searchParams: { q?: string; metode?: string };
}) {
  const q = searchParams.q?.trim();
  const metode = searchParams.metode;

  const payments = await prisma.payment.findMany({
    where: {
      AND: [
        metode ? { metode } : {},
        q
          ? {
              OR: [
                { code: { contains: q, mode: "insensitive" } },
                { order: { code: { contains: q, mode: "insensitive" } } },
                { order: { snapshotNama: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { order: true },
  });

  const csvRows = payments.map((p) => ({
    "ID Pembayaran": p.code,
    "ID Pesanan": p.order.code,
    "Nama Pelanggan": p.order.snapshotNama,
    "Jumlah Bayar": p.jumlah,
    Metode: p.metode,
    "Created at": formatDate(p.createdAt),
    "Updated at": formatDate(p.updatedAt),
  }));

  return (
    <DashboardShell>
      <Topbar title="Manajemen Pembayaran" showSearch={false} />

      <div className="flex items-center justify-between mb-5">
        <div />
        <div className="flex items-center gap-3">
          <ExportButton rows={csvRows} filename="pembayaran" />
          <Link href="/pembayaran/new" className="btn-primary !py-2.5 !px-4">
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">
          Riwayat Pembayaran ({payments.length})
        </h2>
        <SearchFilterBar
          searchPlaceholder="Cari ID pembayaran/pesanan/pelanggan..."
          filters={[
            {
              key: "metode",
              label: "Metode Pembayaran",
              options: [
                { value: "Tunai", label: "Tunai" },
                { value: "Transfer", label: "Transfer" },
              ],
            },
          ]}
        />
      </div>

      {payments.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-ink-500">
            {q || metode ? "Tidak ada hasil." : "Belum ada pembayaran."}
          </p>
        </div>
      ) : (
        <div className="card p-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50 text-ink-700">
                <Th>ID Pembayaran</Th>
                <Th>ID Pesanan</Th>
                <Th>Nama Pelanggan</Th>
                <Th>Jumlah</Th>
                <Th>Metode</Th>
                <Th>Created at</Th>
                <Th>Updated at</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-ink-100 last:border-0">
                  <Td>{p.code}</Td>
                  <Td>{p.order.code}</Td>
                  <Td>{p.order.snapshotNama}</Td>
                  <Td>{formatRupiah(p.jumlah)}</Td>
                  <Td>
                    <span
                      className={
                        "rounded-md px-2.5 py-1 text-xs font-medium " +
                        (p.metode === "Tunai"
                          ? "bg-[#FFEDB1] text-[#FFB62E]"
                          : "bg-[#DAEEFF] text-[#008BFF]")
                      }
                    >
                      {p.metode}
                    </span>
                  </Td>
                  <Td>{formatDate(p.createdAt)}</Td>
                  <Td>{formatDate(p.updatedAt)}</Td>
                  <Td>
                    <PembayaranRowActions
                      code={p.code}
                      pesananCode={p.order.code}
                    />
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
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4 text-ink-700">{children}</td>;
}
