"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { CekEmailModal } from "@/components/CekEmailModal";
import { requestPasswordResetAction } from "@/lib/actions/auth";
import { BRAND } from "@/lib/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("email", email);
    startTransition(async () => {
      const res = await requestPasswordResetAction(fd);
      if (res?.error) setError(res.error);
      else if (res?.ok) {
        setToken(res.token ?? null);
        setModalOpen(true);
      }
    });
  }

  return (
    <>
      <AuthShell heading={BRAND.forgotHeading} subheading={BRAND.forgotSubheading}>
        <h2 className="text-xl font-bold text-ink-900">Lupa Password</h2>
        <p className="mt-1 text-sm text-ink-500">
          Masukkan email yang terdaftar, kami akan kirim link reset password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label-base">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adminsijah@gmail.com"
                className="input-base pl-10"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-[#FFD1C9] px-3 py-2 text-sm text-[#FF4B4B]">{error}</p>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Mengirim..." : "Kirim Link Reset"}
          </button>

          <p className="text-center text-sm">
            <Link href="/login" className="text-brand-600 hover:underline">
              ← Kembali ke Login
            </Link>
          </p>
        </form>
      </AuthShell>

      <CekEmailModal
        open={modalOpen}
        email={email}
        token={token}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
