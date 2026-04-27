"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { KeyRound, Mail, User } from "lucide-react";
import { logoutAction, updateProfileAction } from "@/lib/actions/auth";

export function ProfileForm({
  initial,
}: {
  initial: { username: string; email: string };
}) {
  const [username, setUsername] = useState(initial.username);
  const [email, setEmail] = useState(initial.email);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData();
    fd.set("username", username);
    fd.set("email", email);
    startTransition(async () => {
      const res = await updateProfileAction(fd);
      if (res?.ok) setMsg("Tersimpan!");
    });
  }

  return (
    <form onSubmit={handleSave} className="card p-7">
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 ring-2 ring-white shadow-sm" />
        <div>
          <button type="button" className="btn-secondary !py-2 !px-4 text-xs">
            Upload Foto Baru
          </button>
          <p className="mt-3 text-xs text-ink-500">
            At least 512 × 512 px recommended.
            <br />
            JPG or PNG is allowed
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-2xl bg-brand-50 p-6 border border-brand-100">
        <h3 className="text-base font-semibold text-ink-900 mb-5">Personal Info</h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label-base">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-base pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label-base">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base pl-10"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 max-w-md">
          <label className="label-base">Password</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="password"
              defaultValue="********"
              disabled
              className="input-base pl-10"
            />
          </div>
          <Link
            href="/update-password"
            className="mt-3 inline-flex items-center rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-100"
          >
            Ganti Password?
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => startTransition(() => logoutAction())}
          className="btn-danger !py-2.5 !px-5"
        >
          Logout
        </button>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-brand-600">{msg}</span>}
          <button type="submit" disabled={pending} className="btn-primary !py-2.5 !px-7">
            {pending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </form>
  );
}
