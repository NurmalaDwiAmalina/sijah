import Link from "next/link";
import { Search, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export async function Topbar({
  title,
  showSearch = true,
}: {
  title: string;
  showSearch?: boolean;
}) {
  const user = await getCurrentUser();
  return (
    <header className="flex items-center justify-between gap-3 mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-ink-900 truncate min-w-0">{title}</h1>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {showSearch && (
          <div className="relative hidden md:block w-56 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              placeholder="Search"
              className="w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 py-2.5 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        )}
        <Link
          href="/profile"
          title={`${user?.username ?? "Profile"} — Buka profile`}
          className="group relative h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 ring-2 ring-white shadow-sm overflow-hidden grid place-items-center cursor-pointer hover:ring-brand-600 hover:scale-105 transition"
        >
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.username}
              className="h-full w-full object-cover pointer-events-none"
            />
          ) : (
            <User className="h-5 w-5 text-white/70 pointer-events-none" />
          )}
        </Link>
      </div>
    </header>
  );
}
