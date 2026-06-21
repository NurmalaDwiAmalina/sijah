"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { MAIN_NAV, SUPPORT_NAV } from "@/lib/config";
import { logoutAction } from "@/lib/actions/auth";
import { useMobileNav } from "./MobileNav";

export function Sidebar() {
  const pathname = usePathname();
  const { open, setOpen } = useMobileNav();

  function NavList({ items, label }: { items: typeof MAIN_NAV; label: string }) {
    return (
      <>
        <p className="px-3 mb-2 text-xs font-medium text-ink-500">{label}</p>
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
                {active && (
                  <span className="absolute right-0 top-1.5 bottom-1.5 w-1 rounded-l bg-brand-600" />
                )}
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <>
      {/* Backdrop (hanya HP) */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={cn(
          "fixed inset-0 z-30 bg-black/40 lg:hidden transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-ink-200 flex flex-col",
          "transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Tutup menu"
          className="lg:hidden absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 py-6">
          <Link href="/dashboard" onClick={() => setOpen(false)} className="hover:opacity-80 transition">
            <Logo withTagline />
          </Link>
        </div>

        <nav className="flex-1 px-3 pb-6">
          <NavList items={MAIN_NAV} label="Main" />
          <div className="my-4 border-t border-ink-200" />
          <NavList items={SUPPORT_NAV} label="Support" />
        </nav>

        <div className="px-3 pb-6">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-[#FFD1C9] hover:text-[#FF4B4B]"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
