"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ClipboardList, ImageIcon, X, Loader, User, Phone, DollarSign } from "lucide-react";
import { updatePesananAction } from "@/lib/actions/pesanan";
import { useToast } from "./Toast";
import { ORDER_STATUS, PAYMENT_STATUS_BADGE, VALIDATION } from "@/lib/config";

export function PesananEditForm({
  code,
  initial,
}: {
  code: string;
  initial: {
    judul: string;
    catatan: string;
    status: string;
    statusBayar: string;
    tglEstimasi: string;
    fotoReferensi: string | null;
    totalHarga: number;
    snapshotNama: string;
    snapshotNoWa: string;
  };
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [judul, setJudul] = useState(initial.judul);
  const [catatan, setCatatan] = useState(initial.catatan);
  const [status, setStatus] = useState(initial.status);
  const [tglEstimasi, setTglEstimasi] = useState(initial.tglEstimasi);
  const [foto, setFoto] = useState<string | null>(initial.fotoReferensi);
  const [fotoUploading, setFotoUploading] = useState(false);
  const [totalHarga, setTotalHarga] = useState(String(initial.totalHarga));
  const [snapshotNama, setSnapshotNama] = useState(initial.snapshotNama);
  const [snapshotNoWa, setSnapshotNoWa] = useState(initial.snapshotNoWa);
  const fotoRef = useRef<HTMLInputElement>(null);

  async function handleFoto(file: File) {
    const allowed = VALIDATION.upload.allowedImageTypes as readonly string[];
    if (!allowed.includes(file.type)) {
      toast.error(`Format harus ${VALIDATION.upload.allowedExtensionsLabel}`);
      return;
    }
    if (file.size > VALIDATION.upload.fotoReferensiMaxBytes) {
      toast.error(
        `Maksimal ${Math.round(VALIDATION.upload.fotoReferensiMaxBytes / 1024)}KB`
      );
      return;
    }

    setFotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Upload gagal");
        return;
      }

      const data = await response.json();
      setFoto(data.url);
    } catch (err) {
      toast.error("Upload gagal, coba lagi");
      console.error(err);
    } finally {
      setFotoUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updatePesananAction(code, {
        judul,
        catatan,
        status,
        tglEstimasi,
        fotoReferensi: foto,
        totalHarga: Number(totalHarga) || 0,
        snapshotNama,
        snapshotNoWa,
      });
      toast.success("Pesanan diperbarui", code);
      router.push(`/pesanan/${code}`);
      void res;
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-end gap-3 mb-5 -mt-4">
        <Link href={`/pesanan/${code}`} className="btn-secondary !py-2.5 !px-5">Cancel</Link>
        <button type="submit" disabled={pending} className="btn-primary !py-2.5 !px-7">
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {/* Info Pesanan */}
      <div className="card p-7 space-y-5 mb-5">
        <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide">Info Pesanan</h3>

        <div>
          <label className="label-base">Judul Pesanan</label>
          <div className="relative">
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="input-base pr-10"
            />
            <ClipboardList className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label-base">Status Pesanan</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-base"
            >
              {ORDER_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Status Pembayaran</label>
            <div className="flex items-center gap-2">
              <span
                className={
                  "rounded-md px-3 py-1.5 text-sm font-semibold " +
                  (PAYMENT_STATUS_BADGE[
                    initial.statusBayar as keyof typeof PAYMENT_STATUS_BADGE
                  ] ?? "bg-ink-100 text-ink-700")
                }
              >
                {initial.statusBayar}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-ink-400">
              Dihitung otomatis dari total pembayaran yang masuk.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label-base">Tanggal Estimasi Selesai</label>
            <div className="relative">
              <input
                type="date"
                value={tglEstimasi}
                onChange={(e) => setTglEstimasi(e.target.value)}
                className="input-base pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="label-base">Total Harga (Rp)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={totalHarga}
                onChange={(e) => setTotalHarga(e.target.value)}
                placeholder="0"
                className="input-base pr-10"
              />
              <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="label-base">Catatan</label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={3}
            className="input-base resize-none"
          />
        </div>

        <div>
          <label className="label-base">Referensi Gambar</label>
          <input
            ref={fotoRef}
            type="file"
            accept={VALIDATION.upload.allowedAcceptString}
            className="hidden"
            disabled={fotoUploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFoto(f);
            }}
          />
          {foto ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt="referensi" className="h-40 rounded-xl border border-ink-200 object-cover" />
              <button
                type="button"
                disabled={fotoUploading}
                onClick={() => setFoto(null)}
                className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-[#FF4B4B] text-white disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={fotoUploading}
              onClick={() => fotoRef.current?.click()}
              className="flex w-full items-center justify-between rounded-xl border-2 border-dashed border-ink-200 bg-white px-4 py-6 text-sm text-ink-500 hover:border-brand-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{fotoUploading ? "Mengunggah..." : "Klik untuk upload referensi (JPG/PNG/WebP, max 5MB)"}</span>
              {fotoUploading ? (
                <Loader className="h-5 w-5 text-ink-400 animate-spin" />
              ) : (
                <ImageIcon className="h-5 w-5 text-ink-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Info Pelanggan */}
      <div className="card p-7 space-y-5">
        <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide">Info Pelanggan</h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label-base">Nama Pelanggan</label>
            <div className="relative">
              <input
                value={snapshotNama}
                onChange={(e) => setSnapshotNama(e.target.value)}
                placeholder="Nama pelanggan"
                className="input-base pr-10"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="label-base">No. WhatsApp</label>
            <div className="relative">
              <input
                value={snapshotNoWa}
                onChange={(e) => setSnapshotNoWa(e.target.value)}
                placeholder="No WhatsApp pelanggan"
                className="input-base pr-10"
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
