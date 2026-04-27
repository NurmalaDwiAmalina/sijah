"use client";

import { Search } from "lucide-react";

export function Topbar({
  title,
  showSearch = true,
}: {
  title: string;
  showSearch?: boolean;
}) {
  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              placeholder="Search"
              className="w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 py-2.5 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        )}
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 ring-2 ring-white shadow-sm" />
      </div>
    </header>
  );
}
