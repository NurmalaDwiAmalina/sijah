"use client";

import { Mail, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <AuthShell
      heading={"Hallo,\nMinjah!"}
      subheading="Ayo masuk dan kelola semua pelanggan dan pesanan jahitanmu!"
    >
      <h2 className="text-2xl font-bold text-ink-900">Selamat datang min!</h2>
      <p className="mt-1 text-sm text-ink-500">
        Masuk untuk mengelola pesananmu hari ini.
      </p>

      <form
        className="mt-8 space-y-5"
        action={async (fd) => {
          setPending(true);
          setError(null);
          const res = await loginAction(fd);
          if (res?.error) {
            setError(res.error);
            setPending(false);
          }
        }}
      >
        <div>
          <label className="label-base">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@sijah.com"
              placeholder="Masukkan email"
              className="input-base pl-10"
            />
          </div>
        </div>

        <div>
          <label className="label-base">Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              required
              defaultValue="admin123"
              placeholder="Masukkan password"
              className="input-base pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-[#FFD1C9] px-3 py-2 text-sm text-[#FF4B4B]">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" className="h-4 w-4 rounded border-ink-300 accent-brand-600" />
            Simpan Password
          </label>
          <Link
            href="/update-password"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Login..." : "Login"}
        </button>

        <p className="text-center text-xs text-ink-500">
          Demo: <b>admin@sijah.com</b> / <b>admin123</b>
        </p>
      </form>
    </AuthShell>
  );
}
