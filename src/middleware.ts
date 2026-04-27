import { NextRequest, NextResponse } from "next/server";

// NOTE: middleware tidak boleh import dari "@/lib/config" karena pakai Edge runtime
// dan beberapa lib (Prisma, lucide) bukan Edge-compatible. Cookie name disinkronkan
// dengan VALIDATION.session.cookieName di config.ts secara manual.
const COOKIE_NAME = "sijah_session";
const ANON_ONLY = ["/login", "/forgot-password", "/reset-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get(COOKIE_NAME)?.value;

  if (ANON_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (session) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
