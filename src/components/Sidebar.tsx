"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { MAIN_NAV, SUPPORT_NAV } from "@/lib/config";

export function Sidebar() {
  const pathname = usePathname();

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
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-ink-200 flex flex-col">
      <div className="px-6 py-6">
        <Logo withTagline />
      </div>

      <nav className="flex-1 px-3 pb-6">
        <NavList items={MAIN_NAV} label="Main" />
        <div className="my-4 border-t border-ink-200" />
        <NavList items={SUPPORT_NAV} label="Support" />
      </nav>
    </aside>
  );
}
