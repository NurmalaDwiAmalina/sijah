"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";

type MobileNavCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<MobileNavCtx | null>(null);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Kunci scroll body saat drawer terbuka di HP
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

export function useMobileNav() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMobileNav harus dipakai di dalam MobileNavProvider");
  return ctx;
}

/** Bar atas khusus HP: tombol menu + logo. Disembunyikan di layar lg ke atas. */
export function MobileTopBar() {
  const { setOpen } = useMobileNav();
  return (
    <div className="lg:hidden sticky top-0 z-20 flex items-center gap-3 border-b border-ink-200 bg-white px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buka menu"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink-200 bg-white text-ink-700 hover:bg-ink-100 transition"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link href="/dashboard" className="hover:opacity-80 transition">
        <Logo size="sm" />
      </Link>
    </div>
  );
}
