"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  addUkuranAction,
  updateUkuranAction,
  type Kategori,
  type UkuranInput,
} from "@/lib/actions/pelanggan";
import { useToast } from "./Toast";
import {
  ATASAN_FIELDS,
  BAWAHAN_FIELDS,
  MEASUREMENT_KATEGORI,
  STANDAR_SIZES,
} from "@/lib/config";

type Mode = "add" | "edit" | "view";

export type UkuranData = {
  id?: string;
  judul: string;
  kategori: Kategori;
  catatan?: string | null;
  lingkarLeher?: number | null;
  lebarBahu?: number | null;
  lingkarDada?: number | null;
  lingkarPinggang?: number | null;
  panjangLengan?: number | null;
  panjangBaju?: number | null;
  lingkarPinggul?: number | null;
  lingkarPaha?: number | null;
  panjangCelana?: number | null;
  ukuranStandar?: string | null;
};

export function UkuranModal({
  open,
  mode,
  customerCode,
  initial,
  onClose,
  onLocalSave,
}: {
  open: boolean;
  mode: Mode;
  customerCode?: string;
  initial?: UkuranData;
  onClose: () => void;
  onLocalSave?: (u: UkuranInput) => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [data, setData] = useState<UkuranData>({
    judul: "",
    kategori: "Atasan",
  });

  useEffect(() => {
    if (open) {
      setData(
        initial ?? {
          judul: "",
          kategori: "Atasan",
        }
      );
    }
  }, [open, initial]);

  if (!open) return null;

  const isView = mode === "view";

  function set<K extends keyof UkuranData>(k: K, v: UkuranData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function handleSave() {
    if (!data.judul.trim()) {
      toast.error("Judul ukuran wajib diisi");
      return;
    }
    const payload: UkuranInput = {
      judul: data.judul,
      kategori: data.kategori,
      catatan: data.catatan ?? undefined,
      lingkarLeher: data.lingkarLeher ?? undefined,
      lebarBahu: data.lebarBahu ?? undefined,
      lingkarDada: data.lingkarDada ?? undefined,
      lingkarPinggang: data.lingkarPinggang ?? undefined,
      panjangLengan: data.panjangLengan ?? undefined,
      panjangBaju: data.panjangBaju ?? undefined,
      lingkarPinggul: data.lingkarPinggul ?? undefined,
      lingkarPaha: data.lingkarPaha ?? undefined,
      panjangCelana: data.panjangCelana ?? undefined,
      ukuranStandar: data.ukuranStandar ?? undefined,
    };

    if (onLocalSave) {
      onLocalSave(payload);
      toast.success("Ukuran ditambahkan", `${payload.judul} (sebelum simpan pelanggan)`);
      onClose();
      return;
    }

    if (!customerCode) return;

    startTransition(async () => {
      const res =
        mode === "add"
          ? await addUkuranAction(customerCode, payload)
          : await updateUkuranAction(customerCode, initial!.id!, payload);

      if (res.error) {
        toast.error("Gagal", res.error);
      } else {
        toast.success(
          mode === "add" ? "Ukuran ditambahkan" : "Ukuran diperbarui",
          payload.judul
        );
        onClose();
        router.refresh();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 overflow-y-auto" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-ink-100">
          <div>
            <h2 className="text-lg font-bold text-ink-900">
              {mode === "add" ? "Tambah Ukuran" : mode === "edit" ? "Edit Ukuran" : "Detail Ukuran"}
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              {mode === "view"
                ? "Detail ukuran yang sudah disimpan"
                : "Pilih kategori dan isi field yang relevan (boleh sebagian)"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-ink-100">
            <X className="h-5 w-5 text-ink-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Judul Ukuran</label>
              <input
                value={data.judul}
                onChange={(e) => set("judul", e.target.value)}
                disabled={isView}
                placeholder="mis. Ukuran Kemeja Formal"
                className="input-base disabled:bg-ink-50"
              />
            </div>
            <div>
              <label className="label-base">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {MEASUREMENT_KATEGORI.map((k) => (
                  <button
                    key={k}
                    type="button"
                    disabled={isView}
                    onClick={() => set("kategori", k)}
                    className={
                      "px-4 py-2 rounded-lg text-sm font-medium border transition " +
                      (data.kategori === k
                        ? "bg-brand-600 border-brand-600 text-white"
                        : "bg-white border-ink-200 text-ink-700 hover:bg-ink-100") +
                      (isView ? " opacity-70 cursor-not-allowed" : "")
                    }
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(data.kategori === "Atasan" || data.kategori === "Bawahan") && (
            <div>
              <p className="text-sm font-semibold text-ink-900 mb-3">
                {data.kategori === "Atasan" ? "Ukuran Atasan (cm)" : "Ukuran Bawahan (cm)"}
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                {(data.kategori === "Atasan" ? ATASAN_FIELDS : BAWAHAN_FIELDS).map(
                  ([key, label]) => (
                    <NumField
                      key={key}
                      label={label}
                      value={data[key as keyof UkuranData] as number | null | undefined}
                      onChange={(v) => set(key as keyof UkuranData, v as never)}
                      disabled={isView}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {data.kategori === "Standar" && (
            <div>
              <p className="text-sm font-semibold text-ink-900 mb-3">Ukuran Standar</p>
              <div className="flex flex-wrap gap-2">
                {STANDAR_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={isView}
                    onClick={() => set("ukuranStandar", s)}
                    className={
                      "px-4 py-2 rounded-lg text-sm font-medium border transition " +
                      (data.ukuranStandar === s
                        ? "bg-brand-600 border-brand-600 text-white"
                        : "bg-white border-ink-200 text-ink-700 hover:bg-ink-100") +
                      (isView ? " opacity-70 cursor-not-allowed" : "")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
              {data.ukuranStandar === "Custom" && (
                <input
                  value={data.catatan ?? ""}
                  onChange={(e) => set("catatan", e.target.value)}
                  disabled={isView}
                  placeholder="Tulis ukuran custom..."
                  className="input-base mt-3 disabled:bg-ink-50"
                />
              )}
            </div>
          )}

          <div>
            <label className="label-base">Catatan</label>
            <input
              value={data.catatan ?? ""}
              onChange={(e) => set("catatan", e.target.value)}
              disabled={isView}
              placeholder="Catatan khusus (opsional)"
              className="input-base disabled:bg-ink-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-ink-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-100"
          >
            {isView ? "Tutup" : "Batal"}
          </button>
          {!isView && (
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="btn-primary !py-2.5 !px-7"
            >
              {pending ? "Menyimpan..." : "Simpan"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (v: number | null) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="label-base !mb-1.5 !text-xs">{label}</label>
      <input
        type="number"
        step="0.5"
        min={0}
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        placeholder="—"
        className="input-base !py-2 disabled:bg-ink-50"
      />
    </div>
  );
}
