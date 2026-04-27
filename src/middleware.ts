import { NextRequest, NextResponse } from "next/server";

// Halaman yang BOLEH diakses tanpa login (anonymous)
const ANON_ONLY = ["/login", "/forgot-password", "/reset-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("sijah_session")?.value;

  // Halaman anonymous: kalau sudah login → ke dashboard
  if (ANON_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Halaman lain butuh login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
