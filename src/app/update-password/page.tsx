"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { updatePasswordAction } from "@/lib/actions/auth";
import { BRAND, passwordChecks } from "@/lib/config";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [oldPwd, setOldPwd] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  const checks = passwordChecks(pwd);
  const allChecked = checks.every((c) => c.ok);
  const matched = pwd === confirm && pwd.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const fd = new FormData();
    fd.set("oldPassword", oldPwd);
    fd.set("newPassword", pwd);
    fd.set("confirmPassword", confirm);
    startTransition(async () => {
      const res = await updatePasswordAction(fd);
      if (res?.error) setError(res.error);
      else if (res?.ok) {
        setOk(true);
        setTimeout(() => router.push("/profile"), 1200);
      }
    });
  }

  return (
    <AuthShell heading={BRAND.updateHeading} subheading={BRAND.updateSubheading}>
      <h2 className="text-xl font-bold text-ink-900">Update Password</h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <PwdInput
          label="Password Lama"
          value={oldPwd}
          onChange={setOldPwd}
          show={show}
          toggleShow={() => setShow((s) => !s)}
        />
        <PwdInput
          label="Password Baru"
          value={pwd}
          onChange={setPwd}
          show={show}
          toggleShow={() => setShow((s) => !s)}
        />

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

        <PwdInput
          label="Konfirmasi Password Baru"
          value={confirm}
          onChange={setConfirm}
          show={show}
          toggleShow={() => setShow((s) => !s)}
        />

        {error && (
          <p className="rounded-lg bg-[#FFD1C9] px-3 py-2 text-sm text-[#FF4B4B]">{error}</p>
        )}
        {ok && (
          <p className="rounded-lg bg-[#DEFFA7] px-3 py-2 text-sm text-[#019537]">
            Password berhasil diupdate, mengarahkan...
          </p>
        )}

        <button
          type="submit"
          disabled={!allChecked || !matched || !oldPwd || pending}
          className="btn-primary w-full"
        >
          {pending ? "Memperbarui..." : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
}

function PwdInput({
  label,
  value,
  onChange,
  show,
  toggleShow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggleShow: () => void;
}) {
  return (
    <div>
      <label className="label-base">{label}</label>
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Masukkan password"
          className="input-base pl-10 pr-10"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
