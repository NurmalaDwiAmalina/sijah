"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, MessageCircle, MoreHorizontal, Trash2, User } from "lucide-react";
import {
  createPelangganAction,
  updatePelangganAction,
  deletePelangganAction,
  addUkuranAction,
  deleteUkuranAction,
  type UkuranInput,
} from "@/lib/actions/pelanggan";
import { formatDate } from "@/lib/format";

type UkuranItem = {
  id?: string;
  judul: string;
  catatan?: string | null;
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
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [nama, setNama] = useState(initial?.nama ?? "");
  const [noWa, setNoWa] = useState(initial?.noWa ?? "");
  const [alamat, setAlamat] = useState(initial?.alamat ?? "");
  const [gender, setGender] = useState(initial?.gender ?? "");
  const [ukuranBaru, setUkuranBaru] = useState<UkuranInput[]>([]);
  const [showUkuranForm, setShowUkuranForm] = useState(false);
  const [ukuranJudul, setUkuranJudul] = useState("");
  const [ukuranCatatan, setUkuranCatatan] = useState("");

  const heading = mode === "create" ? "Buat Pelanggan Baru" : "Detail Pelanggan";
  const sub =
    mode === "create"
      ? "Masukkan data pelanggan dan ukuran badan untuk memulai pesanan."
      : "Informasi data pelanggan dan ukuran badan untuk pesanan.";

  function tambahUkuranLokal() {
    if (!ukuranJudul.trim()) return;
    setUkuranBaru([
      ...ukuranBaru,
      { judul: ukuranJudul.trim(), catatan: ukuranCatatan.trim() || undefined },
    ]);
    setUkuranJudul("");
    setUkuranCatatan("");
    setShowUkuranForm(false);
  }

  async function tambahUkuranServer() {
    if (!initial || !ukuranJudul.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await addUkuranAction(initial.code, {
        judul: ukuranJudul.trim(),
        catatan: ukuranCatatan.trim() || undefined,
      });
      if (res?.error) setError(res.error);
      else {
        setUkuranJudul("");
        setUkuranCatatan("");
        setShowUkuranForm(false);
        router.refresh();
      }
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "create") {
      startTransition(async () => {
        const res = await createPelangganAction({
          nama,
          noWa,
          alamat,
          gender: gender as "Laki-laki" | "Perempuan",
          ukuran: ukuranBaru,
        });
        if (res?.error) setError(res.error);
      });
    } else if (initial) {
      startTransition(async () => {
        const res = await updatePelangganAction(initial.code, {
          nama,
          noWa,
          alamat,
          gender: gender as "Laki-laki" | "Perempuan",
        });
        if (res?.error) setError(res.error);
        else router.refresh();
      });
    }
  }

  async function handleDelete() {
    if (!initial) return;
    if (!confirm(`Hapus pelanggan ${initial.nama}?`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deletePelangganAction(initial.code);
      if (res?.error) setError(res.error);
    });
  }

  async function handleHapusUkuran(uId: string) {
    if (!initial) return;
    if (!confirm("Hapus ukuran ini?")) return;
    startTransition(async () => {
      await deleteUkuranAction(initial.code, uId);
      router.refresh();
    });
  }

  const ukuranList: UkuranItem[] =
    mode === "detail" ? initial?.measurements ?? [] : ukuranBaru;

  return (
    <form onSubmit={handleSubmit} id="pelanggan-form">
      <div className="flex items-center justify-end gap-3 mb-5 -mt-4">
        {mode === "detail" && (
          <button
            type="button"
            onClick={handleDelete}
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

      {error && (
        <p className="mb-4 rounded-lg bg-[#FFD1C9] px-4 py-2 text-sm text-[#FF4B4B]">
          {error}
        </p>
      )}

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
            {(["Laki-laki", "Perempuan"] as const).map((g) => (
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
            onClick={() => setShowUkuranForm((v) => !v)}
            className="btn-secondary !py-2 !px-3 text-xs"
          >
            Tambahkan Ukuran
          </button>
        </div>

        {showUkuranForm && (
          <div className="mt-3 rounded-xl border border-ink-200 bg-brand-50 p-4">
            <div className="grid md:grid-cols-2 gap-3">
              <input
                value={ukuranJudul}
                onChange={(e) => setUkuranJudul(e.target.value)}
                placeholder="Judul ukuran (mis. Ukuran Kaos S)"
                className="input-base"
              />
              <input
                value={ukuranCatatan}
                onChange={(e) => setUkuranCatatan(e.target.value)}
                placeholder="Catatan (opsional)"
                className="input-base"
              />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowUkuranForm(false);
                  setUkuranJudul("");
                  setUkuranCatatan("");
                }}
                className="btn-secondary !py-1.5 !px-3 text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={mode === "create" ? tambahUkuranLokal : tambahUkuranServer}
                disabled={!ukuranJudul.trim() || isPending}
                className="btn-primary !py-1.5 !px-3 text-xs"
              >
                Simpan Ukuran
              </button>
            </div>
          </div>
        )}

        {ukuranList.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-50 text-ink-700">
                  <Th>Judul Ukuran</Th>
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
                    <Td>{u.createdAt ? formatDate(u.createdAt) : "-"}</Td>
                    <Td>{u.updatedAt ? formatDate(u.updatedAt) : "-"}</Td>
                    <Td>{u.catatan ?? "-"}</Td>
                    <Td>
                      {mode === "detail" && u.id ? (
                        <button
                          type="button"
                          onClick={() => handleHapusUkuran(u.id!)}
                          className="text-[#FF4B4B] hover:opacity-80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : mode === "create" ? (
                        <button
                          type="button"
                          onClick={() =>
                            setUkuranBaru(ukuranBaru.filter((_, idx) => idx !== i))
                          }
                          className="text-[#FF4B4B] hover:opacity-80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <MoreHorizontal className="h-5 w-5 text-ink-500" />
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !showUkuranForm && (
            <p className="mt-4 text-sm text-ink-400">
              Belum ada ukuran. Klik &quot;Tambahkan Ukuran&quot;.
            </p>
          )
        )}
      </div>
    </form>
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
