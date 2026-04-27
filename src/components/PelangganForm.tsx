"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, MapPin, MessageCircle, Pencil, Trash2, User } from "lucide-react";
import {
  createPelangganAction,
  updatePelangganAction,
  deletePelangganAction,
  deleteUkuranAction,
  type UkuranInput,
} from "@/lib/actions/pelanggan";
import { formatDate } from "@/lib/format";
import { UkuranModal, type UkuranData } from "./UkuranModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";
import { GENDER } from "@/lib/config";

type UkuranItem = UkuranData & {
  id?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export function PelangganForm({
  mode,
  initial,
}: {
  mode: "create" | "detail";
  initial?: {
    code: string;
    nama: string;
    noWa: string;
    alamat: string;
    gender: string;
    measurements: UkuranItem[];
  };
}) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const [nama, setNama] = useState(initial?.nama ?? "");
  const [noWa, setNoWa] = useState(initial?.noWa ?? "");
  const [alamat, setAlamat] = useState(initial?.alamat ?? "");
  const [gender, setGender] = useState(initial?.gender ?? "");

  // Local ukuran (untuk mode create) — server-side untuk detail
  const [ukuranLocal, setUkuranLocal] = useState<UkuranInput[]>([]);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: "add" | "edit" | "view";
    data?: UkuranData;
  }>({ open: false, mode: "add" });

  const [deleteUkuran, setDeleteUkuran] = useState<{ id: string; judul: string } | null>(null);
  const [deleteSelfOpen, setDeleteSelfOpen] = useState(false);

  const heading = mode === "create" ? "Buat Pelanggan Baru" : "Detail Pelanggan";
  const sub =
    mode === "create"
      ? "Masukkan data pelanggan dan ukuran badan untuk memulai pesanan."
      : "Informasi data pelanggan dan ukuran badan untuk pesanan.";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "create") {
      startTransition(async () => {
        const res = await createPelangganAction({
          nama,
          noWa,
          alamat,
          gender: gender as "Laki-laki" | "Perempuan",
          ukuran: ukuranLocal,
        });
        if (res?.error) toast.error("Gagal", res.error);
      });
    } else if (initial) {
      startTransition(async () => {
        const res = await updatePelangganAction(initial.code, {
          nama,
          noWa,
          alamat,
          gender: gender as "Laki-laki" | "Perempuan",
        });
        if (res?.error) toast.error("Gagal", res.error);
        else {
          toast.success("Tersimpan", "Data pelanggan diperbarui");
          router.refresh();
        }
      });
    }
  }

  function handleDeleteSelf() {
    if (!initial) return;
    startTransition(async () => {
      const res = await deletePelangganAction(initial.code);
      if (res?.error) {
        toast.error("Gagal menghapus", res.error);
        setDeleteSelfOpen(false);
      } else {
        toast.deleted("Pelanggan dihapus", initial.nama);
        router.push("/pelanggan");
      }
    });
  }

  function handleDeleteUkuran() {
    if (!initial || !deleteUkuran) return;
    startTransition(async () => {
      await deleteUkuranAction(initial.code, deleteUkuran.id);
      toast.deleted("Berhasil Menghapus Ukuran", `${deleteUkuran.judul} berhasil dihapus`);
      setDeleteUkuran(null);
      router.refresh();
    });
  }

  const ukuranList: UkuranItem[] =
    mode === "detail"
      ? initial?.measurements ?? []
      : ukuranLocal.map((u) => ({ ...u } as UkuranItem));

  return (
    <>
      <form onSubmit={handleSubmit} id="pelanggan-form">
        <div className="flex items-center justify-end gap-3 mb-5 -mt-4">
          {mode === "detail" && (
            <button
              type="button"
              onClick={() => setDeleteSelfOpen(true)}
              disabled={isPending}
              className="btn-danger !py-2.5 !px-7"
            >
              Hapus
            </button>
          )}
          <button
            type="submit"
            disabled={isPending || !nama || !noWa || !alamat || !gender}
            className="btn-primary !py-2.5 !px-7"
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>

        <div className="card p-7">
          <h2 className="text-xl font-bold text-ink-900">{heading}</h2>
          <p className="text-sm text-ink-500 mt-1 mb-6">{sub}</p>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label-base">Nama Pelanggan</label>
              <div className="relative">
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama pelanggan"
                  className="input-base pr-10"
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              </div>
            </div>
            <div>
              <label className="label-base">No Wa</label>
              <div className="relative">
                <input
                  value={noWa}
                  onChange={(e) => setNoWa(e.target.value)}
                  placeholder="Masukkan no WA pelanggan"
                  className="input-base pr-10"
                />
                <MessageCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="label-base">Alamat</label>
            <div className="relative">
              <input
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Masukkan alamat pelanggan"
                className="input-base pr-10"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            </div>
          </div>

          <div className="mt-5">
            <p className="label-base">Gender</p>
            <div className="flex items-center gap-8">
              {GENDER.map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink-900">Ukuran</h3>
            <button
              type="button"
              onClick={() => setModal({ open: true, mode: "add" })}
              className="btn-secondary !py-2 !px-3 text-xs"
            >
              Tambahkan Ukuran
            </button>
          </div>

          {ukuranList.length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-50 text-ink-700">
                    <Th>Judul Ukuran</Th>
                    <Th>Kategori</Th>
                    <Th>Created at</Th>
                    <Th>Updated at</Th>
                    <Th>Catatan</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {ukuranList.map((u, i) => (
                    <tr key={u.id ?? i} className="border-b border-ink-100 last:border-0">
                      <Td>{u.judul}</Td>
                      <Td>
                        <span className="rounded-md bg-brand-50 text-brand-700 px-2 py-0.5 text-xs">
                          {u.kategori}
                        </span>
                      </Td>
                      <Td>{u.createdAt ? formatDate(u.createdAt) : "-"}</Td>
                      <Td>{u.updatedAt ? formatDate(u.updatedAt) : "-"}</Td>
                      <Td>{u.catatan ?? "-"}</Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="Lihat detail"
                            onClick={() =>
                              setModal({ open: true, mode: "view", data: u })
                            }
                            className="p-1.5 rounded hover:bg-ink-100 text-ink-500 hover:text-ink-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {mode === "detail" && u.id && (
                            <>
                              <button
                                type="button"
                                title="Edit"
                                onClick={() =>
                                  setModal({ open: true, mode: "edit", data: u })
                                }
                                className="p-1.5 rounded hover:bg-ink-100 text-ink-500 hover:text-ink-900"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                title="Hapus"
                                onClick={() =>
                                  setDeleteUkuran({ id: u.id!, judul: u.judul })
                                }
                                className="p-1.5 rounded hover:bg-[#FFD1C9]/40 text-[#FF4B4B]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {mode === "create" && (
                            <button
                              type="button"
                              title="Hapus"
                              onClick={() =>
                                setUkuranLocal(ukuranLocal.filter((_, idx) => idx !== i))
                              }
                              className="p-1.5 rounded hover:bg-[#FFD1C9]/40 text-[#FF4B4B]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-400">
              Belum ada ukuran. Klik &quot;Tambahkan Ukuran&quot;.
            </p>
          )}
        </div>
      </form>

      <UkuranModal
        open={modal.open}
        mode={modal.mode}
        customerCode={mode === "detail" ? initial?.code : undefined}
        initial={modal.data}
        onClose={() => setModal({ open: false, mode: "add" })}
        onLocalSave={
          mode === "create"
            ? (u) => setUkuranLocal([...ukuranLocal, u])
            : undefined
        }
      />

      <ConfirmDialog
        open={!!deleteUkuran}
        title="Mau Hapus Ukuran ini?"
        description="Ukuran yang sudah dihapus tidak dapat dipulihkan."
        confirmLabel="Ya, Hapus"
        pending={isPending}
        onClose={() => setDeleteUkuran(null)}
        onConfirm={handleDeleteUkuran}
      />

      <ConfirmDialog
        open={deleteSelfOpen}
        title="Mau Hapus Pelanggan ini?"
        description="Pelanggan yang dihapus tidak dapat dipulihkan."
        confirmLabel="Ya, Hapus"
        pending={isPending}
        onClose={() => setDeleteSelfOpen(false)}
        onConfirm={handleDeleteSelf}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-semibold px-4 py-3 first:rounded-l-lg last:rounded-r-lg whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4 text-ink-700 align-top">{children}</td>;
}
