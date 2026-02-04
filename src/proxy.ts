import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { validateApiAccess } from "@/lib/api-security";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protect API routes (except auth endpoints)
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    const validationError = validateApiAccess(req);
    if (validationError) {
      return validationError;
    }
  }

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Protected paths that require authentication
  const protectedPaths = ["/dashboard", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // Redirect to login if trying to access protected route without auth
  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
