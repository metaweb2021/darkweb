import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";
const LOGIN_PATH = "/admin/login";
const ADMIN_PATH = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes (but not /admin/login itself)
  if (pathname.startsWith(ADMIN_PATH) && !pathname.startsWith(LOGIN_PATH)) {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE);

    if (!session?.value) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all /admin/* routes
  matcher: ["/admin/:path*"],
};
