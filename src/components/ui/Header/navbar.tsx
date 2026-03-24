"use client";

import Image from "next/image";
import Link from "next/link";

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
  return (
    <div>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Logo_TPCaoLanh.svg"
            alt="Logo"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <span className="text-xl font-bold">Phường Cao Lãnh</span>
        </Link>
        <NavigationMenu>
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
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[500px]">
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
        <Link href="/dang-nhap" className="">
          <Button size="lg" className="text-lg" variant="outline">
            Đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  );
}
