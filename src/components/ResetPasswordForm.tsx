"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/auth";
import { PasswordSuccessModal } from "./PasswordSuccessModal";
import { passwordChecks } from "@/lib/config";

export function ResetPasswordForm() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const checks = passwordChecks(pwd);
  const allChecked = checks.every((c) => c.ok);
  const matched = pwd === confirm && pwd.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("token", token);
    fd.set("newPassword", pwd);
    fd.set("confirmPassword", confirm);
    startTransition(async () => {
      const res = await resetPasswordAction(fd);
      if (res?.error) setError(res.error);
      else if (res?.ok) setSuccess(true);
    });
  }

  if (!token) {
    return (
      <div>
        <h2 className="text-xl font-bold text-ink-900">Token tidak valid</h2>
        <p className="mt-2 text-sm text-ink-500">
          Link reset password tidak lengkap. Silakan request ulang.
        </p>
        <Link href="/forgot-password" className="mt-6 btn-primary w-full !block">
          Request Ulang
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold text-ink-900">Reset Password</h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="label-base">Password Baru</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type={show ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Masukkan password"
              className="input-base pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink-700 mb-2">Password harus mengandung:</p>
          <div className="grid grid-cols-2 gap-2">
            {checks.map((c) => (
              <label key={c.label} className="flex items-start gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={c.ok}
                  readOnly
                  className="mt-0.5 h-4 w-4 rounded border-ink-300 accent-brand-600"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label-base">Konfirmasi Password Baru</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Masukkan password"
              className="input-base pl-10 pr-10"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-[#FFD1C9] px-3 py-2 text-sm text-[#FF4B4B]">{error}</p>
        )}

        <button
          type="submit"
          disabled={!allChecked || !matched || pending}
          className="btn-primary w-full"
        >
          {pending ? "Memperbarui..." : "Reset Password"}
        </button>
      </form>

      <PasswordSuccessModal open={success} />
    </>
  );
}
