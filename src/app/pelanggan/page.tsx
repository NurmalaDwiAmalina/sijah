import Link from "next/link";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/DashboardShell";
import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/Badge";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { ExportButton } from "@/components/ExportButton";
import { PelangganRowActions } from "@/components/PelangganRowActions";
import { formatDate } from "@/lib/format";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PelangganPage({
  searchParams,
}: {
  searchParams: { q?: string; gender?: string };
}) {
  const q = searchParams.q?.trim();
  const gender = searchParams.gender;

  const list = await prisma.customer.findMany({
    where: {
      AND: [
        gender ? { gender } : {},
        q
          ? {
              OR: [
                { nama: { contains: q, mode: "insensitive" } },
                { code: { contains: q, mode: "insensitive" } },
                { noWa: { contains: q } },
                { alamat: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const csvRows = list.map((p) => ({
    ID: p.code,
    "Nama Lengkap": p.nama,
    "No WA": p.noWa,
    Alamat: p.alamat,
    Gender: p.gender,
    "Created at": formatDate(p.createdAt),
    "Updated at": formatDate(p.updatedAt),
  }));

  return (
    <DashboardShell>
      <Topbar title="Manajemen Pelanggan" showSearch={false} />

      <div className="flex items-center justify-between mb-5">
        <div />
        <div className="flex items-center gap-3">
          <ExportButton rows={csvRows} filename="pelanggan" />
          <Link href="/pelanggan/new" className="btn-primary !py-2.5 !px-4">
            <Plus className="h-4 w-4" /> Add New
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">
          Pelanggan ({list.length})
        </h2>
        <SearchFilterBar
          searchPlaceholder="Cari nama, ID, WA, alamat..."
          filters={[
            {
              key: "gender",
              label: "Gender",
              options: [
                { value: "Laki-laki", label: "Laki-laki" },
                { value: "Perempuan", label: "Perempuan" },
              ],
            },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-ink-500">
            {q || gender ? "Tidak ada hasil." : "Belum ada pelanggan. Klik \"Add New\" untuk menambahkan."}
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
                    <StatusBadge value={p.gender} withChevron={false} />
                  </Td>
                  <Td>
                    <PelangganRowActions code={p.code} nama={p.nama} />
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
