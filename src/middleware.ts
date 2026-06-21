import { NextRequest, NextResponse } from "next/server";

// NOTE: middleware tidak boleh import dari "@/lib/config" karena pakai Edge runtime
// dan beberapa lib (Prisma, lucide) bukan Edge-compatible. Cookie name disinkronkan
// dengan VALIDATION.session.cookieName di config.ts secara manual.
const COOKIE_NAME = "sijah_session";

// Halaman auth-only: redirect ke /dashboard jika sudah login
const AUTH_REDIRECT = ["/login", "/forgot-password", "/reset-password"];

// Halaman publik: bisa diakses oleh siapa saja (termasuk admin yang sudah login)
// /buat-pesanan, /cek-status, /pesanan-berhasil adalah halaman untuk pelanggan,
// tidak perlu session
const PUBLIC_ROUTES = ["/", "/buat-pesanan", "/cek-status", "/pesanan-berhasil"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get(COOKIE_NAME)?.value;

  // Halaman auth (login, dll) → redirect ke dashboard jika sudah login
  if (AUTH_REDIRECT.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (session) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  // Halaman publik (katalog, buat-pesanan, cek-status) → selalu bisa diakses
  if (PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Semua route lain butuh session
  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
