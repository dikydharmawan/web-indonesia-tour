// Catatan: Next 16 menamai konvensi ini "proxy". Pada Next 16.4.2 + Turbopack
// build produksi tidak mendaftarkan proxy.ts (auth tidak berjalan), sedangkan
// middleware.ts terverifikasi berjalan. Migrasikan ke proxy.ts setelah stabil.

import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/login";
const SESSION_COOKIE = "admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Validasi sesi penuh dilakukan di src/lib/auth.ts (server/Node runtime).
  // Middleware (edge) hanya memeriksa keberadaan cookie agar ringan.
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isAdminArea =
    pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);

  if (!hasSession && isAdminArea) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && pathname === LOGIN_PATH) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = ADMIN_PREFIX;
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
