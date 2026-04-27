"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";

type FilterOption = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

export function SearchFilterBar({
  filters = [],
  searchPlaceholder = "Search",
}: {
  filters?: FilterOption[];
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initialQ = sp.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => setQ(sp.get("q") ?? ""), [sp]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function pushParams(next: URLSearchParams) {
    const str = next.toString();
    router.replace(str ? `${pathname}?${str}` : pathname);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(sp.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    pushParams(next);
  }

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    pushParams(next);
  }

  function clearAll() {
    setQ("");
    router.replace(pathname);
  }

  const activeCount = filters.filter((f) => sp.get(f.key)).length + (sp.get("q") ? 1 : 0);

  return (
    <div className="flex items-center gap-3">
      <form onSubmit={handleSearch} className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="input-base pl-10 !py-2.5"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              const next = new URLSearchParams(sp.toString());
              next.delete("q");
              pushParams(next);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {filters.length > 0 && (
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "btn-secondary !py-2.5 !px-4",
              activeCount > 0 && "!border-brand-600 !text-brand-700 !bg-brand-50"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filter
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-brand-600 text-white text-[10px] px-1.5 py-0.5">
                {activeCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-ink-200 bg-white shadow-lg z-20 p-4 space-y-4">
              {filters.map((f) => (
                <div key={f.key}>
                  <p className="text-sm font-medium text-ink-700 mb-2">{f.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.options.map((opt) => {
                      const active = sp.get(f.key) === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFilter(f.key, active ? "" : opt.value)}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-medium border transition",
                            active
                              ? "bg-brand-600 border-brand-600 text-white"
                              : "bg-white border-ink-200 text-ink-700 hover:bg-ink-100"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full text-center text-xs text-[#FF4B4B] hover:underline"
                >
                  Bersihkan semua filter
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
