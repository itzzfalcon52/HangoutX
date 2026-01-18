import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/about", "/login", "/signup","/contact"]);

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    // allow static assets and Next internals
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api/public");

  if (isPublic) {
    return NextResponse.next();
  }

  const jwt = req.cookies.get("jwt")?.value || req.cookies.get("session-token")?.value;

  if (!jwt) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};