import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "px_token";
const ROLE_COOKIE = "px_role";

const DASHBOARD_ROLE_KEYS = new Set(["admin", "editor", "staff", "lanhdao"]);

function normalizeRole(role: string): string {
  return role
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toRoleKey(role: string): string {
  return normalizeRole(role).replace(/\s+/g, "");
}

function hasDashboardAccess(role: string): boolean {
  return DASHBOARD_ROLE_KEYS.has(toRoleKey(role));
}

function getRedirectByRole(role: string): string {
  return hasDashboardAccess(role) ? "/dashboard" : "/";
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const rawRole = request.cookies.get(ROLE_COOKIE)?.value ?? "";
  const role = decodeURIComponent(rawRole);

  if (pathname === "/dang-nhap" && token) {
    const url = request.nextUrl.clone();
    url.pathname = getRedirectByRole(role);
    url.search = "";
    return NextResponse.redirect(url);
  }

  const isAdminPath =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isAdminPath) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/dang-nhap";
      url.search = `?callbackUrl=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }

    if (!hasDashboardAccess(role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dang-nhap", "/dashboard", "/dashboard/:path*"],
};
