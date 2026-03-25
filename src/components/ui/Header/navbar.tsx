"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

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
];

const services: {
  id: number;
  title: string;
  href: string;
  description: string;
}[] = [
  {
    id: 1,
    title: "Dịch vụ 1",
    href: "/dich-vu/1",
    description: "Mô tả dịch vụ 1.",
  },
  {
    id: 2,
    title: "Dịch vụ 2",
    href: "/dich-vu/2",
    description: "Mô tả dịch vụ 2.",
  },
  {
    id: 3,
    title: "Dịch vụ 3",
    href: "/dich-vu/3",
    description: "Mô tả dịch vụ 3.",
  },
  {
    id: 4,
    title: "Dịch vụ 4",
    href: "/dich-vu/4",
    description: "Mô tả dịch vụ 4.",
  },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="relative">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-2 sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/Logo_TPCaoLanh.svg"
            alt="Logo"
            width={45}
            height={45}
            className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11"
          />
          <span className="truncate text-base font-bold sm:text-xl">
            Phường Cao Lãnh
          </span>
        </Link>

        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="gap-2">
            {components.map((component) => (
              <NavigationMenuItem key={component.id}>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} text-lg`}
                >
                  <Link href={component.href}>{component.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-lg">
                Dịch vụ
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-80 gap-2 md:w-96 md:grid-cols-2 lg:w-96">
                  {services.map((service) => (
                    <NavigationMenuLink key={service.id} asChild>
                      <Link href={`/dich-vu/${service.id}`}>
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

        <Link href="/dang-nhap" className="hidden md:block">
          <Button size="lg" className="text-lg" variant="outline">
            Đăng nhập
          </Button>
        </Link>

        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          className="inline-flex items-center justify-center rounded-md border p-2 md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border bg-white p-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {components.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
              >
                {item.title}
              </Link>
            ))}
            <div className="px-3">
              <Select
                onValueChange={(value) => {
                  router.push(`/dich-vu/${value}`);
                  closeMobileMenu();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dịch vụ" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {services.map((service) => (
                      <SelectItem
                        key={service.id}
                        value={service.id.toString()}
                      >
                        {service.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Link href="/dang-nhap" onClick={closeMobileMenu} className="mt-3">
              <Button className="w-full" variant="outline">
                Đăng nhập
              </Button>
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
