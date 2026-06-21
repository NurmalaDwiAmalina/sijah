"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CekStatusModal } from "@/components/CekStatusModal";

export default function PesananBerhasilPage({
  params,
}: {
  params: { code: string };
}) {
  const code = decodeURIComponent(params.code);
  const [cekStatusOpen, setCekStatusOpen] = useState(false);

  return (
    <>
      <CekStatusModal isOpen={cekStatusOpen} onClose={() => setCekStatusOpen(false)} />
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-ink-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo-sijah.png" alt="Sijah Asy-Syifa Logo" width={40} height={40} className="h-10 w-auto" />
              <div>
                <div className="font-black text-brand-600 text-base leading-tight">sijah Asy-Syifa</div>
                <div className="text-xs text-ink-500">Sistem Informasi Penjahit Syifa</div>
              </div>
            </Link>
            <Link href="/" className="px-4 py-2 text-ink-700 hover:text-brand-600 transition font-medium text-sm">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-ink-100 text-center">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-100">
              <CheckCircle2 className="h-12 w-12 text-brand-600" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900 mb-3">Pesanan Berhasil Dibuat!</h1>
            <p className="text-ink-700 mb-6">
              Terima kasih, pesananmu sudah kami terima. Tim kami akan segera
              menghubungi kamu untuk konfirmasi harga dan detail jahitan.
            </p>

            <div className="rounded-xl border border-brand-100 bg-brand-50 p-5 mb-6">
              <p className="text-xs font-semibold text-ink-500 mb-1">Kode Pesanan</p>
              <p className="text-2xl font-bold text-brand-600 tracking-wide">{code}</p>
              <p className="text-xs text-ink-500 mt-2">
                Simpan kode ini untuk melacak status pesananmu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setCekStatusOpen(true)}
                className="flex-1 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-semibold"
              >
                Cek Status Pesanan
              </button>
              <Link
                href="/"
                className="flex-1 py-3 border-2 border-ink-900 text-ink-900 rounded-lg hover:bg-ink-50 transition font-semibold flex items-center justify-center"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
