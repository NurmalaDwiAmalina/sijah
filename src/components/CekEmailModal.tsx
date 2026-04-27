"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

export function CekEmailModal({
  open,
  email,
  token,
  onClose,
}: {
  open: boolean;
  email: string;
  token: string | null;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center"
      >
        <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-[#DEFFA7]/40">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#DEFFA7]">
            <Mail className="h-7 w-7 text-[#019537]" strokeWidth={2.5} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-ink-900">Cek Email Anda</h2>
        <p className="mt-2 text-sm text-ink-500">
          Link verifikasi telah kami kirim melalui alamat email
          <br />
          <span className="font-semibold text-ink-700">{email}</span>
        </p>

        {token && (
          <div className="mt-4 rounded-lg bg-brand-50 p-3 text-left text-xs text-ink-700">
            <p className="font-semibold text-brand-700 mb-1">⚠️ Mode Demo</p>
            <p className="mb-2">
              Karena belum ada email service, link reset langsung muncul di sini:
            </p>
            <Link
              href={`/reset-password?token=${token}`}
              className="block break-all text-brand-600 hover:underline font-mono"
            >
              /reset-password?token={token.slice(0, 16)}...
            </Link>
          </div>
        )}

        <Link
          href={token ? `/reset-password?token=${token}` : "#"}
          onClick={(e) => {
            if (!token) {
              e.preventDefault();
              onClose();
            }
          }}
          className="mt-6 btn-primary w-full !block"
        >
          {token ? "Buka Halaman Reset" : "Cek Email"}
        </Link>
      </div>
    </div>
  );
}
