"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";

import {
  clearAuthSession,
  getCurrentUserDisplay,
  type CurrentUserDisplay,
  getRedirectPathByRole,
  getAuthSnapshot,
  hasDashboardAccess,
  hydrateAuthCookiesFromStorage,
  isViewerRole,
} from "@/lib/auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const components: {
  id: number;
  title: string;
  href: string;
  description: string;
}[] = [
  {
    id: 1,
    title: "Trang chủ",
    href: "/",
    description: "Trang chủ của website.",
  },
  {
    id: 2,
    title: "Giới thiệu",
    href: "/gioi-thieu",
    description: "Thông tin về Phường Cao Lãnh.",
  },
  {
    id: 3,
    title: "Liên hệ",
    href: "/lien-he",
    description: "Thông tin liên hệ với Phường Cao Lãnh.",
  },
  {
    id: 4,
    title: "Tin tức",
    href: "/tin-tuc",
    description: "Cập nhật tin tức mới nhất về Phường Cao Lãnh.",
  },
  {
    id: 5,
    title: "Thư viện",
    href: "/thu-vien",
    description: "Thư viện hình ảnh và tài liệu về Phường Cao Lãnh.",
  },
];

const services = [
  {
    id: 1,
    title: "Thủ tục hành chính",
    url: "/thu-tuc-hanh-chinh",
    description:
      "Cung cấp thông tin và hướng dẫn về các thủ tục hành chính tại Phường Cao Lãnh.",
  },
  {
    id: 2,
    title: "Nộp hồ sơ",
    url: "/nop-ho-so",
    description:
      "Hỗ trợ nộp hồ sơ trực tuyến cho các dịch vụ công tại Phường Cao Lãnh.",
  },
  {
    id: 3,
    title: "Tra cứu hồ sơ",
    url: "/tra-cuu-ho-so",
    description:
      "Cho phép người dân tra cứu tình trạng hồ sơ đã nộp tại Phường Cao Lãnh.",
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "ND";
  }

  const first = parts[0]?.charAt(0) ?? "";
  const last =
    parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  const initials = `${first}${last}`.toUpperCase();

  return initials || "ND";
}

export function Navbar() {
  // const [services, setServices] = useState<Service[]>([]);
  const [authRole, setAuthRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUserDisplay | null>(
    null,
  );
  // const hasFetchedServices = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = authRole !== null;
  const canAccessAdmin =
    isAuthenticated &&
    hasDashboardAccess(authRole ?? "") &&
    !isViewerRole(authRole ?? "");
  const dashboardHref = getRedirectPathByRole(authRole ?? "");

  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthRole(null);
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const syncAuthState = () => {
      hydrateAuthCookiesFromStorage();
      const { token, role } = getAuthSnapshot();

      if (!token) {
        setAuthRole(null);
        setCurrentUser(null);
        return;
      }

      setAuthRole(role ?? "");
      setCurrentUser(getCurrentUserDisplay());
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, [pathname]);

  return (
    <div className="bg-white border-b-4 border-pink-500 shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-2 sm:px-4 py-2 sm:py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 sm:gap-3 group"
        >
          <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 p-0.5 shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <Image
              src="/Logo_TPCaoLanh.svg"
              alt="Logo"
              width={45}
              height={45}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <span className="truncate text-base font-bold sm:text-xl bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent group-hover:from-pink-700 group-hover:to-pink-600 transition-all duration-300">
            Phường Cao Lãnh
          </span>
        </Link>

        <NavigationMenu viewport={false} className="hidden md:block">
          <NavigationMenuList className="gap-1">
            {components.map((component) => (
              <NavigationMenuItem key={component.id}>
                <NavigationMenuLink
                  asChild
                  className={`relative px-4 py-2 text-base font-medium rounded-lg transition-all duration-300 ${
                    isRouteActive(component.href)
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <Link href={component.href}>{component.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem className="z-50">
              <NavigationMenuTrigger className="rounded-lg px-4 py-2 text-base font-medium transition-all duration-300 hover:bg-pink-50 hover:text-pink-600 focus:bg-pink-50 focus:text-pink-600">
                <Link href="/dich-vu">Dịch vụ</Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="z-60 md:left-auto md:right-0">
                <ul className="grid w-1000 gap-2 md:w-96 md:grid-cols-1 lg:w-96 p-4 bg-gradient-to-b from-white to-pink-50 rounded-lg shadow-lg">
                  {services.map((service) => (
                    <NavigationMenuLink
                      key={service.id}
                      className="px-3 py-3 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 hover:shadow-md group"
                      asChild
                    >
                      <Link href={`/dich-vu/${service.url}`}>
                        <div className="flex flex-col gap-1">
                          <div className="text-base font-semibold text-pink-700 group-hover:text-pink-800 transition-colors">
                            {service.title}
                          </div>
                          <div className="line-clamp-2 text-sm text-gray-600 group-hover:text-gray-700">
                            {service.description}
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-pink-50 hover:shadow-md transition-all duration-300 gap-2 px-2 h-auto py-1.5"
                >
                  <div className="relative h-9 w-9 rounded-full ring-2 ring-pink-200 hover:ring-pink-300 transition-all">
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={currentUser?.avatarUrl ?? undefined}
                        alt={currentUser?.fullName ?? "Tài khoản"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white">
                        {getInitials(currentUser?.fullName ?? "")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="text-sm font-semibold text-gray-900">
                      {currentUser?.fullName ?? "Người dùng"}
                    </span>
                    <span className="text-xs text-gray-600">
                      {currentUser?.email ?? "Chưa cập nhật email"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 rounded-lg shadow-lg">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer hover:bg-pink-50 transition-colors">
                    {canAccessAdmin ? (
                      <Link href={dashboardHref} className="flex w-full">
                        Quản trị Hệ Thống
                      </Link>
                    ) : null}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-red-50 text-red-600 transition-colors font-medium"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/dang-nhap">
              <Button
                size="lg"
                className="text-base bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 font-semibold rounded-lg"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
