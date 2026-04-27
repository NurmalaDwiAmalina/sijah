import { NextRequest, NextResponse } from "next/server";

// Bersihkan cookie session (untuk handle stale cookie / session yang hilang dari DB)
// dan arahkan ke /login.
export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete("sijah_session");
  return res;
}
