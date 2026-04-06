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
    <div className="relative">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-2 sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/Logo_TPCaoLanh.svg"
            alt="Logo"
            width={45}
            height={45}
            className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11"
          />
          <span className="truncate text-base font-bold sm:text-xl ">
            Phường Cao Lãnh
          </span>
        </Link>

        <NavigationMenu viewport={false} className="hidden md:block">
          <NavigationMenuList className="gap-2">
            {components.map((component) => (
              <NavigationMenuItem key={component.id}>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} text-lg ${
                    isRouteActive(component.href)
                      ? "bg-pink-100 text-pink-600"
                      : ""
                  }`}
                >
                  <Link href={component.href}>{component.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-lg hover:text-pink-600 hover:bg-pink-100 focus:bg-pink-100 focus:text-pink-600">
                <Link href="/dich-vu">Dịch vụ</Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="z-50 md:left-auto md:right-0">
                <ul className="grid w-1000 gap-2 md:w-96 md:grid-cols-1 lg:w-96">
                  {services.map((service) => (
                    <NavigationMenuLink
                      key={service.id}
                      className="hover:text-pink-600 hover:bg-pink-100"
                      asChild
                    >
                      <Link href={`/dich-vu/${service.url}`}>
                        <div className="flex flex-col gap-1 text-base">
                          <div className="leading-none font-medium">
                            {service.title}
                          </div>
                          <div className="line-clamp-2 text-muted-foreground">
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

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={currentUser?.avatarUrl ?? undefined}
                      alt={currentUser?.fullName ?? "Tài khoản"}
                    />
                    <AvatarFallback>
                      {getInitials(currentUser?.fullName ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-medium">
                      {currentUser?.fullName ?? "Người dùng"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {currentUser?.email ?? "Chưa cập nhật email"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    {canAccessAdmin ? (
                      <Link href={dashboardHref}>Quản trị</Link>
                    ) : null}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/dang-nhap">
              <Button size="lg" className="text-lg" variant="outline">
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
