import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { Topbar } from "@/components/Topbar";
import { formatRupiah } from "@/lib/format";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PembayaranPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { payments: true },
  });

  return (
    <DashboardShell>
      <Topbar title="Manajemen Pembayaran" showSearch={false} />

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-ink-900">
          Riwayat Pembayaran ({orders.length})
        </h2>
        <Link href="/pembayaran/new" className="btn-primary !py-2.5 !px-4">
          <Plus className="h-4 w-4" /> Add New
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-ink-500">Belum ada pesanan untuk dibayar.</p>
        </div>
      ) : (
        <div className="card p-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50 text-ink-700">
                <Th>ID Pesanan</Th>
                <Th>Nama Pelanggan</Th>
                <Th>Total</Th>
                <Th>Dibayar</Th>
                <Th>Sisa</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((p) => {
                const dibayar = p.payments.reduce((a, b) => a + b.jumlah, 0);
                const sisa = Math.max(0, p.totalHarga - dibayar);
                const statusCls =
                  p.statusBayar === "Lunas"
                    ? "bg-[#DEFFA7] text-[#019537]"
                    : p.statusBayar === "DP"
                    ? "bg-[#FFEDB1] text-[#FFB62E]"
                    : "bg-[#FFD1C9] text-[#FF4B4B]";
                return (
                  <tr key={p.id} className="border-b border-ink-100 last:border-0">
                    <Td>{p.code}</Td>
                    <Td>{p.snapshotNama}</Td>
                    <Td>{formatRupiah(p.totalHarga)}</Td>
                    <Td>{formatRupiah(dibayar)}</Td>
                    <Td>{formatRupiah(sisa)}</Td>
                    <Td>
                      <span className={"rounded-md px-2.5 py-1 text-xs font-medium " + statusCls}>
                        {p.statusBayar}
                      </span>
                    </Td>
                  </tr>
                );
              })}
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
