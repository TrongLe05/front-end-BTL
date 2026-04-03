import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "px_token";
const ROLE_COOKIE = "px_role";

const ADMIN_ROLE_KEYS = new Set(["admin"]);
const EDITOR_ROLE_KEYS = new Set(["editor"]);
const VIEWER_ROLE_KEYS = new Set(["viewer"]);
const DASHBOARD_ROLE_KEYS = new Set([
  ...ADMIN_ROLE_KEYS,
  ...EDITOR_ROLE_KEYS,
  ...VIEWER_ROLE_KEYS,
]);

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

function isAdminRole(role: string): boolean {
  return ADMIN_ROLE_KEYS.has(toRoleKey(role));
}

function isEditorRole(role: string): boolean {
  return EDITOR_ROLE_KEYS.has(toRoleKey(role));
}

function isViewerRole(role: string): boolean {
  return VIEWER_ROLE_KEYS.has(toRoleKey(role));
}

function getDashboardPathByRole(role: string): string {
  if (isAdminRole(role)) {
    return "/dashboard/admin";
  }

  if (isEditorRole(role)) {
    return "/dashboard/editor";
  }

  if (isViewerRole(role)) {
    return "/";
  }

  return "/";
}

function getRedirectByRole(role: string): string {
  return hasDashboardAccess(role) ? getDashboardPathByRole(role) : "/";
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

  const isDashboardPath =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const isAdminPath =
    pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/");

  const isEditorPath =
    pathname === "/dashboard/editor" ||
    pathname.startsWith("/dashboard/editor/");

  const isViewerPath =
    pathname === "/dashboard/viewer" ||
    pathname.startsWith("/dashboard/viewer/");

  if (isDashboardPath) {
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

    if (pathname === "/dashboard") {
      const targetPath = getDashboardPathByRole(role);

      if (targetPath !== pathname) {
        const url = request.nextUrl.clone();
        url.pathname = targetPath;
        url.search = "";
        return NextResponse.redirect(url);
      }
    }

    if (isAdminPath && !isAdminRole(role)) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPathByRole(role);
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (isEditorPath && !isEditorRole(role) && !isAdminRole(role)) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPathByRole(role);
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (
      isViewerPath &&
      !isViewerRole(role) &&
      !isEditorRole(role) &&
      !isAdminRole(role)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPathByRole(role);
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dang-nhap", "/dashboard", "/dashboard/:path*"],
};
