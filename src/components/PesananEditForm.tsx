"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ClipboardList, ImageIcon, X } from "lucide-react";
import { updatePesananAction } from "@/lib/actions/pesanan";
import { useToast } from "./Toast";
import { ORDER_STATUS, PAYMENT_STATUS, VALIDATION } from "@/lib/config";

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
  };
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [judul, setJudul] = useState(initial.judul);
  const [catatan, setCatatan] = useState(initial.catatan);
  const [status, setStatus] = useState(initial.status);
  const [statusBayar, setStatusBayar] = useState(initial.statusBayar);
  const [tglEstimasi, setTglEstimasi] = useState(initial.tglEstimasi);
  const [foto, setFoto] = useState<string | null>(initial.fotoReferensi);
  const fotoRef = useRef<HTMLInputElement>(null);

  function handleFoto(file: File) {
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
    const reader = new FileReader();
    reader.onload = () => setFoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updatePesananAction(code, {
        judul,
        catatan,
        status,
        statusBayar,
        tglEstimasi,
        fotoReferensi: foto,
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

      <div className="card p-7 space-y-5">
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
            <select
              value={statusBayar}
              onChange={(e) => setStatusBayar(e.target.value)}
              className="input-base"
            >
              {PAYMENT_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

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
          <label className="label-base">Catatan</label>
          <input
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="label-base">Referensi Gambar</label>
          <input
            ref={fotoRef}
            type="file"
            accept={VALIDATION.upload.allowedAcceptString}
            className="hidden"
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
                onClick={() => setFoto(null)}
                className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-[#FF4B4B] text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fotoRef.current?.click()}
              className="flex w-full items-center justify-between rounded-xl border-2 border-dashed border-ink-200 bg-white px-4 py-6 text-sm text-ink-500 hover:border-brand-500"
            >
              <span>Klik untuk upload referensi (JPG/PNG/WebP, max 1MB)</span>
              <ImageIcon className="h-5 w-5 text-ink-400" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
