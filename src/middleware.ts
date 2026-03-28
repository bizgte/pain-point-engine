import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // If Supabase is not configured, allow access (dev mode)
    if (!supabaseUrl) {
      return NextResponse.next();
    }

    // Check for Supabase session cookie
    const hasSession =
      request.cookies.has("sb-access-token") ||
      request.cookies.has(`sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`) ||
      // Also check old-style cookie
      request.cookies.has("admin_auth");

    if (!hasSession) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
