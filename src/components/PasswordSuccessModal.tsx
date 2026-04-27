"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export function PasswordSuccessModal({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <div className="mx-auto mb-6 relative h-32 w-32">
          <div className="absolute inset-0 rounded-full bg-[#DEFFA7]/30" />
          <div className="absolute inset-3 rounded-full bg-[#DEFFA7]/50" />
          <div className="absolute inset-6 rounded-full bg-[#019537] grid place-items-center">
            <Check className="h-10 w-10 text-white" strokeWidth={3.5} />
          </div>
          {/* dots */}
          <span className="absolute top-2 left-1/4 h-1.5 w-1.5 rounded-full bg-[#019537]" />
          <span className="absolute top-1/4 right-2 h-2 w-2 rounded-full bg-[#019537]" />
          <span className="absolute bottom-2 left-1/2 h-1.5 w-1.5 rounded-full bg-[#019537]" />
          <span className="absolute bottom-1/4 left-2 h-1.5 w-1.5 rounded-full bg-[#019537]" />
        </div>
        <h2 className="text-2xl font-bold text-ink-900">Password Diperbarui</h2>
        <p className="mt-2 text-sm text-ink-500">
          Passwordmu berhasil diperbarui, mau kembali Login lagi?
        </p>
        <Link href="/login" className="mt-6 btn-primary w-full !block">
          Kembali Login
        </Link>
      </div>
    </div>
  );
}
