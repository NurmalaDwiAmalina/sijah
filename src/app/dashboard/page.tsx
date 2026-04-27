import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { Topbar } from "@/components/Topbar";
import { DonutChart } from "@/components/DonutChart";
import { formatRupiah, formatDate } from "@/lib/format";
import { DollarSign, Wallet, ShoppingBasket, Download, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  Antrean: "#868686",
  "Potong Kain": "#008BFF",
  Dijahit: "#FFB62E",
  Fitting: "#0FD859",
  Selesai: "#17D55C",
  Diambil: "#019537",
  Dibatalkan: "#FF4B4B",
};

export default async function DashboardPage() {
  const [orders, payments] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { payments: true },
    }),
    prisma.payment.findMany(),
  ]);

  const totalRevenue = payments.reduce((a, b) => a + b.jumlah, 0);
  const belumTerbayar = orders.reduce((a, o) => {
    const dibayar = o.payments.reduce((x, p) => x + p.jumlah, 0);
    return a + Math.max(0, o.totalHarga - dibayar);
  }, 0);

  const totalPesanan = orders.length;

  const statusCounts: Record<string, number> = {};
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  }
  const statusOverview = Object.entries(statusCounts).map(([label, count]) => ({
    label,
    count,
    percent: totalPesanan ? (count / totalPesanan) * 100 : 0,
    color: STATUS_COLORS[label] ?? "#868686",
  }));

  return (
    <DashboardShell>
      <Topbar title="Selamat datang, minjah!" />

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-ink-900">Dashboard Penjualan</h2>
        <div className="flex items-center gap-3">
          <button className="btn-secondary !py-2.5 !px-4">
            <Download className="h-4 w-4" /> Ekspor
          </button>
          <button className="btn-primary !py-2.5 !px-4">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-brand-600" />}
          label="Total Revenue"
          value={formatRupiah(totalRevenue)}
          caption="Total Pesanan Terbayar"
        />
        <StatCard
          icon={<Wallet className="h-5 w-5 text-brand-600" />}
          label={"Total Pesanan\nBelum Terbayar"}
          value={formatRupiah(belumTerbayar)}
          caption="Total Pesanan Belum Dibayar"
        />
        <StatCard
          icon={<ShoppingBasket className="h-5 w-5 text-brand-600" />}
          label="Total Pesanan"
          value={`${totalPesanan} Pesanan`}
          caption="Semua Total Pesanan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-ink-900 mb-4">Status Pesanan Overview</h3>
          {statusOverview.length === 0 ? (
            <p className="text-sm text-ink-500">Belum ada data pesanan</p>
          ) : (
            <>
              <ul className="space-y-2 mb-6">
                {statusOverview.map((s) => (
                  <li key={s.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-ink-700">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.label}
                    </div>
                    <div className="text-ink-700">
                      <span className="mr-3">{s.count}</span>
                      <span className="text-ink-500">{s.percent.toFixed(2)}%</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <DonutChart data={statusOverview} total={totalPesanan} />
              </div>
            </>
          )}
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-ink-900 mb-4">Ringkasan Pesanan</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-ink-500">Belum ada pesanan</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-50 text-ink-700">
                    <Th>ID</Th>
                    <Th>Created at</Th>
                    <Th>Updated at</Th>
                    <Th>Nama Pesanan</Th>
                    <Th>Nama Pelanggan</Th>
                    <Th>Deadline</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 7).map((p) => (
                    <tr key={p.id} className="border-b border-ink-100 last:border-0">
                      <Td>{p.code}</Td>
                      <Td>{formatDate(p.createdAt)}</Td>
                      <Td>{formatDate(p.updatedAt)}</Td>
                      <Td className="max-w-[180px]">{p.judul}</Td>
                      <Td>{p.snapshotNama}</Td>
                      <Td>{formatDate(p.tglEstimasi)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-brand-100 grid place-items-center">
          {icon}
        </div>
        <p className="font-semibold text-ink-700 whitespace-pre-line">{label}</p>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-ink-900">{value}</p>
      </div>
      <p className="text-xs text-ink-500 mt-1">{caption}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-medium px-3 py-3 first:rounded-l-lg last:rounded-r-lg whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={"px-3 py-3.5 text-ink-700 align-top " + className}>{children}</td>;
}
